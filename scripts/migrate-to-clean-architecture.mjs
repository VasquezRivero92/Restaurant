import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectId = process.env.FIREBASE_PROJECT_ID || 'restaurant-4e0ee';
const defaultAdcPath = path.join(process.env.APPDATA || '', 'gcloud', 'application_default_credentials.json');
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(defaultAdcPath)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = defaultAdcPath;
}

const app = initializeApp({ credential: applicationDefault(), projectId });
const db = getFirestore(app);
const firebaseAuth = getAuth(app);

const backupPath = path.join(__dirname, 'rtdb-backup.json');
if (!fs.existsSync(backupPath)) throw new Error('No se encontro rtdb-backup.json');
const source = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

const array = (v) => Array.isArray(v) ? v : v ? Object.values(v) : [];

console.log('--- INICIANDO REESTRUCTURACION LIMPIA A CLOUD FIRESTORE ---');

// ==========================================
// 1. UNIFICACION DE USUARIOS (users/{userId})
// ==========================================
console.log('\n1. Migrando usuarios unificados a collection `users`...');

const rawAdmins = [
  {
    id: 'adm-global-1',
    name: 'José Manuel Vasquez Rivero',
    docType: 'DNI',
    docNumber: '10203040',
    email: 'admin@ordena.pe',
    phone: '+51 999 888 777',
    role: 'Administrador Global',
    roleKey: 'admin_global',
    tenantId: null,
    assignedBranchIds: [],
    initials: 'JV',
    pin: '999999',
    active: true
  },
  ...array(source.admins).map((a) => ({
    id: a.id,
    name: a.name,
    docType: a.docType || 'DNI',
    docNumber: a.docNumber || '',
    email: a.email,
    phone: a.phone || '',
    role: a.role,
    roleKey: a.roleKey,
    tenantId: a.brandId || null,
    brandName: a.brand || '',
    branchName: a.branchName || '',
    branchId: a.branchId || '',
    assignedBranchIds: a.assignedBranchIds || (a.branchId ? [a.branchId] : []),
    initials: a.initials || 'AD',
    pin: a.pin || '888888',
    active: a.active !== false
  }))
];

const rawStaff = [
  { id: 'stf-1', name: 'Carlos Mendoza', role: 'Mozo Principal', roleKey: 'mesero', pin: '123456', assignedBranchIds: ['loc-miraflores', 'loc-chorrillos'], tenantId: 'la-barra', tablesZone: 'Mesas 1 a 6', shift: 'Turno Mañana', active: true, avatarColor: 'bg-teal-600' },
  { id: 'stf-2', name: 'Rosa Paredes', role: 'Moza Salón', roleKey: 'mesero', pin: '234567', assignedBranchIds: ['loc-miraflores'], tenantId: 'la-barra', tablesZone: 'Mesas 7 a 12', shift: 'Turno Tarde', active: true, avatarColor: 'bg-purple-600' },
  { id: 'stf-3', name: 'Jorge Benítez', role: 'Mozo Terraza', roleKey: 'mesero', pin: '345678', assignedBranchIds: ['loc-miraflores', 'loc-chorrillos'], tenantId: 'la-barra', tablesZone: 'Mesas 13 a 16 & Barra', shift: 'Turno Completo', active: true, avatarColor: 'bg-amber-600' },
  { id: 'stf-4', name: 'Walter Quispe', role: 'Barman / Bebidas', roleKey: 'mesero', pin: '456789', assignedBranchIds: ['loc-miraflores'], tenantId: 'la-barra', tablesZone: 'Barra & Bebidas', shift: 'Turno Tarde', active: true, avatarColor: 'bg-blue-600' },
  { id: 'stf-5', name: 'Marilú Chávez', role: 'Cajera POS', roleKey: 'cajero', pin: '567890', assignedBranchIds: ['loc-miraflores', 'loc-chorrillos', 'loc-san-miguel'], tenantId: 'la-barra', tablesZone: 'Caja', shift: 'Turno Completo', active: true, avatarColor: 'bg-emerald-600' },
  { id: 'stf-6', name: 'Julio Cárdenas', role: 'Mozo Salón', roleKey: 'mesero', pin: '678901', assignedBranchIds: ['loc-chorrillos'], tenantId: 'la-barra', tablesZone: 'Mesas 1 a 8', shift: 'Turno Mañana', active: true, avatarColor: 'bg-rose-600' },
  { id: 'stf-7', name: 'Mario Quispe', role: 'Jefe de Cocina KDS', roleKey: 'cocina', pin: '555555', assignedBranchIds: ['loc-miraflores'], tenantId: 'la-barra', tablesZone: 'Cocina & KDS', shift: 'Turno Completo', active: true, avatarColor: 'bg-red-600' }
];

