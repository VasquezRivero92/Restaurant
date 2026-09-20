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

async function writeAudit({ tenantId, actorId, action, entityType, entityId, metadata = {} }) {
  if (!tenantId) return;
  await firestore.collection('restaurants').doc(tenantId).collection('auditLogs').add({
    tenantId, actorId, action, entityType, entityId,
    metadata, createdAt: Date.now()
  });
}

app.use(express.json({ limit: '32kb' }));

app.get('/api/public/tenant/:slug', async (req, res) => {
  try {
    const slugParam = String(req.params.slug || '').toLowerCase().trim();
    let document = null;

    const snapshot = await firestore.collection('restaurants').where('slug', '==', slugParam).limit(1).get();
    if (!snapshot.empty) {
      document = snapshot.docs[0];
    } else {
      const docSnap = await firestore.collection('restaurants').doc(slugParam).get();
      if (docSnap.exists) {
        document = docSnap;
      }
    }

    if (!document) return res.status(404).json({ error: 'Restaurante no encontrado' });
    const value = document.data();
    return res.json({
      id: document.id,
      slug: value.slug || document.id,
      name: value.name,
      legalName: value.legalName || '',
      ruc: value.ruc || '',
      plan: value.plan || 'Básico',
      logoUrl: value.logoUrl || null,
      status: value.status || 'Activa',
      assignedCartaId: value.assignedCartaId || '',
      locations: (value.locations || []).filter((location) => location.active !== false).map((location) => ({
        id: location.id,
        name: location.name,
        district: location.district,
        address: location.address,
        phone: location.phone,
        tables: location.tables
      }))
    });
  } catch (error) {
    console.error('No se pudo obtener el restaurante público:', error);
    return res.status(500).json({ error: 'Servicio temporalmente no disponible' });
  }
});

// Carta pública: el QR contiene /:slug?qr=:branchId. Solo se expone lo necesario para pedir.
app.get('/api/public/menu/:slug/:branchId', async (req, res) => {
  try {
    const slugParam = String(req.params.slug || '').toLowerCase().trim();
    let tenant = null;
    const tenantSnapshot = await firestore.collection('restaurants').where('slug', '==', slugParam).limit(1).get();
    if (!tenantSnapshot.empty) {
      tenant = tenantSnapshot.docs[0];
    } else {
      const docSnap = await firestore.collection('restaurants').doc(slugParam).get();
      if (docSnap.exists) {
        tenant = docSnap;
      }
    }
    if (!tenant) return res.status(404).json({ error: 'Restaurante no encontrado.' });
    const data = tenant.data();
    const branch = (data.locations || []).find(location => location.id === req.params.branchId && location.active !== false);
    if (!branch) return res.status(404).json({ error: 'Sede no disponible.' });
    const branchRef = tenant.ref.collection('branches').doc(req.params.branchId);
    const [menuSnapshot, tablesSnapshot] = await Promise.all([branchRef.collection('menu').get(), branchRef.collection('tables').get()]);
    return res.json({ branchName: branch.name, menu: menuSnapshot.docs.map(doc => ({ id: Number(doc.id) || doc.data().id, ...doc.data() })).filter(item => item.available !== false), tables: tablesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(table => table.status !== 'bill_requested') });
  } catch (error) { console.error('Error de carta QR:', error); return res.status(500).json({ error: 'No fue posible abrir la carta.' }); }
});

