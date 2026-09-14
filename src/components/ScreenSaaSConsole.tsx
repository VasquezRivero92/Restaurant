import React, { useState } from 'react';
import { ChainBrand, AdminUser, ScreenType, BranchLocation, AppRole, MasterCarta, MenuItem } from '../types';

interface ScreenSaaSConsoleProps {
  chains: ChainBrand[];
  admins: AdminUser[];
  masterCartas?: MasterCarta[];
  onAddChain: (newChain: ChainBrand) => void;
  onAddLocationToChain: (chainId: string, newLocation: BranchLocation, managerAdmin?: AdminUser) => void;
  onToggleLocation: (chainId: string, locationId: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectChainAndBranch?: (chainId: string, branchId: string, screen?: ScreenType) => void;
  currentRole?: AppRole;
  onSwitchRole?: (role: AppRole) => void;
  onAddMasterCarta?: (newCarta: MasterCarta) => void;
  onAssignCartaToChain?: (chainId: string, cartaId: string) => void;
  onUpdateAdmin?: (admin: AdminUser) => void;
}

export const ScreenSaaSConsole: React.FC<ScreenSaaSConsoleProps> = ({
  chains,
  admins,
  masterCartas = [],
  onAddChain,
  onAddLocationToChain,
  onToggleLocation,
  onNavigate,
  onSelectChainAndBranch,
  currentRole = 'admin_global',
  onSwitchRole,
  onAddMasterCarta,
  onAssignCartaToChain,
  onUpdateAdmin
}) => {
  // Modals state
  const [showModalNewChain, setShowModalNewChain] = useState(false);
  const [showModalNewLocation, setShowModalNewLocation] = useState(false);
  const [selectedChainForLocation, setSelectedChainForLocation] = useState<string>(chains[0]?.id || '');
  const [editingAdminForPin, setEditingAdminForPin] = useState<AdminUser | null>(null);
  const [newAdminPin, setNewAdminPin] = useState<string>('');
  
  // Search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [adminTab, setAdminTab] = useState<'todos' | 'admin_global' | 'admin_general' | 'admin_sede'>('todos');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Main View Navigation Tabs
  const [mainViewTab, setMainViewTab] = useState<'restaurantes' | 'cartas' | 'admins'>('restaurantes');

  // Modal: Assign Carta to Restaurant
  const [showModalAssignCarta, setShowModalAssignCarta] = useState(false);
  const [selectedChainForCarta, setSelectedChainForCarta] = useState<string>(chains[0]?.id || '');
  const [selectedCartaToAssign, setSelectedCartaToAssign] = useState<string>(masterCartas[0]?.id || 'carta-la-barra');

  // Modal: New Master Carta
  const [showModalNewCarta, setShowModalNewCarta] = useState(false);
  const [newCartaName, setNewCartaName] = useState('');
  const [newCartaDesc, setNewCartaDesc] = useState('');
  const [newCartaCloneSource, setNewCartaCloneSource] = useState<string>(masterCartas[0]?.id || 'carta-la-barra');
  const [customDishesForNewCarta, setCustomDishesForNewCarta] = useState<MenuItem[]>([]);
  const [dishNameInput, setDishNameInput] = useState('');
  const [dishCategoryInput, setDishCategoryInput] = useState<MenuItem['category']>('ceviches');
  const [dishPriceInput, setDishPriceInput] = useState<number>(20.0);
  const [dishSizesInput, setDishSizesInput] = useState<{ name: string; price: number }[]>([
    { name: 'Personal', price: 20.0 },
    { name: 'Mediano', price: 28.0 },
    { name: 'Familiar', price: 38.0 }
  ]);
  const [sizeNameInput, setSizeNameInput] = useState('');
  const [sizePriceInput, setSizePriceInput] = useState<number>(20.0);

  // Modal: Preview Master Carta dishes
  const [previewCarta, setPreviewCarta] = useState<MasterCarta | null>(null);

  const handleOpenAssignModal = (chainId?: string, cartaId?: string) => {
    if (chainId) setSelectedChainForCarta(chainId);
    if (cartaId) setSelectedCartaToAssign(cartaId);
    setShowModalAssignCarta(true);
  };

  const handleConfirmAssignCarta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChainForCarta || !selectedCartaToAssign) {
      showToast('Selecciona el restaurante y la carta a asignar');
      return;
    }
    const targetChain = chains.find((c) => c.id === selectedChainForCarta);
    const targetCarta = masterCartas.find((c) => c.id === selectedCartaToAssign);
    if (onAssignCartaToChain) {
      onAssignCartaToChain(selectedChainForCarta, selectedCartaToAssign);
    }
    setShowModalAssignCarta(false);
    showToast(
      `¡Carta "${targetCarta?.name || 'Asignada'}" vinculada a "${targetChain?.name}"! Sus ${targetChain?.locations.length || 0} sedes ahora cuentan con estos platos.`
    );
  };

  const handleAddSizeToNewCartaDish = () => {
    if (!sizeNameInput.trim() || sizePriceInput <= 0) {
      showToast('Ingresa un nombre y precio válido para el tamaño');
      return;
    }
    const updated = [...dishSizesInput, { name: sizeNameInput.trim(), price: Number(sizePriceInput) }].sort(
      (a, b) => a.price - b.price
    );
    setDishSizesInput(updated);
    setDishPriceInput(updated[0].price);
    setSizeNameInput('');
    showToast(`Tamaño agregado (S/ ${updated[0].price.toFixed(2)})`);
  };

  const handleRemoveSizeFromNewCartaDish = (idx: number) => {
    const updated = dishSizesInput.filter((_, i) => i !== idx).sort((a, b) => a.price - b.price);
    setDishSizesInput(updated);
    if (updated.length > 0) setDishPriceInput(updated[0].price);
  };

  const handleAddDishToNewCartaList = () => {
    if (!dishNameInput.trim()) {
      showToast('Ingresa el nombre del plato');
      return;
    }
    const sortedSizes = dishSizesInput.length > 0 ? [...dishSizesInput].sort((a, b) => a.price - b.price) : undefined;
    const basePrice = sortedSizes && sortedSizes.length > 0 ? sortedSizes[0].price : Number(dishPriceInput) || 20.0;
    const newDish: MenuItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: dishNameInput.trim(),
      category: dishCategoryInput,
      price: basePrice,
      sizes: sortedSizes,
      description: 'Especialidad culinaria preparada con insumos frescos seleccionados.',
      available: true,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      isDrink: dishCategoryInput === 'bebidas'
    };
    setCustomDishesForNewCarta((prev) => [newDish, ...prev]);
    setDishNameInput('');
    showToast(`Plato "${newDish.name}" añadido a la lista (${sortedSizes ? sortedSizes.length : 1} precios)`);
  };

  const handleCreateMasterCarta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCartaName.trim()) {
      showToast('Ingresa un nombre para la nueva Carta Maestra');
      return;
    }
    let baseDishes: MenuItem[] = [];
    if (newCartaCloneSource !== 'empty') {
      const sourceCarta = masterCartas.find((c) => c.id === newCartaCloneSource);
      if (sourceCarta) {
        baseDishes = JSON.parse(JSON.stringify(sourceCarta.dishes));
      }
    }
    const combinedDishes = [...customDishesForNewCarta, ...baseDishes];

    const newCarta: MasterCarta = {
      id: `carta-${Date.now()}`,
      name: newCartaName.trim(),
      description: newCartaDesc.trim() || 'Carta maestra oficial para restaurantes de la plataforma',
      dishes: combinedDishes,
      createdAt: new Date().toLocaleDateString('es-PE'),
      assignedChainIds: []
    };

    if (onAddMasterCarta) {
      onAddMasterCarta(newCarta);
    }
    setShowModalNewCarta(false);
    setNewCartaName('');
    setNewCartaDesc('');
    setCustomDishesForNewCarta([]);
    showToast(`¡Carta Maestra "${newCarta.name}" creada con ${combinedDishes.length} platos!`);
  };

  // Form state: New Restaurant / Chain
  const [chainForm, setChainForm] = useState({
    name: '',
    slug: '',
    legalName: '',
    ruc: '',
    plan: 'Enterprise' as 'Enterprise' | 'Pro' | 'Básico',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    initialLocName: 'Sede Central',
    initialLocAddress: '',
    initialLocDistrict: 'Miraflores',
    initialLocTables: 16,
    initialLocManager: ''
  });

  // Form state: New Branch / Sede
  const [locationForm, setLocationForm] = useState({
    chainId: chains[0]?.id || '',
    name: '',
    address: '',
    district: 'San Isidro',
    city: 'Lima',
    phone: '',
    tables: 14,
    managerName: '',
    managerEmail: '',
    managerPhone: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Add Sede modal pre-selecting a specific restaurant
  const handleOpenAddLocation = (chainId?: string) => {
    const targetId = chainId || chains[0]?.id || '';
    setSelectedChainForLocation(targetId);
    setLocationForm((prev) => ({
      ...prev,
      chainId: targetId,
      name: '',
      address: '',
      phone: '',
      tables: 14,
      managerName: '',
      managerEmail: '',
      managerPhone: ''
    }));
    setShowModalNewLocation(true);
  };

  // Submit New Restaurant
  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chainForm.name.trim()) {
      showToast('Ingresa el nombre comercial de la cevichería o restaurante');
      return;
    }

    const newChainId = `chain-${Date.now()}`;
    const initialLocationId = `loc-${Date.now()}-1`;
    const genAdminName = chainForm.adminName.trim() || 'Admin General';
    const locAdminName = chainForm.initialLocManager.trim() || genAdminName;

    const initialLocation: BranchLocation = {
      id: initialLocationId,
      name: chainForm.initialLocName || 'Sede Principal',
      address: chainForm.initialLocAddress || 'Av. Principal 100',
      district: chainForm.initialLocDistrict || 'Miraflores',
      city: 'Lima',
      phone: chainForm.adminPhone || '+51 1 445-0000',
      tables: Number(chainForm.initialLocTables) || 16,
      todaySales: 0,
      active: true,
      managerName: locAdminName,
      managerEmail: chainForm.adminEmail || 'sede@restaurante.pe',
      managerPhone: chainForm.adminPhone
    };

    const computedSlug = chainForm.slug.trim()
      ? chainForm.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : chainForm.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newChain: ChainBrand = {
      id: newChainId,
      slug: computedSlug,
      name: chainForm.name.trim(),
      legalName: chainForm.legalName.trim() || `${chainForm.name.trim()} S.A.C.`,
      ruc: chainForm.ruc.trim() || '20' + Math.floor(100000000 + Math.random() * 900000000),
      plan: chainForm.plan,
      status: 'Activa',
      adminName: genAdminName,
      adminEmail: chainForm.adminEmail.trim() || 'admin@cadena.pe',
      adminPhone: chainForm.adminPhone.trim() || '+51 987 654 321',
      locationsCount: 1,
      locations: [initialLocation]
    };

    onAddChain(newChain);
    setShowModalNewChain(false);
    setChainForm({
      name: '',
      slug: '',
      legalName: '',
      ruc: '',
      plan: 'Enterprise',
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      initialLocName: 'Sede Central',
      initialLocAddress: '',
      initialLocDistrict: 'Miraflores',
      initialLocTables: 16,
      initialLocManager: ''
    });
    showToast(`¡Restaurante "${newChain.name}" registrado con su Sede Matriz y desplegado en la nube!`);
  };

  // Submit New Branch (Sede)
  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationForm.name.trim()) {
      showToast('Por favor ingresa el nombre de la nueva sede');
      return;
    }

    const targetChain = chains.find((c) => c.id === locationForm.chainId) || chains[0];
    if (!targetChain) {
      showToast('Error: No se encontró el restaurante seleccionado');
      return;
    }

    const newLocId = `loc-${Date.now()}`;
    const managerName = locationForm.managerName.trim() || 'Admin Asignado';

    const newLocation: BranchLocation = {
      id: newLocId,
      name: locationForm.name.trim(),
      address: locationForm.address.trim() || 'Av. Comercial 500',
      district: locationForm.district.trim() || 'San Isidro',
      city: locationForm.city.trim() || 'Lima',
      phone: locationForm.phone.trim() || '+51 1 220-4400',
      tables: Number(locationForm.tables) || 14,
      todaySales: 0,
      active: true,
      managerName: managerName,
      managerEmail: locationForm.managerEmail.trim() || `${managerName.toLowerCase().replace(/\s+/g, '.')}@${targetChain.name.toLowerCase().replace(/\s+/g, '')}.pe`,
      managerPhone: locationForm.managerPhone.trim() || '+51 990 000 000'
    };

    const newManagerAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      name: managerName,
      email: newLocation.managerEmail || 'admin.sede@restaurante.pe',
      phone: newLocation.managerPhone,
      role: 'Administrador de Sede',
      roleKey: 'admin_sede',
      brand: targetChain.name,
      brandId: targetChain.id,
      branchName: newLocation.name,
      branchId: newLocId,
      initials: managerName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'AS',
      active: true
    };

    onAddLocationToChain(targetChain.id, newLocation, newManagerAdmin);
    setShowModalNewLocation(false);
    showToast(`¡Nueva sede "${newLocation.name}" agregada con éxito a "${targetChain.name}"!`);
  };

  // Total metrics calculation
  const totalLocations = chains.reduce((sum, c) => sum + c.locations.length, 0);
  const totalTables = chains.reduce(
    (sum, c) => sum + c.locations.reduce((lSum, l) => lSum + (l.tables || 0), 0),
    0
  );
  const totalTodaySales = chains.reduce(
    (sum, c) => sum + c.locations.reduce((lSum, l) => lSum + (l.todaySales || 0), 0),
    0
  );

  const filteredChains = chains.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.ruc.includes(q) ||
      c.adminName.toLowerCase().includes(q) ||
      c.locations.some((l) => l.name.toLowerCase().includes(q) || l.district?.toLowerCase().includes(q))
    );
  });

  const filteredAdmins = admins.filter((a) => {
    if (adminTab === 'admin_global') return a.roleKey === 'admin_global';
    if (adminTab === 'admin_general') return a.roleKey === 'admin_general';
    if (adminTab === 'admin_sede') return a.roleKey === 'admin_sede';
    return true;
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface pb-28 pt-2">
      <div className="max-w-7xl mx-auto px-4 w-full">
        {/* Top Authority Web Banner for Administrador Global */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0A2540] to-slate-900 text-white rounded-2xl p-5 sm:p-6 mb-6 shadow-xl border border-white/10 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-inner shrink-0">
                <span className="material-symbols-outlined text-[30px]">public</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-extrabold text-[11px] tracking-wider uppercase border border-teal-400/30">
                    PANEL WEB • ADMINISTRADOR GLOBAL
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[11px] font-medium">
                    Acceso Total SaaS Multi-Empresa
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mt-1">
                  Gestión Central de Restaurantes & Sedes
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-2xl">
                  Controla todas las marcas gastronómicas. Como <strong className="text-teal-300">Administrador Global</strong> puedes crear restaurantes, desplegar sedes por cada restaurante y auditar a los administradores generales y de sede.
                </p>
              </div>
            </div>

            {/* Quick Actions in Banner */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setShowModalNewChain(true)}
                className="h-11 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add_business</span>
                <span>+ Agregar Restaurante</span>
              </button>

              <button
                onClick={() => handleOpenAddLocation()}
                className="h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-teal-300">add_location_alt</span>
                <span>+ Agregar Sede</span>
              </button>
            </div>
          </div>

          {/* Quick Perspective Switcher for Testing/Demonstrating Hierarchy */}
          {onSwitchRole && (
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="material-symbols-outlined text-[18px] text-teal-300">shield_person</span>
                <span className="font-bold">Simular Navegación de Perfiles:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'admin_global', label: '1. Admin Global (Web)', icon: 'public' },
                  { key: 'admin_general', label: '2. Admin General (Restaurante)', icon: 'corporate_fare' },
                  { key: 'admin_sede', label: '3. Admin Sede (Local)', icon: 'storefront' },
                  { key: 'mesero', label: '4. Mozo Salón', icon: 'room_service' }
                ].map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      onSwitchRole(r.key as AppRole);
                      showToast(`Cambiado a perfil: ${r.label}`);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      currentRole === r.key
                        ? 'bg-teal-400 text-slate-950 shadow-sm ring-2 ring-white/30'
                        : 'bg-white/10 hover:bg-white/15 text-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Key Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Metric 1: Total Restaurants */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Restaurantes Registrados
              </span>
              <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-extrabold text-3xl text-on-surface">{chains.length}</span>
              <span className="text-xs text-on-surface-variant font-bold">marcas / clientes SaaS</span>
            </div>
            <div className="mt-2 text-xs text-secondary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Todos los tenants con aislamiento de base de datos</span>
            </div>
          </div>

          {/* Metric 2: Total Branches */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Sedes Activas Totales
              </span>
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">store</span>
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-extrabold text-3xl text-secondary">{totalLocations}</span>
              <span className="text-xs text-on-surface-variant font-bold">locales físicos en vivo</span>
            </div>
            <div className="mt-2 text-xs text-on-surface-variant flex items-center justify-between">
              <span>{totalTables} mesas desplegadas</span>
              <span className="text-emerald-700 font-bold">100% operativas</span>
            </div>
          </div>

          {/* Metric 3: Consolidated Sales */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Ventas Consolidadas Hoy
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-extrabold text-3xl text-primary">S/ {totalTodaySales.toLocaleString()}</span>
            </div>
            <div className="mt-2 text-xs text-on-surface-variant flex items-center justify-between">
              <span>Suma de todas las sedes</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container font-bold text-secondary">
                En vivo
              </span>
            </div>
          </div>

          {/* Metric 4: Admin Directory Count */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Admins Generales & Sede
              </span>
              <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">badge</span>
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-extrabold text-3xl text-on-surface">{admins.length}</span>
              <span className="text-xs text-on-surface-variant font-bold">usuarios autorizados</span>
            </div>
            <div className="mt-2 text-xs text-on-surface-variant flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>1 Global • {chains.length} Generales • {totalLocations} Sedes</span>
            </div>
          </div>
        </div>

        {/* Global SaaS Main View Tabs */}
        <div className="flex items-center gap-2 mb-6 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30">
          <button
            onClick={() => setMainViewTab('restaurantes')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mainViewTab === 'restaurantes'
                ? 'bg-surface-container-lowest text-primary shadow-sm ring-1 ring-primary/20'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
            <span>Restaurantes & Sedes ({chains.length})</span>
          </button>

          <button
            onClick={() => setMainViewTab('cartas')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mainViewTab === 'cartas'
                ? 'bg-surface-container-lowest text-amber-700 shadow-sm ring-1 ring-amber-500/30'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-amber-600">restaurant_menu</span>
            <span>Cartas Maestras & Asignación ({masterCartas.length})</span>
          </button>

          <button
            onClick={() => setMainViewTab('admins')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mainViewTab === 'admins'
                ? 'bg-surface-container-lowest text-primary shadow-sm ring-1 ring-primary/20'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>Directorio de Admins ({admins.length})</span>
          </button>
        </div>

        {/* TAB 1: RESTAURANTES & SEDES */}
        {mainViewTab === 'restaurantes' && (
          <>
            {/* Filter & Search Bar */}
            <div className="bg-surface-container-lowest p-3 sm:p-4 rounded-xl shadow-sm border border-outline-variant/30 mb-6 flex flex-col md:flex-row items-center gap-3 justify-between">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por restaurante, RUC, administrador o distrito de sede..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-low text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container border border-outline-variant/20"
                />
              </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
            <button
              onClick={() => setShowModalNewChain(true)}
              className="h-10 px-3.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_business</span>
              <span>+ Nuevo Restaurante</span>
            </button>

            <button
              onClick={() => handleOpenAddLocation()}
              className="h-10 px-3.5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
              <span>+ Nueva Sede</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Restaurants & their Locations (Sedes) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Left Column (8 cols): Restaurants List with Expanded Branches */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">storefront</span>
                  <span>Restaurantes & Sedes Desplegadas</span>
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Cada restaurante cuenta con su Administrador General y sus sedes con sus respectivos Administradores de Sede.
                </p>
              </div>
              <span className="text-xs text-on-surface-variant font-bold">
                {filteredChains.length} restaurantes encontrados
              </span>
            </div>

            {filteredChains.map((chain) => (
              <div
                key={chain.id}
                className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Brand Card Top Accent Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-teal-400"></div>

                <div className="p-5 sm:p-6 flex flex-col gap-5">
                  {/* Restaurant Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/20">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-extrabold text-xl shadow-sm border border-secondary/20 shrink-0">
                        {chain.id === 'la-barra' ? (
                          <span className="material-symbols-outlined text-[28px] text-teal-300">phishing</span>
                        ) : (
                          chain.name.substring(0, 2).toUpperCase()
                        )}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-lg text-primary">{chain.name}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            {chain.status}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-surface-container font-bold text-[10px] text-on-surface-variant uppercase">
                            Plan {chain.plan}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                          <span className="font-bold text-on-surface">RUC: {chain.ruc}</span>
                          <span>•</span>
                          <span className="truncate max-w-[240px]">{chain.legalName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Button to Add Sede directly to THIS Restaurant */}
                    <button
                      onClick={() => handleOpenAddLocation(chain.id)}
                      className="h-10 px-3.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 font-bold text-xs flex items-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer shadow-sm"
                      title={`Agregar una nueva sede a ${chain.name}`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-teal-700">add_location_alt</span>
                      <span>+ Agregar Sede a este Restaurante</span>
                    </button>
                  </div>

                  {/* Direct Access Link Box for Multi-Tenant Client Access */}
                  {(() => {
                    const tenantSlug = chain.slug || chain.id;
                    const directUrl = `${window.location.origin}/${tenantSlug}`;
                    return (
                      <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-700 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[18px]">link</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                              <span>Link Exclusivo del Restaurante</span>
                              <span className="text-[9px] bg-teal-100 text-teal-800 font-extrabold px-1.5 py-0.2 rounded">Acceso Personal</span>
                            </span>
                            <span className="font-mono text-xs text-primary font-bold truncate select-all">
                              {directUrl}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(directUrl);
                              showToast(`¡Link copiado al portapapeles: ${directUrl}!`);
                            }}
                            className="h-8 px-3 rounded-lg bg-surface-container-highest hover:bg-teal-600 hover:text-white text-on-surface font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            title="Copiar link para enviar al cliente o personal"
                          >
                            <span className="material-symbols-outlined text-[15px]">content_copy</span>
                            <span>Copiar Link</span>
                          </button>

                          <a
                            href={`/${tenantSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            title="Abrir este restaurante en una nueva pestaña"
                          >
                            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                            <span>Abrir</span>
                          </a>
                        </div>
                      </div>
                    );
                  })()}

                  {/* General Administrator Badge for this Restaurant */}
                  <div className="bg-primary-container/15 rounded-xl p-3.5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {chain.adminName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'AG'}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.2 rounded bg-primary text-on-primary font-extrabold text-[10px] uppercase tracking-wider">
                            ADMINISTRADOR GENERAL
                          </span>
                          <span className="text-xs text-on-surface-variant">de la marca</span>
                        </div>
                        <span className="font-extrabold text-sm text-primary mt-0.5">{chain.adminName}</span>
                        <span className="text-xs text-on-surface-variant">
                          {chain.adminEmail} • {chain.adminPhone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (onSelectChainAndBranch) {
                            onSelectChainAndBranch(chain.id, chain.locations[0]?.id || '', 'carta-sede');
                          } else {
                            onNavigate('carta-sede');
                          }
                          showToast(`Accediendo como Administrador General de ${chain.name}`);
                        }}
                        className="h-9 px-3 rounded-lg bg-surface-container-highest hover:bg-primary hover:text-white text-on-surface font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                        <span>Gestionar Marca</span>
                      </button>
                    </div>
                  </div>

                  {/* Carta Asignada a este Restaurante (Multi-Sede Sync) */}
                  {(() => {
                    const assignedCarta = masterCartas.find((c) => c.id === chain.assignedCartaId) || masterCartas[0];
                    return (
                      <div className="bg-amber-500/10 rounded-xl p-3.5 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                            <span className="material-symbols-outlined text-[22px] text-amber-700">restaurant_menu</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.2 rounded bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                                CARTA ASIGNADA
                              </span>
                              <span className="text-xs text-amber-900 font-extrabold">
                                {assignedCarta ? `${assignedCarta.name} (${assignedCarta.dishes.length} platos)` : 'Sin carta asignada'}
                              </span>
                            </div>
                            <span className="text-xs text-on-surface-variant mt-0.5">
                              Distribuida a todas sus {chain.locations.length} sedes. Cada sede puede agregar, eliminar o pausar platos.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenAssignModal(chain.id, chain.assignedCartaId)}
                            className="h-9 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                            <span>Asignar / Cambiar Carta</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Branches (Sedes) Section for this Restaurant */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[18px] text-secondary">store</span>
                        <span>Sedes del Restaurante ({chain.locations.length})</span>
                      </div>
                      <button
                        onClick={() => handleOpenAddLocation(chain.id)}
                        className="text-xs text-secondary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>Aperturar Nueva Sede</span>
                      </button>
                    </div>

                    {/* Sede Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {chain.locations.map((loc) => (
                        <div
                          key={loc.id}
                          className={`rounded-xl p-3.5 flex flex-col justify-between gap-3 border transition-all ${
                            loc.active
                              ? 'bg-surface-container-low/70 border-outline-variant/30 hover:border-secondary/40 shadow-sm'
                              : 'bg-red-50/40 border-red-200 opacity-80'
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-extrabold text-sm text-on-surface truncate">
                                {loc.name}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  loc.active
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {loc.active ? 'Activa' : 'Pausada'}
                              </span>
                            </div>
                            <span className="text-xs text-on-surface-variant truncate">
                              📍 {loc.address} {loc.district ? `(${loc.district})` : ''}
                            </span>
                          </div>

                          {/* Branch Manager (Administrador de Sede) */}
                          <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/20 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                                {loc.managerName.charAt(0) || 'S'}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-tight">
                                    ADMIN DE SEDE:
                                  </span>
                                </div>
                                <span className="font-bold text-xs text-on-surface truncate">
                                  {loc.managerName}
                                </span>
                              </div>
                            </div>
                            {loc.phone && (
                              <span className="text-[10px] text-on-surface-variant font-mono whitespace-nowrap">
                                {loc.phone}
                              </span>
                            )}
                          </div>

                          {/* Sede Footer Stats & Action Buttons */}
                          <div className="flex items-center justify-between pt-1 text-xs border-t border-outline-variant/15">
                            <div className="flex items-center gap-2 text-on-surface-variant">
                              <span className="font-medium">{loc.tables} Mesas</span>
                              <span>•</span>
                              <span className="font-bold text-secondary">
                                {loc.todaySales > 0 ? `S/ ${loc.todaySales.toLocaleString()} hoy` : 'Recién aperturada'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onToggleLocation(chain.id, loc.id)}
                                className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                                  loc.active
                                    ? 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                                title={loc.active ? 'Pausar operaciones en esta sede' : 'Activar operaciones en esta sede'}
                              >
                                {loc.active ? 'Pausar' : 'Activar'}
                              </button>

                              <button
                                onClick={() => {
                                  if (onSelectChainAndBranch) {
                                    onSelectChainAndBranch(chain.id, loc.id, 'mesas');
                                  } else {
                                    onNavigate('mesas');
                                  }
                                  showToast(`Ingresando al salón de ${loc.name}`);
                                }}
                                className="px-2.5 py-1 rounded bg-secondary text-on-secondary hover:bg-secondary/90 font-bold text-[11px] flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                                title="Ingresar a ver el salón y mesas de esta sede"
                              >
                                <span>Ver Salón</span>
                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (4 cols): Quick Add Form + Admin Directory */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Quick Sede Aperture Widget */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-primary">Aperturar Nueva Sede</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-extrabold text-[10px]">
                  Global
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Despliega una nueva sucursal para cualquier restaurante y nómbrale su Administrador de Sede responsable.
              </p>

              <button
                onClick={() => handleOpenAddLocation()}
                className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">domain_add</span>
                <span>Aperturar Sede en Restaurante</span>
              </button>
            </div>

            {/* Administrators Directory with Roles Filtering */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-primary">Directorio de Administradores</h3>
                </div>
                <span className="text-xs text-on-surface-variant font-bold">{admins.length} usuarios</span>
              </div>

              {/* Role filter pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                {[
                  { key: 'todos', label: 'Todos' },
                  { key: 'admin_global', label: 'Global' },
                  { key: 'admin_general', label: 'Generales' },
                  { key: 'admin_sede', label: 'Sedes' }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setAdminTab(t.key as typeof adminTab)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      adminTab === t.key
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Admins List */}
              <div className="flex flex-col divide-y divide-surface-container max-h-[380px] overflow-y-auto pr-1">
                {filteredAdmins.map((admin) => (
                  <div key={admin.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          admin.roleKey === 'admin_global'
                            ? 'bg-purple-600 text-white'
                            : admin.roleKey === 'admin_general'
                            ? 'bg-teal-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {admin.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-on-surface truncate">
                            {admin.name}
                          </span>
                          {admin.assignedBranchIds && admin.assignedBranchIds.length > 1 && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 font-extrabold text-[8px] uppercase">
                              Multi-Sede ({admin.assignedBranchIds.length})
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-on-surface-variant truncate">
                          {admin.brand} {admin.branchName ? `• ${admin.branchName}` : ''}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-extrabold whitespace-nowrap ${
                        admin.roleKey === 'admin_global'
                          ? 'bg-purple-100 text-purple-900'
                          : admin.roleKey === 'admin_general'
                          ? 'bg-teal-100 text-teal-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {admin.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Tenant System Architecture Summary Card */}
            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col gap-2.5 text-xs text-on-surface-variant">
              <span className="font-extrabold text-[11px] text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">security</span>
                Jerarquía de Permisos del Sistema
              </span>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold">1. Admin Global:</span>
                  <span>Panel Web. Acceso a todo el SaaS, agrega restaurantes y sedes por restaurante.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">2. Admin General:</span>
                  <span>Administra su restaurante, sus sedes y designa admins de cada sede.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    )}

    {/* TAB 2: CARTAS MAESTRAS & ASIGNACIÓN A RESTAURANTES */}
    {mainViewTab === 'cartas' && (
      <div className="flex flex-col gap-6 mb-12">
        <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 border border-amber-500/25">
              <span className="material-symbols-outlined text-[30px]">restaurant_menu</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
                  MÓDULO GLOBAL • CARTAS MAESTRAS
                </span>
                <span className="text-xs text-on-surface-variant font-bold">
                  {masterCartas.length} cartas registradas
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-primary mt-1">
                Gestión Central de Cartas & Asignación
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 max-w-3xl">
                Crea cartas maestras con soporte de <strong>1, 2, 3 o más precios/tamaños por plato</strong> y asígnalas a los restaurantes. Al asignarla, <strong>todas las sedes de ese restaurante heredarán automáticamente la carta</strong>, y luego cada sede podrá agregar, eliminar o pausar platos localmente.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setNewCartaName('');
                setNewCartaDesc('');
                setCustomDishesForNewCarta([]);
                setShowModalNewCarta(true);
              }}
              className="h-11 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>+ Nueva Carta Maestra</span>
            </button>

            <button
              onClick={() => handleOpenAssignModal()}
              className="h-11 px-4 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
              <span>Asignar a Restaurante</span>
            </button>
          </div>
        </div>

        {/* Master Cartas Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masterCartas.map((carta) => {
            const assignedChains = chains.filter((c) => c.assignedCartaId === carta.id);
            const totalSedes = assignedChains.reduce((sum, c) => sum + c.locations.length, 0);

            return (
              <div
                key={carta.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 relative overflow-hidden"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-teal-500 absolute top-0 left-0"></div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-800 border border-amber-500/20 flex items-center justify-center font-bold text-lg shrink-0">
                      <span className="material-symbols-outlined text-[26px]">menu_book</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center gap-1 border border-amber-200">
                      <span className="material-symbols-outlined text-[14px]">set_meal</span>
                      {carta.dishes.length} platos
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-primary leading-snug">
                      {carta.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                      {carta.description}
                    </p>
                  </div>

                  {/* Assigned Restaurants Box */}
                  <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/20 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-teal-600">store</span>
                        <span>Restaurantes Asignados ({assignedChains.length}):</span>
                      </span>
                      <span className="text-teal-700 font-bold">{totalSedes} sedes en total</span>
                    </div>

                    {assignedChains.length > 0 ? (
                      <div className="flex flex-col gap-1 mt-1">
                        {assignedChains.map((ac) => (
                          <div
                            key={ac.id}
                            className="px-2.5 py-1.5 rounded-lg bg-teal-50/80 border border-teal-200/80 text-[11px] flex items-center justify-between gap-1 text-teal-950"
                          >
                            <span className="font-bold truncate">{ac.name}</span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-teal-200 text-teal-900">
                              {ac.locations.length} sedes
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-on-surface-variant italic py-1">
                        Sin restaurantes asignados. Haz clic en "Asignar" para desplegarla.
                      </span>
                    )}
                  </div>

                  {/* Categories Breakdown */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {Array.from(new Set(carta.dishes.map((d) => d.category))).map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-bold text-on-surface capitalize border border-outline-variant/20"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewCarta(carta)}
                    className="h-9 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>Ver Platos ({carta.dishes.length})</span>
                  </button>

                  <button
                    onClick={() => handleOpenAssignModal(undefined, carta.id)}
                    className="h-9 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">hub</span>
                    <span>Asignar a Cadena</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* TAB 3: DIRECTORIO COMPLETO DE ADMINISTRADORES */}
    {mainViewTab === 'admins' && (
      <div className="flex flex-col gap-6 mb-12">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">badge</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-primary">
                Directorio Global de Usuarios & Administradores
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Audita y gestiona a todos los Administradores Globales, Generales y de Sede de cada restaurante.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-xl">
            {[
              { key: 'todos', label: 'Todos' },
              { key: 'admin_global', label: 'Global' },
              { key: 'admin_general', label: 'Generales' },
              { key: 'admin_sede', label: 'Sedes' }
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setAdminTab(t.key as typeof adminTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  adminTab === t.key
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Full Admins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAdmins.map((admin) => (
            <div
              key={admin.id}
              className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                    admin.roleKey === 'admin_global'
                      ? 'bg-purple-600 text-white'
                      : admin.roleKey === 'admin_general'
                      ? 'bg-teal-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {admin.initials}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`px-2 py-0.2 rounded font-extrabold text-[9px] uppercase tracking-wider ${
                        admin.roleKey === 'admin_global'
                          ? 'bg-purple-100 text-purple-800'
                          : admin.roleKey === 'admin_general'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {admin.role}
                    </span>
                    {admin.assignedBranchIds && admin.assignedBranchIds.length > 1 && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 font-extrabold text-[9px]">
                        Multi-Sede ({admin.assignedBranchIds.length})
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm text-primary truncate mt-0.5">{admin.name}</h4>
                  <span className="text-xs text-on-surface-variant truncate font-medium">
                    {admin.brand}
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-2.5 text-xs text-on-surface-variant flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">mail</span>
                  <span className="truncate">{admin.email}</span>
                </div>
                {admin.phone && (
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    <span>{admin.phone}</span>
                  </div>
                )}
                {admin.branchName && (
                  <div className="flex items-center gap-1.5 text-teal-700 font-bold">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span className="truncate">{admin.branchName}</span>
                  </div>
                )}

                {/* PIN de Ingreso (6 Dígitos) */}
                <div className="pt-1.5 mt-1 border-t border-outline-variant/15 flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-teal-700">key</span>
                    <span className="text-[10px] font-bold text-on-surface">PIN (6 dígitos):</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-teal-300 font-mono font-bold text-[10px] tracking-wider">
                      {admin.pin || (admin.roleKey === 'admin_global' ? '999999' : admin.roleKey === 'admin_general' ? '888888' : '777777')}
                    </span>
                  </div>

                  {(currentRole === 'admin_global' || currentRole === 'admin_general') && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAdminForPin(admin);
                        setNewAdminPin(admin.pin || (admin.roleKey === 'admin_global' ? '999999' : admin.roleKey === 'admin_general' ? '888888' : '777777'));
                      }}
                      className="text-[10px] text-teal-800 font-extrabold hover:underline cursor-pointer flex items-center gap-0.5"
                      title="Asignar o cambiar PIN de 6 dígitos"
                    >
                      <span className="material-symbols-outlined text-[12px]">edit</span>
                      <span>Cambiar PIN</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>


      {/* ========================================================================= */}
      {/* MODAL 1: REGISTRAR NUEVO RESTAURANTE / CEVICHERÍA (ADMIN GLOBAL) */}
      {/* ========================================================================= */}
      {showModalNewChain && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-outline-variant/40 animate-in zoom-in-95 my-8">
            <div className="px-6 py-4 bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-400/20 flex items-center justify-center text-teal-300">
                  <span className="material-symbols-outlined text-[24px]">add_business</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-on-primary">
                    Registrar Nuevo Restaurante
                  </h3>
                  <p className="text-xs text-primary-fixed-dim">
                    Alta de cliente multi-tenant con Administrador General asignado.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModalNewChain(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-on-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="p-6 flex flex-col gap-4">
              {/* Restaurant Commercial & Fiscal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Nombre Comercial del Restaurante / Marca *
                  </label>
                  <input
                    type="text"
                    value={chainForm.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      const autoSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setChainForm({ ...chainForm, name: newName, slug: chainForm.slug ? chainForm.slug : autoSlug });
                    }}
                    placeholder="ej. Cevichería El Pulpo Real"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container font-medium"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Enlace Directo del Restaurante (URL Slug)
                  </label>
                  <div className="flex items-center rounded-lg bg-surface-container-low border border-outline-variant/30 overflow-hidden px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20">
                    <span className="text-xs text-on-surface-variant font-mono select-none">
                      {window.location.origin}/
                    </span>
                    <input
                      type="text"
                      value={chainForm.slug}
                      onChange={(e) => setChainForm({ ...chainForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      placeholder="el-pulpo-real"
                      className="flex-1 bg-transparent text-xs sm:text-sm text-on-surface font-mono font-bold focus:outline-none ml-0.5"
                    />
                  </div>
                  <span className="text-[10px] text-on-surface-variant mt-0.5 block">
                    Cada restaurante tendrá su propio link exclusivo para su personal y clientes.
                  </span>
                </div>

                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Razón Social Legal
                  </label>
                  <input
                    type="text"
                    value={chainForm.legalName}
                    onChange={(e) => setChainForm({ ...chainForm, legalName: e.target.value })}
                    placeholder="ej. Inversiones El Pulpo S.A.C."
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    RUC SUNAT (11 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    value={chainForm.ruc}
                    onChange={(e) => setChainForm({ ...chainForm, ruc: e.target.value })}
                    placeholder="20XXXXXXXXX"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Plan Selection */}
              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Plan de Licencia SaaS
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Enterprise', title: 'Enterprise', price: 'S/ 499 /mes', desc: 'Sedes ilimitadas' },
                    { id: 'Pro', title: 'Pro', price: 'S/ 249 /mes', desc: 'Hasta 3 sedes' },
                    { id: 'Básico', title: 'Básico', price: 'S/ 129 /mes', desc: '1 sede' }
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setChainForm({ ...chainForm, plan: p.id as any })}
                      className={`p-2.5 rounded-xl border text-left flex flex-col transition-all cursor-pointer ${
                        chainForm.plan === p.id
                          ? 'border-secondary bg-secondary/10 ring-1 ring-secondary'
                          : 'border-outline-variant/30 bg-surface-container-low'
                      }`}
                    >
                      <span className="font-extrabold text-xs text-primary">{p.title}</span>
                      <span className="font-bold text-[11px] text-secondary">{p.price}</span>
                      <span className="text-[10px] text-on-surface-variant mt-0.5">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* General Admin Information */}
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex flex-col gap-2.5">
                <span className="font-extrabold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">person</span>
                  Administrador General Designado (Dueño de la Cadena)
                </span>

                <div>
                  <label className="font-bold text-[11px] text-on-surface block mb-0.5">
                    Nombre Completo del Administrador General
                  </label>
                  <input
                    type="text"
                    value={chainForm.adminName}
                    onChange={(e) => setChainForm({ ...chainForm, adminName: e.target.value })}
                    placeholder="ej. Roberto Morales Sánchez"
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/30 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-[11px] text-on-surface block mb-0.5">
                      Email Corporativo
                    </label>
                    <input
                      type="email"
                      value={chainForm.adminEmail}
                      onChange={(e) => setChainForm({ ...chainForm, adminEmail: e.target.value })}
                      placeholder="roberto@restaurante.pe"
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[11px] text-on-surface block mb-0.5">
                      WhatsApp / Móvil
                    </label>
                    <input
                      type="tel"
                      value={chainForm.adminPhone}
                      onChange={(e) => setChainForm({ ...chainForm, adminPhone: e.target.value })}
                      placeholder="+51 987 654 321"
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/30 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Sede Info */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-col gap-2.5">
                <span className="font-extrabold text-xs text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">storefront</span>
                  Primera Sede / Sede Matriz del Restaurante
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-[11px] text-on-surface block mb-0.5">
                      Nombre de la Sede
                    </label>
                    <input
                      type="text"
                      value={chainForm.initialLocName}
                      onChange={(e) => setChainForm({ ...chainForm, initialLocName: e.target.value })}
                      placeholder="ej. Sede Principal La Mar"
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[11px] text-on-surface block mb-0.5">
                      Distrito
                    </label>
                    <input
                      type="text"
                      value={chainForm.initialLocDistrict}
                      onChange={(e) => setChainForm({ ...chainForm, initialLocDistrict: e.target.value })}
                      placeholder="Miraflores"
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[11px] text-on-surface block mb-0.5">
                    Dirección Física
                  </label>
                  <input
                    type="text"
                    value={chainForm.initialLocAddress}
                    onChange={(e) => setChainForm({ ...chainForm, initialLocAddress: e.target.value })}
                    placeholder="Av. Mariscal La Mar 1290"
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/30 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowModalNewChain(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Registrar Restaurante y Desplegar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: AGREGAR SEDE POR CADA RESTAURANTE (ADMIN GLOBAL) */}
      {/* ========================================================================= */}
      {showModalNewLocation && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-outline-variant/40 animate-in zoom-in-95 my-8">
            <div className="px-6 py-4 bg-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
                  <span className="material-symbols-outlined text-[24px]">add_location_alt</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Aperturar Nueva Sede en Restaurante
                  </h3>
                  <p className="text-xs text-teal-200">
                    Como Administrador Global, agrega una sucursal y nómbrale su Administrador de Sede.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModalNewLocation(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateLocation} className="p-6 flex flex-col gap-4">
              {/* Select Target Restaurant */}
              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Restaurante al que pertenece la nueva sede *
                </label>
                <select
                  value={locationForm.chainId}
                  onChange={(e) => setLocationForm({ ...locationForm, chainId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container font-extrabold cursor-pointer"
                  required
                >
                  {chains.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (RUC {c.ruc} • {c.locations.length} sedes actuales)
                    </option>
                  ))}
                </select>
              </div>

              {/* Sede Name and Tables */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Nombre de la Nueva Sede *
                  </label>
                  <input
                    type="text"
                    value={locationForm.name}
                    onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                    placeholder="ej. Sede San Isidro Financiero"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Capacidad (Mesas)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={locationForm.tables}
                    onChange={(e) => setLocationForm({ ...locationForm, tables: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Address, District and City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Dirección Exacta de la Sede
                  </label>
                  <input
                    type="text"
                    value={locationForm.address}
                    onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                    placeholder="ej. Av. Canaval y Moreyra 450"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Distrito
                  </label>
                  <input
                    type="text"
                    value={locationForm.district}
                    onChange={(e) => setLocationForm({ ...locationForm, district: e.target.value })}
                    placeholder="San Isidro"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                </div>
              </div>

              {/* Assigned Sede Manager (Administrador de Sede) */}
              <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 flex flex-col gap-2.5">
                <span className="font-extrabold text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-amber-700">badge</span>
                  Administrador de Sede Designado (Gerente Local de la Sede)
                </span>
                <p className="text-[11px] text-amber-900/80">
                  Esta persona tendrá acceso exclusivo para gestionar la carta del día, platos agotados, mesas y equipo de mozos de esta sede específica.
                </p>

                <div>
                  <label className="font-bold text-[11px] text-on-surface block mb-0.5">
                    Nombre Completo del Administrador de Sede *
                  </label>
                  <input
                    type="text"
                    value={locationForm.managerName}
                    onChange={(e) => setLocationForm({ ...locationForm, managerName: e.target.value })}
                    placeholder="ej. Fernando Castro Poma"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-[11px] text-on-surface block mb-0.5">
                      Email Corporativo
                    </label>
                    <input
                      type="email"
                      value={locationForm.managerEmail}
                      onChange={(e) => setLocationForm({ ...locationForm, managerEmail: e.target.value })}
                      placeholder="fernando.c@restaurante.pe"
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[11px] text-on-surface block mb-0.5">
                      Teléfono / WhatsApp de la Sede
                    </label>
                    <input
                      type="tel"
                      value={locationForm.managerPhone}
                      onChange={(e) => setLocationForm({ ...locationForm, managerPhone: e.target.value })}
                      placeholder="+51 978 123 456"
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/30 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowModalNewLocation(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_location</span>
                  <span>Aperturar y Desplegar Sede</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ASIGNAR CARTA MAESTRA A RESTAURANTE (CON PROPAGACIÓN MULTI-SEDE) */}
      {/* ========================================================================= */}
      {showModalAssignCarta && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-outline-variant/40 animate-in zoom-in-95 my-8">
            <div className="px-6 py-4 bg-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[24px]">hub</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Asignar Carta Maestra a Restaurante
                  </h3>
                  <p className="text-xs text-amber-100">
                    Sincronización centralizada para todas las sedes del restaurante
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModalAssignCarta(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmAssignCarta} className="p-6 flex flex-col gap-4">
              {/* Select Restaurant */}
              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  1. Selecciona el Restaurante / Cadena Destino *
                </label>
                <select
                  value={selectedChainForCarta}
                  onChange={(e) => setSelectedChainForCarta(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                  required
                >
                  {chains.map((chain) => {
                    const currentCarta = masterCartas.find((c) => c.id === chain.assignedCartaId);
                    return (
                      <option key={chain.id} value={chain.id}>
                        {chain.name} ({chain.locations.length} sedes) - Carta actual: {currentCarta ? currentCarta.name : 'Sin asignar'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Select Master Carta */}
              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  2. Selecciona la Carta Maestra a Asignar *
                </label>
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  {masterCartas.map((carta) => {
                    const isSelected = selectedCartaToAssign === carta.id;
                    return (
                      <div
                        key={carta.id}
                        onClick={() => setSelectedCartaToAssign(carta.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400 shadow-sm'
                            : 'bg-surface-container-low border-outline-variant/20 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-amber-600 bg-amber-600' : 'border-outline-variant'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-xs text-on-surface truncate">
                              {carta.name}
                            </span>
                            <span className="text-[11px] text-on-surface-variant truncate">
                              {carta.description}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[10px] shrink-0">
                          {carta.dishes.length} platos
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Multi-Branch Impact Explanation Box */}
              {(() => {
                const targetChain = chains.find((c) => c.id === selectedChainForCarta);
                const targetCarta = masterCartas.find((c) => c.id === selectedCartaToAssign);
                return (
                  <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex flex-col gap-1.5 text-amber-950 text-xs">
                    <span className="font-extrabold flex items-center gap-1.5 text-amber-900">
                      <span className="material-symbols-outlined text-[18px] text-amber-700">info</span>
                      Efecto Inmediato en Todas las Sedes:
                    </span>
                    <p className="leading-relaxed">
                      Al confirmar, las <strong>{targetChain?.locations.length || 0} sedes</strong> de <strong>{targetChain?.name}</strong> ({targetChain?.locations.map((l) => l.name).join(', ')}) adoptarán los <strong>{targetCarta?.dishes.length || 0} platos</strong> de <em>"{targetCarta?.name}"</em>.
                    </p>
                    <p className="text-[11px] text-amber-900/80 font-medium">
                      ✓ Cada sede mantendrá la libertad de agregar nuevos platos locales, eliminar o desactivar platos individualmente según su stock.
                    </p>
                  </div>
                );
              })()}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowModalAssignCarta(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Confirmar y Propagar a Sedes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CREAR NUEVA CARTA MAESTRA (CON MÚLTIPLES PRECIOS/TAMAÑOS)      */}
      {/* ========================================================================= */}
      {showModalNewCarta && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-outline-variant/40 animate-in zoom-in-95 my-8 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-primary text-on-primary flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
                  <span className="material-symbols-outlined text-[24px]">library_add</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Crear Nueva Carta Maestra Global
                  </h3>
                  <p className="text-xs text-primary-fixed-dim">
                    Define platos con 1, 2, 3 o más precios y asígnalos a los restaurantes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModalNewCarta(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateMasterCarta} className="p-6 overflow-y-auto flex flex-col gap-5">
              {/* Carta Name & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Nombre de la Carta Maestra *
                  </label>
                  <input
                    type="text"
                    value={newCartaName}
                    onChange={(e) => setNewCartaName(e.target.value)}
                    placeholder="ej. Carta Verano 2026 - Especialidades del Norte"
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Descripción de la Carta
                  </label>
                  <input
                    type="text"
                    value={newCartaDesc}
                    onChange={(e) => setNewCartaDesc(e.target.value)}
                    placeholder="ej. Carta oficial con pescados frescos, combinados, tríos y sudados"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                </div>

                {/* Base Cloning Selection */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Plantilla Base de Platos
                  </label>
                  <select
                    value={newCartaCloneSource}
                    onChange={(e) => setNewCartaCloneSource(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none font-medium"
                  >
                    {masterCartas.map((c) => (
                      <option key={c.id} value={c.id}>
                        Copiar platos de: {c.name} ({c.dishes.length} platos)
                      </option>
                    ))}
                    <option value="empty">Comenzar carta vacía (sin platos iniciales)</option>
                  </select>
                </div>
              </div>

              {/* Quick Dish Adder with Unlimited Prices/Sizes */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary">add_circle</span>
                    Añadir Platos Específicos a esta Carta Maestra
                  </span>
                  <span className="text-[11px] text-secondary font-bold">
                    {customDishesForNewCarta.length} agregados
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-[11px] text-on-surface block mb-0.5">Nombre del Plato</label>
                    <input
                      type="text"
                      value={dishNameInput}
                      onChange={(e) => setDishNameInput(e.target.value)}
                      placeholder="ej. Ceviche de Mero Murique"
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[11px] text-on-surface block mb-0.5">Categoría</label>
                    <select
                      value={dishCategoryInput}
                      onChange={(e) => setDishCategoryInput(e.target.value as MenuItem['category'])}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                    >
                      <option value="ceviches">Ceviches</option>
                      <option value="leches">Leches de Tigre</option>
                      <option value="calientes">Calientes</option>
                      <option value="arroces">Arroces</option>
                      <option value="combinados">Combinados</option>
                      <option value="trios">Tríos</option>
                      <option value="jaleas">Jaleas</option>
                      <option value="bebidas">Bebidas</option>
                    </select>
                  </div>
                </div>

                {/* Multiple Sizes/Prices List */}
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-on-surface flex items-center justify-between">
                    <span>Tamaños y Precios de este Plato (Sin Límite):</span>
                    <span className="text-[10px] text-on-surface-variant">Soporta 1, 2, 3, 4 o más precios</span>
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    {dishSizesInput.map((sz, szIdx) => (
                      <span
                        key={szIdx}
                        className="px-2.5 py-1 rounded-md bg-secondary/10 text-secondary border border-secondary/20 text-xs font-bold flex items-center gap-1.5"
                      >
                        <span>{sz.name}:</span>
                        <span className="text-primary font-black">S/ {sz.price.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSizeFromNewCartaDish(szIdx)}
                          className="hover:text-red-600 transition-colors ml-0.5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={sizeNameInput}
                      onChange={(e) => setSizeNameInput(e.target.value)}
                      placeholder="Nombre (ej. Litro, Familiar)"
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 focus:outline-none"
                    />
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-on-surface-variant font-bold">
                        S/
                      </span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={sizePriceInput || ''}
                        onChange={(e) => setSizePriceInput(Number(e.target.value))}
                        placeholder="0.00"
                        className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-surface-container-low text-xs border border-outline-variant/30 focus:outline-none font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSizeToNewCartaDish}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-bold text-xs cursor-pointer active:scale-95 shrink-0"
                    >
                      + Tamaño
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddDishToNewCartaList}
                    className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>+ Añadir Plato a la Lista</span>
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModalNewCarta(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Guardar y Publicar Carta Maestra</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: PREVISUALIZACIÓN DE PLATOS Y PRECIOS DE CARTA MAESTRA           */}
      {/* ========================================================================= */}
      {previewCarta && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-outline-variant/40 animate-in zoom-in-95 my-8 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">restaurant_menu</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {previewCarta.name}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {previewCarta.dishes.length} platos registrados con sus precios oficiales
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewCarta(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-4">
              <p className="text-xs text-on-surface-variant">{previewCarta.description}</p>

              {/* Dishes List */}
              <div className="flex flex-col divide-y divide-surface-container">
                {previewCarta.dishes.map((dish) => (
                  <div key={dish.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-outline-variant/30"
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-xs text-on-surface truncate">
                            {dish.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-surface-container text-[9px] font-extrabold uppercase text-on-surface-variant">
                            {dish.category}
                          </span>
                          {dish.tag && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold uppercase">
                              {dish.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                          {dish.description}
                        </p>

                        {/* Sizes list */}
                        {dish.sizes && dish.sizes.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {dish.sizes.map((sz, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-semibold flex items-center gap-1 border border-outline-variant/20"
                              >
                                <span>{sz.name}:</span>
                                <span className="text-primary font-black">S/ {sz.price.toFixed(2)}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="font-extrabold text-sm text-primary">
                        S/ {dish.price.toFixed(2)}
                      </span>
                      {dish.sizes && dish.sizes.length > 1 && (
                        <span className="text-[10px] text-emerald-700 font-bold">
                          {dish.sizes.length} precios
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between shrink-0">
              <span className="text-xs text-on-surface-variant font-bold">
                Total de platos: {previewCarta.dishes.length}
              </span>
              <button
                onClick={() => setPreviewCarta(null)}
                className="px-4 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASIGNAR PIN DE 6 DÍGITOS A ADMINISTRADOR */}
      {editingAdminForPin && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-outline-variant/40 animate-in zoom-in-95">
            <div className="px-5 py-4 bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-300 text-[22px]">vpn_key</span>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Asignar PIN de 6 Dígitos</h3>
                  <p className="text-[11px] text-teal-200">{editingAdminForPin.name} ({editingAdminForPin.role})</p>
                </div>
              </div>
              <button
                onClick={() => setEditingAdminForPin(null)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newAdminPin.length !== 6 || !/^\d{6}$/.test(newAdminPin)) {
                  setToastMessage('El PIN debe tener exactamente 6 dígitos numéricos');
                  setTimeout(() => setToastMessage(null), 3000);
                  return;
                }
                if (onUpdateAdmin) {
                  onUpdateAdmin({
                    ...editingAdminForPin,
                    pin: newAdminPin
                  });
                  setToastMessage(`¡PIN de 6 dígitos asignado para ${editingAdminForPin.name}!`);
                  setTimeout(() => setToastMessage(null), 3000);
                }
                setEditingAdminForPin(null);
              }}
              className="p-5 flex flex-col gap-4"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-xs text-on-surface">Nuevo PIN de Terminal *</label>
                  <button
                    type="button"
                    onClick={() => setNewAdminPin(Math.floor(100000 + Math.random() * 900000).toString())}
                    className="text-[10px] text-teal-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[13px]">autorenew</span>
                    <span>Generar PIN</span>
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={newAdminPin}
                  onChange={(e) => setNewAdminPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="999999"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-base font-mono font-extrabold tracking-widest text-primary border border-outline-variant/30 focus:outline-none text-center"
                  required
                  autoFocus
                />
                <p className="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                  Como <strong>Administrador General / Global</strong>, este PIN de 6 dígitos permitirá a este usuario autenticarse en terminales de acceso.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingAdminForPin(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Guardar PIN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-teal-400 text-xs font-bold animate-in fade-in slide-in-from-top-3 max-w-md">
          <span className="material-symbols-outlined text-teal-400 text-[22px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
