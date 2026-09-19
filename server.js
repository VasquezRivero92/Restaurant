import express from 'express';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';
import { fileURLToPath } from 'url';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 10019;
const keyPath = path.join(__dirname, 'serviceAccountKey.json');
const credential = fs.existsSync(keyPath)
  ? cert(JSON.parse(fs.readFileSync(keyPath, 'utf8')))
  : applicationDefault();

const firebaseAdminApp = getApps().length ? getApps()[0] : initializeApp({
  credential,
  projectId: process.env.FIREBASE_PROJECT_ID || 'restaurant-4e0ee'
});
const firestore = getFirestore(firebaseAdminApp);
const failedPinAttempts = new Map();

app.use(express.json({ limit: '32kb' }));

app.get('/api/public/tenant/:slug', async (req, res) => {
  try {
    const snapshot = await firestore.collection('restaurants').where('slug', '==', req.params.slug.toLowerCase()).limit(1).get();
    if (snapshot.empty) return res.status(404).json({ error: 'Restaurante no encontrado' });
    const document = snapshot.docs[0];
    const value = document.data();
    return res.json({ id: document.id, slug: value.slug, name: value.name, logoUrl: value.logoUrl || null, status: value.status, locations: (value.locations || []).filter((location) => location.active !== false).map((location) => ({ id: location.id, name: location.name, district: location.district })) });
  } catch (error) {
    console.error('No se pudo obtener el restaurante público:', error);
    return res.status(500).json({ error: 'Servicio temporalmente no disponible' });
  }
});

app.post('/api/auth/pin', async (req, res) => {
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const attempt = failedPinAttempts.get(key) || { count: 0, blockedUntil: 0 };
  if (attempt.blockedUntil > Date.now()) return res.status(429).json({ error: 'Demasiados intentos. Espera unos minutos.' });

  const { tenantId, branchId, pin } = req.body || {};
  if (!tenantId || !branchId || !/^\d{6}$/.test(String(pin || ''))) return res.status(400).json({ error: 'Solicitud de acceso inválida' });

  try {
    const operatorRoles = new Set(['mesero', 'cocina', 'cajero']);
    const snapshot = await firestore.collection('users').where('tenantId', '==', tenantId).get();
    const candidates = snapshot.docs.filter((document) => {
      const member = document.data();
      return member.active !== false && operatorRoles.has(member.roleKey) && Array.isArray(member.assignedBranchIds) && member.assignedBranchIds.includes(branchId);
    });
    let match = null;
    for (const document of candidates) {
      const member = document.data();
      if (member.pinHash && await bcrypt.compare(String(pin), member.pinHash)) { match = { id: document.id, ...member }; break; }
      if (process.env.ENABLE_DEMO_DATA === 'true' && member.pin === String(pin)) { match = { id: document.id, ...member }; break; }
    }
    if (!match) {
      const nextCount = attempt.count + 1;
      failedPinAttempts.set(key, { count: nextCount, blockedUntil: nextCount >= 5 ? Date.now() + 5 * 60_000 : 0 });
      return res.status(401).json({ error: 'PIN incorrecto o sin acceso a esta sede.' });
    }
    failedPinAttempts.delete(key);
    const roleKey = match.roleKey;
    let token;
    try {
      token = await getAuth(firebaseAdminApp).createCustomToken(match.id, { role: roleKey, tenantId, branchIds: match.assignedBranchIds });
    } catch (tokenErr) {
      console.error('No se pudo crear el token de sesión:', tokenErr.message);
      return res.status(503).json({ error: 'No fue posible iniciar la sesión segura. Intenta nuevamente.' });
    }
    return res.json({ token, staff: { id: match.id, name: match.name, role: roleKey, branchIds: match.assignedBranchIds } });
  } catch (error) {
    console.error('Error al autenticar terminal:', error);
    return res.status(500).json({ error: 'No fue posible validar el acceso' });
  }
});