app.post('/api/public/order/:slug/:branchId', async (req, res) => {
  try {
    const slugParam = String(req.params.slug || '').toLowerCase().trim();
    const tenantSnapshot = await firestore.collection('restaurants').where('slug', '==', slugParam).limit(1).get();
    const tenant = !tenantSnapshot.empty ? tenantSnapshot.docs[0] : await firestore.collection('restaurants').doc(slugParam).get();
    if (!tenant || !tenant.exists) return res.status(404).json({ error: 'Restaurante no encontrado.' });
    const branchId = req.params.branchId; const { tableId, items, notes = '' } = req.body || {};
    if (!tableId || !Array.isArray(items) || items.length === 0 || items.length > 30 || String(notes).length > 300) return res.status(400).json({ error: 'Pedido inválido.' });
    const branchRef = tenant.ref.collection('branches').doc(branchId); const [tableSnapshot, menuSnapshot] = await Promise.all([branchRef.collection('tables').doc(String(tableId)).get(), branchRef.collection('menu').get()]);
    if (!tableSnapshot.exists || tableSnapshot.data().status === 'bill_requested') return res.status(400).json({ error: 'La mesa ya no está disponible.' });
    const menu = new Map(menuSnapshot.docs.map(doc => [Number(doc.id) || doc.data().id, doc.data()])); let total = 0;
    const cleanItems = items.map(line => { const dish = menu.get(Number(line.dishId)); const qty = Number(line.qty); if (!dish || dish.available === false || !Number.isInteger(qty) || qty < 1 || qty > 20) throw new Error('Un producto ya no está disponible.'); const price = Number(dish.price); total += price * qty; return { dishId: Number(line.dishId), dishName: String(dish.name), category: dish.category, isDrink: Boolean(dish.isDrink || dish.category === 'bebidas'), price, qty }; });
    const orderRef = branchRef.collection('customerOrders').doc();
    await orderRef.create({ id: orderRef.id, branchId, tableId: String(tableId), tableNumber: String(tableSnapshot.data().number || ''), items: cleanItems, total: Number(total.toFixed(2)), notes: String(notes).trim(), status: 'pending_waiter', createdAt: Date.now(), source: 'qr' });
    return res.status(201).json({ ok: true, id: orderRef.id });
  } catch (error) { return res.status(400).json({ error: error.message || 'No fue posible solicitar el pedido.' }); }
});

