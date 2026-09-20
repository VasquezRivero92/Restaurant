import {
  collection,
  collectionGroup,
  doc,
  documentId,
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

export function getFirestoreScope() {
  return { ...scope };
}

const clean = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const fromDocs = <T,>(snapshot: { docs: Array<{ id: string; data: () => unknown }> }): T[] =>
  snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as object) } as T));

// Memoria caché para evitar reescribir documentos idénticos y eliminar lecturas duplicadas
const syncedCache = new Map<string, string>();
const knownCollectionIds = new Map<string, Set<string>>();

const getDocKey = (collectionPath: string, docId: string) => `${collectionPath}/${docId}`;

export async function initRTDBSeedIfEmpty(): Promise<boolean> {
  return false;
}

const noop = () => {};

/**
 * Suscripción optimizada a Restaurantes (Chains).
 * Utiliza las ubicaciones ya embebidas en el documento principal,
 * eliminando la consulta N+1 a subcolecciones en cada snapshot.
 */
export function subscribeToChains(callback: (items: ChainBrand[]) => void) {
  if (!firestoreDb) { callback([]); return noop; }
  const target = scope.tenantId
    ? query(collection(firestoreDb, 'restaurants'), where(documentId(), '==', scope.tenantId))
    : collection(firestoreDb, 'restaurants');

  return onSnapshot(target, (snapshot) => {
    const collPath = 'restaurants';
    const currentIds = new Set<string>();

    const chainsWithBranches: ChainBrand[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>;
      const locations = (Array.isArray(data.locations) ? data.locations : []) as BranchLocation[];
      currentIds.add(docSnap.id);

      const chain: ChainBrand = {
        id: docSnap.id,
        ...(data as object),
        locations,
        locationsCount: locations.length
      } as ChainBrand;

      syncedCache.set(getDocKey(collPath, docSnap.id), JSON.stringify(clean(chain)));
      return chain;
    });

    knownCollectionIds.set(collPath, currentIds);
    callback(chainsWithBranches);
  });
}

/**
 * Suscripción a mesas de la sede activa.
 */
export function subscribeToTables(callback: (items: TableItem[]) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback([]); return noop; }
  const collPath = `restaurants/${scope.tenantId}/branches/${scope.branchId}/tables`;
  const target = collection(firestoreDb, collPath);

  return onSnapshot(target, (snapshot) => {
    const currentIds = new Set<string>();
    const tables: TableItem[] = [];

    for (const docSnap of snapshot.docs) {
      const item = { id: docSnap.id, ...(docSnap.data() as object) } as TableItem;
      tables.push(item);
      currentIds.add(docSnap.id);
      syncedCache.set(getDocKey(collPath, docSnap.id), JSON.stringify(clean(item)));
    }

    knownCollectionIds.set(collPath, currentIds);
    callback(tables);
  });
}

/**
 * Suscripción a comandas (KDS) de la sede activa.
 */
export function subscribeToKDSTickets(callback: (items: KDSTicket[]) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback([]); return noop; }
  const collPath = `restaurants/${scope.tenantId}/branches/${scope.branchId}/orders`;
  const target = collection(firestoreDb, collPath);

  return onSnapshot(target, (snapshot) => {
    const currentIds = new Set<string>();
    const orders: KDSTicket[] = [];

    for (const docSnap of snapshot.docs) {
      const item = { id: docSnap.id, ...(docSnap.data() as object) } as KDSTicket;
      orders.push(item);
      currentIds.add(docSnap.id);
      syncedCache.set(getDocKey(collPath, docSnap.id), JSON.stringify(clean(item)));
    }

    knownCollectionIds.set(collPath, currentIds);
    callback(orders);
  });
}

/**
 * Suscripción al menú de la sede activa.
 */
