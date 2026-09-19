import {
  collection,
  collectionGroup,
  doc,
  documentId,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch
} from 'firebase/firestore';
import { auth, firestoreDb } from './firebase';
import { AdminUser, BranchLocation, ChainBrand, KDSTicket, MasterCarta, MenuItem, StaffMember, TableItem } from '../types';

let scope = { tenantId: '', branchId: '' };

export function setFirestoreScope(tenantId?: string, branchId?: string) {
  scope = { tenantId: tenantId || '', branchId: branchId || '' };
}

const clean = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const fromDocs = <T,>(snapshot: { docs: Array<{ id: string; data: () => unknown }> }): T[] =>
  snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as object) } as T));

export async function initRTDBSeedIfEmpty(): Promise<boolean> {
  // Live Firestore database is used directly without mock seed fallbacks
  return false;
}

const noop = () => {};

export function subscribeToChains(callback: (items: ChainBrand[]) => void) {
  if (!firestoreDb) { callback([]); return noop; }
  const target = scope.tenantId
    ? query(collection(firestoreDb, 'restaurants'), where(documentId(), '==', scope.tenantId))
    : collection(firestoreDb, 'restaurants');
  return onSnapshot(target, async (snapshot) => {
    const chainsWithBranches: ChainBrand[] = [];
    for (const docSnap of snapshot.docs) {
      const chainData = { id: docSnap.id, ...(docSnap.data() as object) } as ChainBrand;
      try {
        const branchesSnap = await getDocs(collection(firestoreDb!, 'restaurants', docSnap.id, 'branches'));
        chainData.locations = branchesSnap.docs.map((b) => ({ id: b.id, ...(b.data() as object) } as BranchLocation));
        chainData.locationsCount = chainData.locations.length;
      } catch {
        chainData.locations = chainData.locations || [];
      }
      chainsWithBranches.push(chainData);
    }
    callback(chainsWithBranches);
  });
}

export function subscribeToTables(callback: (items: TableItem[]) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback([]); return noop; }
  const target = collection(firestoreDb, 'restaurants', scope.tenantId, 'branches', scope.branchId, 'tables');
  return onSnapshot(target, (value) => callback(fromDocs<TableItem>(value)));
}

export function subscribeToKDSTickets(callback: (items: KDSTicket[]) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback([]); return noop; }
  const target = collection(firestoreDb, 'restaurants', scope.tenantId, 'branches', scope.branchId, 'orders');
  return onSnapshot(target, (value) => callback(fromDocs<KDSTicket>(value)));
}

export function subscribeToBranchMenus(callback: (items: Record<string, MenuItem[]>) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback({}); return noop; }
  const branchId = scope.branchId;
  const target = collection(firestoreDb, 'restaurants', scope.tenantId, 'branches', branchId, 'menu');
  return onSnapshot(target, (value) => callback({ [branchId]: fromDocs<MenuItem>(value) }));
}

export function subscribeToStaff(callback: (items: StaffMember[]) => void) {
  if (!firestoreDb) { callback([]); return noop; }
  const target = scope.tenantId
    ? query(collection(firestoreDb, 'users'), where('tenantId', '==', scope.tenantId))
    : collection(firestoreDb, 'users');
  return onSnapshot(target, (value) => {
    const all = fromDocs<StaffMember>(value);
    callback(all.filter((u) => ['mesero', 'cocina', 'cajero'].includes(u.roleKey)).map((member) => ({ ...member, pin: '' })));
  });
}

export function subscribeToAdmins(callback: (items: AdminUser[]) => void) {
  if (!firestoreDb) { callback([]); return noop; }
  const tokenTenant = scope.tenantId;
  const target = tokenTenant
    ? query(collection(firestoreDb, 'users'), where('tenantId', '==', tokenTenant))
    : collection(firestoreDb, 'users');
  return onSnapshot(target, (value) => {
    const all = fromDocs<AdminUser>(value);
    callback(all.filter((u) => ['admin_global', 'admin_general', 'admin_sede'].includes(u.roleKey)));
  });
}

export function subscribeToMasterCartas(callback: (items: MasterCarta[]) => void) {
  if (!firestoreDb) { callback([]); return noop; }
  const target = scope.tenantId
    ? collection(firestoreDb, 'restaurants', scope.tenantId, 'masterCartas')
    : collectionGroup(firestoreDb, 'masterCartas');
  return onSnapshot(target, (value) => callback(fromDocs<MasterCarta>(value)));
}

