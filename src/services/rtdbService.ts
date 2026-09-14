import { ref, onValue, set, update, get } from 'firebase/database';
import { rtdb } from './firebase';
import {
  TableItem,
  MenuItem,
  KDSTicket,
  ChainBrand,
  AdminUser,
  StaffMember,
  MasterCarta
} from '../types';
import {
  INITIAL_TABLES,
  INITIAL_MENU_ITEMS,
  INITIAL_KDS_TICKETS,
  INITIAL_CHAINS,
  INITIAL_ADMINS,
  INITIAL_STAFF,
  INITIAL_MASTER_CARTAS
} from '../data/mockData';

// Paths in Realtime Database
const PATHS = {
  TABLES: 'restaurant/tables',
  CHAINS: 'restaurant/chains',
  MASTER_CARTAS: 'restaurant/masterCartas',
  BRANCH_MENUS: 'restaurant/branchMenus',
  KDS_TICKETS: 'restaurant/kdsTickets',
  STAFF: 'restaurant/staff',
  ADMINS: 'restaurant/admins'
};

export interface SyncStatus {
  connected: boolean;
  initialized: boolean;
  lastSyncedAt: Date | null;
}

// Check if database already has data, if empty, seed with initial mock data
export async function initRTDBSeedIfEmpty(): Promise<boolean> {
  try {
    const rootRef = ref(rtdb, 'restaurant');
    const snapshot = await get(rootRef);
    
    if (!snapshot.exists()) {
      // Build initial branch menus map
      const initialBranchMap: Record<string, MenuItem[]> = {};
      INITIAL_CHAINS.forEach((chain) => {
        const assignedCarta = INITIAL_MASTER_CARTAS.find((c) => c.id === chain.assignedCartaId) || INITIAL_MASTER_CARTAS[0];
        const baseDishes = assignedCarta ? [...assignedCarta.dishes] : [...INITIAL_MENU_ITEMS];
        chain.locations.forEach((loc) => {
          initialBranchMap[loc.id] = JSON.parse(JSON.stringify(baseDishes));
        });
      });

      await set(rootRef, {
        tables: INITIAL_TABLES,
        chains: INITIAL_CHAINS,
        masterCartas: INITIAL_MASTER_CARTAS,
        branchMenus: initialBranchMap,
        kdsTickets: INITIAL_KDS_TICKETS,
        staff: INITIAL_STAFF,
        admins: INITIAL_ADMINS,
        initializedAt: new Date().toISOString()
      });
      console.log('Firebase Realtime Database successfully seeded from initial state');
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error seeding Firebase RTDB:', err);
    return false;
  }
}

// Live subscriptions
export function subscribeToTables(callback: (tables: TableItem[]) => void) {
  const tablesRef = ref(rtdb, PATHS.TABLES);
  return onValue(tablesRef, (snapshot) => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      callback(Array.isArray(val) ? val : Object.values(val));
    }
  });
}

export function subscribeToChains(callback: (chains: ChainBrand[]) => void) {
  const chainsRef = ref(rtdb, PATHS.CHAINS);
  return onValue(chainsRef, (snapshot) => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      callback(Array.isArray(val) ? val : Object.values(val));
    }
  });
}

export function subscribeToMasterCartas(callback: (cartas: MasterCarta[]) => void) {
  const refPath = ref(rtdb, PATHS.MASTER_CARTAS);
  return onValue(refPath, (snapshot) => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      callback(Array.isArray(val) ? val : Object.values(val));
    }
  });
}

export function subscribeToBranchMenus(callback: (menus: Record<string, MenuItem[]>) => void) {
  const refPath = ref(rtdb, PATHS.BRANCH_MENUS);
  return onValue(refPath, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
}

export function subscribeToKDSTickets(callback: (tickets: KDSTicket[]) => void) {
  const refPath = ref(rtdb, PATHS.KDS_TICKETS);
  return onValue(refPath, (snapshot) => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      callback(Array.isArray(val) ? val : Object.values(val));
    }
  });
}

export function subscribeToStaff(callback: (staff: StaffMember[]) => void) {
  const refPath = ref(rtdb, PATHS.STAFF);
  return onValue(refPath, (snapshot) => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      callback(Array.isArray(val) ? val : Object.values(val));
    }
  });
}

export function subscribeToAdmins(callback: (admins: AdminUser[]) => void) {
  const refPath = ref(rtdb, PATHS.ADMINS);
  return onValue(refPath, (snapshot) => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      callback(Array.isArray(val) ? val : Object.values(val));
    }
  });
}

// Mutations saving directly to Realtime Database
export async function syncTablesToRTDB(tables: TableItem[]) {
  try {
    await set(ref(rtdb, PATHS.TABLES), tables);
  } catch (e) {
    console.error('Failed to sync tables to RTDB:', e);
  }
}

export async function syncKDSTicketsToRTDB(tickets: KDSTicket[]) {
  try {
    await set(ref(rtdb, PATHS.KDS_TICKETS), tickets);
  } catch (e) {
    console.error('Failed to sync tickets to RTDB:', e);
  }
}

export async function syncBranchMenusToRTDB(branchMenus: Record<string, MenuItem[]>) {
  try {
    await set(ref(rtdb, PATHS.BRANCH_MENUS), branchMenus);
  } catch (e) {
    console.error('Failed to sync branch menus to RTDB:', e);
  }
}

export async function syncMasterCartasToRTDB(cartas: MasterCarta[]) {
  try {
    await set(ref(rtdb, PATHS.MASTER_CARTAS), cartas);
  } catch (e) {
    console.error('Failed to sync master cartas to RTDB:', e);
  }
}

export async function syncChainsToRTDB(chains: ChainBrand[]) {
  try {
    await set(ref(rtdb, PATHS.CHAINS), chains);
  } catch (e) {
    console.error('Failed to sync chains to RTDB:', e);
  }
}

export async function syncStaffToRTDB(staff: StaffMember[]) {
  try {
    await set(ref(rtdb, PATHS.STAFF), staff);
  } catch (e) {
    console.error('Failed to sync staff to RTDB:', e);
  }
}

export async function syncAdminsToRTDB(admins: AdminUser[]) {
  try {
    await set(ref(rtdb, PATHS.ADMINS), admins);
  } catch (e) {
    console.error('Failed to sync admins to RTDB:', e);
  }
}

export async function resetAllDataInRTDB() {
  const initialBranchMap: Record<string, MenuItem[]> = {};
  INITIAL_CHAINS.forEach((chain) => {
    const assignedCarta = INITIAL_MASTER_CARTAS.find((c) => c.id === chain.assignedCartaId) || INITIAL_MASTER_CARTAS[0];
    const baseDishes = assignedCarta ? [...assignedCarta.dishes] : [...INITIAL_MENU_ITEMS];
    chain.locations.forEach((loc) => {
      initialBranchMap[loc.id] = JSON.parse(JSON.stringify(baseDishes));
    });
  });

  await set(ref(rtdb, 'restaurant'), {
    tables: INITIAL_TABLES,
    chains: INITIAL_CHAINS,
    masterCartas: INITIAL_MASTER_CARTAS,
    branchMenus: initialBranchMap,
    kdsTickets: INITIAL_KDS_TICKETS,
    staff: INITIAL_STAFF,
    admins: INITIAL_ADMINS,
    resetAt: new Date().toISOString()
  });
}