app.post('/api/staff/sync', async (req, res) => {
  try {
    const authorization = req.headers.authorization || '';
    const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const decoded = await getAuth(firebaseAdminApp).verifyIdToken(idToken);
    const { tenantId, staff } = req.body || {};
    const isGlobal = decoded.platformAdmin === true;
    if (!tenantId || !Array.isArray(staff) || (!isGlobal && (decoded.role !== 'admin_general' || decoded.tenantId !== tenantId))) {
      return res.status(403).json({ error: 'No tienes permiso para gestionar este personal.' });
    }

    const operatorRoles = new Set(['mesero', 'cocina', 'cajero']);
    const existing = await firestore.collection('users').where('tenantId', '==', tenantId).get();
    const incomingIds = new Set(staff.map((member) => String(member.id)));
    const batch = firestore.batch();
    existing.docs.filter((d) => operatorRoles.has(d.data().roleKey)).forEach((document) => {
      if (!incomingIds.has(document.id)) batch.delete(document.ref);
    });

    for (const member of staff) {
      if (!member.id || (member.tenantId && member.tenantId !== tenantId) ||
        !operatorRoles.has(member.roleKey) || !Array.isArray(member.assignedBranchIds) ||
        !member.assignedBranchIds.every((branchId) => typeof branchId === 'string' && branchId.length > 0) ||
        (member.pin && !/^\d{6}$/.test(String(member.pin)))) {
        return res.status(400).json({ error: 'Registro de personal inválido.' });
      }
      const current = existing.docs.find((document) => document.id === member.id)?.data() || {};
      // El endpoint no acepta claims, hashes ni campos de identidad administrativa
      // enviados por el navegador. Solo persiste el perfil operativo esperado.
      const payload = {
        id: String(member.id), tenantId, name: String(member.name || ''),
        email: member.email || '', username: member.username || '', phone: member.phone || '',
        docType: member.docType || '', docNumber: member.docNumber || '',
        role: member.role || member.roleKey, roleKey: member.roleKey,
        brandId: member.brandId || tenantId, brand: member.brand || '',
        branchName: member.branchName || '', branchId: member.branchId || '',
        assignedBranchIds: member.assignedBranchIds, initials: member.initials || '',
        tablesZone: member.tablesZone || '', shift: member.shift || '', avatarColor: member.avatarColor || '',
        active: member.active !== false, createdAt: current.createdAt || member.createdAt || Date.now(), updatedAt: Date.now()
      };
      if (member.pin) payload.pinHash = await bcrypt.hash(String(member.pin), 12);
      else if (current.pinHash) payload.pinHash = current.pinHash;
      batch.set(firestore.collection('users').doc(String(member.id)), payload, { merge: true });
    }
    await batch.commit();
    return res.json({ ok: true });
  } catch (error) {
    console.error('Error al guardar personal:', error);
    return res.status(401).json({ error: 'Sesión inválida o vencida.' });
  }
});

