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
  MasterCarta
} from './types';
import {
  INITIAL_TABLES,
  INITIAL_MENU_ITEMS,
  INITIAL_KDS_TICKETS,
  INITIAL_CHAINS,
  INITIAL_ADMINS,
  INITIAL_STAFF,
  INITIAL_MASTER_CARTAS
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
import { ModalBandejaBebidas } from './components/ModalBandejaBebidas';
import {
  initRTDBSeedIfEmpty,
  subscribeToTables,
  subscribeToChains,
  subscribeToMasterCartas,
  subscribeToBranchMenus,
  subscribeToKDSTickets,
  subscribeToStaff,
  subscribeToAdmins,
  syncTablesToRTDB,
  syncKDSTicketsToRTDB,
  syncBranchMenusToRTDB,
  syncMasterCartasToRTDB,
  syncChainsToRTDB,
  syncStaffToRTDB,
  syncAdminsToRTDB,
  resetAllDataInRTDB
} from './services/rtdbService';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isGlobalLoginOpen, setIsGlobalLoginOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('pin-lock');
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

  const [cart, setCart] = useState<{ [cartKey: string]: CartItem }>({
    '401__Personal': {
      id: '401__Personal',
      dishId: 401,
      dishName: 'Ceviche de Pescado',
      category: 'ceviches',
      selectedSize: 'Personal',
      price: 20.0, // Exact menu price
      qty: 1
    },
    '701__Trío': {
      id: '701__Trío',
      dishId: 701,
      dishName: 'Trío Marino',
      category: 'trios',
      selectedSize: 'Trío',
      price: 15.0, // Exact menu price (S/ 15, S/ 20, S/ 25)
      qty: 1
    },
    '201__Vaso': {
      id: '201__Vaso',
      dishId: 201,
      dishName: 'Refresco Natural (Chicha Morada / Maracuyá)',
      category: 'bebidas',
      isDrink: true,
      selectedSize: 'Vaso',
      price: 2.0, // Exact menu price (Vaso S/ 2, 1/2 lt S/ 4, Litro S/ 8)
      qty: 1
    }
  });
  const [kdsTickets, setKdsTickets] = useState<KDSTicket[]>(INITIAL_KDS_TICKETS);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF);
  const [selectedTableId, setSelectedTableId] = useState<string>('mesa-05');
  const [isDrinksTrayOpen, setIsDrinksTrayOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<AppRole>('admin_sede');
  const [activeChainId, setActiveChainId] = useState<string>('la-barra');
  const [activeBranchId, setActiveBranchId] = useState<string>('loc-miraflores');
  const [cartaInitialTab, setCartaInitialTab] = useState<'carta' | 'sedes' | 'equipo'>('carta');
  const [staffUser, setStaffUser] = useState<{ name: string; role: 'mesero' | 'admin' }>({
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
          setActiveBranchId(foundChain.locations[0].id);
        }
      }
    }
  }, [tenantSlug, chains]);

  // Synchronize with Firebase Realtime Database in real time
  React.useEffect(() => {
    // 1. Check if database is empty; if so, populate with initial data
    initRTDBSeedIfEmpty().catch((err) => console.error('Error init seed:', err));

    // 2. Subscribe to real-time changes
    const unsubTables = subscribeToTables((cloudTables) => {
      if (cloudTables && cloudTables.length > 0) {
        setTables(cloudTables);
        setIsCloudConnected(true);
      }
    });

    const unsubChains = subscribeToChains((cloudChains) => {
      if (cloudChains && cloudChains.length > 0) {
        setChains(cloudChains);
        setIsCloudConnected(true);
      }
    });

    const unsubCartas = subscribeToMasterCartas((cloudCartas) => {
      if (cloudCartas && cloudCartas.length > 0) {
        setMasterCartas(cloudCartas);
        setIsCloudConnected(true);
      }
    });

    const unsubMenus = subscribeToBranchMenus((cloudMenus) => {
      if (cloudMenus && Object.keys(cloudMenus).length > 0) {
        setBranchMenus(cloudMenus);
        setIsCloudConnected(true);
      }
    });

    const unsubTickets = subscribeToKDSTickets((cloudTickets) => {
      if (cloudTickets) {
        setKdsTickets(cloudTickets);
        setIsCloudConnected(true);
      }
    });

    const unsubStaff = subscribeToStaff((cloudStaff) => {
      if (cloudStaff && cloudStaff.length > 0) {
        setStaffMembers(cloudStaff);
        setIsCloudConnected(true);
      }
    });

    const unsubAdmins = subscribeToAdmins((cloudAdmins) => {
      if (cloudAdmins && cloudAdmins.length > 0) {
        setAdmins(cloudAdmins);
        setIsCloudConnected(true);
      }
    });

    return () => {
      unsubTables();
      unsubChains();
      unsubCartas();
      unsubMenus();
      unsubTickets();
      unsubStaff();
      unsubAdmins();
    };
  }, []);

  // Sync state mutations to Firebase Realtime Database
  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    syncTablesToRTDB(tables);
  }, [tables]);

  React.useEffect(() => {
    if (isInitialMount.current) return;
    syncKDSTicketsToRTDB(kdsTickets);
  }, [kdsTickets]);

  React.useEffect(() => {
    if (isInitialMount.current) return;
    syncBranchMenusToRTDB(branchMenus);
  }, [branchMenus]);

  React.useEffect(() => {
    if (isInitialMount.current) return;
    syncMasterCartasToRTDB(masterCartas);
  }, [masterCartas]);

  React.useEffect(() => {
    if (isInitialMount.current) return;
    syncChainsToRTDB(chains);
  }, [chains]);

  React.useEffect(() => {
    if (isInitialMount.current) return;
    syncStaffToRTDB(staffMembers);
  }, [staffMembers]);

  React.useEffect(() => {
    if (isInitialMount.current) return;
    syncAdminsToRTDB(admins);
  }, [admins]);

  // Role switching handler with synchronized user profile and destination screen
  const handleSwitchRole = (role: AppRole) => {
    setCurrentRole(role);
    if (role === 'cocina') {
      setStaffUser({ name: 'Chef Mario Quispe', role: 'admin' });
      setCurrentScreen('cocina-kds');
    } else if (role === 'mesero') {
      setStaffUser({ name: 'Carlos Mendoza', role: 'mesero' });
      setCurrentScreen('mesas');
    } else if (role === 'admin_sede') {
      setStaffUser({ name: 'Roberto Morales', role: 'admin' });
      setCurrentScreen('mesas');
    } else if (role === 'admin_general') {
      setStaffUser({ name: 'Mariana Alva', role: 'admin' });
      setCurrentScreen('carta-sede');
      setCartaInitialTab('carta');
    } else if (role === 'admin_global') {
      setStaffUser({ name: 'José Manuel Vasquez Rivero', role: 'admin' });
      setCurrentScreen('saas-console');
    }
  };

  // Navegar a un tenant específico (actualiza la URL y el slug)
  const navigateToTenant = (slug: string) => {
    window.history.pushState({}, '', `/${slug}`);
    setTenantSlug(slug);
    setIsAuthenticated(false);
    setCurrentScreen('pin-lock');
    setStaffUser({ name: '', role: 'mesero' });
  };

  // Navegar de regreso al portal global
  const navigateToGlobal = () => {
    window.history.pushState({}, '', '/');
    setTenantSlug(null);
    setIsAuthenticated(false);
    setCurrentScreen('pin-lock');
    setStaffUser({ name: '', role: 'mesero' });
  };

  // Cerrar sesión y bloquear terminal (Solo se puede reingresar con PIN de 6 dígitos o credenciales de Admin Global)
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('pin-lock');
    setStaffUser({ name: '', role: 'mesero' });
  };

  // Guard navigation: requiring 6-digit PIN authentication
  const handleNavigate = (screen: ScreenType) => {
    if (screen === 'pin-lock') {
      handleLogout();
      return;
    }
    if (currentRole === 'cocina' && screen !== 'cocina-kds') {
      return;
    }
    setCurrentScreen(screen);
  };

  // Table actions
  const handleSelectTable = (tableId: string) => {
    setSelectedTableId(tableId);
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
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status: 'eating',
              notes: 'Platos servidos en mesa. Comensales atendidos.'
            }
          : t
      )
    );
  };

  const handleTablePaidAndFreed = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
              ...t,
              status: 'free',
              waiter: '', // Asignación de mesa queda en blanco al liberarse
              notes: 'Mesa desinfectada y libre',
              total: 0,
              timeInSalon: undefined,
              dishes: [],
              drinks: []
            }
          : t
      )
    );
  };

  // Reassign waiter for a table (Admin authority)
  const handleUpdateTableWaiter = (tableId: string, newWaiterName: string) => {
    const targetTable = tables.find((t) => t.id === tableId);
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, waiter: newWaiterName } : t))
    );
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
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const updatedDrinks = t.drinks?.map((d) =>
          d.id === drinkId
            ? {
                ...d,
                served: !d.served,
                servedAt: !d.served
                  ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : undefined
              }
            : d
        );
        return {
          ...t,
          drinks: updatedDrinks
        };
      })
    );
  };

  // Mark all drinks for a table as served
  const handleServeAllDrinks = (tableId: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const updatedDrinks = t.drinks?.map((d) => ({
          ...d,
          served: true,
          servedAt: d.servedAt || timeNow
        }));
        return {
          ...t,
          drinks: updatedDrinks
        };
      })
    );
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
    let ticketTable = '';
    let isAllReady = false;

    setKdsTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        ticketTable = t.table;
        const newItems = t.items.map((item, idx) => {
          if (idx !== itemIndex) return item;
          return {
            ...item,
            isReady: true,
            readyAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });
        isAllReady = newItems.every((i) => i.isReady);
        return {
          ...t,
          items: newItems,
          status: isAllReady ? 'ready' : t.status === 'pending' ? 'cooking' : t.status
        };
      })
    );

    if (ticketTable) {
      setTables((prev) =>
        prev.map((tbl) => {
          if (!ticketTable.includes(tbl.number)) return tbl;
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
        })
      );
    }
  };

  // 2. Waiter marks individual dish as served in salon
  const handleMarkDishServed = (ticketId: string, itemIndex: number) => {
    let ticketTable = '';
    let isAllServedAndReady = false;

    setKdsTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        ticketTable = t.table;
        const newItems = t.items.map((item, idx) => {
          if (idx !== itemIndex) return item;
          return {
            ...item,
            isReady: true,
            isServed: true,
            servedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });
        isAllServedAndReady = newItems.every((i) => i.isReady && i.isServed);
        return {
          ...t,
          items: newItems,
          // When all dishes are served, the ticket status becomes 'served' and it disappears from active view!
          status: isAllServedAndReady ? 'served' : t.status
        };
      })
    );

    if (ticketTable) {
      setTables((prev) =>
        prev.map((tbl) => {
          if (!ticketTable.includes(tbl.number)) return tbl;
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
        })
      );
    }
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
    let ticketTable = '';
    setKdsTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        ticketTable = t.table;
        return {
          ...t,
          status: 'ready',
          items: t.items.map((i) => ({ ...i, isReady: true }))
        };
      })
    );

    if (ticketTable) {
      setTables((prev) =>
        prev.map((tbl) => {
          if (!ticketTable.includes(tbl.number)) return tbl;
          return {
            ...tbl,
            status: 'ready',
            dishes: tbl.dishes?.map((d) => ({ ...d, status: 'ready' as const }))
          };
        })
      );
    }
  };

  // 5. Mark all dishes in a ticket served (card disappears immediately)
  const handleMarkAllDishesServed = (ticketId: string) => {
    let ticketTable = '';
    setKdsTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        ticketTable = t.table;
        return {
          ...t,
          status: 'served',
          items: t.items.map((i) => ({ ...i, isReady: true, isServed: true }))
        };
      })
    );

    if (ticketTable) {
      setTables((prev) =>
        prev.map((tbl) => {
          if (!ticketTable.includes(tbl.number)) return tbl;
          return {
            ...tbl,
            status: 'eating',
            notes: 'Todos los platos servidos por el mozo.',
            dishes: tbl.dishes?.map((d) => ({ ...d, status: 'served' as const }))
          };
        })
      );
    }
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
  const handleAddChain = (newChain: ChainBrand) => {
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
      brandId: newChain.id,
      branchName: initialLoc?.name || 'Sede Principal',
      branchId: initialLoc?.id || '',
      assignedBranchIds: initialLoc?.id ? [initialLoc.id] : [],
      initials: (initialLoc?.managerName || 'AS').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'AS',
      active: true
    };

    setAdmins((prev) => [genAdmin, sedeAdmin, ...prev]);
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
      setAdmins((prev) => [managerAdmin, ...prev]);
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

  // Update chain brand details (e.g. logo, name, branding, and designated general admin)
  const handleUpdateChain = (updatedChain: ChainBrand) => {
    setChains((prev) => prev.map((c) => (c.id === updatedChain.id ? updatedChain : c)));

    // Synchronize or assign the General Admin in admins list
    if (updatedChain.adminName || updatedChain.adminEmail) {
      setAdmins((prev) => {
        const existingIdx = prev.findIndex(
          (a) => a.brandId === updatedChain.id && a.roleKey === 'admin_general'
        );
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            name: updatedChain.adminName || updated[existingIdx].name,
            email: updatedChain.adminEmail || updated[existingIdx].email,
            phone: updatedChain.adminPhone || updated[existingIdx].phone,
            docType: updatedChain.adminDocType || updated[existingIdx].docType,
            docNumber: updatedChain.adminDocNumber || updated[existingIdx].docNumber,
            brand: updatedChain.name,
            assignedBranchIds: updatedChain.locations.map((loc) => loc.id),
            initials: (updatedChain.adminName || 'AG').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
          };
          return updated;
        } else {
          // If no admin_general was linked yet, register them now
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
            initials: (updatedChain.adminName || 'AG').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
            active: true
          };
          return [newGenAdmin, ...prev];
        }
      });
    }
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

    if (role === 'admin_sede') {
      const foundAdmin = admins.find((a) => a.name.toLowerCase() === name.toLowerCase() || a.roleKey === 'admin_sede');
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
      setCurrentScreen('carta-sede');
      setCartaInitialTab('carta');
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
  const handleUpdateAdminBranches = (adminId: string, branchIds: string[]) => {
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

    setCart({
      '401__Personal': {
        id: '401__Personal',
        dishId: 401,
        dishName: 'Ceviche de Pescado',
        category: 'ceviches',
        selectedSize: 'Personal',
        price: 20.0,
        qty: 1
      },
      '701__Trío': {
        id: '701__Trío',
        dishId: 701,
        dishName: 'Trío Marino',
        category: 'trios',
        selectedSize: 'Trío',
        price: 15.0,
        qty: 1
      },
      '201__Vaso': {
        id: '201__Vaso',
        dishId: 201,
        dishName: 'Refresco Natural (Chicha Morada / Maracuyá)',
        category: 'bebidas',
        isDrink: true,
        selectedSize: 'Vaso',
        price: 2.0,
        qty: 1
      }
    });
  };

  const isWaiterUser = currentRole === 'mesero';
  const isMyTableForAlerts = (tableWaiter?: string) => {
    if (!tableWaiter) return false;
    const waiterLower = tableWaiter.toLowerCase().trim();
    const currentLower = (staffUser.name || '').toLowerCase().trim();
    if (!waiterLower || !currentLower) return false;
    const currentFirst = currentLower.split(' ')[0];
    const tableFirst = waiterLower.split(' ')[0];
    return (
      waiterLower === currentLower ||
      (currentFirst && waiterLower.includes(currentFirst)) ||
      (tableFirst && currentLower.includes(tableFirst))
    );
  };

  const tablesForAlerts = isWaiterUser
    ? tables.filter((t) => isMyTableForAlerts(t.waiter))
    : tables;

  const ticketsForAlerts = isWaiterUser
    ? kdsTickets.filter((t) => isMyTableForAlerts(t.waiter))
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
      return isMyTableForAlerts(t.waiter);
    }
    return true;
  }).length;
  
  // Total pending drinks count (for waiter: only their assigned tables)
  const pendingDrinksCount = tablesForAlerts.reduce((acc, t) => {
    return acc + (t.drinks?.filter((d) => !d.served).length || 0);
  }, 0);

  const currentChain = chains.find((c) => c.id === activeChainId) || chains[0];
  const currentBranch = currentChain?.locations.find((l) => l.id === activeBranchId) || currentChain?.locations[0];
  const currentAdmin = admins.find((admin) => admin.name.toLowerCase() === staffUser.name.toLowerCase()) 
    || admins.find((admin) => admin.roleKey === currentRole)
    || (['admin_sede', 'admin_general', 'admin_global'].includes(currentRole) ? {
        id: 'adm-current',
        name: staffUser.name || 'Administrador',
        role: currentRole === 'admin_general' ? 'Administrador General' : currentRole === 'admin_global' ? 'Administrador Global' : 'Administrador de Sede',
        roleKey: currentRole,
        assignedBranchIds: activeBranchId ? [activeBranchId] : (currentChain?.locations.map((l) => l.id) || []),
        active: true
      } as AdminUser : undefined);

  const isWideLayoutScreen =
    currentScreen === 'saas-console' ||
    currentScreen === 'cocina-kds' ||
    currentScreen === 'carta-sede' ||
    currentRole === 'admin_global' ||
    currentRole === 'admin_general';

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans antialiased selection:bg-secondary/20 selection:text-secondary">
      {/* Authentication screens when not logged in or explicitly locked */}
      {(!isAuthenticated || currentScreen === 'pin-lock') ? (
        !tenantSlug ? (
          /* ROOT URL (/): Web de Presentación de ORDENA con botón de Login arriba a la derecha */
          isGlobalLoginOpen ? (
            <ScreenGlobalLogin
              onLoginSuccess={() => {
                setIsAuthenticated(true);
                setCurrentRole('admin_global');
                setStaffUser({ name: 'José Manuel Vasquez Rivero', role: 'admin' });
                setCurrentScreen('saas-console');
              }}
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
            onNavigate={handleNavigate}
            staffMembers={staffMembers}
            admins={admins}
            activeChainName={currentChain?.name || 'Restaurante'}
            activeChainLogo={currentChain?.logoUrl}
            isTenantMode={true}
            onBackToGlobalLogin={navigateToGlobal}
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
              onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
              activeBranchName={currentBranch?.name || 'Sede Miraflores'}
              activeChainName={currentChain?.name}
              activeChainLogo={currentChain?.logoUrl}
              isCloudConnected={isCloudConnected}
              onLogout={handleLogout}
            />

            {/* Viewport content */}
            <main className="flex-1 flex flex-col">
              {currentScreen === 'mesas' && (
                <ScreenMesas
                  tables={tables}
                  staffMembers={staffMembers}
                  onNavigate={handleNavigate}
                  onSelectTable={handleSelectTable}
                  onMarkDelivered={handleMarkDelivered}
                  onOpenTable={handleOpenTable}
                  onUpdateTableWaiter={handleUpdateTableWaiter}
                  onToggleDrinkServed={handleToggleDrinkServed}
                  onServeAllDrinks={handleServeAllDrinks}
                  onOpenDrinksTray={() => setIsDrinksTrayOpen(true)}
                  currentRole={currentRole}
                  currentUserName={staffUser.name}
                />
              )}

              {currentScreen === 'dashboard-admin' && currentChain && currentAdmin && (
                <ScreenAdminDashboard
                  admin={currentAdmin}
                  chain={currentChain}
                  activeBranchId={activeBranchId}
                  tables={tables}
                  tickets={kdsTickets}
                  onSelectBranch={setActiveBranchId}
                  onNavigate={handleNavigate}
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
                  onUpdateTicketStatus={handleUpdateTicketStatus}
                  onMarkDishReady={handleMarkDishReady}
                  onMarkDishServed={handleMarkDishServed}
                  onRemoveDish={handleRemoveDish}
                  onMarkAllDishesReady={handleMarkAllDishesReady}
                  onMarkAllDishesServed={handleMarkAllDishesServed}
                  onNavigate={handleNavigate}
                  currentRole={currentRole}
                  currentUserName={staffUser.name}
                  onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
                />
              )}

              {currentScreen === 'cuenta-cobro' && (
                <ScreenCuentaCobro
                  onNavigate={handleNavigate}
                  onTablePaidAndFreed={handleTablePaidAndFreed}
                  tables={tables}
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
              onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Modal: Bandeja de Bebidas del Mozo */}
      <ModalBandejaBebidas
        isOpen={isDrinksTrayOpen}
        onClose={() => setIsDrinksTrayOpen(false)}
        tables={tables}
        onToggleDrinkServed={handleToggleDrinkServed}
        onServeAllDrinks={handleServeAllDrinks}
        currentRole={currentRole}
        currentUserName={staffUser.name}
      />

      {/* Modal: Selector de Perfil / Rol */}
      <ModalRoleSwitcher
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        currentRole={currentRole}
        onSelectRole={handleSwitchRole}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        onResetData={handleResetData}
        onLogout={handleLogout}
      />
    </div>
  );
}
