import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const root = path.resolve(import.meta.dirname, '..');
const readEnv = (file) => {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/)
    .filter((line) => line && !line.trimStart().startsWith('#') && line.includes('='))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')];
    }));
};

const env = { ...readEnv(path.join(root, '.env')), ...readEnv(path.join(root, '.env.local')), ...process.env };
const apiKey = env.VITE_FIREBASE_API_KEY;
if (!apiKey) throw new Error('Falta VITE_FIREBASE_API_KEY para el intercambio de tokens de QA.');

const serviceAccount = JSON.parse(fs.readFileSync(path.join(root, 'serviceAccountKey.json'), 'utf8'));
const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth(app);
const firestore = getFirestore(app);
const runId = `qa-e2e-${Date.now()}`;
const tenantId = runId;
const branchId = `${runId}-branch`;
const createdAuthIds = [];
const createdUserIds = [];
const apiBaseUrl = process.env.QA_API_BASE_URL || 'http://127.0.0.1:10019';
const payment = { method: 'yape_plin', documentType: 'boleta' };

const expect = (condition, message) => {
  if (!condition) throw new Error(message);
  console.log(`PASS ${message}`);
};

const request = async (pathname, body, token) => {
  const response = await fetch(`${apiBaseUrl}${pathname}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body)
  });
  return { status: response.status, body: await response.json() };
};

const exchangeCustomToken = async (customToken) => {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: customToken, returnSecureToken: true })
  });
  const payload = await response.json();
  if (!response.ok || !payload.idToken) throw new Error(`No se pudo intercambiar el token de QA: ${payload.error?.message || response.status}`);
  return payload.idToken;
};

const createOperator = async (role, pin) => {
  const id = `${runId}-${role}`;
  createdUserIds.push(id);
  await firestore.collection('users').doc(id).set({
    id, name: `QA ${role}`, tenantId, roleKey: role, assignedBranchIds: [branchId],
    active: true, pinHash: await bcrypt.hash(pin, 10), createdAt: Date.now()
  });
  return id;
};

const createAdminToken = async (role, claims) => {
  const id = `${runId}-${role}`;
  createdAuthIds.push(id);
  return exchangeCustomToken(await auth.createCustomToken(id, claims));
};

const table = (id, total) => ({
  id, number: id.slice(-2), status: 'bill_requested', statusLabel: 'Cuenta Pedida',
  waiter: 'QA mesero', diners: 2, total, dishes: [], drinks: []
});

try {
  await firestore.collection('restaurants').doc(tenantId).set({ id: tenantId, name: 'QA E2E Restaurant', slug: runId, status: 'Activa', todaySales: 0 });
  await firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).set({ id: branchId, name: 'QA Branch', todaySales: 0, active: true });
  await Promise.all([
    firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).collection('tables').doc('table-cashier').set(table('table-cashier', 120)),
    firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).collection('tables').doc('table-waiter').set(table('table-waiter', 80)),
    firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).collection('tables').doc('table-sede').set(table('table-sede', 60)),
    firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).collection('tables').doc('table-general').set(table('table-general', 40)),
    firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).collection('tables').doc('table-global').set(table('table-global', 30)),
    firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).collection('tables').doc('table-early').set({ ...table('table-early', 25), status: 'cooking', statusLabel: 'En preparación' })
  ]);

  await Promise.all([createOperator('mesero', '111111'), createOperator('cocina', '222222'), createOperator('cajero', '333333')]);

  const waiterPin = await request('/api/auth/pin', { tenantId, branchId, pin: '111111' });
  const kitchenPin = await request('/api/auth/pin', { tenantId, branchId, pin: '222222' });
  const cashierPin = await request('/api/auth/pin', { tenantId, branchId, pin: '333333' });
  const invalidPin = await request('/api/auth/pin', { tenantId, branchId, pin: '000000' });
  expect(waiterPin.status === 200 && waiterPin.body.staff?.role === 'mesero', 'PIN de mesero entrega el rol correcto');
  expect(kitchenPin.status === 200 && kitchenPin.body.staff?.role === 'cocina', 'PIN de cocina entrega el rol correcto');
  expect(cashierPin.status === 200 && cashierPin.body.staff?.role === 'cajero', 'PIN de cajero entrega el rol correcto');
  expect(invalidPin.status === 401, 'un PIN incorrecto queda bloqueado');

  const waiterToken = await exchangeCustomToken(waiterPin.body.token);
  const kitchenToken = await exchangeCustomToken(kitchenPin.body.token);
  const cashierToken = await exchangeCustomToken(cashierPin.body.token);
  const deniedKitchen = await request('/api/sales/complete', { tenantId, branchId, tableId: 'table-cashier', tipAmount: 0, payment }, kitchenToken);
  expect(deniedKitchen.status === 403, 'cocina no puede registrar cobros');
  const prematureSale = await request('/api/sales/complete', { tenantId, branchId, tableId: 'table-early', tipAmount: 0, payment }, cashierToken);
  expect(prematureSale.status !== 200, 'no se puede cobrar una mesa que aún no pidió la cuenta');

  const cashierSale = await request('/api/sales/complete', { tenantId, branchId, tableId: 'table-cashier', amount: 999999, tipAmount: 5, payment }, cashierToken);
  expect(cashierSale.status === 200, 'cajero registra un cobro válido');

  const waiterSale = await request('/api/sales/complete', { tenantId, branchId, tableId: 'table-waiter', tipAmount: 0, payment }, waiterToken);
  expect(waiterSale.status === 200, 'mesero registra un cobro válido');

  const sedeToken = await createAdminToken('admin-sede', { role: 'admin_sede', tenantId, branchIds: [branchId] });
  const sedeSale = await request('/api/sales/complete', { tenantId, branchId, tableId: 'table-sede', tipAmount: 0, payment }, sedeToken);
  expect(sedeSale.status === 200, 'admin de sede registra un cobro de su sede');

  const generalToken = await createAdminToken('admin-general', { role: 'admin_general', tenantId, branchIds: [branchId] });
  const generalSale = await request('/api/sales/complete', { tenantId, branchId, tableId: 'table-general', tipAmount: 0, payment }, generalToken);
  expect(generalSale.status === 200, 'admin general registra un cobro de su empresa');
  const syncedStaffId = `${runId}-sync-waiter`;
  createdUserIds.push(syncedStaffId);
  const validStaffSync = await request('/api/staff/sync', {
    tenantId,
    staff: [{ id: syncedStaffId, name: 'QA Sync Waiter', role: 'Mozo Salón', roleKey: 'mesero', assignedBranchIds: [branchId], pin: '444444', active: true }]
  }, generalToken);
  expect(validStaffSync.status === 200, 'admin general registra personal operativo');
  const syncedStaff = (await firestore.collection('users').doc(syncedStaffId).get()).data();
  expect(Boolean(syncedStaff?.pinHash) && !('pin' in syncedStaff), 'el PIN del personal se guarda solo como hash');
  const forbiddenStaffRole = await request('/api/staff/sync', {
    tenantId,
    staff: [{ id: `${runId}-forbidden`, name: 'QA Forbidden', role: 'Administrador Global', roleKey: 'admin_global', assignedBranchIds: [branchId], active: true }]
  }, generalToken);
  expect(forbiddenStaffRole.status === 400, 'la sincronización de personal rechaza roles administrativos');
  expect(!(await firestore.collection('users').doc(`${runId}-forbidden`).get()).exists, 'un rol administrativo no se persiste desde personal');

  const globalToken = await createAdminToken('admin-global', { role: 'admin_global', platformAdmin: true });
  const globalSale = await request('/api/sales/complete', { tenantId, branchId, tableId: 'table-global', tipAmount: 0, payment }, globalToken);
  expect(globalSale.status === 200, 'admin global registra un cobro para la empresa seleccionada');
  const provisionedAdmin = await request('/api/admins/provision', {
    admin: {
      name: 'QA Provisioned Sede', email: `${runId}-provisioned@example.invalid`, role: 'Administrador de Sede',
      roleKey: 'admin_sede', brand: 'QA E2E Restaurant', brandId: tenantId,
      branchId, branchName: 'QA Branch', assignedBranchIds: [branchId], active: true
    }
  }, globalToken);
  expect(provisionedAdmin.status === 200 && Boolean(provisionedAdmin.body.activationLink), 'admin global provisiona una identidad con enlace de activación');
  createdAuthIds.push(provisionedAdmin.body.profile.id);
  createdUserIds.push(provisionedAdmin.body.profile.id);
  const provisionedClaims = await auth.getUser(provisionedAdmin.body.profile.id);
  expect(provisionedClaims.customClaims?.role === 'admin_sede' && provisionedClaims.customClaims?.tenantId === tenantId, 'la identidad provisionada recibe claims de sede firmados');

  const duplicateSale = await request('/api/sales/complete', { tenantId, branchId, tableId: 'table-cashier', tipAmount: 0, payment }, cashierToken);
  expect(duplicateSale.status !== 200, 'un cobro duplicado queda bloqueado');

  const branch = (await firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).get()).data();
  const paidTable = (await firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).collection('tables').doc('table-cashier').get()).data();
  const sales = await firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).collection('sales').get();
  expect(branch.todaySales === 335, 'el total diario proviene de los consumos almacenados en servidor');
  expect(paidTable.status === 'free' && paidTable.total === 0, 'el cobro libera la mesa de forma persistente');
  expect(sales.size === 5, 'cada cobro genera exactamente una venta');
  console.log('QA_E2E_RESULT=PASS');
} finally {
  const branchRef = firestore.collection('restaurants').doc(tenantId).collection('branches').doc(branchId);
  const [tables, sales] = await Promise.all([branchRef.collection('tables').get(), branchRef.collection('sales').get()]);
  const batch = firestore.batch();
  tables.docs.forEach((doc) => batch.delete(doc.ref));
  sales.docs.forEach((doc) => batch.delete(doc.ref));
  batch.delete(branchRef);
  batch.delete(firestore.collection('restaurants').doc(tenantId));
  createdUserIds.forEach((id) => batch.delete(firestore.collection('users').doc(id)));
  await batch.commit();
  await Promise.all(createdAuthIds.map((id) => auth.deleteUser(id).catch(() => undefined)));
  await Promise.all(createdUserIds.map((id) => auth.deleteUser(id).catch(() => undefined)));
  console.log('QA_E2E_CLEANUP=COMPLETE');
}