app.post('/api/staff/qr-orders/:orderId/confirm', async (req, res) => {
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, ''); const decoded = await getAuth(firebaseAdminApp).verifyIdToken(token);
    if (!['mesero', 'admin_sede', 'admin_general'].includes(decoded.role)) return res.status(403).json({ error: 'No autorizado.' });
    const snapshot = await firestore.collectionGroup('customerOrders').where('id', '==', req.params.orderId).limit(1).get();
    if (snapshot.empty) return res.status(404).json({ error: 'Pedido no encontrado.' });
    const orderRef = snapshot.docs[0].ref;
    const branchRef = orderRef.parent.parent;
    const restaurantId = branchRef.parent.parent.id;
    const initialOrder = snapshot.docs[0].data();
    if (decoded.platformAdmin !== true && (decoded.tenantId !== restaurantId || !Array.isArray(decoded.branchIds) || !decoded.branchIds.includes(initialOrder.branchId))) return res.status(403).json({ error: 'Pedido fuera de tu sede.' });

    const tableRef = branchRef.collection('tables').doc(initialOrder.tableId);
    const ticketRef = branchRef.collection('orders').doc();
    const staffRef = firestore.collection('users').doc(decoded.uid);
    await firestore.runTransaction(async (transaction) => {
      const [orderSnapshot, tableSnapshot, staffSnapshot] = await Promise.all([transaction.get(orderRef), transaction.get(tableRef), transaction.get(staffRef)]);
      if (!orderSnapshot.exists || orderSnapshot.data().status !== 'pending_waiter') throw new Error('Este pedido ya fue atendido o no está disponible.');
      if (!tableSnapshot.exists || tableSnapshot.data().status === 'bill_requested') throw new Error('La mesa ya no puede recibir pedidos.');
      const order = orderSnapshot.data(); const table = tableSnapshot.data();
      const waiter = String(staffSnapshot.exists ? staffSnapshot.data().name : '') || 'Mozo de turno';
      const items = Array.isArray(order.items) ? order.items : [];
      const foodItems = items.filter(item => !item.isDrink && item.category !== 'bebidas').map((item, index) => ({
        id: `qr-${orderRef.id}-${index}`, dishId: item.dishId, name: item.selectedSize ? `${item.dishName} (${item.selectedSize})` : item.dishName,
        qty: Number(item.qty), price: Number(item.price), substation: ['ceviches', 'leches'].includes(item.category) ? 'FRÍOS' : 'CALIENTES', notes: order.notes || '', isReady: false, isServed: false, status: 'pending'
      }));
      const drinks = items.filter(item => item.isDrink || item.category === 'bebidas').map((item, index) => ({ id: `qr-drink-${orderRef.id}-${index}`, name: item.dishName, size: item.selectedSize || 'Estándar', qty: Number(item.qty), price: Number(item.price), served: false }));
      const createdAt = Date.now();
      if (foodItems.length) transaction.create(ticketRef, { id: ticketRef.id, table: `Mesa ${table.number}`, station: foodItems.some(item => item.substation === 'CALIENTES') ? 'calientes' : 'frios', status: 'pending', waiter, elapsed: 'Ahora', time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }), createdAt, arrivalOrder: createdAt, items: foodItems, branchId: order.branchId, restaurantId });
      transaction.update(tableRef, { waiter: table.waiter || waiter, status: foodItems.length ? 'cooking' : 'occupied', statusLabel: 'Pedido QR confirmado', total: Number(table.total || 0) + Number(order.total || 0), dishes: [...(table.dishes || []), ...foodItems.map(item => ({ id: item.id, name: `${item.qty}x ${item.name}`, qty: item.qty, price: item.price, station: item.substation === 'FRÍOS' ? 'Barra Fría' : 'Calientes', description: item.notes || 'Pedido QR confirmado', status: 'cooking' }))], drinks: [...(table.drinks || []), ...drinks] });
      transaction.update(orderRef, { status: 'confirmed', confirmedBy: decoded.uid, confirmedAt: createdAt, ticketId: foodItems.length ? ticketRef.id : null });
    });
    return res.json({ ok: true, ticketId: ticketRef.id });
  } catch (error) { return res.status(400).json({ error: 'No fue posible confirmar el pedido.' }); }
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
    await writeAudit({ tenantId, actorId: decoded.uid, action: 'staff.synced', entityType: 'staff', entityId: tenantId, metadata: { count: staff.length } });
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
    await writeAudit({ tenantId, actorId: decoded.uid, action: 'admin.provisioned', entityType: 'user', entityId: authUser.uid, metadata: { role: profile.roleKey, branchIds: assignedBranchIds } });
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
    const { tenantId: requestedTenantId, branchId, tableId, tipAmount = 0, payment = {} } = req.body || {};
    const numericTip = Number(tipAmount);
    const branchIds = Array.isArray(decoded.branchIds) ? decoded.branchIds : [];
    const allowedRoles = new Set(['mesero', 'cajero', 'admin_sede', 'admin_general']);
    const isGlobal = decoded.platformAdmin === true;
    const tenantId = isGlobal ? requestedTenantId : decoded.tenantId;
    const paymentMethods = new Set(['yape_plin', 'card', 'cash', 'split']);
    const documentTypes = new Set(['boleta', 'factura']);
    if (!branchId || !tableId || !tenantId || !Number.isFinite(numericTip) || numericTip < 0 ||
      !paymentMethods.has(payment.method) || !documentTypes.has(payment.documentType) ||
      (!isGlobal && (!allowedRoles.has(decoded.role) || !branchIds.includes(branchId))) ||
      (!isGlobal && requestedTenantId && requestedTenantId !== decoded.tenantId)) {
      return res.status(403).json({ error: 'Venta o sede no autorizada.' });
    }
    const branchRef = firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId);
    const tableRef = branchRef.collection('tables').doc(tableId);
    const saleRef = branchRef.collection('sales').doc();
    let recordedAmount = 0;
    await firestore.runTransaction(async (transaction) => {
      const [branchSnapshot, tableSnapshot] = await Promise.all([transaction.get(branchRef), transaction.get(tableRef)]);
      if (!branchSnapshot.exists) throw new Error('Sede no encontrada');
      if (!tableSnapshot.exists || tableSnapshot.data().status !== 'bill_requested') throw new Error('La mesa debe solicitar la cuenta antes de registrar el cobro');
      const branch = branchSnapshot.data();
      const baseAmount = Number(tableSnapshot.data().total || 0);
      if (!Number.isFinite(baseAmount) || baseAmount <= 0) throw new Error('El consumo de la mesa no es válido');
      const amount = baseAmount + numericTip;
      recordedAmount = amount;
      const cashReceived = Number(payment.cashReceived || 0);
      if (payment.method === 'cash' && (!Number.isFinite(cashReceived) || cashReceived < amount)) {
        throw new Error('El efectivo recibido no cubre el total de la venta');
      }
      const table = tableSnapshot.data();
      const dishLines = (Array.isArray(table.dishes) ? table.dishes : []).map((item) => ({
        name: String(item.name || 'Plato'), qty: Number(item.qty || 1), unitPrice: Number(item.price || 0),
        total: Number(item.qty || 1) * Number(item.price || 0), category: item.station || '', kind: 'dish'
      }));
      const drinkLines = (Array.isArray(table.drinks) ? table.drinks : []).map((item) => ({
        name: String(item.name || 'Bebida'), qty: Number(item.qty || 1), unitPrice: Number(item.price || 0),
        total: Number(item.qty || 1) * Number(item.price || 0), category: 'bebidas', kind: 'drink'
      }));
      const businessDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());
      // Descuenta insumos según las recetas vigentes de la carta. La venta es la
      // única fuente que puede generar este movimiento, evitando ajustes desde el cliente.
      const recipeUsage = new Map();
      let recipeCost = 0;
      for (const dish of Array.isArray(table.dishes) ? table.dishes : []) {
        if (!dish.dishId) continue;
        const menuSnapshot = await transaction.get(branchRef.collection('menu').doc(String(dish.dishId)));
        if (!menuSnapshot.exists) continue;
        const recipe = Array.isArray(menuSnapshot.data().recipe) ? menuSnapshot.data().recipe : [];
        for (const ingredient of recipe) {
          if (!ingredient.inventoryItemId || !Number.isFinite(Number(ingredient.qty))) continue;
          const used = Number(ingredient.qty) * Number(dish.qty || 1);
          recipeUsage.set(String(ingredient.inventoryItemId), (recipeUsage.get(String(ingredient.inventoryItemId)) || 0) + used);
        }
      }
      for (const [inventoryItemId, quantity] of recipeUsage) {
        const inventoryRef = branchRef.collection('inventory').doc(inventoryItemId);
        const inventorySnapshot = await transaction.get(inventoryRef);
        if (!inventorySnapshot.exists) continue;
        const currentStock = Number(inventorySnapshot.data().currentStock || 0);
        recipeCost += Number(inventorySnapshot.data().unitCost || 0) * quantity;
        transaction.update(inventoryRef, { currentStock: Math.max(0, currentStock - quantity), updatedAt: Date.now() });
        const movementRef = branchRef.collection('inventoryMovements').doc();
        transaction.create(movementRef, { id: movementRef.id, branchId, inventoryItemId, type: 'sale', quantity: -quantity, reason: `Venta mesa ${table.number || tableId}`, createdAt: Date.now(), createdBy: decoded.uid });
      }
      const todaySales = Number(branch.todaySales || 0) + amount;
      transaction.update(branchRef, { todaySales, updatedAt: Date.now() });
      transaction.update(tableRef, {
        status: 'free', statusLabel: 'Libre', waiter: '', notes: 'Mesa desinfectada y libre', total: 0,
        timeInSalon: null, dishes: [], drinks: [], updatedAt: Date.now()
      });
      transaction.create(saleRef, {
        id: saleRef.id, tenantId, branchId, tableId, baseAmount, tipAmount: numericTip,
        tableNumber: table.number || '', amount, paymentMethod: payment.method,
        documentType: payment.documentType, customerDoc: String(payment.customerDoc || ''),
        customerName: String(payment.customerName || ''), cashReceived: payment.method === 'cash' ? cashReceived : null,
        changeAmount: payment.method === 'cash' ? cashReceived - amount : 0,
        lineItems: [...dishLines, ...drinkLines], costAmount: recipeCost, grossMargin: amount - recipeCost, businessDate, waiterName: table.waiter || '',
        createdAt: Date.now(), createdBy: decoded.uid, status: 'completed'
      });
    });
    await writeAudit({ tenantId, actorId: decoded.uid, action: 'sale.completed', entityType: 'sale', entityId: saleRef.id, metadata: { branchId, tableId, amount: recordedAmount } });
    return res.json({ ok: true, paymentId: saleRef.id });
  } catch (error) {
    console.error('Error al registrar venta:', error);
    return res.status(401).json({ error: 'No se pudo registrar la venta.' });
  }
});

