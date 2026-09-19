import fs from 'fs';
import path from 'path';
import { cert, getApps, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

const root = path.resolve(import.meta.dirname, '..');
const readEnv = (file) => {
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/)
    .filter((line) => line && !line.trimStart().startsWith('#') && line.includes('='))
    .map((line) => { const i = line.indexOf('='); return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')]; }));
};
const env = { ...readEnv(path.join(root, '.env')), ...readEnv(path.join(root, '.env.local')), ...process.env };
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY, authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID, appId: env.VITE_FIREBASE_APP_ID
};
if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) throw new Error('Falta configuración Firebase de cliente.');

const serviceAccount = JSON.parse(fs.readFileSync(path.join(root, 'serviceAccountKey.json'), 'utf8'));
const adminApp = getApps().length ? getApps()[0] : initializeAdminApp({ credential: cert(serviceAccount) });
const adminAuth = getAdminAuth(adminApp);
const adminDb = getAdminFirestore(adminApp);
const runId = `qa-rules-${Date.now()}`;
const tenantId = runId;
const branchA = `${runId}-a`;
const branchB = `${runId}-b`;
const createdAuthIds = [];

const expect = (condition, message) => {
  if (!condition) throw new Error(message);
  console.log(`PASS ${message}`);
};
const exchangeCustomToken = async (customToken) => {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${config.apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: customToken, returnSecureToken: true })
  });
  const body = await response.json();
  if (!response.ok || !body.idToken) throw new Error(`No se pudo autenticar el perfil QA: ${body.error?.message || response.status}`);
  return body.idToken;
};
const canReadMenu = async (name, claims, branchId) => {
  const userId = `${runId}-${name}`;
  createdAuthIds.push(userId);
  const idToken = await exchangeCustomToken(await adminAuth.createCustomToken(userId, claims));
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/restaurants/${tenantId}/branches/${branchId}/menu/dish-1`,
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  if (response.status === 200) return true;
  if (response.status === 403) return false;
  throw new Error(`Lectura de reglas inesperada: HTTP ${response.status}`);
};
const canWriteMenu = async (name, claims, branchId) => {
  const userId = `${runId}-${name}`;
  createdAuthIds.push(userId);
  const idToken = await exchangeCustomToken(await adminAuth.createCustomToken(userId, claims));
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/restaurants/${tenantId}/branches/${branchId}/menu/dish-1?updateMask.fieldPaths=available`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { available: { booleanValue: false } } })
    }
  );
  if (response.status === 200) return true;
  if (response.status === 403) return false;
  throw new Error(`Escritura de reglas inesperada: HTTP ${response.status}`);
};

try {
  await adminDb.collection('restaurants').doc(tenantId).set({ id: tenantId, name: 'QA Rules', status: 'Activa' });
  await Promise.all([branchA, branchB].map(async (branchId) => {
    await adminDb.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).set({ id: branchId, name: branchId, active: true });
    await adminDb.collection('restaurants').doc(tenantId).collection('branches').doc(branchId).collection('menu').doc('dish-1').set({ id: 1, name: 'QA Dish', available: true });
  }));

  expect(await canReadMenu('sede-own', { role: 'admin_sede', tenantId, branchIds: [branchA] }, branchA), 'admin de sede puede leer su sede asignada');
  expect(!(await canReadMenu('sede-other', { role: 'admin_sede', tenantId, branchIds: [branchA] }, branchB)), 'admin de sede no puede leer otra sede');
  expect(!(await canReadMenu('waiter-other', { role: 'mesero', tenantId, branchIds: [branchA] }, branchB)), 'mesero no puede leer otra sede');
  expect(await canReadMenu('general', { role: 'admin_general', tenantId, branchIds: [branchA] }, branchB), 'admin general puede leer las sedes de su empresa');
  expect(await canReadMenu('global', { role: 'admin_global', platformAdmin: true }, branchB), 'admin global puede leer todas las sedes');
  expect(await canWriteMenu('sede-write-own', { role: 'admin_sede', tenantId, branchIds: [branchA] }, branchA), 'admin de sede puede editar la carta de su sede');
  expect(!(await canWriteMenu('sede-write-other', { role: 'admin_sede', tenantId, branchIds: [branchA] }, branchB)), 'admin de sede no puede editar la carta de otra sede');
  console.log('QA_RULES_RESULT=PASS');
} finally {
  const branchRef = adminDb.collection('restaurants').doc(tenantId).collection('branches');
  const branches = await branchRef.get();
  const batch = adminDb.batch();
  for (const branch of branches.docs) {
    const dishes = await branch.ref.collection('menu').get();
    dishes.docs.forEach((dish) => batch.delete(dish.ref));
    batch.delete(branch.ref);
  }
  batch.delete(adminDb.collection('restaurants').doc(tenantId));
  await batch.commit();
  await Promise.all(createdAuthIds.map((id) => adminAuth.deleteUser(id).catch(() => undefined)));
  console.log('QA_RULES_CLEANUP=COMPLETE');
}