// Provisiona identidades administrativas únicamente desde la consola global.
// La contraseña temporal nunca se entrega al navegador: se genera un enlace de
// activación para que el administrador defina su propia contraseña.
app.post('/api/admins/provision', async (req, res) => {
  try {
    const authorization = req.headers.authorization || '';
    const decoded = await getAuth(firebaseAdminApp).verifyIdToken(authorization.startsWith('Bearer ') ? authorization.slice(7) : '');
    if (decoded.platformAdmin !== true) return res.status(403).json({ error: 'Solo el Administrador Global puede provisionar accesos.' });

    const { admin } = req.body || {};
    const allowedRoles = new Set(['admin_general', 'admin_sede']);
    const tenantId = admin?.brandId || admin?.tenantId;
    const email = String(admin?.email || '').trim().toLowerCase();
    const assignedBranchIds = Array.isArray(admin?.assignedBranchIds) ? admin.assignedBranchIds.filter((id) => typeof id === 'string' && id.length > 0) : [];
    if (!tenantId || !email || !allowedRoles.has(admin?.roleKey) || assignedBranchIds.length === 0) {
      return res.status(400).json({ error: 'Datos de administrador incompletos o inválidos.' });
    }

    let authUser;
    try {
      authUser = await getAuth(firebaseAdminApp).getUserByEmail(email);
      const existingClaims = authUser.customClaims || {};
      if (existingClaims.platformAdmin === true || (existingClaims.tenantId && existingClaims.tenantId !== tenantId)) {
        return res.status(409).json({ error: 'El correo ya está vinculado a otra organización.' });
      }
    } catch (error) {
      if (error?.code !== 'auth/user-not-found') throw error;
      authUser = await getAuth(firebaseAdminApp).createUser({
        email,
        displayName: String(admin.name || 'Administrador'),
        // Firebase requiere una credencial inicial. Esta clave aleatoria no se
        // expone; el enlace de activación obliga a definir una contraseña propia.
        password: randomBytes(32).toString('base64url')
      });
    }

    const claims = { role: admin.roleKey, tenantId, branchIds: assignedBranchIds };
    await getAuth(firebaseAdminApp).setCustomUserClaims(authUser.uid, claims);
    const profile = {
      id: authUser.uid,
      authUid: authUser.uid,
      name: String(admin.name || 'Administrador'),
      email,
      phone: admin.phone || '',
      role: admin.role || (admin.roleKey === 'admin_general' ? 'Administrador General' : 'Administrador de Sede'),
      roleKey: admin.roleKey,
      brand: admin.brand || '',
      brandId: tenantId,
      branchName: admin.branchName || '',
      branchId: admin.branchId || assignedBranchIds[0],
      assignedBranchIds,
      initials: admin.initials || '',
      active: admin.active !== false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await firestore.collection('users').doc(authUser.uid).set(profile, { merge: true });
    const activationLink = await getAuth(firebaseAdminApp).generatePasswordResetLink(email);
    return res.json({ profile, activationLink });
  } catch (error) {
    console.error('Error al provisionar administrador:', error);
    return res.status(500).json({ error: 'No fue posible provisionar la identidad administrativa.' });
  }
});

app.post('/api/sales/complete', async (req, res) => {
  try {
    const authorization = req.headers.authorization || '';
    const decoded = await getAuth(firebaseAdminApp).verifyIdToken(authorization.startsWith('Bearer ') ? authorization.slice(7) : '');
    const { tenantId: requestedTenantId, branchId, tableId, tipAmount = 0 } = req.body || {};
    const numericTip = Number(tipAmount);
    const branchIds = Array.isArray(decoded.branchIds) ? decoded.branchIds : [];
    const allowedRoles = new Set(['mesero', 'cajero', 'admin_sede', 'admin_general']);
    const isGlobal = decoded.platformAdmin === true;
    const tenantId = isGlobal ? requestedTenantId : decoded.tenantId;
    if (!branchId || !tableId || !tenantId || !Number.isFinite(numericTip) || numericTip < 0 ||
      (!isGlobal && (!allowedRoles.has(decoded.role) || !branchIds.includes(branchId))) ||
      (!isGlobal && requestedTenantId && requestedTenantId !== decoded.tenantId)) {
      return res.status(403).json({ error: 'Venta o sede no autorizada.' });
    }
    const branchRef = firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId);
    const tableRef = branchRef.collection('tables').doc(tableId);
    const saleRef = branchRef.collection('sales').doc();
    await firestore.runTransaction(async (transaction) => {
      const [branchSnapshot, tableSnapshot] = await Promise.all([transaction.get(branchRef), transaction.get(tableRef)]);
      if (!branchSnapshot.exists) throw new Error('Sede no encontrada');
      if (!tableSnapshot.exists || tableSnapshot.data().status === 'free') throw new Error('La mesa no tiene un consumo pendiente de cobro');
      const branch = branchSnapshot.data();
      const baseAmount = Number(tableSnapshot.data().total || 0);
      if (!Number.isFinite(baseAmount) || baseAmount <= 0) throw new Error('El consumo de la mesa no es válido');
      const amount = baseAmount + numericTip;
      const todaySales = Number(branch.todaySales || 0) + amount;
      transaction.update(branchRef, { todaySales, updatedAt: Date.now() });
      transaction.update(tableRef, {
        status: 'free', statusLabel: 'Libre', waiter: '', notes: 'Mesa desinfectada y libre', total: 0,
        timeInSalon: null, dishes: [], drinks: [], updatedAt: Date.now()
      });
      transaction.create(saleRef, {
        id: saleRef.id, tenantId, branchId, tableId, baseAmount, tipAmount: numericTip,
        amount, createdAt: Date.now(), createdBy: decoded.uid, status: 'completed'
      });
    });
    return res.json({ ok: true, paymentId: saleRef.id });
  } catch (error) {
    console.error('Error al registrar venta:', error);
    return res.status(401).json({ error: 'No se pudo registrar la venta.' });
  }
});

// Servir los archivos estáticos de la build de producción
app.use(express.static(path.join(__dirname, 'dist')));

// Redireccionar todas las rutas a index.html (SPA routing)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor web de producción listo y escuchando en el puerto ${PORT}`);
});