export function subscribeToBranchMenus(callback: (items: Record<string, MenuItem[]>) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback({}); return noop; }
  const branchId = scope.branchId;
  const collPath = `restaurants/${scope.tenantId}/branches/${branchId}/menu`;
  const target = collection(firestoreDb, collPath);

  return onSnapshot(target, (snapshot) => {
    const currentIds = new Set<string>();
    const dishes: MenuItem[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const item = { id: Number(docSnap.id) || data.id, ...data } as unknown as MenuItem;
      dishes.push(item);
      currentIds.add(docSnap.id);
      syncedCache.set(getDocKey(collPath, String(docSnap.id)), JSON.stringify(clean(item)));
    }

    knownCollectionIds.set(collPath, currentIds);
    callback({ [branchId]: dishes });
  });
}

/**
 * Suscripción a usuarios operativos (personal de servicio/cocina).
 */
export function subscribeToStaff(callback: (items: StaffMember[]) => void) {
  if (!firestoreDb) { callback([]); return noop; }
  const collPath = 'users';
  const target = scope.tenantId
    ? query(collection(firestoreDb, collPath), where('tenantId', '==', scope.tenantId))
    : collection(firestoreDb, collPath);

  return onSnapshot(target, (snapshot) => {
    const all = fromDocs<StaffMember>(snapshot);
    for (const member of all) {
      syncedCache.set(getDocKey(collPath, String(member.id)), JSON.stringify(clean(member)));
    }
    callback(all.filter((u) => ['mesero', 'cocina', 'cajero'].includes(u.roleKey)).map((m) => ({ ...m, pin: '' })));
  });
}

/**
 * Suscripción a administradores autorizados.
 */
export function subscribeToAdmins(callback: (items: AdminUser[]) => void) {
  if (!firestoreDb) { callback([]); return noop; }
  const tokenTenant = scope.tenantId;
  const collPath = 'users';
  const target = tokenTenant
    ? query(collection(firestoreDb, collPath), where('tenantId', '==', tokenTenant))
    : collection(firestoreDb, collPath);

  return onSnapshot(target, (snapshot) => {
    const all = fromDocs<AdminUser>(snapshot);
    for (const admin of all) {
      syncedCache.set(getDocKey(collPath, String(admin.id)), JSON.stringify(clean(admin)));
    }
    callback(all.filter((u) => ['admin_global', 'admin_general', 'admin_sede'].includes(u.roleKey)));
  });
}

/**
 * Suscripción a cartas maestras.
 */
export function subscribeToMasterCartas(callback: (items: MasterCarta[]) => void) {
  if (!firestoreDb) { callback([]); return noop; }
  const collPath = scope.tenantId ? `restaurants/${scope.tenantId}/masterCartas` : 'masterCartas';
  const target = scope.tenantId
    ? collection(firestoreDb, collPath)
    : collectionGroup(firestoreDb, 'masterCartas');

  return onSnapshot(target, (snapshot) => {
    const cartas = fromDocs<MasterCarta>(snapshot);
    for (const carta of cartas) {
      syncedCache.set(getDocKey(collPath, carta.id), JSON.stringify(clean(carta)));
    }
    callback(cartas);
  });
}

/**
 * Sincronización diferencial ultra-eficiente:
 * 1. Compara cada elemento con la caché local de Firestore.
 * 2. Si el elemento no cambió, NO genera escritura ni lectura (0 costo).
 * 3. Si cambió o es nuevo, únicamente escribe ese documento puntual con { merge: true }.
 * 4. Elimina la lectura masiva previa (getDocs), ahorrando el 95%+ de operaciones.
 */
