import React, { useState } from 'react';
import {
  ScreenType,
  TableItem,
  MenuItem,
  KDSTicket,
  KDSTicketItem,
  ChainBrand,
  AdminUser,
  DrinkOrder,
  BranchLocation,
  AppRole,
  StaffMember,
  CartItem,
  MasterCarta,
  PaymentDetails,
  SaleRecord,
  SaleLineItem,
  InventoryItem,
  CashShift,
  Reservation,
  AttendanceRecord,
  ApprovalRequest,
  QrCustomerOrder
} from './types';
import {
  INITIAL_TABLES,
  INITIAL_MENU_ITEMS,
  INITIAL_KDS_TICKETS,
  INITIAL_CHAINS,
  INITIAL_ADMINS,
  INITIAL_STAFF,
  INITIAL_MASTER_CARTAS,
  INITIAL_INVENTORY,
  DISH_IMAGE_MAP
} from './data/mockData';
import { HeaderTop } from './components/HeaderTop';
import { BottomNav } from './components/BottomNav';
import { ModalRoleSwitcher } from './components/ModalRoleSwitcher';
import { ScreenMesas } from './components/ScreenMesas';
import { ScreenTomarPedido } from './components/ScreenTomarPedido';
import { ScreenCocinaKDS } from './components/ScreenCocinaKDS';
import { ScreenCuentaCobro } from './components/ScreenCuentaCobro';
import { ScreenCartaSede } from './components/ScreenCartaSede';
import { ScreenSaaSConsole } from './components/ScreenSaaSConsole';
import { ScreenPinLock } from './components/ScreenPinLock';
import { ScreenGlobalLogin } from './components/ScreenGlobalLogin';
import { ScreenLanding } from './components/ScreenLanding';
import { ScreenAdminDashboard } from './components/ScreenAdminDashboard';
import { ScreenCartaQR } from './components/ScreenCartaQR';
import { ModalBandejaBebidas } from './components/ModalBandejaBebidas';
import {
  isTableAssignedToWaiter,
  isTicketAssignedToWaiter,
  isDrinkKDSTicketItem,
  matchesTable,
  extractDrinksFromTickets
} from './utils/waiterUtils';
import {
  initRTDBSeedIfEmpty,
  setFirestoreScope,
  subscribeToTables,
  subscribeToChains,
  subscribeToMasterCartas,
  subscribeToBranchMenus,
  subscribeToKDSTickets,
  subscribeToStaff,
  subscribeToAdmins,
  subscribeToSales,
  subscribeToTenantSales,
  subscribeToInventory,
  subscribeToCashShifts,
  subscribeToReservations,
  subscribeToAttendance,
  subscribeToApprovals,
  subscribeToQrCustomerOrders,
  syncTablesToRTDB,
  syncKDSTicketsToRTDB,
  syncBranchMenusToRTDB,
  syncMasterCartasToRTDB,
  syncChainsToRTDB,
  syncStaffToRTDB,
  syncAdminsToRTDB,
  syncInventoryToFirestore,
  syncCashShiftsToFirestore,
  syncReservationsToFirestore,
  syncAttendanceToFirestore,
  resetAllDataInRTDB
} from './services/rtdbService';
import { loadSession, saveSession, clearSession } from './services/sessionService';
import { closeAdminSession, ensureTableReadyForPayment, fetchTableDrinks, persistTableDrinks, provisionAdminIdentity, recordCashMovement, recordCompletedSale, recordInventoryMovement } from './services/authService';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const initialSession = React.useMemo(() => loadSession(), []);
  const isDemoMode = import.meta.env.VITE_ENABLE_DEMO_DATA === 'true';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(initialSession?.isAuthenticated));
  const [hasFirebaseUser, setHasFirebaseUser] = useState<boolean>(() => Boolean(auth?.currentUser));
  const [adminProfile, setAdminProfile] = useState<AdminUser | undefined>(() => initialSession?.adminProfile);
  const [isGlobalLoginOpen, setIsGlobalLoginOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    if (initialSession?.isAuthenticated) {
      if (initialSession.currentScreen && initialSession.currentScreen !== 'pin-lock') {
        return initialSession.currentScreen;
      }
      if (initialSession.currentRole === 'admin_global') return 'saas-console';
      if (['admin_general', 'admin_sede'].includes(initialSession.currentRole)) return 'dashboard-admin';
      if (initialSession.currentRole === 'cocina') return 'cocina-kds';
      if (initialSession.currentRole === 'cajero') return 'cuenta-cobro';
      return 'mesas';
    }
    return 'pin-lock';
  });
  const [tables, setTables] = useState<TableItem[]>(INITIAL_TABLES);
  
  // Master Cartas SaaS Catalog
  const [masterCartas, setMasterCartas] = useState<MasterCarta[]>(INITIAL_MASTER_CARTAS);

  // Chains & Branches
  const [chains, setChains] = useState<ChainBrand[]>(INITIAL_CHAINS);

  // Independent Menu per Branch: Record<branchId, MenuItem[]>
  const [branchMenus, setBranchMenus] = useState<Record<string, MenuItem[]>>(() => {
    const initialBranchMap: Record<string, MenuItem[]> = {};
    INITIAL_CHAINS.forEach((chain) => {
      const assignedCarta = INITIAL_MASTER_CARTAS.find((c) => c.id === chain.assignedCartaId) || INITIAL_MASTER_CARTAS[0];
      const baseDishes = assignedCarta ? [...assignedCarta.dishes] : [...INITIAL_MENU_ITEMS];
      chain.locations.forEach((loc) => {
        initialBranchMap[loc.id] = JSON.parse(JSON.stringify(baseDishes));
      });
    });
    return initialBranchMap;
  });

  // A new order must always start empty. Preloading products here makes it
  // possible to send a chargeable order without the waiter selecting anything.
  const [cart, setCart] = useState<{ [cartKey: string]: CartItem }>({});
  const [kdsTickets, setKdsTickets] = useState<KDSTicket[]>(INITIAL_KDS_TICKETS);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [tenantSales, setTenantSales] = useState<SaleRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [cashShifts, setCashShifts] = useState<CashShift[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [qrOrders, setQrOrders] = useState<QrCustomerOrder[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF);
  const [selectedTableId, setSelectedTableId] = useState<string>(() => initialSession?.selectedTableId || 'mesa-05');
  const [isDrinksTrayOpen, setIsDrinksTrayOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<AppRole>(() => initialSession?.currentRole || 'admin_sede');
  const [activeChainId, setActiveChainId] = useState<string>(() => initialSession?.activeChainId || 'la-barra');
  const [activeBranchId, setActiveBranchId] = useState<string>(() => initialSession?.activeBranchId || 'loc-miraflores');
  const [cartaInitialTab, setCartaInitialTab] = useState<'carta' | 'sedes' | 'equipo'>(() => initialSession?.cartaInitialTab || 'carta');
  const [staffUser, setStaffUser] = useState<{ name: string; role: 'mesero' | 'admin' }>(() => initialSession?.staffUser || {
    name: '',
    role: 'mesero'
  });
  
  // Toggle device simulation frame (Mobile mockup vs Full fluid)
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  const [isCloudConnected, setIsCloudConnected] = useState(true);
  
  // Helper to extract restaurant slug from path, hash, or query param
  const getSlugFromUrl = (): string | null => {
    // 1. Check query param: ?r=la-barra
    const searchParams = new URLSearchParams(window.location.search);
    const querySlug = searchParams.get('r') || searchParams.get('restaurant');
    if (querySlug) return querySlug.toLowerCase().trim();

    // 2. Check hash route: #/la-barra or #la-barra
    if (window.location.hash) {
      const cleanHash = window.location.hash.replace(/^#[/]?/, '').trim();
      if (cleanHash && cleanHash !== '/') {
        return cleanHash.split('/')[0].toLowerCase();
      }
    }

    // 3. Check pathname: /la-barra or /dominio/la-barra
    const cleanPath = window.location.pathname.replace(/^\/+/, '').trim();
    if (cleanPath && cleanPath !== 'index.html') {
      const parts = cleanPath.split('/').filter(Boolean);
      if (parts.length > 0) {
        return parts[0].toLowerCase();
      }
    }

    return null;
  };

  const [tenantSlug, setTenantSlug] = useState<string | null>(() => getSlugFromUrl());
  const qrBranchId = new URLSearchParams(window.location.search).get('qr');

  // Listen for browser navigation (back/forward)
  React.useEffect(() => {
    const handleLocationChange = () => {
      setTenantSlug(getSlugFromUrl());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Cargar datos del restaurante público para la terminal operativa antes de iniciar sesión
  React.useEffect(() => {
    if (!tenantSlug) return;
    let isMounted = true;

    const loadPublicTenant = async () => {
      try {
        const res = await fetch(`/api/public/tenant/${encodeURIComponent(tenantSlug)}`);
        if (!res.ok) return;
        const tenantData = await res.json();
        if (!isMounted || !tenantData?.id) return;

        setActiveChainId(tenantData.id);
        if (Array.isArray(tenantData.locations) && tenantData.locations.length > 0) {
          setActiveBranchId((prev) => {
            if (tenantData.locations.some((l: any) => l.id === prev)) return prev;
            return tenantData.locations[0].id;
          });
        }

        // Actualizar o agregar el restaurante en chains para que ScreenPinLock y el resto de vistas
        // muestren inmediatamente el nombre real ("Cevichería La Barra de Naomi")
        setChains((prev) => {
          const existingIdx = prev.findIndex((c) => c.id === tenantData.id || c.slug === tenantData.slug);
          if (existingIdx >= 0) {
            const updated = [...prev];
            updated[existingIdx] = {
              ...updated[existingIdx],
              id: tenantData.id,
              name: tenantData.name || updated[existingIdx].name,
              slug: tenantData.slug || updated[existingIdx].slug,
              legalName: tenantData.legalName || updated[existingIdx].legalName,
              logoUrl: tenantData.logoUrl || updated[existingIdx].logoUrl,
              status: tenantData.status || updated[existingIdx].status,
              locations: tenantData.locations?.length ? tenantData.locations : updated[existingIdx].locations,
              locationsCount: tenantData.locations?.length || updated[existingIdx].locationsCount
            };
            return updated;
          } else {
            return [
              {
                id: tenantData.id,
                slug: tenantData.slug,
                name: tenantData.name,
                legalName: tenantData.legalName || `${tenantData.name} S.A.C.`,
                ruc: tenantData.ruc || '',
                plan: tenantData.plan || 'Básico',
                status: tenantData.status || 'Activa',
                logoUrl: tenantData.logoUrl,
                assignedCartaId: tenantData.assignedCartaId || '',
                adminName: '',
                adminEmail: '',
                adminPhone: '',
                locationsCount: tenantData.locations?.length || 0,
                locations: tenantData.locations || []
              },
              ...prev
            ];
          }
        });
      } catch (err) {
        console.error('No se pudo cargar la información pública del restaurante:', err);
      }
    };

    loadPublicTenant();
    return () => {
      isMounted = false;
    };
  }, [tenantSlug]);

  // Update activeChainId whenever tenantSlug changes or chains load
  React.useEffect(() => {
    if (tenantSlug && chains.length > 0) {
      const foundChain = chains.find(
        (c) => (c.slug && c.slug.toLowerCase() === tenantSlug.toLowerCase()) ||
               c.id.toLowerCase() === tenantSlug.toLowerCase() ||
               c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === tenantSlug.toLowerCase()
      );
      if (foundChain) {
        setActiveChainId(foundChain.id);
        if (foundChain.locations && foundChain.locations.length > 0) {
          setActiveBranchId((prev) => {
            if (foundChain.locations.some((l) => l.id === prev)) {
              return prev;
            }
            return foundChain.locations[0].id;
          });
        }
      }
    }
  }, [tenantSlug, chains]);

  // Persistir la sesión activa en localStorage
  React.useEffect(() => {
    saveSession({
      isAuthenticated,
      currentRole,
      staffUser,
      currentScreen,
      activeChainId,
      activeBranchId,
      selectedTableId,
      cartaInitialTab,
      adminProfile
    });
  }, [
    isAuthenticated,
    currentRole,
    staffUser,
    currentScreen,
    activeChainId,
    activeBranchId,
    selectedTableId,
    cartaInitialTab,
    adminProfile
  ]);

  // Escuchar cambios de autenticación de Firebase
  React.useEffect(() => {
    if (!auth) {
      setHasFirebaseUser(false);
      setIsAuthenticated(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setHasFirebaseUser(Boolean(firebaseUser));
      if (firebaseUser) {
        setIsAuthenticated(true);
        setCurrentScreen((prev) => {
          if (prev === 'pin-lock') {
            return currentRole === 'admin_global' ? 'saas-console' : 'dashboard-admin';
          }
          return prev;
        });
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, [currentRole]);

  // Actualizar el alcance de Firestore cuando cambia el tenant o la sede activa
  React.useEffect(() => {
    setFirestoreScope(activeChainId, activeBranchId);
  }, [activeChainId, activeBranchId]);

  // Reconcile drink states with the server after authentication. This protects
  // the operational view when Firestore initially returns an offline cache.
  const canUseCloudData = isAuthenticated && hasFirebaseUser;

  React.useEffect(() => {
    if (!canUseCloudData || !activeChainId || !activeBranchId) return;
    let cancelled = false;
    const refreshDrinks = async () => {
      try {
        const remoteTables = await fetchTableDrinks(activeChainId, activeBranchId);
        if (cancelled) return;
        const drinksByTable = new Map(remoteTables.map((table) => [table.id, table.drinks]));
        setTables((previous) => previous.map((table) => ({
          ...table,
          drinks: drinksByTable.get(table.id) || table.drinks
        })));
      } catch {
        // The normal Firestore subscription remains available as fallback.
      }
    };
    void refreshDrinks();
    const retry = window.setTimeout(() => void refreshDrinks(), 1000);
    return () => { cancelled = true; window.clearTimeout(retry); };
  }, [activeBranchId, activeChainId, canUseCloudData]);

  React.useEffect(() => {
    if (!canUseCloudData) { setTenantSales([]); return; }
    if (!['admin_general', 'admin_global'].includes(currentRole)) { setTenantSales([]); return; }
    setFirestoreScope(activeChainId, activeBranchId);
    return subscribeToTenantSales(setTenantSales);
  }, [activeChainId, activeBranchId, canUseCloudData, currentRole]);

  // Banderas para asegurar que los datos recibidos desde la nube no se reenvíen a la base de datos
  const isRemoteTables = React.useRef(false);
  const isRemoteMenus = React.useRef(false);
  const isRemoteTickets = React.useRef(false);
  const isRemoteChains = React.useRef(false);
  const isRemoteCartas = React.useRef(false);
  const isRemoteStaff = React.useRef(false);
  const isRemoteAdmins = React.useRef(false);
  // Firestore can serve a stale offline snapshot immediately after a reload.
  // Keep drink delivery confirmations from the current terminal session so the
  // UI honours the server-confirmed state while that snapshot is refreshed.
  const servedDrinkStatesRef = React.useRef<Record<string, Record<string, { served: boolean; servedAt?: string }>>>(
    (() => {
      try {
        return window.sessionStorage ? JSON.parse(window.sessionStorage.getItem('ordena:served-drinks') || '{}') : {};
      } catch {
        return {};
      }
    })()
  );

  const rememberDrinkStates = (tableId: string, drinks: DrinkOrder[]) => {
    servedDrinkStatesRef.current[tableId] = Object.fromEntries(
      drinks.map((drink) => [drink.id, { served: Boolean(drink.served), servedAt: drink.servedAt }])
    );
    try {
      window.sessionStorage.setItem('ordena:served-drinks', JSON.stringify(servedDrinkStatesRef.current));
    } catch {
      // Storage is an enhancement; the server remains the source of truth.
    }
  };

  // 1. Suscripción a datos de la sede activa (Mesas, KDS, Carta de la sede)
  // Solo se suscribe si existe una sede y tenant activos para evitar lecturas innecesarias
  React.useEffect(() => {
    if (!canUseCloudData || !activeChainId || !activeBranchId) return;
    setFirestoreScope(activeChainId, activeBranchId);

    const unsubTables = subscribeToTables((cloudTables) => {
      if (cloudTables && cloudTables.length > 0) {
        isRemoteTables.current = true;
        setTables((prevTables) => {
          if (!prevTables || prevTables.length === 0) {
            return cloudTables.map((table) => ({
              ...table,
              drinks: (table.drinks || []).map((drink) => ({
                ...drink,
                ...(servedDrinkStatesRef.current[table.id]?.[drink.id] || {})
              }))
            }));
          }
          return cloudTables.map((cTable) => {
            const persistedDrinkStates = servedDrinkStatesRef.current[cTable.id] || {};
            const persistedCloudTable = {
              ...cTable,
              drinks: (cTable.drinks || []).map((drink) => ({
                ...drink,
                ...(persistedDrinkStates[drink.id] || {})
              }))
            };
            const lTable = prevTables.find((lt) => lt.id === cTable.id);
            if (!lTable) return persistedCloudTable;

            // Merge drinks: once marked served locally, keep it served unless explicitly cleared
            const mergedDrinks = (persistedCloudTable.drinks || []).map((cDrink) => {
              const lDrink = lTable.drinks?.find(
                (ld) => ld.id === cDrink.id || ld.name.toLowerCase().trim() === cDrink.name.toLowerCase().trim()
              );
              if (!lDrink) return cDrink;
              const isServed = Boolean(cDrink.served || lDrink.served);
              return {
                ...cDrink,
                served: isServed,
                servedAt: isServed ? (cDrink.servedAt || lDrink.servedAt) : undefined
              };
            });

            // Keep any local drinks that haven't synced to Firestore yet
            const cDrinkNames = new Set(mergedDrinks.map((d) => d.name.toLowerCase().trim()));
            const localOnlyDrinks = (lTable.drinks || []).filter(
              (ld) => !cDrinkNames.has(ld.name.toLowerCase().trim())
            );

            // Merge dishes: keep served status if served locally
            const mergedDishes = (cTable.dishes || []).map((cD) => {
              const lD = lTable.dishes?.find((ld) => ld.id === cD.id || ld.name === cD.name);
              if (!lD) return cD;
              const isServed = cD.status === 'served' || lD.status === 'served';
              const isReady = cD.status === 'ready' || lD.status === 'ready';
              return {
                ...cD,
                status: isServed ? ('served' as const) : isReady ? ('ready' as const) : cD.status
              };
            });

            const effectiveStatus =
              lTable.status === 'eating' && (cTable.status === 'ready' || cTable.status === 'cooking')
                ? 'eating'
                : lTable.status === 'free' && cTable.status !== 'free'
                ? 'free'
                : cTable.status;

            return {
              ...persistedCloudTable,
              status: effectiveStatus,
              drinks: [...mergedDrinks, ...localOnlyDrinks],
              dishes: mergedDishes.length > 0 ? mergedDishes : cTable.dishes
            };
          });
        });
        setIsCloudConnected(true);
      }
    });

    const unsubMenus = subscribeToBranchMenus((cloudMenus) => {
      if (cloudMenus && Object.keys(cloudMenus).length > 0) {
        isRemoteMenus.current = true;
        const normalized: Record<string, MenuItem[]> = {};
        Object.entries(cloudMenus).forEach(([branchId, list]) => {
          normalized[branchId] = list.map((dish) => {
            const isOutdated = !dish.image ||
              dish.image.includes('photo-1567620832903') ||
              dish.image.includes('photo-1565299585323') ||
              dish.image.includes('photo-1544025162-d76694265947') ||
              dish.image.includes('photo-1555396273-367ea4eb4db5');
            const img = (DISH_IMAGE_MAP[dish.id] && isOutdated) ? DISH_IMAGE_MAP[dish.id] : dish.image;
            const spiceLevel = dish.allowSpiceLevel !== undefined
              ? dish.allowSpiceLevel
              : ['ceviches', 'leches', 'calientes'].includes(dish.category) || [301, 302, 303, 701, 702].includes(dish.id);
            return {
              ...dish,
              image: img,
              allowSpiceLevel: spiceLevel
            };
          });
        });
        setBranchMenus(normalized);
        setIsCloudConnected(true);
      }
    });

    const unsubTickets = subscribeToKDSTickets((cloudTickets) => {
      if (cloudTickets) {
        isRemoteTickets.current = true;
        setKdsTickets((prevTickets) => {
          if (!prevTickets || prevTickets.length === 0) return cloudTickets;
          return cloudTickets.map((cTicket) => {
            const localTicket = prevTickets.find((lt) => lt.id === cTicket.id);
            if (!localTicket) return cTicket;

            const mergedItems = cTicket.items.map((cItem, idx) => {
              const lItem =
                localTicket.items[idx] ||
                localTicket.items.find((li) => li.id === cItem.id || li.name === cItem.name);
              if (!lItem) return cItem;
              const isReady = Boolean(cItem.isReady || lItem.isReady);
              const isServed = Boolean(cItem.isServed || lItem.isServed);
              return {
                ...cItem,
                isReady,
                isServed,
                status: isServed
                  ? ('served' as const)
                  : isReady
                  ? ('ready' as const)
                  : cItem.status,
                readyAt: cItem.readyAt || lItem.readyAt,
                servedAt: cItem.servedAt || lItem.servedAt
              };
            });

            const allReady = mergedItems.every((i) => i.isReady);
            const allServed = mergedItems.every((i) => i.isServed);

            return {
              ...cTicket,
              items: mergedItems,
              status: allServed
                ? ('served' as const)
                : allReady
                ? ('ready' as const)
                : localTicket.status === 'ready'
                ? ('ready' as const)
                : cTicket.status
            };
          });
        });
        setIsCloudConnected(true);
      }
    });

    const isTenantAdmin = ['admin_general', 'admin_sede', 'admin_global'].includes(currentRole);
    const unsubSales = isTenantAdmin ? subscribeToSales((cloudSales) => {
      setSales(cloudSales);
      setIsCloudConnected(true);
    }) : () => {};

    const unsubInventory = subscribeToInventory((cloudInventory) => {
      if (cloudInventory.length > 0) setInventory(cloudInventory);
      setIsCloudConnected(true);
    });

    const unsubCashShifts = subscribeToCashShifts((cloudShifts) => {
      setCashShifts(cloudShifts);
      setIsCloudConnected(true);
    });
    const unsubReservations = subscribeToReservations((cloudReservations) => {
      setReservations(cloudReservations);
      setIsCloudConnected(true);
    });
    const unsubAttendance = subscribeToAttendance((cloudAttendance) => {
      setAttendance(cloudAttendance);
      setIsCloudConnected(true);
    });
    const unsubApprovals = subscribeToApprovals((cloudApprovals) => { setApprovals(cloudApprovals); });
    const unsubQrOrders = subscribeToQrCustomerOrders(setQrOrders);

    return () => {
      unsubTables();
      unsubMenus();
      unsubTickets();
      unsubSales();
      unsubInventory();
      unsubCashShifts();
      unsubReservations();
      unsubAttendance();
      unsubApprovals();
      unsubQrOrders();
    };
  }, [activeChainId, activeBranchId, canUseCloudData, currentRole]);

  // 2. Suscripción a datos organizacionales (Restaurantes, Cartas Maestras, Personal, Admins)
  // No se suscribe si el usuario solo está visitando la landing pública sin tenant
  React.useEffect(() => {
    if (!canUseCloudData) return;

    setFirestoreScope(activeChainId, activeBranchId);

    const unsubChains = subscribeToChains((cloudChains) => {
      if (cloudChains && cloudChains.length > 0) {
        isRemoteChains.current = true;
        setChains(cloudChains);
        setIsCloudConnected(true);
      }
    });

    const unsubCartas = subscribeToMasterCartas((cloudCartas) => {
      if (cloudCartas && cloudCartas.length > 0) {
        isRemoteCartas.current = true;
        setMasterCartas(cloudCartas);
        setIsCloudConnected(true);
      }
    });

    const unsubStaff = subscribeToStaff((cloudStaff) => {
      if (cloudStaff && cloudStaff.length > 0) {
        isRemoteStaff.current = true;
        setStaffMembers(cloudStaff);
        setIsCloudConnected(true);
      }
    });

    const unsubAdmins = subscribeToAdmins((cloudAdmins) => {
      if (cloudAdmins && cloudAdmins.length > 0) {
        isRemoteAdmins.current = true;
        setAdmins(cloudAdmins);
        setIsCloudConnected(true);
      }
    });

    return () => {
      unsubChains();
      unsubCartas();
      unsubStaff();
      unsubAdmins();
    };
  }, [activeChainId, canUseCloudData]);

  // Sincronización diferencial con debounce y protección contra bucles
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (!canUseCloudData) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isRemoteTables.current) {
      isRemoteTables.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      syncTablesToRTDB(tables);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [canUseCloudData, tables]);

  React.useEffect(() => {
    if (!canUseCloudData) return;
    if (isInitialMount.current) return;
    if (isRemoteTickets.current) {
      isRemoteTickets.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      syncKDSTicketsToRTDB(kdsTickets);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [canUseCloudData, kdsTickets]);

  React.useEffect(() => {
    if (!canUseCloudData) return;
    if (isInitialMount.current) return;
    if (isRemoteMenus.current) {
      isRemoteMenus.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      syncBranchMenusToRTDB(branchMenus);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [branchMenus, canUseCloudData]);

  React.useEffect(() => {
    if (!canUseCloudData) return;
    if (isInitialMount.current) return;
    if (isRemoteCartas.current) {
      isRemoteCartas.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      syncMasterCartasToRTDB(masterCartas);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [canUseCloudData, masterCartas]);

  React.useEffect(() => {
    if (!canUseCloudData) return;
    if (isInitialMount.current) return;
    if (isRemoteChains.current) {
      isRemoteChains.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      syncChainsToRTDB(chains);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [canUseCloudData, chains]);

  React.useEffect(() => {
    if (!canUseCloudData) return;
    if (isInitialMount.current) return;
    if (isRemoteStaff.current) {
      isRemoteStaff.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      syncStaffToRTDB(staffMembers);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [canUseCloudData, staffMembers]);

  React.useEffect(() => {
    if (!canUseCloudData) return;
    if (isInitialMount.current) return;
    if (isRemoteAdmins.current) {
      isRemoteAdmins.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      syncAdminsToRTDB(admins);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [admins, canUseCloudData]);

  // Role switching handler with synchronized user profile and destination screen
  const handleSwitchRole = (role: AppRole) => {
    setCurrentRole(role);
    if (role === 'cocina') {
      const chef = staffMembers.find((s) => s.roleKey === 'cocina');
      setStaffUser({ name: chef?.name || 'Chef Mario Quispe', role: 'admin' });
      setCurrentScreen('cocina-kds');
    } else if (role === 'mesero') {
      const waiter = staffMembers.find((s) => s.roleKey === 'mesero');
      setStaffUser({ name: waiter?.name || 'Carlos Mendoza', role: 'mesero' });
      setCurrentScreen('mesas');
    } else if (role === 'cajero') {
      const cashier = staffMembers.find((s) => s.roleKey === 'cajero');
      setStaffUser({ name: cashier?.name || 'Cajero de Turno', role: 'mesero' });
      setCurrentScreen('cuenta-cobro');
    } else if (role === 'admin_sede') {
      const sedeAdmin = admins.find((a) => a.roleKey === 'admin_sede');
      setStaffUser({
        name: adminProfile?.roleKey === 'admin_sede' ? adminProfile.name : (sedeAdmin?.name || adminProfile?.name || 'Roberto Morales'),
        role: 'admin'
      });
      setCurrentScreen('dashboard-admin');
    } else if (role === 'admin_general') {
      const genAdmin = admins.find((a) => a.roleKey === 'admin_general');
      setStaffUser({
        name: adminProfile?.roleKey === 'admin_general' ? adminProfile.name : (genAdmin?.name || adminProfile?.name || 'Mariana Alva'),
        role: 'admin'
      });
      setCurrentScreen('dashboard-admin');
    } else if (role === 'admin_global') {
      const globalAdmin = admins.find((a) => a.roleKey === 'admin_global');
      setStaffUser({
        name: adminProfile?.roleKey === 'admin_global' ? adminProfile.name : (globalAdmin?.name || adminProfile?.name || 'José Manuel Vasquez Rivero'),
        role: 'admin'
      });
      setCurrentScreen('saas-console');
    }
  };

  // Navegar a un tenant específico (actualiza la URL y el slug)
  const navigateToTenant = (slug: string) => {
    clearSession();
    window.history.pushState({}, '', `/${slug}`);
    setTenantSlug(slug);
    setIsAuthenticated(false);
    setAdminProfile(undefined);
    setCurrentScreen('pin-lock');
    setStaffUser({ name: '', role: 'mesero' });
  };

  // Navegar de regreso al portal global
  const navigateToGlobal = () => {
    clearSession();
    window.history.pushState({}, '', '/');
    setTenantSlug(null);
    setIsAuthenticated(false);
    setAdminProfile(undefined);
    setCurrentScreen('pin-lock');
    setStaffUser({ name: '', role: 'mesero' });
  };

  // Cerrar sesión y bloquear terminal (Solo se puede reingresar con PIN de 6 dígitos o credenciales de Admin Global)
  const handleLogout = () => {
    clearSession();
    closeAdminSession().catch(() => {});
    setIsAuthenticated(false);
    setAdminProfile(undefined);
    setCurrentScreen('pin-lock');
    setStaffUser({ name: '', role: 'mesero' });
  };

  // Guard navigation: requiring 6-digit PIN authentication
  const handleNavigate = (screen: ScreenType) => {
    if (screen === 'pin-lock') {
      handleLogout();
      return;
    }
    const allowedScreens: Record<AppRole, ScreenType[]> = {
      admin_global: ['saas-console', 'dashboard-admin', 'carta-sede', 'mesas', 'tomar-pedido', 'cocina-kds', 'cuenta-cobro'],
      admin_general: ['dashboard-admin', 'carta-sede', 'mesas', 'tomar-pedido', 'cocina-kds', 'cuenta-cobro'],
      admin_sede: ['dashboard-admin', 'carta-sede', 'mesas', 'tomar-pedido', 'cocina-kds', 'cuenta-cobro'],
      mesero: ['mesas', 'tomar-pedido', 'cuenta-cobro', 'cocina-kds'],
      cocina: ['cocina-kds'],
      cajero: ['cuenta-cobro', 'mesas']
    };
    if (!allowedScreens[currentRole].includes(screen)) {
      return;
    }
    setCurrentScreen(screen);
  };

  // Table actions
  const handleSelectTable = (tableId: string) => {
    setSelectedTableId(tableId);
  };

  const handleConfirmQrOrder = async (order: QrCustomerOrder) => {
    const token = auth?.currentUser ? await auth.currentUser.getIdToken() : '';
    if (!token) throw new Error('Tu sesión venció. Vuelve a ingresar con tu PIN.');
    const response = await fetch(`/api/staff/qr-orders/${encodeURIComponent(order.id)}/confirm`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'No se pudo confirmar el pedido.');
  };

  const handleRequestBill = (tableId: string) => {
    let updatedTablesList: TableItem[] = [];
    setTables((prev) => {
      updatedTablesList = prev.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          status: 'bill_requested',
          statusLabel: 'Cuenta Pedida'
        };
      });
      return updatedTablesList;
    });
    setSelectedTableId(tableId);
    if (updatedTablesList.length > 0) {
      syncTablesToRTDB(updatedTablesList);
    }
  };

  const handleOpenTable = (tableId: string) => {
    const currentWaiter = staffUser.name || 'Carlos Mendoza';
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const isUnassigned = !t.waiter || t.waiter.trim() === '' || t.waiter === 'Sin asignar';
        return {
          ...t,
          status: 'cooking',
          waiter: isUnassigned ? currentWaiter : t.waiter
        };
      })
    );
    setSelectedTableId(tableId);
    setCurrentScreen('tomar-pedido');
  };

  const handleMarkDelivered = (tableId: string) => {
    const currentTbl = tables.find((t) => t.id === tableId);
    const targetTableNum = currentTbl ? currentTbl.number : '';

    let updatedTablesList: TableItem[] = [];
    setTables((prev) => {
      updatedTablesList = prev.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          status: 'eating',
          notes: 'Platos servidos en mesa. Comensales atendidos.',
          dishes: t.dishes?.map((d) => ({ ...d, status: 'served' as const }))
        };
      });
      return updatedTablesList;
    });

    let updatedTicketsList: KDSTicket[] = [];
    // Also mark KDS tickets for this table as served so they complete cleanly
    setKdsTickets((prev) => {
      updatedTicketsList = prev.map((tk) => {
        if (!matchesTable(tk.table, targetTableNum, tableId)) return tk;
        const updatedItems = tk.items.map((item) => ({
          ...item,
          isReady: true,
          isServed: true,
          status: 'served' as const
        }));
        return {
          ...tk,
          status: 'served' as const,
          items: updatedItems
        };
      });
      return updatedTicketsList;
    });

    // Immediate Firestore persistence
    if (updatedTablesList.length > 0) {
      syncTablesToRTDB(updatedTablesList);
    }
    if (updatedTicketsList.length > 0) {
      syncKDSTicketsToRTDB(updatedTicketsList);
    }
  };

  const handleTablePaidAndFreed = async (tableId: string, payment: PaymentDetails) => {
    const currentTbl = tables.find((t) => t.id === tableId);
    const targetTableNum = currentTbl ? currentTbl.number : '';
    const baseTotal = currentTbl?.total || 0;
    const tipAmount = Number(payment.tipAmount || 0);
    const grandTotal = baseTotal + tipAmount;
    const businessDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());

    // Construcción de los items detallados de la venta
    const lineItems: SaleLineItem[] = [
      ...(currentTbl?.dishes || []).map((d) => ({
        name: d.name,
        qty: d.qty || 1,
        unitPrice: d.price || 0,
        total: (d.price || 0) * (d.qty || 1),
        category: d.category,
        kind: 'dish' as const
      })),
      ...(currentTbl?.drinks || []).map((dr) => ({
        name: dr.name,
        qty: dr.qty || 1,
        unitPrice: dr.price || 0,
        total: (dr.price || 0) * (dr.qty || 1),
        category: dr.category,
        kind: 'drink' as const
      }))
    ];

    const saleId = `sale-${activeBranchId}-${Date.now()}`;
    const saleRecord: SaleRecord = {
      id: saleId,
      tenantId: activeChainId,
      branchId: activeBranchId,
      tableId,
      tableNumber: targetTableNum || tableId,
      baseAmount: baseTotal,
      tipAmount,
      amount: grandTotal,
      paymentMethod: payment.method,
      documentType: payment.documentType || 'boleta',
      customerDoc: payment.customerDoc,
      customerName: payment.customerName,
      cashReceived: payment.cashReceived,
      changeAmount: payment.cashReceived ? Math.max(0, payment.cashReceived - grandTotal) : 0,
      lineItems,
      businessDate,
      cashierName: staffUser?.name || 'Cajero',
      waiterName: currentTbl?.waiter || staffUser?.name || 'Mozo',
      createdAt: Date.now(),
      createdBy: staffUser?.name || 'system',
      status: 'completed'
    };

    // El servidor ejecuta venta, inventario y liberación de mesa en una única
    // transacción. Si falla, se propaga el error y no se altera el estado local.
    if (!isDemoMode) {
      await ensureTableReadyForPayment(activeChainId, activeBranchId, tableId);
      saleRecord.id = await recordCompletedSale(activeChainId, activeBranchId, tableId, payment);
    }

    // En modo demo no existe backend transaccional; en producción esta vista
    // optimista usa el mismo ID confirmado por el servidor.
    setSales((prev) => [saleRecord, ...prev]);
    setTenantSales((prev) => [saleRecord, ...prev]);

    // Reflejar localmente la liberación ya confirmada por el servidor.
    let updatedTablesList: TableItem[] = [];
    setTables((prev) => {
      updatedTablesList = prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status: 'free',
              statusLabel: 'Libre',
              waiter: '', // Asignación de mesa queda en blanco al liberarse
              notes: 'Mesa desinfectada y libre',
              total: 0,
              timeInSalon: undefined,
              dishes: [],
              drinks: []
            }
          : t
      );
      return updatedTablesList;
    });

    if (updatedTablesList.length > 0) {
      syncTablesToRTDB(updatedTablesList);
    }

    // Completar y cerrar cualquier ticket KDS pendiente de esta mesa.
    let updatedTicketsList: KDSTicket[] = [];
    setKdsTickets((prev) => {
      updatedTicketsList = prev.map((tk) => {
        if (!matchesTable(tk.table, targetTableNum, tableId)) return tk;
        const updatedItems = tk.items.map((item) => ({
          ...item,
          isReady: true,
          isServed: true,
          status: 'served' as const
        }));
        return {
          ...tk,
          status: 'served' as const,
          items: updatedItems
        };
      });
      return updatedTicketsList;
    });

    if (updatedTicketsList.length > 0) {
      syncKDSTicketsToRTDB(updatedTicketsList);
    }
  };

  const handleAdjustInventory = async (itemId: string, adjustment: number) => {
    if (!Number.isFinite(adjustment) || adjustment === 0) return;
    if (!isDemoMode) await recordInventoryMovement(activeChainId, activeBranchId, itemId, 'adjustment', adjustment, 'Ajuste desde panel administrativo');
    setInventory((previous) => {
      const updated = previous.map((item) => item.id === itemId
        ? { ...item, currentStock: Math.max(0, Number((item.currentStock + adjustment).toFixed(2))), updatedAt: Date.now() }
        : item);
      if (isDemoMode) syncInventoryToFirestore(updated).catch((error) => console.error('No se pudo actualizar el inventario:', error));
      return updated;
    });
  };

  const handleOpenCashShift = (openingAmount: number) => {
    const businessDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());
    if (!Number.isFinite(openingAmount) || openingAmount < 0 || cashShifts.some((shift) => shift.status === 'open' && shift.businessDate === businessDate)) return;
    const shift: CashShift = {
      id: `shift-${activeBranchId}-${Date.now()}`, branchId: activeBranchId, businessDate, status: 'open',
      openingAmount, openedAt: Date.now(), openedBy: staffUser.name || 'Administrador'
    };
    const updated = [shift, ...cashShifts];
    setCashShifts(updated);
    syncCashShiftsToFirestore(updated).catch((error) => console.error('No se pudo abrir el turno:', error));
  };

  const handleCloseCashShift = (shiftId: string, countedAmount: number) => {
    if (!Number.isFinite(countedAmount) || countedAmount < 0) return;
    const targetShift = cashShifts.find((shift) => shift.id === shiftId);
    if (!targetShift) return;
    const collectedCash = sales
      .filter((sale) => sale.status === 'completed' && sale.paymentMethod === 'cash' && sale.businessDate === targetShift.businessDate)
      .reduce((sum, sale) => sum + sale.amount, 0);
    const updated = cashShifts.map((shift) => shift.id === shiftId ? {
      ...shift, status: 'closed' as const, countedAmount, expectedAmount: shift.openingAmount + collectedCash,
      difference: countedAmount - (shift.openingAmount + collectedCash), closedAt: Date.now(), closedBy: staffUser.name || 'Administrador'
    } : shift);
    setCashShifts(updated);
    syncCashShiftsToFirestore(updated).catch((error) => console.error('No se pudo cerrar el turno:', error));
  };

  const handleCashMovement = async (type: 'income' | 'expense', amount: number, concept: string) => {
    if (!Number.isFinite(amount) || amount <= 0 || !concept.trim()) return;
    const shiftId = cashShifts.find((shift) => shift.status === 'open')?.id;
    if (!isDemoMode) await recordCashMovement(activeChainId, activeBranchId, shiftId, type, amount, concept);
  };

  const handleCreateReservation = (reservation: Omit<Reservation, 'id' | 'branchId' | 'createdAt' | 'status'>) => {
    const created: Reservation = { ...reservation, id: `res-${Date.now()}`, branchId: activeBranchId, status: 'pending', createdAt: Date.now() };
    const updated = [...reservations, created];
    setReservations(updated);
    syncReservationsToFirestore(updated).catch((error) => console.error('No se pudo guardar la reserva:', error));
  };

  const handleUpdateReservationStatus = (reservationId: string, status: Reservation['status']) => {
    const updated = reservations.map((reservation) => reservation.id === reservationId ? { ...reservation, status } : reservation);
    setReservations(updated);
    syncReservationsToFirestore(updated).catch((error) => console.error('No se pudo actualizar la reserva:', error));
  };

  const handleToggleAttendance = (staff: StaffMember) => {
    const businessDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());
    const openRecord = attendance.find((record) => record.staffId === staff.id && record.businessDate === businessDate && record.status === 'present');
    const updated = openRecord
      ? attendance.map((record) => record.id === openRecord.id ? { ...record, status: 'completed' as const, checkOutAt: Date.now() } : record)
      : [{ id: `att-${staff.id}-${Date.now()}`, branchId: activeBranchId, staffId: staff.id, staffName: staff.name, businessDate, checkInAt: Date.now(), status: 'present' as const }, ...attendance];
    setAttendance(updated);
    syncAttendanceToFirestore(updated).catch((error) => console.error('No se pudo registrar la asistencia:', error));
  };

  // Reassign waiter for a table (Admin authority)
  const handleUpdateTableWaiter = (tableId: string, newWaiterName: string) => {
    const targetTable = tables.find((t) => t.id === tableId);
    let updatedTablesList: TableItem[] = [];
    setTables((prev) => {
      updatedTablesList = prev.map((t) => (t.id === tableId ? { ...t, waiter: newWaiterName } : t));
      return updatedTablesList;
    });
    if (updatedTablesList.length > 0) {
      syncTablesToRTDB(updatedTablesList);
    }
    if (targetTable) {
      const tableLabel = `Mesa ${targetTable.number}`;
      setKdsTickets((prev) =>
        prev.map((tk) =>
          tk.table === tableLabel || tk.table === targetTable.number || tk.table === targetTable.id
            ? { ...tk, waiter: newWaiterName }
            : tk
        )
      );
    }
  };

  // Cart actions: supports size selection, minimum default price, and individual quantity tracking
  const handleUpdateQty = (
    dishId: number,
    delta: number,
    sizeName?: string,
    price?: number,
    customization?: CartItem['customization'],
    notes?: string
  ) => {
    const dish = currentBranchDishes.find((d) => d.id === dishId);
    if (!dish) return;

    // Default to the first size (minimum price) if no size is explicitly provided
    const chosenSize = sizeName || (dish.sizes && dish.sizes.length > 0 ? dish.sizes[0].name : undefined);
    const chosenPrice =
      price !== undefined
        ? price
        : dish.sizes && dish.sizes.length > 0
        ? (chosenSize ? dish.sizes.find((s) => s.name === chosenSize)?.price || dish.sizes[0].price : dish.sizes[0].price)
        : dish.price;

    const cartKey = `${dish.id}__${chosenSize || 'default'}`;

    setCart((prev) => {
      const existing = prev[cartKey];
      const newQty = Math.max(0, (existing ? existing.qty : 0) + delta);
      if (newQty === 0) {
        const copy = { ...prev };
        delete copy[cartKey];
        return copy;
      }
      return {
        ...prev,
        [cartKey]: {
          id: cartKey,
          dishId: dish.id,
          dishName: dish.name,
          category: dish.category,
          isDrink: dish.isDrink || dish.category === 'bebidas',
          selectedSize: chosenSize,
          price: chosenPrice,
          qty: newQty,
          customization: customization !== undefined ? customization : existing?.customization,
          notes: notes !== undefined ? notes : existing?.notes
        }
      };
    });
  };

  // Waiter-managed drink toggle
  const handleToggleDrinkServed = (tableId: string, drinkId: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentTbl = tables.find((t) => t.id === tableId);
    const targetTableNum = currentTbl ? currentTbl.number : '';

    let affectedDrinkName = '';
    let isNowServed = false;
    const updatedTablesList = tables.map((t) => {
        if (t.id !== tableId) return t;
        const existingDrinks = t.drinks || [];
        const found = existingDrinks.find((d) => d.id === drinkId);

        if (found) {
          affectedDrinkName = found.name;
          isNowServed = !found.served;
          const updatedDrinks = existingDrinks.map((d) =>
            d.id === drinkId
              ? {
                  ...d,
                  served: !d.served,
                  servedAt: !d.served ? timeNow : undefined
                }
              : d
          );
          return {
            ...t,
            drinks: updatedDrinks
          };
        } else {
          // If the drink came from a KDS ticket item
          const ticketDrinks = extractDrinksFromTickets(kdsTickets, t.number, t.id);
          const fromTicket = ticketDrinks.find((d) => d.id === drinkId);
          if (fromTicket) {
            affectedDrinkName = fromTicket.name;
            isNowServed = !fromTicket.served;
            const newDrink: DrinkOrder = {
              ...fromTicket,
              served: isNowServed,
              servedAt: isNowServed ? timeNow : undefined
            };
            return {
              ...t,
              drinks: [...existingDrinks, newDrink]
            };
          }
        }
        return t;
    });
    setTables(updatedTablesList);

    let updatedTicketsList = kdsTickets;
    if (affectedDrinkName) {
      updatedTicketsList = kdsTickets.map((tk) => {
          if (!matchesTable(tk.table, targetTableNum, tableId)) return tk;
          const updatedItems = tk.items.map((item) => {
            if (
              item.id === drinkId ||
              item.name.toLowerCase().includes(affectedDrinkName.toLowerCase()) ||
              affectedDrinkName.toLowerCase().includes(item.name.toLowerCase())
            ) {
              return {
                ...item,
                isReady: true,
                isServed: isNowServed,
                status: isNowServed ? ('served' as const) : ('ready' as const),
                servedAt: isNowServed ? timeNow : undefined
              };
            }
            return item;
          });
          const allCompleted = updatedItems.length > 0 && updatedItems.every((i) => i.isReady && i.isServed);
          return {
            ...tk,
            items: updatedItems,
            status: allCompleted ? ('served' as const) : tk.status
          };
      });
      setKdsTickets(updatedTicketsList);
    }

    // Persist the computed state, rather than waiting for React state updates.
    void syncTablesToRTDB(updatedTablesList);
    if (affectedDrinkName) void syncKDSTicketsToRTDB(updatedTicketsList);
    const updatedTable = updatedTablesList.find((table) => table.id === tableId);
    if (updatedTable) {
      rememberDrinkStates(tableId, updatedTable.drinks || []);
      void persistTableDrinks(activeChainId, activeBranchId, tableId, updatedTable.drinks || []).catch((error) => {
        console.error('No se pudo persistir el despacho de bebidas:', error);
      });
    }
  };

  // Mark all drinks for a table or all tables (tableId === 'all') as served
  const handleServeAllDrinks = (tableIdOrIds?: string | string[]) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isAll = !tableIdOrIds || tableIdOrIds === 'all';
    const targetIds = Array.isArray(tableIdOrIds)
      ? new Set(tableIdOrIds)
      : isAll
      ? null
      : new Set([tableIdOrIds]);

    const updatedTablesList = tables.map((t) => {
        if (targetIds && !targetIds.has(t.id)) return t;
        const ticketDrinks = extractDrinksFromTickets(kdsTickets, t.number, t.id);
        const existingDrinks = t.drinks || [];
        const existingNames = new Set(existingDrinks.map((d) => d.name.toLowerCase().trim()));
        const missingDrinks = ticketDrinks.filter((td) => !existingNames.has(td.name.toLowerCase().trim()));
        const allDrinks = [...existingDrinks, ...missingDrinks].map((d) => ({
          ...d,
          served: true,
          servedAt: d.servedAt || timeNow
        }));
        return {
          ...t,
          drinks: allDrinks
        };
    });
    setTables(updatedTablesList);

    // Also mark all drink items in kdsTickets as served
    const targetTableNumbers = new Set(
      tables
        .filter((t) => !targetIds || targetIds.has(t.id))
        .map((t) => t.number)
    );
    const updatedTicketsList = kdsTickets.map((tk) => {
        const matchesAnyTarget =
          isAll ||
          (targetIds && Array.from(targetIds).some((tid) => matchesTable(tk.table, '', tid))) ||
          targetTableNumbers.has(String(tk.table).replace(/\D+/g, ''));
        if (!matchesAnyTarget) return tk;

        const updatedItems = tk.items.map((item) => {
          if (isDrinkKDSTicketItem(item)) {
            return {
              ...item,
              isReady: true,
              isServed: true,
              status: 'served' as const,
              servedAt: item.servedAt || timeNow
            };
          }
          return item;
        });
        const allCompleted = updatedItems.length > 0 && updatedItems.every((i) => i.isReady && i.isServed);
        return {
          ...tk,
          items: updatedItems,
          status: allCompleted ? ('served' as const) : tk.status
        };
    });
    setKdsTickets(updatedTicketsList);

    // Persist the computed state, rather than waiting for React state updates.
    void syncTablesToRTDB(updatedTablesList);
    void syncKDSTicketsToRTDB(updatedTicketsList);
    const tablesToPersist = updatedTablesList.filter((table) => !targetIds || targetIds.has(table.id));
    tablesToPersist.forEach((table) => {
      rememberDrinkStates(table.id, table.drinks || []);
      void persistTableDrinks(activeChainId, activeBranchId, table.id, table.drinks || []).catch((error) => {
        console.error('No se pudo persistir el despacho de bebidas:', error);
      });
    });
  };

  // Send comanda (Kitchen dishes separated from Waiter drinks, with size and exact price applied)
  const handleSendComanda = (notes: string, serveDrinksNow?: boolean) => {
    const selectedTable = tables.find((t) => t.id === selectedTableId);
    const tableNum = selectedTable ? selectedTable.number : '05';

    const foodItems: KDSTicketItem[] = [];
    const newDrinkOrders: DrinkOrder[] = [];
    let addedTotal = 0;

    (Object.values(cart) as CartItem[]).forEach((item) => {
      if (item.qty <= 0) return;

      const itemTotal = item.price * item.qty;
      addedTotal += itemTotal;

      const displayName = item.selectedSize ? `${item.dishName} (${item.selectedSize})` : item.dishName;

      if (item.isDrink || item.category === 'bebidas') {
        newDrinkOrders.push({
          id: `drk-${Date.now()}-${item.dishId}-${Math.random().toString(36).substring(2, 6)}`,
          name: item.dishName,
          size: item.selectedSize || 'Estándar',
          qty: item.qty,
          price: item.price,
          served: serveDrinksNow === true,
          servedAt: serveDrinksNow
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : undefined
        });
      } else {
        const customParts = [
          notes,
          item.notes,
          item.customization?.picante ? `Ají: ${item.customization.picante}` : '',
          item.customization?.puntoSal ? 'Punto exacto de sal' : '',
          item.customization?.sinCulantro ? 'Sin culantro' : '',
          item.customization?.ajiAparte ? 'Ají aparte' : '',
          item.customization?.cebollaLavada ? 'Cebolla bien lavada' : ''
        ].filter(Boolean);

        foodItems.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          dishId: item.dishId,
          name: displayName,
          qty: item.qty,
          price: item.price,
          substation:
            item.category.includes('frios') || item.category === 'ceviches' || item.category === 'leches'
              ? 'FRÍOS'
              : 'CALIENTES',
          notes: customParts.length > 0 ? customParts.join(' • ') : undefined,
          isReady: false,
          isServed: false
        });
      }
    });

    // Kitchen KDS receives ONLY food items, never drinks!
    if (foodItems.length > 0) {
      const highestOrder = kdsTickets.reduce((max, t) => Math.max(max, t.arrivalOrder || 0), 0);
      const newTicket: KDSTicket = {
        id: `10${Math.floor(50 + Math.random() * 40)}`,
        table: `Mesa ${tableNum}`,
        station: foodItems.some((i) => i.substation === 'CALIENTES') ? 'calientes' : 'frios',
        status: 'pending',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        arrivalOrder: highestOrder + 1,
        elapsed: 'Hace 10s',
        waiter: staffUser.name,
        items: foodItems,
        drinksNote:
          newDrinkOrders.length > 0
            ? `${newDrinkOrders.reduce((a, b) => a + b.qty, 0)} bebidas a cargo del mozo (servir en salón)`
            : undefined
      };
      // Append to the end: FIFO queue where first arrivals are at the top and newest below
      setKdsTickets((prev) => [...prev, newTicket]);
    }

    // Update table status, total, and append drinks and dishes
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === selectedTableId) {
          const existingDrinks = t.drinks || [];
          const combinedDrinks = [...existingDrinks, ...newDrinkOrders];
          const existingDishes = t.dishes || [];
          const newDishes = foodItems.map((fi) => ({
            id: fi.id,
            name: `${fi.qty}x ${fi.name}`,
            qty: fi.qty,
            price: fi.price,
            station: fi.substation === 'FRÍOS' ? 'Barra Fría' : 'Calientes',
            description: fi.notes || 'Preparación según comanda',
            status: 'cooking' as const
          }));
          const combinedDishes = [...existingDishes, ...newDishes];

          const isUnassigned = !t.waiter || t.waiter.trim() === '' || t.waiter === 'Sin asignar';
          const assignedWaiter = isUnassigned ? (staffUser.name || 'Carlos Mendoza') : t.waiter;

          return {
            ...t,
            waiter: assignedWaiter,
            status: foodItems.length > 0 ? 'cooking' : t.status === 'free' ? 'eating' : t.status,
            estRemaining: foodItems.length > 0 ? '~12 min' : t.estRemaining,
            progress: foodItems.length > 0 ? 20 : t.progress,
            total: (t.total || 0) + addedTotal,
            dishes: combinedDishes,
            drinks: combinedDrinks
          };
        }
        return t;
      })
    );

    // Clear cart
    setCart({});
  };

  // KDS ticket updates
  const handleUpdateTicketStatus = (
    ticketId: string,
    newStatus: 'pending' | 'cooking' | 'ready' | 'served'
  ) => {
    setKdsTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        if (newStatus === 'ready') {
          return {
            ...t,
            status: newStatus,
            items: t.items.map((i) => ({ ...i, isReady: true }))
          };
        }
        if (newStatus === 'served') {
          return {
            ...t,
            status: newStatus,
            items: t.items.map((i) => ({ ...i, isReady: true, isServed: true }))
          };
        }
        return { ...t, status: newStatus };
      })
    );

    // If ticket marked ready, update matching table
    if (newStatus === 'ready') {
      const ticket = kdsTickets.find((t) => t.id === ticketId);
      if (ticket) {
        setTables((prev) =>
          prev.map((tbl) =>
            ticket.table.includes(tbl.number)
              ? {
                  ...tbl,
                  status: 'ready',
                  dishes: tbl.dishes?.map((d) => ({ ...d, status: 'ready' as const }))
                }
              : tbl
          )
        );
      }
    }

    // If ticket marked served by waiter, update matching table to eating
    if (newStatus === 'served') {
      const ticket = kdsTickets.find((t) => t.id === ticketId);
      if (ticket) {
        setTables((prev) =>
          prev.map((tbl) =>
            ticket.table.includes(tbl.number)
              ? {
                  ...tbl,
                  status: tbl.status === 'ready' || tbl.status === 'cooking' ? 'eating' : tbl.status,
                  notes: 'Platos servidos en mesa por el mozo.',
                  dishes: tbl.dishes?.map((d) => ({ ...d, status: 'served' as const }))
                }
              : tbl
          )
        );
      }
    }
  };

  // 1. Kitchen cook marks individual dish as ready
  const handleMarkDishReady = (ticketId: string, itemIndex: number) => {
    const targetTicket = kdsTickets.find((t) => t.id === ticketId);
    const ticketTable = targetTicket ? targetTicket.table : '';
    let updatedTicketsList: KDSTicket[] = [];

    setKdsTickets((prev) => {
      updatedTicketsList = prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newItems = t.items.map((item, idx) => {
          if (idx !== itemIndex) return item;
          return {
            ...item,
            isReady: true,
            status: 'ready' as const,
            readyAt: item.readyAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });
        const isAllReady = newItems.every((i) => i.isReady || (i as any).status === 'ready');
        return {
          ...t,
          items: newItems,
          status: isAllReady ? 'ready' : (t.status === 'pending' ? 'cooking' : (t.status as string) === 'preparing' ? 'cooking' : t.status)
        };
      });
      return updatedTicketsList;
    });

    let updatedTablesList: TableItem[] = [];
    if (ticketTable) {
      setTables((prev) => {
        updatedTablesList = prev.map((tbl) => {
          if (!matchesTable(ticketTable, tbl.number, tbl.id)) return tbl;
          const updatedDishes =
            tbl.dishes?.map((dish, dIdx) => {
              if (dIdx === itemIndex) {
                return { ...dish, status: 'ready' as const };
              }
              return dish;
            }) || [];
          return {
            ...tbl,
            status: 'ready',
            dishes: updatedDishes
          };
        });
        return updatedTablesList;
      });
    }

    if (updatedTicketsList.length > 0) syncKDSTicketsToRTDB(updatedTicketsList);
    if (updatedTablesList.length > 0) syncTablesToRTDB(updatedTablesList);
  };

  // 2. Waiter marks individual dish as served in salon
  const handleMarkDishServed = (ticketId: string, itemIndex: number) => {
    const targetTicket = kdsTickets.find((t) => t.id === ticketId);
    const ticketTable = targetTicket ? targetTicket.table : '';
    let updatedTicketsList: KDSTicket[] = [];

    setKdsTickets((prev) => {
      updatedTicketsList = prev.map((t) => {
        if (t.id !== ticketId) return t;
        const newItems = t.items.map((item, idx) => {
          if (idx !== itemIndex) return item;
          return {
            ...item,
            isReady: true,
            isServed: true,
            status: 'served' as const,
            servedAt: item.servedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });
        const isAllServedAndReady = newItems.every(
          (i) => (i.isReady || (i as any).status === 'ready') && (i.isServed || (i as any).status === 'served')
        );
        return {
          ...t,
          items: newItems,
          // When all dishes are served, the ticket status becomes 'served' and it disappears from active view!
          status: isAllServedAndReady ? 'served' : t.status
        };
      });
      return updatedTicketsList;
    });

    let updatedTablesList: TableItem[] = [];
    if (ticketTable) {
      setTables((prev) => {
        updatedTablesList = prev.map((tbl) => {
          if (!matchesTable(ticketTable, tbl.number, tbl.id)) return tbl;
          const updatedDishes =
            tbl.dishes?.map((dish, dIdx) => {
              if (dIdx === itemIndex) {
                return { ...dish, status: 'served' as const };
              }
              return dish;
            }) || [];

          const hasPendingDishes = updatedDishes.some((d) => d.status !== 'served');
          return {
            ...tbl,
            status: !hasPendingDishes ? 'eating' : tbl.status,
            notes: !hasPendingDishes ? 'Todos los platos servidos por el mozo.' : tbl.notes,
            dishes: updatedDishes
          };
        });
        return updatedTablesList;
      });
    }

    if (updatedTicketsList.length > 0) syncKDSTicketsToRTDB(updatedTicketsList);
    if (updatedTablesList.length > 0) syncTablesToRTDB(updatedTablesList);
  };

  // 3. Waiter removes a dish from the order at ANY time
  const handleRemoveDish = (ticketId: string, itemIndex: number) => {
    let ticketTable = '';
    let removedItemPrice = 0;
    let removedItemQty = 1;
    let removedItemName = '';

    setKdsTickets((prev) => {
      const target = prev.find((t) => t.id === ticketId);
      if (!target) return prev;
      ticketTable = target.table;
      const itemToRemove = target.items[itemIndex];
      if (itemToRemove) {
        removedItemPrice = itemToRemove.price || 0;
        removedItemQty = itemToRemove.qty || 1;
        removedItemName = itemToRemove.name;
      }

      const updatedItems = target.items.filter((_, idx) => idx !== itemIndex);

      // If all dishes were removed from this comanda, remove the ticket completely
      if (updatedItems.length === 0) {
        return prev.filter((t) => t.id !== ticketId);
      }

      // If all remaining items are already prepared and served, ticket disappears
      const allRemainingCompleted = updatedItems.every((i) => i.isReady && i.isServed);

      return prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          items: updatedItems,
          status: allRemainingCompleted ? 'served' : t.status
        };
      });
    });

    // Update table: deduct price and remove dish
    if (ticketTable) {
      setTables((prev) =>
        prev.map((tbl) => {
          if (!ticketTable.includes(tbl.number)) return tbl;
          const updatedDishes = (tbl.dishes || []).filter((d, dIdx) => {
            if (dIdx === itemIndex) return false;
            if (removedItemName && d.name.toLowerCase().includes(removedItemName.toLowerCase())) return false;
            return true;
          });
          const deductAmount = removedItemPrice > 0 ? removedItemPrice * removedItemQty : 0;
          const newTotal = Math.max(0, (tbl.total || 0) - deductAmount);
          return {
            ...tbl,
            total: newTotal,
            dishes: updatedDishes,
            status:
              updatedDishes.length === 0 && (!tbl.drinks || tbl.drinks.every((d) => d.served))
                ? 'free'
                : tbl.status
          };
        })
      );
    }
  };

  // 3b. Waiter removes an already ordered dish directly from the table order view
  const handleRemoveTableDish = (tableId: string, dishIndex: number, reason: string = 'A solicitud del cliente') => {
    let removedDishName = '';
    let removedDishId: string | undefined = undefined;
    let tableNumber = '';

    setTables((prev) =>
      prev.map((tbl) => {
        if (tbl.id !== tableId) return tbl;
        tableNumber = tbl.number;
        const targetDish = tbl.dishes?.[dishIndex];
        if (!targetDish) return tbl;

        removedDishName = targetDish.name;
        removedDishId = targetDish.id;
        const pricePerUnit =
          targetDish.price ||
          (tbl.total && tbl.dishes && tbl.dishes.length > 0
            ? Math.round((tbl.total / tbl.dishes.length) * 10) / 10
            : 24);
        const deductAmount = pricePerUnit * (targetDish.qty || 1);
        const newTotal = Math.max(0, (tbl.total || 0) - deductAmount);
        const updatedDishes = (tbl.dishes || []).filter((_, idx) => idx !== dishIndex);

        const cancelRecord = {
          id: `canc-dish-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          name: targetDish.name,
          qty: targetDish.qty || 1,
          price: deductAmount,
          reason,
          canceledBy: staffUser.name,
          canceledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const hasPendingDishes = updatedDishes.some((d) => d.status !== 'served');
        const hasPendingDrinks = tbl.drinks?.some((d) => !d.served);

        return {
          ...tbl,
          total: newTotal,
          dishes: updatedDishes,
          canceledItems: [...(tbl.canceledItems || []), cancelRecord],
          status:
            updatedDishes.length === 0 && (!tbl.drinks || tbl.drinks.length === 0)
              ? 'free'
              : !hasPendingDishes && !hasPendingDrinks
              ? 'eating'
              : tbl.status
        };
      })
    );

    // Sync with KDS ticket in kitchen so cook does not prepare an eliminated dish
    if (tableNumber) {
      setKdsTickets((prev) =>
        prev
          .map((ticket) => {
            if (!ticket.table.includes(tableNumber)) return ticket;
            let removedOne = false;
            const updatedItems = ticket.items.filter((item) => {
              if (removedDishId && item.id) {
                return item.id !== removedDishId;
              }
              const cleanItem = item.name.replace(/^\d+x\s*/i, '').toLowerCase().trim();
              const cleanDish = removedDishName.replace(/^\d+x\s*/i, '').toLowerCase().trim();
              if (!removedOne && (cleanItem === cleanDish || cleanItem.includes(cleanDish) || cleanDish.includes(cleanItem))) {
                removedOne = true;
                return false;
              }
              return true;
            });
            const allServedAndReady =
              updatedItems.length > 0 && updatedItems.every((i) => i.isReady && i.isServed);
            return {
              ...ticket,
              items: updatedItems,
              status:
                updatedItems.length === 0
                  ? ('served' as const)
                  : allServedAndReady
                  ? ('served' as const)
                  : ticket.status
            };
          })
          .filter((t) => t.items.length > 0)
      );
    }
  };

  // 3c. Waiter removes an already ordered drink from the table order view
  const handleRemoveTableDrink = (tableId: string, drinkId: string, reason: string = 'A solicitud del cliente') => {
    setTables((prev) =>
      prev.map((tbl) => {
        if (tbl.id !== tableId) return tbl;
        const targetDrink = tbl.drinks?.find((d) => d.id === drinkId);
        if (!targetDrink) return tbl;

        const deductAmount = (targetDrink.price || 0) * (targetDrink.qty || 1);
        const newTotal = Math.max(0, (tbl.total || 0) - deductAmount);
        const updatedDrinks = (tbl.drinks || []).filter((d) => d.id !== drinkId);

        const cancelRecord = {
          id: `canc-drk-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          name: `${targetDrink.qty}x ${targetDrink.name}${targetDrink.size ? ` (${targetDrink.size})` : ''}`,
          qty: targetDrink.qty || 1,
          price: deductAmount,
          reason,
          canceledBy: staffUser.name,
          canceledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        return {
          ...tbl,
          total: newTotal,
          drinks: updatedDrinks,
          canceledItems: [...(tbl.canceledItems || []), cancelRecord]
        };
      })
    );
  };

  // 4. Mark all dishes in a ticket ready
  const handleMarkAllDishesReady = (ticketId: string) => {
    const targetTicket = kdsTickets.find((t) => t.id === ticketId);
    const ticketTable = targetTicket ? targetTicket.table : '';
    let updatedTicketsList: KDSTicket[] = [];

    setKdsTickets((prev) => {
      updatedTicketsList = prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'ready',
          items: t.items.map((i) => ({
            ...i,
            isReady: true,
            status: 'ready' as const,
            readyAt: i.readyAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }))
        };
      });
      return updatedTicketsList;
    });

    let updatedTablesList: TableItem[] = [];
    if (ticketTable) {
      setTables((prev) => {
        updatedTablesList = prev.map((tbl) => {
          if (!matchesTable(ticketTable, tbl.number, tbl.id)) return tbl;
          return {
            ...tbl,
            status: 'ready',
            dishes: tbl.dishes?.map((d) => ({ ...d, status: 'ready' as const }))
          };
        });
        return updatedTablesList;
      });
    }

    if (updatedTicketsList.length > 0) syncKDSTicketsToRTDB(updatedTicketsList);
    if (updatedTablesList.length > 0) syncTablesToRTDB(updatedTablesList);
  };

  // 5. Mark all dishes in a ticket served (card disappears immediately)
  const handleMarkAllDishesServed = (ticketId: string) => {
    const targetTicket = kdsTickets.find((t) => t.id === ticketId);
    const ticketTable = targetTicket ? targetTicket.table : '';
    let updatedTicketsList: KDSTicket[] = [];

    setKdsTickets((prev) => {
      updatedTicketsList = prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'served',
          items: t.items.map((i) => ({
            ...i,
            isReady: true,
            isServed: true,
            status: 'served' as const,
            servedAt: i.servedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }))
        };
      });
      return updatedTicketsList;
    });

    let updatedTablesList: TableItem[] = [];
    if (ticketTable) {
      setTables((prev) => {
        updatedTablesList = prev.map((tbl) => {
          if (!matchesTable(ticketTable, tbl.number, tbl.id)) return tbl;
          return {
            ...tbl,
            status: 'eating',
            notes: 'Todos los platos servidos por el mozo.',
            dishes: tbl.dishes?.map((d) => ({ ...d, status: 'served' as const }))
          };
        });
        return updatedTablesList;
      });
    }

    if (updatedTicketsList.length > 0) syncKDSTicketsToRTDB(updatedTicketsList);
    if (updatedTablesList.length > 0) syncTablesToRTDB(updatedTablesList);
  };

  // Active branch menu: isolated per branch location
  const currentBranchDishes: MenuItem[] = branchMenus[activeBranchId] || INITIAL_MENU_ITEMS;

  // Availability toggle per branch
  const handleToggleItemAvailability = (itemId: number) => {
    setBranchMenus((prev) => {
      const currentList = prev[activeBranchId] || INITIAL_MENU_ITEMS;
      const updatedList = currentList.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      );
      return {
        ...prev,
        [activeBranchId]: updatedList
      };
    });
  };

  // Branch dish handlers: Add, Update, Delete, Restore, Reset
  const handleAddMenuItem = (newItem: MenuItem) => {
    setBranchMenus((prev) => {
      const currentList = prev[activeBranchId] || INITIAL_MENU_ITEMS;
      return {
        ...prev,
        [activeBranchId]: [newItem, ...currentList]
      };
    });
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setBranchMenus((prev) => {
      const currentList = prev[activeBranchId] || INITIAL_MENU_ITEMS;
      return {
        ...prev,
        [activeBranchId]: currentList.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      };
    });
  };

  const handleDeleteDishFromBranch = (itemId: number) => {
    setBranchMenus((prev) => {
      const currentList = prev[activeBranchId] || INITIAL_MENU_ITEMS;
      return {
        ...prev,
        [activeBranchId]: currentList.filter((item) => item.id !== itemId)
      };
    });
  };

  const handleRestoreDishInBranch = (itemId: number) => {
    const chain = chains.find((c) => c.id === activeChainId);
    const assignedCarta = masterCartas.find((c) => c.id === chain?.assignedCartaId) ||
      masterCartas.find((c) => c.id === 'carta-la-barra');
    const dishToRestore = assignedCarta?.dishes.find((d) => d.id === itemId);

    if (dishToRestore) {
      setBranchMenus((prev) => {
        const currentList = prev[activeBranchId] || INITIAL_MENU_ITEMS;
        if (currentList.some((d) => d.id === itemId)) return prev;
        return {
          ...prev,
          [activeBranchId]: [...currentList, { ...dishToRestore, available: true }]
        };
      });
    }
  };

  const handleResetBranchMenu = () => {
    const chain = chains.find((c) => c.id === activeChainId);
    const assignedCarta = masterCartas.find((c) => c.id === chain?.assignedCartaId) ||
      masterCartas.find((c) => c.id === 'carta-la-barra');
    if (assignedCarta) {
      setBranchMenus((prev) => ({
        ...prev,
        [activeBranchId]: JSON.parse(JSON.stringify(assignedCarta.dishes))
      }));
    }
  };

  // SaaS Master Cartas handlers
  const handleAddMasterCarta = (newCarta: MasterCarta) => {
    setMasterCartas((prev) => [newCarta, ...prev]);
  };

  const handleAssignCartaToChain = (chainId: string, cartaId: string) => {
    // 1. Update chain assignedCartaId
    setChains((prev) =>
      prev.map((c) => (c.id === chainId ? { ...c, assignedCartaId: cartaId } : c))
    );

    // 2. Update master cartas assignment list
    setMasterCartas((prev) =>
      prev.map((carta) => {
        const currentAssigned = carta.assignedChainIds || [];
        if (carta.id === cartaId) {
          return {
            ...carta,
            assignedChainIds: Array.from(new Set([...currentAssigned, chainId]))
          };
        } else {
          return {
            ...carta,
            assignedChainIds: currentAssigned.filter((id) => id !== chainId)
          };
        }
      })
    );

    // 3. Propagate dishes to ALL branches of this restaurant chain
    const targetCarta = masterCartas.find((c) => c.id === cartaId);
    const targetChain = chains.find((c) => c.id === chainId);
    if (targetCarta && targetChain) {
      setBranchMenus((prev) => {
        const updated = { ...prev };
        targetChain.locations.forEach((loc) => {
          updated[loc.id] = JSON.parse(JSON.stringify(targetCarta.dishes));
        });
        return updated;
      });
    }
  };

  // SaaS brand addition (Administrador Global)
  const handleAddChain = async (newChain: ChainBrand): Promise<Array<{ email: string; activationLink: string }>> => {
    setChains((prev) => [newChain, ...prev]);

    // Initialize branch menus for new locations
    const assignedCarta = masterCartas.find((c) => c.id === newChain.assignedCartaId) || masterCartas[0];
    const baseDishes = assignedCarta ? [...assignedCarta.dishes] : [...INITIAL_MENU_ITEMS];
    setBranchMenus((prev) => {
      const updated = { ...prev };
      newChain.locations.forEach((loc) => {
        updated[loc.id] = JSON.parse(JSON.stringify(baseDishes));
      });
      return updated;
    });

    // Automatically register the General Admin in the multi-tier directory
    const genAdmin: AdminUser = {
      id: `adm-gen-${Date.now()}`,
      name: newChain.adminName,
      email: newChain.adminEmail,
      phone: newChain.adminPhone,
      role: 'Administrador General',
      roleKey: 'admin_general',
      brand: newChain.name,
      tenantId: newChain.id,
      brandId: newChain.id,
      assignedBranchIds: newChain.locations.map((loc) => loc.id),
      initials: newChain.adminName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'AG',
      active: true
    };

    // Automatically register the Sede Admin for the initial location
    const initialLoc = newChain.locations[0];
    const sedeAdmin: AdminUser = {
      id: `adm-sede-${Date.now()}`,
      name: initialLoc?.managerName || newChain.adminName,
      email: initialLoc?.managerEmail || newChain.adminEmail,
      phone: initialLoc?.managerPhone || newChain.adminPhone,
      role: 'Administrador de Sede',
      roleKey: 'admin_sede',
      brand: newChain.name,
      tenantId: newChain.id,
      brandId: newChain.id,
      branchName: initialLoc?.name || 'Sede Principal',
      branchId: initialLoc?.id || '',
      assignedBranchIds: initialLoc?.id ? [initialLoc.id] : [],
      initials: (initialLoc?.managerName || 'AS').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'AS',
      active: true
    };

    setAdmins((prev) => [genAdmin, sedeAdmin, ...prev]);

    const links: Array<{ email: string; activationLink: string }> = [];
    if (auth?.currentUser) {
      try {
        const resGen = await provisionAdminIdentity(genAdmin);
        if (resGen?.activationLink) links.push({ email: genAdmin.email || '', activationLink: resGen.activationLink });
      } catch (err) {
        console.error('No se pudo provisionar admin general automáticamente:', err);
      }
      try {
        const resSede = await provisionAdminIdentity(sedeAdmin);
        if (resSede?.activationLink) links.push({ email: sedeAdmin.email || '', activationLink: resSede.activationLink });
      } catch (err) {
        console.error('No se pudo provisionar admin de sede automáticamente:', err);
      }
    }
    return links;
  };

  // Add a new branch/sede to a specific restaurant (Global Admin or General Admin)
  const handleAddLocationToChain = (
    chainId: string,
    newLocation: BranchLocation,
    managerAdmin?: AdminUser
  ) => {
    setChains((prev) =>
      prev.map((c) =>
        c.id === chainId
          ? {
              ...c,
              locationsCount: c.locations.length + 1,
              locations: [...c.locations, newLocation]
            }
          : c
      )
    );

    // Initialize branch menu for this new location
    const chain = chains.find((c) => c.id === chainId);
    const assignedCarta = masterCartas.find((c) => c.id === chain?.assignedCartaId) || masterCartas[0];
    const baseDishes = assignedCarta ? [...assignedCarta.dishes] : [...INITIAL_MENU_ITEMS];
    setBranchMenus((prev) => ({
      ...prev,
      [newLocation.id]: JSON.parse(JSON.stringify(baseDishes))
    }));

    if (managerAdmin) {
      const safeManager: AdminUser = {
        ...managerAdmin,
        tenantId: managerAdmin.tenantId || chainId,
        brandId: managerAdmin.brandId || chainId
      };
      setAdmins((prev) => [safeManager, ...prev]);
      if (auth?.currentUser && safeManager.email) {
        provisionAdminIdentity(safeManager).catch((err) =>
          console.error('No se pudo provisionar admin de sede en Auth:', err)
        );
      }
    }
  };

  // Toggle active/paused state on a branch
  const handleToggleLocation = (chainId: string, locationId: string) => {
    setChains((prev) =>
      prev.map((c) =>
        c.id === chainId
          ? {
              ...c,
              locations: c.locations.map((loc) =>
                loc.id === locationId ? { ...loc, active: !loc.active } : loc
              )
            }
          : c
      )
    );
  };

  // Update an existing branch/sede location (Global Admin or General Admin)
  const handleUpdateLocation = (
    chainId: string,
    updatedLocation: BranchLocation,
    managerAdmin?: AdminUser
  ) => {
    setChains((prev) =>
      prev.map((c) =>
        c.id === chainId
          ? {
              ...c,
              locations: c.locations.map((loc) =>
                loc.id === updatedLocation.id ? updatedLocation : loc
              )
            }
          : c
      )
    );

    // If active branch is this one and table count changed, adjust tables if necessary
    if (activeBranchId === updatedLocation.id) {
      setTables((prev) => {
        if (prev.length < updatedLocation.tables) {
          const addedCount = updatedLocation.tables - prev.length;
          const newTables: TableItem[] = Array.from({ length: addedCount }).map((_, idx) => {
            const num = (prev.length + idx + 1).toString().padStart(2, '0');
            return {
              id: `tbl-${updatedLocation.id}-${num}`,
              number: num,
              status: 'free',
              statusLabel: 'Disponible',
              zone: 'Salón Principal',
              waiter: '',
              diners: 4,
              branchId: updatedLocation.id
            };
          });
          return [...prev, ...newTables];
        }
        return prev;
      });
    }

    // Synchronize or update Admin User for this sede in admins directory
    if (updatedLocation.managerName || updatedLocation.managerEmail) {
      setAdmins((prev) => {
        const existingIdx = prev.findIndex(
          (a) =>
            a.brandId === chainId &&
            a.roleKey === 'admin_sede' &&
            (a.assignedBranchIds?.includes(updatedLocation.id) || a.branchId === updatedLocation.id)
        );
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            name: updatedLocation.managerName || updated[existingIdx].name,
            email: updatedLocation.managerEmail || updated[existingIdx].email,
            phone: updatedLocation.managerPhone || updated[existingIdx].phone,
            docType: updatedLocation.managerDocType || updated[existingIdx].docType,
            docNumber: updatedLocation.managerDocNumber || updated[existingIdx].docNumber,
            branchName: updatedLocation.name,
            initials: (updatedLocation.managerName || 'AS').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
          };
          return updated;
        } else if (managerAdmin) {
          return [managerAdmin, ...prev];
        }
        return prev;
      });
    }
  };

  // Delete a branch/location from chain
  const handleDeleteLocation = (chainId: string, locationId: string) => {
    setChains((prev) =>
      prev.map((c) =>
        c.id === chainId
          ? {
              ...c,
              locationsCount: Math.max(0, c.locations.length - 1),
              locations: c.locations.filter((loc) => loc.id !== locationId)
            }
          : c
      )
    );
  };

  // Update chain brand details (e.g. logo, name, branding, and designated general admin)
  const handleUpdateChain = (updatedChain: ChainBrand) => {
    setChains((prev) => prev.map((c) => (c.id === updatedChain.id ? updatedChain : c)));

    // Actualizar en cascada la Carta Maestra asignada para que su nombre refleje el nuevo restaurante
    setMasterCartas((prev) =>
      prev.map((carta) => {
        const isAssigned =
          carta.id === updatedChain.assignedCartaId ||
          (Array.isArray(carta.assignedChainIds) && carta.assignedChainIds.includes(updatedChain.id));
        if (isAssigned && carta.name.startsWith('Carta Oficial')) {
          return {
            ...carta,
            name: `Carta Oficial ${updatedChain.name}`
          };
        }
        return carta;
      })
    );

    // Synchronize or assign the General Admin and update all admins of this brand
    setAdmins((prev) => {
      const updated = prev.map((admin) => {
        if (admin.brandId === updatedChain.id) {
          if (admin.roleKey === 'admin_general') {
            return {
              ...admin,
              name: updatedChain.adminName || admin.name,
              email: updatedChain.adminEmail || admin.email,
              phone: updatedChain.adminPhone || admin.phone,
              docType: updatedChain.adminDocType || admin.docType,
              docNumber: updatedChain.adminDocNumber || admin.docNumber,
              brand: updatedChain.name,
              assignedBranchIds: updatedChain.locations.map((loc) => loc.id),
              initials: (updatedChain.adminName || admin.name || 'AG')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()
            };
          }
          // Admins de sede de esta marca: actualizar nombre de la marca
          return {
            ...admin,
            brand: updatedChain.name
          };
        }
        return admin;
      });

      const hasGenAdmin = updated.some(
        (a) => a.brandId === updatedChain.id && a.roleKey === 'admin_general'
      );
      if (!hasGenAdmin && (updatedChain.adminName || updatedChain.adminEmail)) {
        const newGenAdmin: AdminUser = {
          id: `adm-gen-${Date.now()}`,
          name: updatedChain.adminName || 'Administrador General',
          email: updatedChain.adminEmail || '',
          phone: updatedChain.adminPhone || '',
          docType: updatedChain.adminDocType,
          docNumber: updatedChain.adminDocNumber,
          role: 'Administrador General',
          roleKey: 'admin_general',
          brand: updatedChain.name,
          brandId: updatedChain.id,
          assignedBranchIds: updatedChain.locations.map((loc) => loc.id),
          initials: (updatedChain.adminName || 'AG')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase(),
          active: true
        };
        return [newGenAdmin, ...updated];
      }

      return updated;
    });
  };

  // Delete chain and its associated branch/admin data
  const handleDeleteChain = (chainId: string) => {
    setChains((prev) => prev.filter((c) => c.id !== chainId));
    setAdmins((prev) => prev.filter((a) => a.brandId !== chainId));
  };

  // Switch active chain and branch context
  const handleSelectChainAndBranch = (
    chainId: string,
    branchId: string,
    screen?: ScreenType
  ) => {
    setActiveChainId(chainId);
    setActiveBranchId(branchId);
    if (screen) {
      setCurrentScreen(screen);
    }
  };

  // Staff unlock with role hierarchy (Autenticación estricta con PIN de 6 dígitos)
  const handleUnlock = (role: AppRole, name: string, targetScreen?: ScreenType) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    setStaffUser({
      name,
      role: role === 'mesero' ? 'mesero' : 'admin'
    });

    if (['admin_sede', 'admin_general', 'admin_global'].includes(role)) {
      const foundAdmin = admins.find((a) => a.name.toLowerCase() === name.toLowerCase() || a.roleKey === role);
      setAdminProfile(foundAdmin || {
        id: `adm-${Date.now()}`,
        name,
        role: role === 'admin_general' ? 'Administrador General' : role === 'admin_global' ? 'Administrador Global' : 'Administrador de Sede',
        roleKey: role,
        assignedBranchIds: activeBranchId ? [activeBranchId] : [],
        active: true
      });
      if (foundAdmin?.brandId) setActiveChainId(foundAdmin.brandId);
      if (foundAdmin?.assignedBranchIds && foundAdmin.assignedBranchIds.length > 0) {
        setActiveBranchId(foundAdmin.assignedBranchIds[0]);
      } else if (foundAdmin?.branchId) {
        setActiveBranchId(foundAdmin.branchId);
      }
    }

    if (targetScreen) {
      setCurrentScreen(targetScreen);
      if (targetScreen === 'carta-sede') {
        setCartaInitialTab('carta');
      }
      return;
    }

    if (role === 'cocina') {
      setCurrentScreen('cocina-kds');
      return;
    }
    if (role === 'admin_global') {
      setCurrentScreen('saas-console');
      return;
    }
    if (role === 'admin_general' || role === 'admin_sede') {
      setCurrentScreen('dashboard-admin');
      return;
    }

    // Rol mesero / cajero / salón
    setCurrentScreen('mesas');
  };

  // Staff management handlers (Multi-Sede)
  const handleAddStaff = (newStaff: StaffMember) => {
    setStaffMembers((prev) => [newStaff, ...prev]);
  };

  const handleUpdateStaff = (updatedStaff: StaffMember) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    );
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaffMembers((prev) => prev.filter((s) => s.id !== staffId));
  };

  // Admin branch assignment handler (Sede Admin managing multiple sedes)
  const handleUpdateAdminBranches = async (adminId: string, branchIds: string[]) => {
    setAdmins((prev) =>
      prev.map((adm) =>
        adm.id === adminId
          ? {
              ...adm,
              assignedBranchIds: branchIds,
              branchId: branchIds[0] || adm.branchId
            }
          : adm
      )
    );

    const targetAdmin = admins.find((a) => a.id === adminId);
    if (targetAdmin && targetAdmin.email && auth?.currentUser) {
      try {
        await provisionAdminIdentity({
          ...targetAdmin,
          assignedBranchIds: branchIds,
          branchId: branchIds[0] || targetAdmin.branchId
        });
      } catch (err) {
        console.error('No se pudo sincronizar sedes con Firebase Auth:', err);
      }
    }
  };

  // Update Admin user (e.g. PIN update)
  const handleUpdateAdmin = (updatedAdmin: AdminUser) => {
    setAdmins((prev) =>
      prev.map((adm) => (adm.id === updatedAdmin.id ? updatedAdmin : adm))
    );
  };

  // Reset demo data
  const handleResetData = () => {
    resetAllDataInRTDB().catch((e) => console.error('Error resetting RTDB:', e));
    setTables(INITIAL_TABLES);
    setMasterCartas(INITIAL_MASTER_CARTAS);
    setChains(INITIAL_CHAINS);
    setKdsTickets(INITIAL_KDS_TICKETS);
    setStaffMembers(INITIAL_STAFF);
    setAdmins(INITIAL_ADMINS);
    
    // Reset branch menus
    const initialBranchMap: Record<string, MenuItem[]> = {};
    INITIAL_CHAINS.forEach((chain) => {
      const assignedCarta = INITIAL_MASTER_CARTAS.find((c) => c.id === chain.assignedCartaId) || INITIAL_MASTER_CARTAS[0];
      const baseDishes = assignedCarta ? [...assignedCarta.dishes] : [...INITIAL_MENU_ITEMS];
      chain.locations.forEach((loc) => {
        initialBranchMap[loc.id] = JSON.parse(JSON.stringify(baseDishes));
      });
    });
    setBranchMenus(initialBranchMap);

    setCart({});
  };

  const isWaiterUser = currentRole === 'mesero';

  // Harmonize tables with active tickets from KDS so drinks and dishes are in sync across salon and drinks tray
  const tablesWithTicketDrinks = tables.map((t) => {
    const activeTicket = kdsTickets.find(
      (tk) => tk.status !== 'served' && matchesTable(tk.table, t.number, t.id)
    );
    const ticketDrinks = extractDrinksFromTickets(kdsTickets, t.number, t.id);
    const existingDrinks = t.drinks || [];
    const existingNames = new Set(existingDrinks.map((d) => d.name.toLowerCase().trim()));
    const missingDrinks = ticketDrinks.filter((td) => !existingNames.has(td.name.toLowerCase().trim()));
    const combinedDrinks = [...existingDrinks, ...missingDrinks];

    if (activeTicket) {
      const foodItems = activeTicket.items.filter((i) => !isDrinkKDSTicketItem(i));
      const allFoodReady = foodItems.length > 0 && foodItems.every((i) => i.isReady);
      const newStatus =
        t.status === 'free'
          ? (foodItems.length > 0 && allFoodReady ? 'ready' : 'cooking')
          : (allFoodReady && t.status !== 'bill_requested' ? 'ready' : t.status);
      const newWaiter =
        activeTicket.waiter && activeTicket.waiter !== 'Mozo de Turno' && activeTicket.waiter !== 'Sin asignar'
          ? activeTicket.waiter
          : (t.waiter || (isWaiterUser ? (staffUser.name || 'Carlos Mendoza') : t.waiter));

      return {
        ...t,
        status: newStatus,
        waiter: newWaiter,
        drinks: combinedDrinks
      };
    }

    return {
      ...t,
      drinks: combinedDrinks
    };
  });

  const tablesForAlerts = isWaiterUser
    ? tablesWithTicketDrinks.filter((t) => isTableAssignedToWaiter(t, staffUser.name, true))
    : tablesWithTicketDrinks;

  const ticketsForAlerts = isWaiterUser
    ? kdsTickets.filter((t) => isTicketAssignedToWaiter(t, staffUser.name, tables))
    : kdsTickets;

  const totalReadyDishesInKDS = ticketsForAlerts.reduce((acc, t) => {
    return acc + t.items.filter((i) => i.isReady && !i.isServed).length;
  }, 0);
  const readyPlatesCount = Math.max(
    tablesForAlerts.filter((t) => t.status === 'ready').length,
    totalReadyDishesInKDS
  );
  const cartCount = (Object.values(cart) as CartItem[]).reduce((sum, item) => sum + item.qty, 0);
  
  // Pending bills count: role-filtered for waiters to only show their assigned tables requiring payment
  const pendingBillsCount = tables.filter((t) => {
    if (t.status !== 'bill_requested') return false;
    if (isWaiterUser) {
      return isTableAssignedToWaiter(t, staffUser.name, true);
    }
    return true;
  }).length;
  
  // Total pending drinks count (for waiter: only their assigned tables and shift orders)
  const pendingDrinksCount = tablesForAlerts.reduce((acc, t) => {
    return acc + (t.drinks?.filter((d) => !d.served).length || 0);
  }, 0);

  const currentChain = chains.find((c) => c.id === activeChainId) || chains[0];
  const currentBranch = currentChain?.locations.find((l) => l.id === activeBranchId) || currentChain?.locations[0];
  const currentAdmin = (adminProfile && ['admin_sede', 'admin_general', 'admin_global'].includes(currentRole)
    ? {
        ...adminProfile,
        roleKey: currentRole,
        role: currentRole === 'admin_general' ? 'Administrador General' : currentRole === 'admin_global' ? 'Administrador Global' : 'Administrador de Sede'
      }
    : undefined)
    || admins.find((admin) => admin.name.toLowerCase() === staffUser.name.toLowerCase()) 
    || admins.find((admin) => admin.roleKey === currentRole)
    || (['admin_sede', 'admin_general', 'admin_global'].includes(currentRole) ? {
        id: 'adm-current',
        name: staffUser.name || 'Administrador',
        role: currentRole === 'admin_general' ? 'Administrador General' : currentRole === 'admin_global' ? 'Administrador Global' : 'Administrador de Sede',
        roleKey: currentRole,
        assignedBranchIds: activeBranchId ? [activeBranchId] : (currentChain?.locations.map((l) => l.id) || []),
        active: true
      } as AdminUser : undefined);

  const canSwitchRole = Boolean(adminProfile) || ['admin_global', 'admin_general', 'admin_sede'].includes(currentRole) || isDemoMode;

  const isWideLayoutScreen =
    currentScreen === 'saas-console' ||
    currentScreen === 'cocina-kds' ||
    currentScreen === 'carta-sede' ||
    currentRole === 'admin_global' ||
    currentRole === 'admin_general';

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans antialiased selection:bg-secondary/20 selection:text-secondary">
      {qrBranchId && tenantSlug ? (
        <ScreenCartaQR slug={tenantSlug} branchId={qrBranchId} />
      ) : (<>
      {/* Authentication screens when not logged in or explicitly locked */}
      {(!isAuthenticated || currentScreen === 'pin-lock') ? (
        !tenantSlug ? (
          /* ROOT URL (/): Web de Presentación de ORDENA con botón de Login arriba a la derecha */
          isGlobalLoginOpen ? (
            <ScreenGlobalLogin
              onLoginSuccess={(adminUser: AdminUser) => {
                setIsAuthenticated(true);
                setAdminProfile(adminUser);
                const roleKey = adminUser.roleKey || 'admin_global';
                setCurrentRole(roleKey);
                setStaffUser({ name: adminUser.name, role: 'admin' });
                if (adminUser.brandId) {
                  setActiveChainId(adminUser.brandId);
                }
                if (adminUser.assignedBranchIds && adminUser.assignedBranchIds.length > 0) {
                  setActiveBranchId(adminUser.assignedBranchIds[0]);
                } else if (adminUser.branchId) {
                  setActiveBranchId(adminUser.branchId);
                }
                if (roleKey === 'admin_global') {
                  setCurrentScreen('saas-console');
                } else {
                  setCurrentScreen('dashboard-admin');
                }
                setIsGlobalLoginOpen(false);
              }}
              admins={admins}
              chains={chains}
              onNavigateToTenant={navigateToTenant}
              onBack={() => setIsGlobalLoginOpen(false)}
            />
          ) : (
            <ScreenLanding onOpenLogin={() => setIsGlobalLoginOpen(true)} />
          )
        ) : (
          /* TENANT URL (/:slug): Terminal del Restaurante aislada con PIN de 6 dígitos */
          <ScreenPinLock
            onUnlock={handleUnlock}
            activeChainId={activeChainId}
            activeBranchId={activeBranchId}
            branches={currentChain?.locations || []}
            onSelectBranch={(branchId) => setActiveBranchId(branchId)}
            activeChainName={currentChain?.name || 'Restaurante'}
            activeChainLogo={currentChain?.logoUrl}
            onBackToLanding={navigateToGlobal}
            onAdminLogin={() => setIsGlobalLoginOpen(true)}
          />
        )
      ) : (
        <div className="flex-1 flex flex-col w-full relative">
          {/* Main Content Layout Container */}
          <div
            className={`w-full mx-auto transition-all duration-300 flex-1 flex flex-col ${
              isMobileFrame && !isWideLayoutScreen
                ? 'max-w-[430px] my-4 shadow-2xl rounded-[36px] overflow-hidden border-8 border-slate-900 bg-surface ring-1 ring-black/10'
                : 'max-w-full'
            }`}
          >
            {/* Unified Role-Aware Header */}
            <HeaderTop
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
              currentRole={currentRole}
              staffName={staffUser.name}
              roleBadge={currentRole.replace('admin_', 'ADMIN ').toUpperCase()}
              alertsCount={readyPlatesCount}
              pendingDrinksCount={pendingDrinksCount}
              onOpenDrinksTray={() => setIsDrinksTrayOpen(true)}
              onOpenRoleSwitcher={canSwitchRole ? () => setIsRoleSwitcherOpen(true) : undefined}
              activeBranchName={currentBranch?.name || 'Sede Miraflores'}
              activeChainName={currentChain?.name}
              activeChainLogo={currentChain?.logoUrl}
              isCloudConnected={isCloudConnected}
              onLogout={handleLogout}
            />

            {/* Viewport content */}
            <main className="flex-1 flex flex-col pb-24">
              {currentScreen === 'mesas' && (
                <ScreenMesas
                  tables={tablesWithTicketDrinks}
                  kdsTickets={kdsTickets}
                  staffMembers={staffMembers}
                  onNavigate={handleNavigate}
                  onSelectTable={handleSelectTable}
                  onMarkDelivered={handleMarkDelivered}
                  onRequestBill={handleRequestBill}
                  onOpenTable={handleOpenTable}
                  onUpdateTableWaiter={handleUpdateTableWaiter}
                  onToggleDrinkServed={handleToggleDrinkServed}
                  onServeAllDrinks={handleServeAllDrinks}
                  onOpenDrinksTray={() => setIsDrinksTrayOpen(true)}
                  currentRole={currentRole}
                  currentUserName={staffUser.name}
                  qrOrders={qrOrders.filter((order) => order.status === 'pending_waiter')}
                  onConfirmQrOrder={handleConfirmQrOrder}
                />
              )}

              {currentScreen === 'dashboard-admin' && currentChain && currentAdmin && (
                <ScreenAdminDashboard
                  admin={currentAdmin}
                  chain={currentChain}
                  activeBranchId={activeBranchId}
                  tables={tables}
                  tickets={kdsTickets}
                  menuItems={currentBranchDishes}
                  staffMembers={staffMembers}
                  sales={sales}
                  tenantSales={tenantSales}
                  inventory={inventory}
                  cashShifts={cashShifts}
                  reservations={reservations}
                  attendance={attendance}
                  onSelectBranch={setActiveBranchId}
                  onNavigate={handleNavigate}
                  onSelectCartaTab={setCartaInitialTab}
                  onToggleItemAvailability={handleToggleItemAvailability}
                  onToggleBranchActive={(branchId) => handleToggleLocation(activeChainId, branchId)}
                  onAdjustInventory={handleAdjustInventory}
                  onOpenCashShift={handleOpenCashShift}
                  onCloseCashShift={handleCloseCashShift}
                  onCashMovement={handleCashMovement}
                  onCreateReservation={handleCreateReservation}
                  onUpdateReservationStatus={handleUpdateReservationStatus}
                  onToggleAttendance={handleToggleAttendance}
                  onSelectTable={handleSelectTable}
                  onOpenRoleSwitcher={canSwitchRole ? () => setIsRoleSwitcherOpen(true) : undefined}
                  onLogout={handleLogout}
                />
              )}

              {currentScreen === 'tomar-pedido' && (
                <ScreenTomarPedido
                  menuItems={currentBranchDishes}
                  cart={cart}
                  onUpdateQty={handleUpdateQty}
                  onSendComanda={handleSendComanda}
                  onNavigate={handleNavigate}
                  selectedTableNumber={
                    tables.find((t) => t.id === selectedTableId)?.number || '05'
                  }
                  selectedTable={tables.find((t) => t.id === selectedTableId)}
                  onRemoveTableDish={(dishIndex, reason) => {
                    if (selectedTableId) {
                      handleRemoveTableDish(selectedTableId, dishIndex, reason);
                    }
                  }}
                  onRemoveTableDrink={(drinkId, reason) => {
                    if (selectedTableId) {
                      handleRemoveTableDrink(selectedTableId, drinkId, reason);
                    }
                  }}
                  currentRole={currentRole}
                  currentUserName={staffUser.name}
                />
              )}

              {currentScreen === 'cocina-kds' && (
                <ScreenCocinaKDS
                  tickets={kdsTickets}
                  tables={tables}
                  onUpdateTicketStatus={handleUpdateTicketStatus}
                  onMarkDishReady={handleMarkDishReady}
                  onMarkDishServed={handleMarkDishServed}
                  onRemoveDish={handleRemoveDish}
                  onMarkAllDishesReady={handleMarkAllDishesReady}
                  onMarkAllDishesServed={handleMarkAllDishesServed}
                  onNavigate={handleNavigate}
                  currentRole={currentRole}
                  currentUserName={staffUser.name}
                  onOpenRoleSwitcher={canSwitchRole ? () => setIsRoleSwitcherOpen(true) : undefined}
                />
              )}

              {currentScreen === 'cuenta-cobro' && (
                <ScreenCuentaCobro
                  onNavigate={handleNavigate}
                  onTablePaidAndFreed={handleTablePaidAndFreed}
                  tables={tablesWithTicketDrinks}
                  currentRole={currentRole}
                  currentWaiterName={staffUser.name}
                  staffMembers={staffMembers}
                  selectedTableId={selectedTableId}
                  onSelectTable={handleSelectTable}
                  onUpdateTableWaiter={handleUpdateTableWaiter}
                />
              )}

              {currentScreen === 'carta-sede' && (
                <ScreenCartaSede
                  menuItems={currentBranchDishes}
                  onToggleItemAvailability={handleToggleItemAvailability}
                  onUpdateMenuItem={handleUpdateMenuItem}
                  onAddMenuItem={handleAddMenuItem}
                  onDeleteMenuItem={handleDeleteDishFromBranch}
                  onRestoreMenuItem={handleRestoreDishInBranch}
                  onResetBranchMenu={handleResetBranchMenu}
                  onNavigate={handleNavigate}
                  chains={chains}
                  admins={admins}
                  staff={staffMembers}
                  masterCartas={masterCartas}
                  onAddStaff={handleAddStaff}
                  onUpdateStaff={handleUpdateStaff}
                  onDeleteStaff={handleDeleteStaff}
                  onUpdateAdminBranches={handleUpdateAdminBranches}
                  activeChainId={activeChainId}
                  activeBranchId={activeBranchId}
                  onSelectBranch={setActiveBranchId}
                  onSelectChain={(chainId) => {
                    const found = chains.find((c) => c.id === chainId);
                    handleSelectChainAndBranch(chainId, found?.locations[0]?.id || '', 'carta-sede');
                  }}
                  onAddLocation={handleAddLocationToChain}
                  onUpdateLocation={handleUpdateLocation}
                  onUpdateChain={handleUpdateChain}
                  currentRole={currentRole}
                  currentAdminName={staffUser.name}
                  initialTab={cartaInitialTab}
                  onTabChange={setCartaInitialTab}
                />
              )}

              {currentScreen === 'saas-console' && (
                <ScreenSaaSConsole
                  chains={chains}
                  admins={admins}
                  masterCartas={masterCartas}
                  onAddChain={handleAddChain}
                  onUpdateChain={handleUpdateChain}
                  onDeleteChain={handleDeleteChain}
                  onAddLocationToChain={handleAddLocationToChain}
                  onUpdateLocation={handleUpdateLocation}
                  onDeleteLocation={handleDeleteLocation}
                  onToggleLocation={handleToggleLocation}
                  onNavigate={handleNavigate}
                  onSelectChainAndBranch={handleSelectChainAndBranch}
                  currentRole={currentRole}
                  onSwitchRole={handleSwitchRole}
                  onAddMasterCarta={handleAddMasterCarta}
                  onAssignCartaToChain={handleAssignCartaToChain}
                  onUpdateAdmin={handleUpdateAdmin}
                />
              )}
            </main>

            {/* Unified Role-Aware Bottom Navigation Bar */}
            <BottomNav
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
              currentRole={currentRole}
              readyPlatesCount={readyPlatesCount}
              cartCount={cartCount}
              pendingBillsCount={pendingBillsCount}
              pendingDrinksCount={pendingDrinksCount}
              onOpenDrinksTray={() => setIsDrinksTrayOpen(true)}
              onSelectCartaTab={(tab) => setCartaInitialTab(tab)}
              onOpenRoleSwitcher={canSwitchRole ? () => setIsRoleSwitcherOpen(true) : undefined}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Modal: Bandeja de Bebidas del Mozo */}
      <ModalBandejaBebidas
        isOpen={isDrinksTrayOpen}
        onClose={() => setIsDrinksTrayOpen(false)}
        tables={tablesWithTicketDrinks}
        onToggleDrinkServed={handleToggleDrinkServed}
        onServeAllDrinks={handleServeAllDrinks}
        currentRole={currentRole}
        currentUserName={staffUser.name}
      />

      {/* Modal: Selector de Perfil / Rol */}
      {canSwitchRole && (
        <ModalRoleSwitcher
          isOpen={isRoleSwitcherOpen}
          onClose={() => setIsRoleSwitcherOpen(false)}
          currentRole={currentRole}
          onSelectRole={handleSwitchRole}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
          onResetData={isDemoMode ? handleResetData : undefined}
          onLogout={handleLogout}
          admins={admins}
          staffMembers={staffMembers}
          activeBranchName={currentBranch?.name}
          activeChainName={currentChain?.name}
        />
      )}
      </>)}
    </div>
  );
}