app.post('/api/inventory/movement', async (req, res) => {
  try {
    const authorization = req.headers.authorization || '';
    const decoded = await getAuth(firebaseAdminApp).verifyIdToken(authorization.startsWith('Bearer ') ? authorization.slice(7) : '');
    const { tenantId: requestedTenantId, branchId, inventoryItemId, type, quantity, reason = '' } = req.body || {};
    const allowedTypes = new Set(['purchase', 'waste', 'adjustment', 'transfer']);
    const numericQuantity = Number(quantity);
    const tenantId = decoded.platformAdmin === true ? requestedTenantId : decoded.tenantId;
    const branchIds = Array.isArray(decoded.branchIds) ? decoded.branchIds : [];
    if (!tenantId || !branchId || !inventoryItemId || !allowedTypes.has(type) || !Number.isFinite(numericQuantity) || numericQuantity === 0 ||
      (decoded.platformAdmin !== true && (decoded.tenantId !== tenantId || !branchIds.includes(branchId) || !['admin_general', 'admin_sede'].includes(decoded.role)))) {
      return res.status(403).json({ error: 'Movimiento de inventario no autorizado.' });
    }
    const branchRef = firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId);
    const itemRef = branchRef.collection('inventory').doc(String(inventoryItemId));
    const movementRef = branchRef.collection('inventoryMovements').doc();
    await firestore.runTransaction(async (transaction) => {
      const itemSnapshot = await transaction.get(itemRef);
      if (!itemSnapshot.exists) throw new Error('Insumo no encontrado');
      const currentStock = Number(itemSnapshot.data().currentStock || 0);
      const nextStock = Math.max(0, currentStock + numericQuantity);
      transaction.update(itemRef, { currentStock: nextStock, updatedAt: Date.now() });
      transaction.create(movementRef, { id: movementRef.id, branchId, inventoryItemId, type, quantity: numericQuantity, reason: String(reason).slice(0, 240), createdAt: Date.now(), createdBy: decoded.uid });
    });
    await writeAudit({ tenantId, actorId: decoded.uid, action: `inventory.${type}`, entityType: 'inventory', entityId: String(inventoryItemId), metadata: { branchId, quantity: numericQuantity } });
    return res.json({ ok: true, movementId: movementRef.id });
  } catch (error) {
    console.error('Error en movimiento de inventario:', error);
    return res.status(400).json({ error: error.message || 'No fue posible registrar el movimiento.' });
  }
});