async function syncCollectionDifferential<T extends { id: string | number }>(
  collPath: string,
  items: T[],
  transformPayload?: (item: T) => unknown
) {
  if (!firestoreDb || !Array.isArray(items)) return;

  const currentIds = new Set<string>();
  const itemsToUpdate: Array<{ id: string; payload: unknown; serialized: string }> = [];

  for (const item of items) {
    const strId = String(item.id);
    currentIds.add(strId);
    const payload = clean(transformPayload ? transformPayload(item) : item);
    const serialized = JSON.stringify(payload);
    const cacheKey = getDocKey(collPath, strId);

    if (syncedCache.get(cacheKey) !== serialized) {
      itemsToUpdate.push({ id: strId, payload, serialized });
    }
  }

  // Detectar eliminaciones utilizando el conjunto de IDs conocidos en memoria
  const knownIds = knownCollectionIds.get(collPath);
  const idsToDelete: string[] = [];
  if (knownIds) {
    for (const oldId of knownIds) {
      if (!currentIds.has(oldId)) {
        idsToDelete.push(oldId);
      }
    }
  }

  // Si no hay cambios ni eliminaciones, no consumir cuota de Firestore
  if (itemsToUpdate.length === 0 && idsToDelete.length === 0) {
    return;
  }

  const batch = writeBatch(firestoreDb);

  for (const item of itemsToUpdate) {
    batch.set(doc(firestoreDb, collPath, item.id), item.payload, { merge: true });
    syncedCache.set(getDocKey(collPath, item.id), item.serialized);
    if (knownIds) knownIds.add(item.id);
  }

  for (const delId of idsToDelete) {
    batch.delete(doc(firestoreDb, collPath, delId));
    syncedCache.delete(getDocKey(collPath, delId));
    if (knownIds) knownIds.delete(delId);
  }

  await batch.commit();
}

export const syncTablesToRTDB = async (items: TableItem[]) => {
  if (!firestoreDb || !scope.branchId || !scope.tenantId || !Array.isArray(items) || items.length === 0) return;
  const collPath = `restaurants/${scope.tenantId}/branches/${scope.branchId}/tables`;
  await syncCollectionDifferential(collPath, items, (table) => ({
    ...table,
    branchId: scope.branchId,
    restaurantId: scope.tenantId
  }));
};

export const syncKDSTicketsToRTDB = async (items: KDSTicket[]) => {
  if (!firestoreDb || !scope.branchId || !scope.tenantId || !Array.isArray(items)) return;
  const collPath = `restaurants/${scope.tenantId}/branches/${scope.branchId}/orders`;
  await syncCollectionDifferential(collPath, items, (order) => ({
    ...order,
    branchId: scope.branchId,
    restaurantId: scope.tenantId
  }));
};

export const syncBranchMenusToRTDB = async (menus: Record<string, MenuItem[]>) => {
  if (!firestoreDb || !scope.tenantId) return;
  for (const [branchId, items] of Object.entries(menus)) {
    if (!items || items.length === 0) continue;
    const collPath = `restaurants/${scope.tenantId}/branches/${branchId}/menu`;
    await syncCollectionDifferential(collPath, items);
  }
};

export const syncMasterCartasToRTDB = async (items: MasterCarta[]) => {
  if (!items || items.length === 0) return;
  const collPath = scope.tenantId ? `restaurants/${scope.tenantId}/masterCartas` : 'masterCartas';
  await syncCollectionDifferential(collPath, items);
};

export const syncChainsToRTDB = async (items: ChainBrand[]) => {
  if (!firestoreDb || !Array.isArray(items) || items.length === 0) return;
  for (const chain of items) {
    const { locations, ...chainMeta } = chain;
    const restPayload = clean({
      ...chainMeta,
      locations: locations || [],
      locationsCount: (locations || []).length
    });
    const cacheKey = getDocKey('restaurants', chain.id);
    const serialized = JSON.stringify(restPayload);

    if (syncedCache.get(cacheKey) !== serialized) {
      await setDoc(doc(firestoreDb, 'restaurants', chain.id), { ...restPayload, updatedAt: Date.now() }, { merge: true });
      syncedCache.set(cacheKey, serialized);
    }

    if (Array.isArray(locations)) {
      const branchColl = `restaurants/${chain.id}/branches`;
      await syncCollectionDifferential(branchColl, locations, (loc) => ({
        ...loc,
        restaurantId: chain.id
      }));
    }
  }
};

export const syncAdminsToRTDB = async (items: AdminUser[]) => {
  if (!firestoreDb || !items || items.length === 0) return;
  await syncCollectionDifferential('users', items);
};

export async function syncStaffToRTDB(items: StaffMember[]) {
  if (!auth?.currentUser || !Array.isArray(items) || items.length === 0 || !scope.tenantId) return;
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
