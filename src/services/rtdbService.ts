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
import { AdminUser, ApprovalRequest, AttendanceRecord, BranchLocation, CashShift, ChainBrand, InventoryItem, KDSTicket, KDSTicketItem, MasterCarta, MenuItem, QrCustomerOrder, Reservation, SaleRecord, StaffMember, TableItem } from '../types';

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
const handleSnapshotError = (resource: string, fallback?: () => void) => (err: Error) => {
  console.warn(`[Firestore:${resource}] Error de permisos o lectura:`, err.message);
  if (fallback) fallback();
};

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
  }, handleSnapshotError('chains', () => callback([])));
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
  }, handleSnapshotError('tables', () => callback([])));
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
      const data = docSnap.data() as Record<string, unknown>;
      const rawItems = Array.isArray(data.items) ? data.items : [];
      const normalizedItems: KDSTicketItem[] = rawItems.map((rawItem: unknown, idx: number) => {
        const it = (rawItem && typeof rawItem === 'object' ? rawItem : {}) as Record<string, unknown>;
        const isReady = Boolean(it.isReady || it.status === 'ready');
        const isServed = Boolean(it.isServed || it.status === 'served');
        return {
          id: (it.id as string) || `item-${docSnap.id}-${idx}`,
          dishId: typeof it.dishId === 'number' ? it.dishId : undefined,
          name: (it.name as string) || 'Plato',
          qty: typeof it.qty === 'number' ? it.qty : 1,
          price: typeof it.price === 'number' ? it.price : 0,
          substation: (it.substation as string) || (it.station as string) || 'COCINA',
          notes: (it.notes as string) || '',
          isReady,
          isServed,
          status: isServed ? ('served' as const) : isReady ? ('ready' as const) : ((it.status as string) === 'preparing' ? 'cooking' : (it.status as string) || 'cooking'),
          readyAt: (it.readyAt as string) || undefined,
          servedAt: (it.servedAt as string) || undefined
        } as KDSTicketItem;
      });

      const rawStatus = data.status as string;
      const normalizedStatus: KDSTicket['status'] =
        rawStatus === 'served'
          ? 'served'
          : rawStatus === 'ready'
          ? 'ready'
          : rawStatus === 'preparing' || rawStatus === 'cooking'
          ? 'cooking'
          : 'pending';

      const tableName = (data.table as string) || (data.tableName as string) || (data.tableNumber ? `Mesa ${data.tableNumber}` : `Comanda #${docSnap.id}`);

      const item: KDSTicket = {
        id: docSnap.id,
        table: tableName,
        station: (data.station as KDSTicket['station']) || 'calientes',
        status: normalizedStatus,
        waiter: (data.waiter as string) || 'Mozo de Turno',
        elapsed: (data.elapsed as string) || (data.timeElapsed as string) || 'Hace 5m',
        time: (data.time as string) || '13:30',
        createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
        arrivalOrder: typeof data.arrivalOrder === 'number' ? data.arrivalOrder : (parseInt(docSnap.id.replace(/\D/g, ''), 10) || 1),
        drinksNote: data.drinksNote as string | undefined,
        items: normalizedItems,
        branchId: (data.branchId as string) || scope.branchId
      };

      orders.push(item);
      currentIds.add(docSnap.id);
      syncedCache.set(getDocKey(collPath, docSnap.id), JSON.stringify(clean(item)));
    }

    knownCollectionIds.set(collPath, currentIds);
    callback(orders);
  }, handleSnapshotError('kdsTickets', () => callback([])));
}

/** Pedidos iniciados por clientes desde el QR. No llegan a cocina hasta que un mozo los confirme. */
export function subscribeToQrCustomerOrders(callback: (items: QrCustomerOrder[]) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback([]); return noop; }
  const collPath = `restaurants/${scope.tenantId}/branches/${scope.branchId}/customerOrders`;
  return onSnapshot(collection(firestoreDb, collPath), (snapshot) => {
    callback(fromDocs<QrCustomerOrder>(snapshot).sort((a, b) => b.createdAt - a.createdAt));
  }, handleSnapshotError('customerOrders', () => callback([])));
}

/** Ventas cerradas de la sede activa para reportes administrativos. */
export function subscribeToSales(callback: (items: SaleRecord[]) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback([]); return noop; }
  const collPath = `restaurants/${scope.tenantId}/branches/${scope.branchId}/sales`;
  return onSnapshot(collection(firestoreDb, collPath), (snapshot) => {
    const sales = fromDocs<SaleRecord>(snapshot).sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
    callback(sales);
  }, handleSnapshotError('sales', () => callback([])));
}

/** Consolidado del tenant para reportes de administrador general/global. */
export function subscribeToTenantSales(callback: (items: SaleRecord[]) => void) {
  if (!firestoreDb || !scope.tenantId) { callback([]); return noop; }
  return onSnapshot(query(collectionGroup(firestoreDb, 'sales'), where('tenantId', '==', scope.tenantId)), (snapshot) => {
    callback(fromDocs<SaleRecord>(snapshot).sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)));
  }, handleSnapshotError('tenantSales', () => callback([])));
}