app.post('/api/approvals', async (req, res) => {
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const decoded = await getAuth(firebaseAdminApp).verifyIdToken(token);
    const { tenantId: requestedTenantId, branchId, type, reason } = req.body || {};
    const tenantId = decoded.platformAdmin === true ? requestedTenantId : decoded.tenantId;
    const types = new Set(['discount', 'void', 'refund', 'price_change', 'inventory_transfer']);
    if (!tenantId || !branchId || !types.has(type) || !String(reason || '').trim() || (decoded.platformAdmin !== true && (!Array.isArray(decoded.branchIds) || !decoded.branchIds.includes(branchId)))) return res.status(403).json({ error: 'Solicitud no autorizada.' });
    const ref = firestore.collection('restaurants').doc(tenantId).collection('approvals').doc();
    await ref.create({ id: ref.id, tenantId, branchId, type, status: 'pending', reason: String(reason).trim().slice(0, 500), requestedBy: decoded.uid, requestedAt: Date.now() });
    await writeAudit({ tenantId, actorId: decoded.uid, action: 'approval.requested', entityType: 'approval', entityId: ref.id, metadata: { branchId, type } });
    return res.json({ ok: true, id: ref.id });
  } catch (error) { return res.status(400).json({ error: 'No fue posible crear la solicitud.' }); }
});