async function syncCollection<T extends { id: string }>(name: string, items: T[], scopeField?: { field: string; value: string }) {
  if (!firestoreDb || !Array.isArray(items) || items.length === 0) return;
  const target = scopeField ? query(collection(firestoreDb, name), where(scopeField.field, '==', scopeField.value)) : collection(firestoreDb, name);
  const existing = await getDocs(target);
  const ids = new Set(items.map((item) => item.id));
  const batch = writeBatch(firestoreDb);
  existing.docs.forEach((item) => { if (!ids.has(item.id)) batch.delete(item.ref); });
  items.forEach((item) => batch.set(doc(firestoreDb!, name, item.id), clean(item)));
  await batch.commit();
}

async function syncMenu(branchId: string, items: MenuItem[]) {
  if (!firestoreDb || !branchId || !scope.tenantId || !Array.isArray(items) || items.length === 0) return;
  const target = collection(firestoreDb, 'restaurants', scope.tenantId, 'branches', branchId, 'menu');
  const existing = await getDocs(target);
  const ids = new Set(items.map((item) => String(item.id)));
  const batch = writeBatch(firestoreDb);
  existing.docs.forEach((item) => { if (!ids.has(item.id)) batch.delete(item.ref); });
  items.forEach((item) => batch.set(doc(target, String(item.id)), clean(item)));
  await batch.commit();
}

export const syncTablesToRTDB = async (items: TableItem[]) => {
  if (!firestoreDb || !scope.branchId || !scope.tenantId || !Array.isArray(items) || items.length === 0) return;
  const target = collection(firestoreDb, 'restaurants', scope.tenantId, 'branches', scope.branchId, 'tables');
  const existing = await getDocs(target);
  const ids = new Set(items.map((item) => item.id));
  const batch = writeBatch(firestoreDb);
  existing.docs.forEach((item) => { if (!ids.has(item.id)) batch.delete(item.ref); });
  items.forEach((item) => batch.set(doc(target, item.id), clean({ ...item, branchId: scope.branchId, restaurantId: scope.tenantId })));
  await batch.commit();
};

export const syncKDSTicketsToRTDB = async (items: KDSTicket[]) => {
  if (!firestoreDb || !scope.branchId || !scope.tenantId || !Array.isArray(items)) return;
  const target = collection(firestoreDb, 'restaurants', scope.tenantId, 'branches', scope.branchId, 'orders');
  const existing = await getDocs(target);
  const ids = new Set(items.map((item) => item.id));
  const batch = writeBatch(firestoreDb);
  existing.docs.forEach((item) => { if (!ids.has(item.id)) batch.delete(item.ref); });
  items.forEach((item) => batch.set(doc(target, item.id), clean({ ...item, branchId: scope.branchId, restaurantId: scope.tenantId })));
  await batch.commit();
};

export const syncBranchMenusToRTDB = async (menus: Record<string, MenuItem[]>) => {
  if (!firestoreDb || !scope.tenantId) return;
  for (const [branchId, items] of Object.entries(menus)) {
    if (!items || items.length === 0) continue;
    await syncMenu(branchId, items);
  }
};

export const syncMasterCartasToRTDB = (items: MasterCarta[]) => {
  if (!items || items.length === 0) return;
  return scope.tenantId ? syncCollection(`restaurants/${scope.tenantId}/masterCartas`, items) : syncCollection('masterCartas', items);
};

export const syncChainsToRTDB = async (items: ChainBrand[]) => {
  if (!firestoreDb || !Array.isArray(items) || items.length === 0) return;
  for (const chain of items) {
    const { locations, ...chainMeta } = chain;
    await setDoc(doc(firestoreDb, 'restaurants', chain.id), clean({
      ...chainMeta,
      locationsCount: (locations || []).length,
      updatedAt: Date.now()
    }), { merge: true });
    if (Array.isArray(locations)) {
      for (const loc of locations) {
        await setDoc(doc(firestoreDb, 'restaurants', chain.id, 'branches', loc.id), clean({
          ...loc,
          restaurantId: chain.id,
          updatedAt: Date.now()
        }), { merge: true });
      }
    }
  }
};

export const syncAdminsToRTDB = async (items: AdminUser[]) => {
  if (!firestoreDb || !items || items.length === 0) return;
  // Nunca eliminamos documentos al sincronizar administradores: la colección users
  // también contiene el personal operativo del mismo tenant.
  const batch = writeBatch(firestoreDb);
  items.forEach((admin) => batch.set(doc(firestoreDb!, 'users', admin.id), clean(admin), { merge: true }));
  await batch.commit();
};

export async function syncStaffToRTDB(items: StaffMember[]) {
  if (!auth?.currentUser || !Array.isArray(items) || items.length === 0) return;
  const token = await auth.currentUser.getIdToken();
  const response = await fetch('/api/staff/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tenantId: scope.tenantId, staff: items })
  });
  if (!response.ok) throw new Error('No fue posible guardar el personal.');
}

export async function resetAllDataInRTDB() {
  return false;
}
