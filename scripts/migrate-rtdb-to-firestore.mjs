import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectId = process.env.FIREBASE_PROJECT_ID || 'restaurant-4e0ee';
const databaseURL = process.env.FIREBASE_DATABASE_URL || 'https://restaurant-4e0ee-default-rtdb.firebaseio.com';

// Ensure ADC path if not explicitly provided
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const defaultAdcPath = path.join(process.env.APPDATA || '', 'gcloud', 'application_default_credentials.json');
  if (fs.existsSync(defaultAdcPath)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = defaultAdcPath;
  }
}

const app = initializeApp({
  credential: applicationDefault(),
  projectId,
  databaseURL
});

let source = null;
const backupPath = path.join(__dirname, 'rtdb-backup.json');
if (fs.existsSync(backupPath)) {
  try {
    source = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    console.log('✓ Leídos datos de origen desde backup local rtdb-backup.json');
  } catch (e) {
    console.warn('No se pudo leer backup local, consultando RTDB:', e.message);
  }
}

if (!source) {
  try {
    source = (await getDatabase(app).ref('restaurant').get()).val();
    console.log('✓ Leídos datos de origen directamente desde Realtime Database');
  } catch (e) {
    throw new Error('No se encontraron datos en RTDB ni en backup local: ' + e.message);
  }
}

const db = getFirestore(app);
const firebaseAuth = getAuth(app);
const array = (value) => Array.isArray(value) ? value : value ? Object.values(value) : [];

const writeCollection = async (name, values, transform = (item) => item) => {
  const items = array(values);
  for (let offset = 0; offset < items.length; offset += 400) {
    const batch = db.batch();
    for (const raw of items.slice(offset, offset + 400)) {
      const item = await transform(raw);
      if (item && item.id) {
        batch.set(db.collection(name).doc(String(item.id)), item);
      }
    }
    await batch.commit();
  }
  console.log(`✓ ${name}: ${items.length} documentos migrados`);
};

// 1. Restaurantes / Cadenas
await writeCollection('restaurants', source.chains);

// 2. Cartas Maestras
await writeCollection('masterCartas', source.masterCartas);

// 3. Administradores (incluyendo Admin Global)
const globalAdmin = {
  id: 'adm-global-1',
  name: 'José Manuel Vasquez Rivero',
  docType: 'DNI',
  docNumber: '10203040',
  email: 'admin@ordena.pe',
  phone: '+51 999 888 777',
  role: 'Administrador Global',
  roleKey: 'admin_global',
  initials: 'JV',
  pin: '999999',
  active: true
};

const rawAdmins = array(source.admins);
if (!rawAdmins.some((a) => a.roleKey === 'admin_global' || a.id === 'adm-global-1')) {
  rawAdmins.unshift(globalAdmin);
}

await writeCollection('admins', rawAdmins, async (admin) => {
  let uid = admin.authUid;
  if (!uid && admin.email) {
    try {
      uid = (await firebaseAuth.getUserByEmail(admin.email)).uid;
    } catch {
      // Usuario pendiente de registro en Firebase Auth
    }
  }
  const { pin, ...safeAdmin } = admin;
  return { ...safeAdmin, id: uid || admin.id, authUid: uid || null };
});

// 4. Staff / Personal operativo
const defaultStaff = [
  { id: 'stf-1', name: 'Carlos Mendoza', role: 'Mozo Principal', pin: '123456', assignedBranchIds: ['loc-miraflores', 'loc-chorrillos'], brandId: 'la-barra', active: true },
  { id: 'stf-2', name: 'Rosa Paredes', role: 'Moza Salón', pin: '234567', assignedBranchIds: ['loc-miraflores'], brandId: 'la-barra', active: true },
  { id: 'stf-3', name: 'Jorge Benítez', role: 'Mozo Terraza', pin: '345678', assignedBranchIds: ['loc-miraflores', 'loc-chorrillos'], brandId: 'la-barra', active: true },
  { id: 'stf-4', name: 'Walter Quispe', role: 'Barman / Bebidas', pin: '456789', assignedBranchIds: ['loc-miraflores'], brandId: 'la-barra', active: true },
  { id: 'stf-5', name: 'Marilú Chávez', role: 'Cajera POS', pin: '567890', assignedBranchIds: ['loc-miraflores', 'loc-chorrillos', 'loc-san-miguel'], brandId: 'la-barra', active: true },
  { id: 'stf-6', name: 'Julio Cárdenas', role: 'Mozo Salón', pin: '678901', assignedBranchIds: ['loc-chorrillos'], brandId: 'la-barra', active: true },
  { id: 'stf-7', name: 'Mario Quispe', role: 'Jefe de Cocina KDS', pin: '555555', assignedBranchIds: ['loc-miraflores'], brandId: 'la-barra', active: true }
];

const staffList = (source.staff && Object.keys(source.staff).length > 0) ? source.staff : defaultStaff;
await writeCollection('staff', staffList, async (member) => {
  const pinHash = member.pin ? await bcrypt.hash(String(member.pin), 12) : member.pinHash;
  const { pin, ...safeMember } = member;
  return { ...safeMember, pinHash };
});

// 5. Mesas y Comandas
const defaultBranch = array(source.chains)[0]?.locations?.[0]?.id || 'loc-miraflores';
await writeCollection('tables', source.tables, (table) => ({ ...table, branchId: table.branchId || defaultBranch }));

const defaultTickets = [
  {
    id: 'kds-104',
    orderNumber: '104',
    tableNumber: '04',
    tableName: 'Mesa 04 (4 personas)',
    branchId: defaultBranch,
    status: 'preparing',
    timeElapsed: '06m 12s',
    createdAt: Date.now() - 372000,
    items: [
      { id: 'item-1', name: 'Plato Principal Especial', qty: 2, station: 'Cocina Caliente', status: 'preparing' },
      { id: 'item-2', name: 'Entrada Gourmet Marina', qty: 1, station: 'Barra Fría', status: 'preparing' },
      { id: 'item-3', name: 'Bebidas Naturales de la Casa', qty: 2, station: 'Bebidas', status: 'ready' }
    ]
  }
];

const kdsList = (source.kdsTickets && Object.keys(source.kdsTickets).length > 0) ? source.kdsTickets : defaultTickets;
await writeCollection('kdsTickets', kdsList, (ticket) => ({ ...ticket, branchId: ticket.branchId || defaultBranch }));

// 6. Catálogos activos por sede (branchMenus/{branchId}/items/{itemId})
for (const [branchId, rawItems] of Object.entries(source.branchMenus || {})) {
  const items = array(rawItems);
  for (let offset = 0; offset < items.length; offset += 400) {
    const batch = db.batch();
    items.slice(offset, offset + 400).forEach((item) => {
      batch.set(db.collection('branchMenus').doc(branchId).collection('items').doc(String(item.id)), item);
    });
    await batch.commit();
  }
  console.log(`✓ branchMenus/${branchId}/items: ${items.length} platos migrados`);
}

console.log(`\n🎉 Migración a Cloud Firestore completada con éxito en '${projectId}' (base default).`);