app.post('/api/approvals/:id/decision', async (req, res) => {
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const decoded = await getAuth(firebaseAdminApp).verifyIdToken(token);
    const { decision, note = '' } = req.body || {};
    if (!['approved', 'rejected'].includes(decision) || (decoded.platformAdmin !== true && decoded.role !== 'admin_general')) return res.status(403).json({ error: 'No tienes permiso para resolver solicitudes.' });
    const snap = await firestore.collectionGroup('approvals').where('id', '==', req.params.id).limit(1).get();
    if (snap.empty) return res.status(404).json({ error: 'Solicitud no encontrada.' });
    const ref = snap.docs[0].ref; const request = snap.docs[0].data();
    if (decoded.platformAdmin !== true && request.tenantId !== decoded.tenantId) return res.status(403).json({ error: 'Solicitud fuera de tu organización.' });
    await ref.update({ status: decision, resolvedBy: decoded.uid, resolvedAt: Date.now(), resolutionNote: String(note).slice(0, 500) });
    await writeAudit({ tenantId: request.tenantId, actorId: decoded.uid, action: `approval.${decision}`, entityType: 'approval', entityId: req.params.id, metadata: { branchId: request.branchId, type: request.type } });
    return res.json({ ok: true });
  } catch (error) { return res.status(400).json({ error: 'No fue posible resolver la solicitud.' }); }
});

app.post('/api/cash/movement', async (req, res) => {
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const decoded = await getAuth(firebaseAdminApp).verifyIdToken(token);
    const { tenantId: requestedTenantId, branchId, shiftId = '', type, amount, concept = '' } = req.body || {};
    const tenantId = decoded.platformAdmin === true ? requestedTenantId : decoded.tenantId;
    const numericAmount = Number(amount); const branchIds = Array.isArray(decoded.branchIds) ? decoded.branchIds : [];
    if (!tenantId || !branchId || !['income', 'expense'].includes(type) || !Number.isFinite(numericAmount) || numericAmount <= 0 || !String(concept).trim() || (decoded.platformAdmin !== true && (!branchIds.includes(branchId) || !['cajero', 'admin_sede', 'admin_general'].includes(decoded.role)))) return res.status(403).json({ error: 'Movimiento de caja no autorizado.' });
    const ref = firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).collection('cashMovements').doc();
    await ref.create({ id: ref.id, branchId, shiftId: String(shiftId), type, amount: numericAmount, concept: String(concept).trim().slice(0, 240), createdAt: Date.now(), createdBy: decoded.uid });
    await writeAudit({ tenantId, actorId: decoded.uid, action: `cash.${type}`, entityType: 'cashMovement', entityId: ref.id, metadata: { branchId, amount: numericAmount } });
    return res.json({ ok: true, id: ref.id });
  } catch (error) { return res.status(400).json({ error: 'No fue posible registrar el movimiento de caja.' }); }
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