export function subscribeToInventory(callback: (items: InventoryItem[]) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback([]); return noop; }
  const collPath = `restaurants/${scope.tenantId}/branches/${scope.branchId}/inventory`;
  return onSnapshot(collection(firestoreDb, collPath), (snapshot) => callback(fromDocs<InventoryItem>(snapshot)), handleSnapshotError('inventory', () => callback([])));
}

export function subscribeToCashShifts(callback: (items: CashShift[]) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback([]); return noop; }
  const collPath = `restaurants/${scope.tenantId}/branches/${scope.branchId}/cashShifts`;
  return onSnapshot(collection(firestoreDb, collPath), (snapshot) => callback(fromDocs<CashShift>(snapshot).sort((a, b) => b.openedAt - a.openedAt)), handleSnapshotError('cashShifts', () => callback([])));
}

export function subscribeToReservations(callback: (items: Reservation[]) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback([]); return noop; }
  const collPath = `restaurants/${scope.tenantId}/branches/${scope.branchId}/reservations`;
  return onSnapshot(collection(firestoreDb, collPath), (snapshot) => callback(fromDocs<Reservation>(snapshot).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))), handleSnapshotError('reservations', () => callback([])));
}

export function subscribeToAttendance(callback: (items: AttendanceRecord[]) => void) {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) { callback([]); return noop; }
  const collPath = `restaurants/${scope.tenantId}/branches/${scope.branchId}/attendance`;
  return onSnapshot(collection(firestoreDb, collPath), (snapshot) => callback(fromDocs<AttendanceRecord>(snapshot).sort((a, b) => b.checkInAt - a.checkInAt)), handleSnapshotError('attendance', () => callback([])));
}

export function subscribeToApprovals(callback: (items: ApprovalRequest[]) => void) {
  if (!firestoreDb || !scope.tenantId) { callback([]); return noop; }
  return onSnapshot(collection(firestoreDb, `restaurants/${scope.tenantId}/approvals`), (snapshot) => callback(fromDocs<ApprovalRequest>(snapshot).sort((a, b) => b.requestedAt - a.requestedAt)), handleSnapshotError('approvals', () => callback([])));
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
  }, handleSnapshotError('branchMenus', () => callback({})));
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
  }, handleSnapshotError('staff', () => callback([])));
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
  }, handleSnapshotError('admins', () => callback([])));
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
  }, handleSnapshotError('masterCartas', () => callback([])));
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

  try {
    const batch = writeBatch(firestoreDb);

    for (const item of itemsToUpdate) {
      batch.set(doc(firestoreDb, collPath, item.id), item.payload, { merge: true });
    }

    for (const delId of idsToDelete) {
      batch.delete(doc(firestoreDb, collPath, delId));
    }

    await batch.commit();

    for (const item of itemsToUpdate) {
      syncedCache.set(getDocKey(collPath, item.id), item.serialized);
      if (knownIds) knownIds.add(item.id);
    }

    for (const delId of idsToDelete) {
      syncedCache.delete(getDocKey(collPath, delId));
      if (knownIds) knownIds.delete(delId);
    }
  } catch (err) {
    console.warn(`[RTDB/Firestore Sync Warning] No se pudo guardar cambios en '${collPath}':`, err);
  }
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

export const syncInventoryToFirestore = async (items: InventoryItem[]) => {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) return;
  await syncCollectionDifferential(`restaurants/${scope.tenantId}/branches/${scope.branchId}/inventory`, items);
};

export const syncCashShiftsToFirestore = async (items: CashShift[]) => {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) return;
  await syncCollectionDifferential(`restaurants/${scope.tenantId}/branches/${scope.branchId}/cashShifts`, items);
};

export const syncSaleRecordToFirestore = async (sale: SaleRecord) => {
  if (!firestoreDb || !sale.tenantId || !sale.branchId || !sale.id) return;
  try {
    const docRef = doc(firestoreDb, `restaurants/${sale.tenantId}/branches/${sale.branchId}/sales`, sale.id);
    await setDoc(docRef, clean(sale), { merge: true });
  } catch (err) {
    console.warn('[RTDB/Firestore Sync Warning] No se pudo guardar la venta en Firestore:', err);
  }
};

export const syncReservationsToFirestore = async (items: Reservation[]) => {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) return;
  await syncCollectionDifferential(`restaurants/${scope.tenantId}/branches/${scope.branchId}/reservations`, items);
};

export const syncAttendanceToFirestore = async (items: AttendanceRecord[]) => {
  if (!firestoreDb || !scope.branchId || !scope.tenantId) return;
  await syncCollectionDifferential(`restaurants/${scope.tenantId}/branches/${scope.branchId}/attendance`, items);
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