const allUsers = [...rawAdmins, ...rawStaff];
for (const user of allUsers) {
  let authUid = null;
  if (user.email) {
    try {
      authUid = (await firebaseAuth.getUserByEmail(user.email)).uid;
    } catch {}
  }
  const pinHash = user.pin ? await bcrypt.hash(String(user.pin), 12) : null;
  const { pin, ...safeUser } = user;
  const docData = {
    ...safeUser,
    authUid,
    pinHash,
    updatedAt: Date.now()
  };
  await db.collection('users').doc(String(user.id)).set(docData, { merge: true });
}
console.log(`✓ users: ${allUsers.length} usuarios migrados (Global, Dueños, Sedes, Mozos, Cocina).`);

// ==========================================
// 2. JERARQUIA RESTAURANTES Y SEDES
// ==========================================
console.log('\n2. Migrando restaurantes y subcolecciones jerárquicas...');

const chains = array(source.chains);
for (const chain of chains) {
  const { locations, ...chainMeta } = chain;
  const restRef = db.collection('restaurants').doc(chain.id);
  
  // Guardar documento del restaurante con conteo y metadata
  await restRef.set({
    ...chainMeta,
    locationsCount: (locations || []).length,
    updatedAt: Date.now()
  }, { merge: true });
  console.log(`  Restaurante: ${chain.name} (${chain.id})`);

  // Guardar cada sede como documento en subcoleccion branches
  for (const branch of (locations || [])) {
    const branchRef = restRef.collection('branches').doc(branch.id);
    await branchRef.set({
      ...branch,
      restaurantId: chain.id,
      updatedAt: Date.now()
    }, { merge: true });

    // A. Mesas de la sede
    const branchTables = array(source.tables).filter(t => (t.branchId || 'loc-miraflores') === branch.id);
    for (const table of branchTables) {
      await branchRef.collection('tables').doc(String(table.id)).set({
        ...table,
        branchId: branch.id,
        restaurantId: chain.id,
        updatedAt: Date.now()
      });
    }
    console.log(`    Sede ${branch.name} (${branch.id}): ${branchTables.length} mesas guardadas.`);

    // B. Menú activo de la sede
    const menuItems = array(source.branchMenus?.[branch.id] || []);
    for (const item of menuItems) {
      await branchRef.collection('menu').doc(String(item.id)).set({
        ...item,
        branchId: branch.id,
        restaurantId: chain.id,
        updatedAt: Date.now()
      });
    }
    console.log(`    Sede ${branch.name} (${branch.id}): ${menuItems.length} platos en carta activa.`);

    // C. Comandas y KDS de la sede
    const sampleKds = [
      {
        id: 'kds-104',
        orderNumber: '104',
        tableNumber: '04',
        tableName: 'Mesa 04 (4 personas)',
        branchId: branch.id,
        restaurantId: chain.id,
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
    if (branch.id === 'loc-miraflores') {
      for (const order of sampleKds) {
        await branchRef.collection('orders').doc(order.id).set(order);
      }
    }
  }

  // Cartas Maestras de la marca
  const masterCartas = array(source.masterCartas);
  for (const carta of masterCartas) {
    await restRef.collection('masterCartas').doc(carta.id).set({
      ...carta,
      restaurantId: chain.id,
      updatedAt: Date.now()
    });
  }
}

// ==========================================
// 3. LIMPIEZA DE COLECCIONES OBSOLETAS
// ==========================================
console.log('\n3. Limpiando colecciones raíz planas obsoletas...');
const collectionsToDelete = ['admins', 'staff', 'tables', 'kdsTickets', 'branchMenus', 'masterCartas'];

for (const colName of collectionsToDelete) {
  const snapshot = await db.collection(colName).get();
  if (!snapshot.empty) {
    const batch = db.batch();
    snapshot.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    console.log(`  ✓ Colección obsoleta raíz '${colName}' eliminada (${snapshot.size} docs removidos).`);
  }
}

console.log('\n======================================================');
console.log('🎉 REESTRUCTURACION LIMPIA COMPLETADA CON EXITO');
console.log('Nueva estructura Firestore:');
console.log(' - users/{userId}');
console.log(' - restaurants/{restaurantId}');
console.log('     └── branches/{branchId}');
console.log('           ├── tables/{tableId}');
console.log('           ├── menu/{dishId}');
console.log('           └── orders/{orderId}');
console.log('     └── masterCartas/{cartaId}');
console.log('======================================================\n');
