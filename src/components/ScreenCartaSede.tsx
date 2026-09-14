import React, { useState } from 'react';
import {
  MenuItem,
  ScreenType,
  ChainBrand,
  AdminUser,
  BranchLocation,
  AppRole,
  StaffMember
} from '../types';

interface ScreenCartaSedeProps {
  menuItems: MenuItem[];
  onToggleItemAvailability: (itemId: number) => void;
  onUpdateMenuItem?: (item: MenuItem) => void;
  onAddMenuItem?: (item: MenuItem) => void;
  onNavigate: (screen: ScreenType) => void;
  chains?: ChainBrand[];
  admins?: AdminUser[];
  staff?: StaffMember[];
  onAddStaff?: (staff: StaffMember) => void;
  onUpdateStaff?: (staff: StaffMember) => void;
  onDeleteStaff?: (staffId: string) => void;
  onUpdateAdminBranches?: (adminId: string, branchIds: string[]) => void;
  activeChainId?: string;
  activeBranchId?: string;
  onSelectBranch?: (branchId: string) => void;
  onAddLocation?: (chainId: string, newLocation: BranchLocation, managerAdmin?: AdminUser) => void;
  currentRole?: AppRole;
  currentAdminName?: string;
  initialTab?: 'carta' | 'sedes' | 'equipo';
  onTabChange?: (tab: 'carta' | 'sedes' | 'equipo') => void;
}

// Preset appetizing images for Cevichería dishes
const PRESET_DISH_IMAGES = [
  { label: 'Ceviche Clásico', url: 'https://images.unsplash.com/photo-1535399831379-5b7eb9bf6316?auto=format&fit=crop&w=400&q=80' },
  { label: 'Arroz con Mariscos', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
  { label: 'Leche de Tigre', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' },
  { label: 'Chicharrón / Jalea', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Parihuela / Caliente', url: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=400&q=80' },
  { label: 'Bebida / Chilcano', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' }
];

export const ScreenCartaSede: React.FC<ScreenCartaSedeProps> = ({
  menuItems,
  onToggleItemAvailability,
  onUpdateMenuItem,
  onAddMenuItem,
  onNavigate,
  chains = [],
  admins = [],
  staff = [],
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onUpdateAdminBranches,
  activeChainId = 'la-barra',
  activeBranchId = 'loc-miraflores',
  onSelectBranch,
  onAddLocation,
  currentRole = 'admin_general',
  currentAdminName = 'Roberto Morales',
  initialTab,
  onTabChange
}) => {
  const currentChain = chains.find((c) => c.id === activeChainId) || chains[0];
  const currentBranch = currentChain?.locations.find((l) => l.id === activeBranchId) || currentChain?.locations[0];

  // Identify current logged-in admin object
  const currentAdmin = admins.find(
    (a) => a.name.toLowerCase() === currentAdminName.toLowerCase()
  ) || admins.find((a) => a.roleKey === currentRole) || admins[0];

  // Identify branches this administrator manages (An admin can manage more than one sede!)
  const adminAssignedBranchIds: string[] =
    currentRole === 'admin_sede' && currentAdmin?.assignedBranchIds && currentAdmin.assignedBranchIds.length > 0
      ? currentAdmin.assignedBranchIds
      : currentRole === 'admin_sede' && currentBranch
      ? [currentBranch.id]
      : currentChain?.locations.map((l) => l.id) || [];

  const managedBranches = currentChain?.locations.filter((loc) =>
    currentRole === 'admin_general' || currentRole === 'admin_global'
      ? true
      : adminAssignedBranchIds.includes(loc.id)
  ) || [];

  const [isCartaActive, setIsCartaActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'carta' | 'sedes' | 'equipo'>(initialTab || 'carta');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleSwitchTab = (tab: 'carta' | 'sedes' | 'equipo') => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');

  // Search and filter in Carta
  const [dishSearchQuery, setDishSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [onlyShowPausedDishes, setOnlyShowPausedDishes] = useState(false);

  // Filter in Personal
  const [staffFilterMode, setStaffFilterMode] = useState<'current_sede' | 'all_managed'>('current_sede');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  // --------------------------------------------------------------------------
  // MODAL 1: EDITAR PLATO DE LA CARTA
  // --------------------------------------------------------------------------
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [editDishName, setEditDishName] = useState('');
  const [editDishPrice, setEditDishPrice] = useState<number>(0);
  const [editDishSizes, setEditDishSizes] = useState<{ name: string; price: number }[]>([]);
  const [newSizeInputName, setNewSizeInputName] = useState('');
  const [newSizeInputPrice, setNewSizeInputPrice] = useState<number>(0);
  const [editDishCategory, setEditDishCategory] = useState<MenuItem['category']>('ceviches');
  const [editDishDescription, setEditDishDescription] = useState('');
  const [editDishTag, setEditDishTag] = useState('');
  const [editDishStockNote, setEditDishStockNote] = useState('');
  const [editDishAvailable, setEditDishAvailable] = useState(true);

  const openEditDishModal = (dish: MenuItem) => {
    setEditingDish(dish);
    setEditDishName(dish.name);
    // Sort sizes so the minimum price presentation is always first
    const sizes = dish.sizes ? [...dish.sizes].sort((a, b) => a.price - b.price) : [];
    setEditDishSizes(sizes);
    // Default price is strictly the minimum size price if sizes exist
    const minPrice = sizes.length > 0 ? sizes[0].price : dish.price;
    setEditDishPrice(minPrice);
    setNewSizeInputName('');
    setNewSizeInputPrice(minPrice);
    setEditDishCategory(dish.category);
    setEditDishDescription(dish.description);
    setEditDishTag(dish.tag || '');
    setEditDishStockNote(dish.stockNote || '');
    setEditDishAvailable(dish.available);
  };

  const handleAddSizeToEditDish = () => {
    if (!newSizeInputName.trim() || newSizeInputPrice <= 0) {
      triggerToast('Ingresa un nombre y precio válido para el tamaño');
      return;
    }
    const updated = [...editDishSizes, { name: newSizeInputName.trim(), price: Number(newSizeInputPrice) }].sort(
      (a, b) => a.price - b.price
    );
    setEditDishSizes(updated);
    setEditDishPrice(updated[0].price); // Minimum price is default
    setNewSizeInputName('');
    setNewSizeInputPrice(updated[0].price);
    triggerToast(`Tamaño agregado. Precio mínimo por defecto actualizado a S/ ${updated[0].price.toFixed(2)}`);
  };

  const handleRemoveSizeFromEditDish = (idx: number) => {
    const updated = editDishSizes.filter((_, i) => i !== idx).sort((a, b) => a.price - b.price);
    setEditDishSizes(updated);
    if (updated.length > 0) {
      setEditDishPrice(updated[0].price);
    }
  };

  const handleSaveDishChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;

    if (!editDishName.trim()) {
      triggerToast('Ingresa un nombre válido para el plato');
      return;
    }

    // Ensure sizes are sorted so index 0 is the minimum price
    const sortedSizes = editDishSizes.length > 0
      ? [...editDishSizes].sort((a, b) => a.price - b.price)
      : undefined;

    // Default price is always the minimum of the sizes
    const computedMinPrice = sortedSizes && sortedSizes.length > 0
      ? sortedSizes[0].price
      : (Number(editDishPrice) || editingDish.price);

    const updatedDish: MenuItem = {
      ...editingDish,
      name: editDishName.trim(),
      price: computedMinPrice,
      sizes: sortedSizes,
      category: editDishCategory,
      description: editDishDescription.trim(),
      tag: editDishTag.trim() || undefined,
      stockNote: editDishStockNote.trim() || undefined,
      available: editDishAvailable
    };

    if (onUpdateMenuItem) {
      onUpdateMenuItem(updatedDish);
    }
    setEditingDish(null);
    setHasUnsavedChanges(true);
    triggerToast(`Plato "${updatedDish.name}" actualizado (Precio base por defecto: S/ ${computedMinPrice.toFixed(2)})`);
  };

  // --------------------------------------------------------------------------
  // MODAL 2: AGREGAR NUEVO PLATO A LA CARTA DE LA SEDE
  // --------------------------------------------------------------------------
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState<number>(18.0);
  const [newDishSizes, setNewDishSizes] = useState<{ name: string; price: number }[]>([
    { name: 'Personal', price: 18.0 },
    { name: 'Familiar', price: 35.0 }
  ]);
  const [newDishSizeNameInput, setNewDishSizeNameInput] = useState('');
  const [newDishSizePriceInput, setNewDishSizePriceInput] = useState<number>(18.0);
  const [newDishCategory, setNewDishCategory] = useState<MenuItem['category']>('ceviches');
  const [newDishDescription, setNewDishDescription] = useState('');
  const [newDishTag, setNewDishTag] = useState('ESPECIALIDAD');
  const [newDishImageUrl, setNewDishImageUrl] = useState(PRESET_DISH_IMAGES[0].url);
  const [newDishStockNote, setNewDishStockNote] = useState('');

  const handleAddSizeToNewDish = () => {
    if (!newDishSizeNameInput.trim() || newDishSizePriceInput <= 0) {
      triggerToast('Ingresa un nombre y precio válido para el tamaño');
      return;
    }
    const updated = [...newDishSizes, { name: newDishSizeNameInput.trim(), price: Number(newDishSizePriceInput) }].sort(
      (a, b) => a.price - b.price
    );
    setNewDishSizes(updated);
    setNewDishPrice(updated[0].price); // Minimum price is default
    setNewDishSizeNameInput('');
    triggerToast(`Tamaño agregado. Precio base por defecto: S/ ${updated[0].price.toFixed(2)}`);
  };

  const handleRemoveSizeFromNewDish = (idx: number) => {
    const updated = newDishSizes.filter((_, i) => i !== idx).sort((a, b) => a.price - b.price);
    setNewDishSizes(updated);
    if (updated.length > 0) {
      setNewDishPrice(updated[0].price);
    }
  };

  const handleCreateNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) {
      triggerToast('Ingresa el nombre del nuevo plato');
      return;
    }

    const sortedSizes = newDishSizes.length > 0
      ? [...newDishSizes].sort((a, b) => a.price - b.price)
      : undefined;

    const basePrice = sortedSizes && sortedSizes.length > 0
      ? sortedSizes[0].price
      : (Number(newDishPrice) || 28.0);

    const newDish: MenuItem = {
      id: Date.now(),
      name: newDishName.trim(),
      category: newDishCategory,
      price: basePrice,
      sizes: sortedSizes,
      description: newDishDescription.trim() || 'Elaborado con pesca fresca del día y sazón criolla tradicional.',
      tag: newDishTag.trim() || undefined,
      image: newDishImageUrl || PRESET_DISH_IMAGES[0].url,
      available: true,
      stockNote: newDishStockNote.trim() || undefined,
      isDrink: newDishCategory === 'bebidas'
    };

    if (onAddMenuItem) {
      onAddMenuItem(newDish);
    }
    setShowAddDishModal(false);
    setNewDishName('');
    setNewDishDescription('');
    setNewDishStockNote('');
    setHasUnsavedChanges(true);
    triggerToast(`¡Nuevo plato "${newDish.name}" agregado con precio por defecto S/ ${basePrice.toFixed(2)}!`);
  };

  // --------------------------------------------------------------------------
  // MODAL 3: AGREGAR / EDITAR PERSONAL (CON ASIGNACIÓN MULTI-SEDE)
  // --------------------------------------------------------------------------
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Mozo Salón');
  const [staffPin, setStaffPin] = useState('1234');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffTablesZone, setStaffTablesZone] = useState('Mesas 1 a 6');
  const [staffShift, setStaffShift] = useState('Turno Mañana');
  const [staffAssignedBranches, setStaffAssignedBranches] = useState<string[]>([currentBranch?.id || 'loc-miraflores']);
  const [staffActive, setStaffActive] = useState(true);

  const openAddStaffModal = () => {
    setEditingStaffId(null);
    setStaffName('');
    setStaffRole('Mozo Salón');
    setStaffPin(Math.floor(1000 + Math.random() * 9000).toString());
    setStaffPhone('');
    setStaffTablesZone('Mesas 1 a 6');
    setStaffShift('Turno Mañana');
    // Pre-select current branch by default
    setStaffAssignedBranches([currentBranch?.id || 'loc-miraflores']);
    setStaffActive(true);
    setShowStaffModal(true);
  };

  const openEditStaffModal = (member: StaffMember) => {
    setEditingStaffId(member.id);
    setStaffName(member.name);
    setStaffRole(member.role);
    setStaffPin(member.pin);
    setStaffPhone(member.phone || '');
    setStaffTablesZone(member.tablesZone || 'Mesas 1 a 6');
    setStaffShift(member.shift || 'Turno Mañana');
    setStaffAssignedBranches(member.assignedBranchIds || [currentBranch?.id || 'loc-miraflores']);
    setStaffActive(member.active);
    setShowStaffModal(true);
  };

  const handleToggleStaffBranch = (branchId: string) => {
    setStaffAssignedBranches((prev) => {
      if (prev.includes(branchId)) {
        // Keep at least one branch
        if (prev.length === 1) {
          triggerToast('El colaborador debe estar asignado al menos a 1 sede');
          return prev;
        }
        return prev.filter((id) => id !== branchId);
      } else {
        return [...prev, branchId];
      }
    });
  };

  const handleSelectAllBranchesForStaff = () => {
    const allAvailableBranchIds = currentChain?.locations.map((l) => l.id) || [];
    setStaffAssignedBranches(allAvailableBranchIds);
  };

  const handleSelectOnlyCurrentBranchForStaff = () => {
    if (currentBranch) {
      setStaffAssignedBranches([currentBranch.id]);
    }
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) {
      triggerToast('Ingresa el nombre del colaborador');
      return;
    }
    if (staffPin.length !== 4) {
      triggerToast('El PIN debe tener exactamente 4 dígitos');
      return;
    }
    if (staffAssignedBranches.length === 0) {
      triggerToast('Selecciona al menos una sede para el colaborador');
      return;
    }

    const colors = ['bg-teal-600', 'bg-purple-600', 'bg-amber-600', 'bg-blue-600', 'bg-rose-600', 'bg-emerald-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    if (editingStaffId) {
      // Update existing
      const updatedMember: StaffMember = {
        id: editingStaffId,
        name: staffName.trim(),
        role: staffRole,
        pin: staffPin.trim(),
        phone: staffPhone.trim() || undefined,
        tablesZone: staffTablesZone.trim(),
        shift: staffShift,
        assignedBranchIds: staffAssignedBranches,
        brandId: currentChain?.id || 'la-barra',
        active: staffActive,
        avatarColor: randomColor
      };
      if (onUpdateStaff) onUpdateStaff(updatedMember);
      triggerToast(`Colaborador "${updatedMember.name}" actualizado con ${staffAssignedBranches.length} sede(s)`);
    } else {
      // Add new
      const newMember: StaffMember = {
        id: `stf-${Date.now()}`,
        name: staffName.trim(),
        role: staffRole,
        pin: staffPin.trim(),
        phone: staffPhone.trim() || undefined,
        tablesZone: staffTablesZone.trim(),
        shift: staffShift,
        assignedBranchIds: staffAssignedBranches,
        brandId: currentChain?.id || 'la-barra',
        active: staffActive,
        avatarColor: randomColor
      };
      if (onAddStaff) onAddStaff(newMember);
      triggerToast(`¡Colaborador "${newMember.name}" registrado en ${staffAssignedBranches.length} sede(s)!`);
    }

    setShowStaffModal(false);
  };

  // --------------------------------------------------------------------------
  // MODAL 4: ASIGNAR SEDES A UN ADMINISTRADOR DE SEDE
  // --------------------------------------------------------------------------
  const [managingAdmin, setManagingAdmin] = useState<AdminUser | null>(null);
  const [tempAdminBranches, setTempAdminBranches] = useState<string[]>([]);

  const openManageAdminBranches = (admin: AdminUser) => {
    setManagingAdmin(admin);
    const assigned = admin.assignedBranchIds && admin.assignedBranchIds.length > 0
      ? admin.assignedBranchIds
      : admin.branchId ? [admin.branchId] : [];
    setTempAdminBranches(assigned);
  };

  const handleToggleAdminBranch = (branchId: string) => {
    setTempAdminBranches((prev) => {
      if (prev.includes(branchId)) {
        if (prev.length === 1) {
          triggerToast('El administrador debe tener asignada al menos una sede');
          return prev;
        }
        return prev.filter((id) => id !== branchId);
      } else {
        return [...prev, branchId];
      }
    });
  };

  const handleSaveAdminBranches = () => {
    if (!managingAdmin) return;
    if (onUpdateAdminBranches) {
      onUpdateAdminBranches(managingAdmin.id, tempAdminBranches);
    }
    triggerToast(`Sedes asignadas a ${managingAdmin.name} actualizadas (${tempAdminBranches.length} sedes)`);
    setManagingAdmin(null);
  };

  // --------------------------------------------------------------------------
  // MODAL 5: AGREGAR SEDE (DESDE ADMINISTRADOR GENERAL)
  // --------------------------------------------------------------------------
  const [showAddSedeModal, setShowAddSedeModal] = useState(false);
  const [newSedeName, setNewSedeName] = useState('');
  const [newSedeAddress, setNewSedeAddress] = useState('');
  const [newSedeDistrict, setNewSedeDistrict] = useState('San Borja');
  const [newSedeTables, setNewSedeTables] = useState(14);
  const [newSedeManager, setNewSedeManager] = useState('');
  const [newSedePhone, setNewSedePhone] = useState('');

  const triggerToast = (text: string) => {
    setToastText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleToggle = (id: number) => {
    onToggleItemAvailability(id);
    setHasUnsavedChanges(true);
    const item = menuItems.find((i) => i.id === id);
    if (item) {
      triggerToast(
        item.available
          ? `"${item.name}" pausado en ${currentBranch?.name || 'la sede'}`
          : `"${item.name}" activado en ${currentBranch?.name || 'la sede'}`
      );
    }
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    triggerToast('¡Sincronizado en tiempo real con terminales POS y KDS!');
  };

  const handleCreateSedeFromGeneralAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSedeName.trim()) {
      triggerToast('Ingresa el nombre de la nueva sede');
      return;
    }

    if (onAddLocation && currentChain) {
      const newLocId = `loc-${Date.now()}`;
      const managerName = newSedeManager.trim() || 'Admin Asignado';

      const newLocation: BranchLocation = {
        id: newLocId,
        name: newSedeName.trim(),
        address: newSedeAddress.trim() || 'Av. Javier Prado Este 2500',
        district: newSedeDistrict,
        city: 'Lima',
        phone: newSedePhone.trim() || '+51 1 500-1122',
        tables: Number(newSedeTables) || 14,
        todaySales: 0,
        active: true,
        managerName: managerName,
        managerEmail: `${managerName.toLowerCase().replace(/\s+/g, '.')}@${currentChain.name.toLowerCase().replace(/\s+/g, '')}.pe`,
        managerPhone: newSedePhone.trim() || '+51 988 000 111'
      };

      const managerAdmin: AdminUser = {
        id: `adm-${Date.now()}`,
        name: managerName,
        email: newLocation.managerEmail || 'admin.sede@restaurante.pe',
        phone: newLocation.managerPhone,
        role: 'Administrador de Sede',
        roleKey: 'admin_sede',
        brand: currentChain.name,
        brandId: currentChain.id,
        branchName: newLocation.name,
        branchId: newLocId,
        assignedBranchIds: [newLocId],
        initials: managerName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'AS',
        active: true
      };

      onAddLocation(currentChain.id, newLocation, managerAdmin);
      setShowAddSedeModal(false);
      setNewSedeName('');
      setNewSedeAddress('');
      setNewSedeManager('');
      setNewSedePhone('');
      triggerToast(`¡Nueva sede "${newLocation.name}" agregada a ${currentChain.name}!`);
    }
  };

  // Filtered dishes
  const filteredDishes = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(dishSearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(dishSearchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    const matchesPaused = onlyShowPausedDishes ? !item.available : true;
    return matchesSearch && matchesCategory && matchesPaused;
  });

  // Filtered staff
  const filteredStaff = staff.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(staffSearchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (staffFilterMode === 'current_sede') {
      return currentBranch ? member.assignedBranchIds.includes(currentBranch.id) : true;
    } else {
      // Show all staff belonging to any branch managed by this admin or chain
      return member.brandId === currentChain?.id;
    }
  });

  const staffInCurrentBranchCount = staff.filter((s) => currentBranch && s.assignedBranchIds.includes(currentBranch.id)).length;
  const multiSedeStaffCount = staff.filter((s) => s.assignedBranchIds.length > 1).length;

  return (
    <div className="flex flex-col w-full pb-36 pt-2 max-w-2xl mx-auto px-3 sm:px-4">
      {/* Top Breadcrumb Context */}
      <div className="py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant flex-wrap">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span className="font-extrabold text-on-surface">{currentChain?.name || 'La Barra Sabrisimo'}</span>
          <span>•</span>
          <span className="font-bold text-secondary">{currentBranch?.name || 'Sede Principal La Mar'}</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container font-extrabold text-[10px] text-primary uppercase">
            {currentRole === 'admin_sede' ? 'Administrador de Sede' : 'Administrador General'}
          </span>
        </div>

        <button
          onClick={() => onNavigate('saas-console')}
          className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">public</span>
          <span>Consola Global</span>
        </button>
      </div>

      {/* Role & Restaurant Scope Card */}
      <div className="pb-3">
        <div className="bg-primary text-on-primary rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col gap-3.5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center font-bold text-lg">
                <span className="material-symbols-outlined text-[24px]">
                  {currentRole === 'admin_sede' ? 'storefront' : 'corporate_fare'}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-teal-400/20 text-teal-300 text-[10px] font-extrabold uppercase tracking-wider">
                    {currentRole === 'admin_sede'
                      ? 'ADMINISTRADOR DE SEDE'
                      : 'ADMINISTRADOR GENERAL DE RESTAURANTE'}
                  </span>
                  {currentRole === 'admin_sede' && managedBranches.length > 1 && (
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-extrabold uppercase flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">hub</span>
                      Multi-Sede ({managedBranches.length})
                    </span>
                  )}
                </div>
                <h2 className="font-extrabold text-base sm:text-lg text-white mt-0.5">
                  {currentRole === 'admin_sede'
                    ? (currentAdmin?.name || currentBranch?.managerName || 'Lucía Ramos')
                    : (currentChain?.adminName || 'Roberto Morales')}
                </h2>
                <span className="text-xs text-slate-300">
                  {currentChain?.name} {currentRole === 'admin_sede' ? `• ${currentBranch?.name}` : `(${currentChain?.locations.length} Sedes)`}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 font-bold text-xs flex items-center gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              En Línea
            </span>
          </div>

          {/* Sede Selector Dropdown / Pills with Multi-Sede highlight */}
          <div className="bg-black/25 rounded-xl p-3 flex flex-col gap-2 border border-white/10">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-teal-300">location_on</span>
                <span>
                  {currentRole === 'admin_sede' && managedBranches.length > 1
                    ? `Sedes a tu cargo (${managedBranches.length} sedes):`
                    : 'Sede en Configuración Activa:'}
                </span>
              </span>
              <span className="text-[11px] text-teal-300 font-normal">
                {currentRole === 'admin_sede'
                  ? `${managedBranches.length} sede(s) autorizada(s)`
                  : `${currentChain?.locations.length} sedes registradas`}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {(currentRole === 'admin_sede' ? managedBranches : (currentChain?.locations || [])).map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    if (onSelectBranch) onSelectBranch(loc.id);
                    triggerToast(`Cambiando a vista de ${loc.name}`);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    loc.id === currentBranch?.id
                      ? 'bg-teal-400 text-slate-950 shadow-md ring-2 ring-white/20'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">store</span>
                  <span>{loc.name}</span>
                  {loc.id === currentBranch?.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
                  )}
                </button>
              ))}

              {/* General Admin Quick Sede Creation Trigger */}
              {currentRole !== 'admin_sede' && (
                <button
                  onClick={() => setShowAddSedeModal(true)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-400/40 flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>+ Agregar Sede</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="pb-3">
        <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
          <button
            onClick={() => handleSwitchTab('carta')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'carta'
                ? 'bg-surface-container-lowest text-primary shadow-sm ring-1 ring-primary/20'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
            <span>Carta Sede ({menuItems.length})</span>
          </button>

          <button
            onClick={() => handleSwitchTab('equipo')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'equipo'
                ? 'bg-surface-container-lowest text-primary shadow-sm ring-1 ring-primary/20'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">group</span>
            <span>Personal & Mozos ({staffInCurrentBranchCount})</span>
            {multiSedeStaffCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            )}
          </button>

          <button
            onClick={() => handleSwitchTab('sedes')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'sedes'
                ? 'bg-surface-container-lowest text-primary shadow-sm ring-1 ring-primary/20'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">store</span>
            <span>Sedes & Admins ({currentChain?.locations.length || 0})</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: CARTA & DISPONIBILIDAD DEL DÍA (EDITAR CARTA DE SEDE)            */}
      {/* ======================================================================= */}
      {activeTab === 'carta' && (
        <div className="flex flex-col gap-3">
          {/* Master Toggle: Carta Status for this Branch */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">restaurant</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-primary">
                      Carta {currentBranch?.name || 'Sede'}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isCartaActive
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {isCartaActive ? 'ACTIVA' : 'PAUSADA'}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Terminales de mozos, KDS y cobranzas sincronizados con esta sede
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => {
                  setIsCartaActive(!isCartaActive);
                  setHasUnsavedChanges(true);
                  triggerToast(isCartaActive ? 'Carta de sede pausada' : 'Carta de sede activada');
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                  isCartaActive ? 'bg-secondary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isCartaActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Sede Admin Actions & Filter Bar */}
          <div className="flex flex-col gap-2.5 bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  value={dishSearchQuery}
                  onChange={(e) => setDishSearchQuery(e.target.value)}
                  placeholder="Buscar plato en la carta de la sede..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                />
              </div>

              {/* Button: Add New Dish to this Sede */}
              <button
                onClick={() => setShowAddDishModal(true)}
                className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>+ Nuevo Plato</span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'ceviches', label: 'Ceviches' },
                { id: 'leches', label: 'Leches de Tigre' },
                { id: 'calientes', label: 'Calientes' },
                { id: 'arroces', label: 'Arroces' },
                { id: 'combinados', label: 'Combinados' },
                { id: 'jaleas', label: 'Jaleas' },
                { id: 'bebidas', label: 'Bebidas' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {cat.label}
                </button>
              ))}

              <button
                onClick={() => setOnlyShowPausedDishes(!onlyShowPausedDishes)}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap border transition-all cursor-pointer ${
                  onlyShowPausedDishes
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-surface-container text-on-surface-variant border-transparent'
                }`}
              >
                Solo Agotados
              </button>
            </div>
          </div>

          {/* Section Heading & Counter */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-on-surface">
              Platos en {currentBranch?.name || 'la sede'} ({filteredDishes.length})
            </span>
            <span className="text-[11px] text-teal-700 font-bold">
              {menuItems.filter((i) => i.available).length} disponibles • {menuItems.filter((i) => !i.available).length} agotados hoy
            </span>
          </div>

          {/* Dishes List */}
          <div className="flex flex-col gap-2.5">
            {filteredDishes.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl p-3 shadow-sm border flex items-center justify-between gap-3 transition-all ${
                  item.available
                    ? 'bg-surface-container-lowest border-outline-variant/30'
                    : 'bg-red-50/70 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-14 h-14 rounded-lg object-cover flex-shrink-0 border ${
                      item.available ? 'border-outline-variant/30' : 'grayscale opacity-60 border-red-300'
                    }`}
                  />

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-xs sm:text-sm text-on-surface truncate">
                        {item.name}
                      </span>
                      {item.tag && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold uppercase">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-extrabold text-primary">
                          S/ {item.price.toFixed(2)}
                        </span>
                        {item.sizes && item.sizes.length > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Mínimo
                          </span>
                        )}
                      </div>

                      {!item.available ? (
                        <span className="px-1.5 py-0.2 rounded bg-red-600 text-white font-bold text-[9px] uppercase tracking-wider">
                          AGOTADO HOY {item.stockNote ? `• ${item.stockNote}` : ''}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase tracking-wider">
                          DISPONIBLE
                        </span>
                      )}
                    </div>

                    {/* Sizes chips for this dish */}
                    {item.sizes && item.sizes.length > 0 && (
                      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                        <span className="text-[10px] text-on-surface-variant font-medium">Tamaños:</span>
                        {item.sizes.map((sz, szIdx) => (
                          <span
                            key={szIdx}
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold flex items-center gap-1 border ${
                              szIdx === 0
                                ? 'bg-secondary/10 text-secondary border-secondary/30 font-bold'
                                : 'bg-surface-container text-on-surface border-outline-variant/30'
                            }`}
                          >
                            <span>{sz.name}</span>
                            <span className="font-extrabold">S/ {sz.price.toFixed(2)}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sede Admin Dish Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Edit Dish Button */}
                  <button
                    onClick={() => openEditDishModal(item)}
                    title="Editar plato para esta sede"
                    className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary hover:text-primary-variant transition-all cursor-pointer flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>

                  {/* Toggle Availability Button */}
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      item.available
                        ? 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                        : 'bg-primary text-on-primary hover:bg-primary-container shadow-sm'
                    }`}
                  >
                    {item.available ? 'Pausar' : 'Activar'}
                  </button>
                </div>
              </div>
            ))}

            {filteredDishes.length === 0 && (
              <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-dashed border-outline-variant/40 flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
                <p className="text-xs text-on-surface-variant font-bold">
                  No se encontraron platos con los filtros seleccionados
                </p>
                <button
                  onClick={() => {
                    setDishSearchQuery('');
                    setSelectedCategoryFilter('all');
                    setOnlyShowPausedDishes(false);
                  }}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Restablecer filtros
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: PERSONAL & MOZOS (AGREGAR PERSONAL Y ASIGNACIÓN MULTI-SEDE)      */}
      {/* ======================================================================= */}
      {activeTab === 'equipo' && (
        <div className="flex flex-col gap-3">
          {/* Header & Subtitle */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-base text-primary">
                Personal de Salón, Barra y Caja
              </h3>
              <p className="text-xs text-on-surface-variant">
                Como administrador de sede, puedes registrar personal y asignarlo a una o más sedes a tu cargo con su mismo PIN.
              </p>
            </div>

            {/* Button: + Agregar Personal */}
            <button
              onClick={openAddStaffModal}
              className="px-3 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>+ Agregar Personal</span>
            </button>
          </div>

          {/* Filter & Search for Staff */}
          <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                  search
                </span>
                <input
                  type="text"
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  placeholder="Buscar personal por nombre o rol..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                />
              </div>

              {/* Sede Scope Filter Toggle */}
              <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setStaffFilterMode('current_sede')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    staffFilterMode === 'current_sede'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Esta Sede ({staffInCurrentBranchCount})
                </button>
                <button
                  onClick={() => setStaffFilterMode('all_managed')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    staffFilterMode === 'all_managed'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Multi-Sede ({staff.length})
                </button>
              </div>
            </div>
          </div>

          {/* Staff Cards List */}
          <div className="flex flex-col gap-2.5">
            {filteredStaff.map((member) => {
              const isAssignedToCurrentBranch = currentBranch ? member.assignedBranchIds.includes(currentBranch.id) : false;
              const isMultiSede = member.assignedBranchIds.length > 1;

              return (
                <div
                  key={member.id}
                  className={`bg-surface-container-lowest rounded-2xl p-4 shadow-sm border transition-all flex flex-col gap-3 ${
                    isAssignedToCurrentBranch
                      ? 'border-outline-variant/30'
                      : 'border-dashed border-outline-variant/50 opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl ${member.avatarColor || 'bg-teal-600'} text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs`}
                      >
                        {member.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-on-surface truncate">
                            {member.name}
                          </h4>
                          <span className="px-2 py-0.2 rounded-full bg-secondary-container text-on-secondary-container font-extrabold text-[10px]">
                            {member.role}
                          </span>
                          {isMultiSede && (
                            <span className="px-2 py-0.2 rounded-full bg-teal-100 text-teal-900 font-extrabold text-[9px] flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">hub</span>
                              Multi-Sede ({member.assignedBranchIds.length})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5 flex-wrap">
                          <span>{member.tablesZone || 'Zona General'}</span>
                          <span>•</span>
                          <span>{member.shift || 'Turno Completo'}</span>
                          {member.phone && (
                            <>
                              <span>•</span>
                              <span>📞 {member.phone}</span>
                            </>
                          )}
                        </div>

                        {/* PIN terminal badge */}
                        <div className="mt-1 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-teal-300 font-mono text-[10px] font-bold tracking-wider">
                            PIN TERMINAL: {member.pin}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          member.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {member.active ? 'En Turno' : 'Franco'}
                      </span>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditStaffModal(member)}
                        title="Editar personal y asignación de sedes"
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>

                      {/* Delete Button */}
                      {onDeleteStaff && (
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar al colaborador ${member.name}?`)) {
                              onDeleteStaff(member.id);
                              triggerToast(`Colaborador ${member.name} eliminado`);
                            }
                          }}
                          title="Eliminar colaborador"
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Multi-Sede Assignment Badges */}
                  <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-teal-700">storefront</span>
                        <span>Sedes donde está asignado este colaborador:</span>
                      </span>
                      <button
                        onClick={() => openEditStaffModal(member)}
                        className="text-primary font-bold hover:underline cursor-pointer"
                      >
                        Cambiar Sedes
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {member.assignedBranchIds.map((branchId) => {
                        const loc = currentChain?.locations.find((l) => l.id === branchId);
                        const isCurrent = loc?.id === currentBranch?.id;
                        return (
                          <span
                            key={branchId}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                              isCurrent
                                ? 'bg-secondary text-on-secondary shadow-xs'
                                : 'bg-surface-container text-on-surface border border-outline-variant/30'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {isCurrent ? 'check_circle' : 'location_on'}
                            </span>
                            <span>{loc?.name || branchId}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredStaff.length === 0 && (
              <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-dashed border-outline-variant/40 flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">person_off</span>
                <p className="text-xs text-on-surface-variant font-bold">
                  No hay colaboradores registrados con los criterios seleccionados
                </p>
                <button
                  onClick={openAddStaffModal}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold mt-1"
                >
                  + Registrar el primer colaborador
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 3: GESTIÓN DE SEDES Y SUS ADMINISTRADORES DE SEDE                   */}
      {/* ======================================================================= */}
      {activeTab === 'sedes' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-primary">
                Sedes de {currentChain?.name}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Supervisa cada sede y qué administrador está a cargo. Un administrador puede gestionar más de una sede.
              </p>
            </div>
            {currentRole !== 'admin_sede' && (
              <button
                onClick={() => setShowAddSedeModal(true)}
                className="px-3 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_location</span>
                <span>+ Nueva Sede</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {currentChain?.locations.map((loc) => {
              // Find the admin user responsible for this branch
              const assignedAdmin = admins.find(
                (a) =>
                  a.roleKey === 'admin_sede' &&
                  (a.assignedBranchIds?.includes(loc.id) || a.branchId === loc.id || a.name === loc.managerName)
              );

              const adminManagesMultiple = (assignedAdmin?.assignedBranchIds?.length || 1) > 1;

              return (
                <div
                  key={loc.id}
                  className={`bg-surface-container-lowest rounded-2xl p-4 shadow-sm border transition-all ${
                    loc.id === currentBranch?.id
                      ? 'border-secondary ring-1 ring-secondary/40'
                      : 'border-outline-variant/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center font-bold shrink-0">
                        <span className="material-symbols-outlined text-[20px]">store</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-primary">{loc.name}</h4>
                          {loc.id === currentBranch?.id && (
                            <span className="px-2 py-0.2 rounded-full bg-secondary-container text-on-secondary-container font-extrabold text-[9px] uppercase">
                              Activa en Pantalla
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-on-surface-variant">
                          📍 {loc.address} {loc.district ? `• ${loc.district}` : ''}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        loc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {loc.active ? 'Operativa' : 'Pausada'}
                    </span>
                  </div>

                  {/* Sede Administrator Details with Multi-Sede info */}
                  <div className="mt-3 bg-amber-500/10 rounded-xl p-3 border border-amber-500/20 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {assignedAdmin?.initials || loc.managerName.charAt(0) || 'A'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-extrabold text-amber-900 uppercase">
                            ADMINISTRADOR DE SEDE ASIGNADO:
                          </span>
                          {adminManagesMultiple && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 font-extrabold text-[9px]">
                              Gestiona {assignedAdmin?.assignedBranchIds?.length} sedes
                            </span>
                          )}
                        </div>

                        <span className="font-extrabold text-xs text-on-surface truncate">
                          {assignedAdmin?.name || loc.managerName}
                        </span>
                        <span className="text-[10px] text-on-surface-variant truncate">
                          {assignedAdmin?.email || loc.managerEmail || 'admin.sede@restaurante.pe'} • {loc.phone || '+51 1 445-0000'}
                        </span>
                      </div>
                    </div>

                    {assignedAdmin && (
                      <button
                        onClick={() => openManageAdminBranches(assignedAdmin)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">hub</span>
                        <span>Asignar Sedes</span>
                      </button>
                    )}
                  </div>

                  {/* Sede Quick Metrics & Enter Button */}
                  <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">
                      <strong>{loc.tables}</strong> mesas asignadas • <strong>S/ {loc.todaySales.toLocaleString()}</strong> hoy
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (onSelectBranch) onSelectBranch(loc.id);
                          setActiveTab('carta');
                          triggerToast(`Configurando carta de ${loc.name}`);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-all cursor-pointer"
                      >
                        Configurar Carta
                      </button>

                      <button
                        onClick={() => {
                          if (onSelectBranch) onSelectBranch(loc.id);
                          onNavigate('mesas');
                          triggerToast(`Ingresando al salón de ${loc.name}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                      >
                        <span>Ver Salón</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: EDITAR PLATO DE LA CARTA                                         */}
      {/* ======================================================================= */}
      {editingDish && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-outline-variant/40 animate-in zoom-in-95 my-8">
            <div className="px-6 py-4 bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-300 text-[24px]">edit_note</span>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Editar Plato en {currentBranch?.name}
                  </h3>
                  <p className="text-xs text-teal-200">
                    Ajusta precios, descripción y stock del día para esta sede.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingDish(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveDishChanges} className="p-6 flex flex-col gap-4">
              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Nombre del Plato *
                </label>
                <input
                  type="text"
                  value={editDishName}
                  onChange={(e) => setEditDishName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-xs text-on-surface">
                      Precio Base en Sede (S/.) *
                    </label>
                    {editDishSizes.length > 0 && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 font-extrabold px-1.5 py-0.2 rounded">
                        Mínimo automático
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={editDishPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditDishPrice(val);
                      if (editDishSizes.length > 0) {
                        // Keep minimum rule
                        const updated = [...editDishSizes];
                        updated[0].price = val;
                        setEditDishSizes(updated.sort((a, b) => a.price - b.price));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-extrabold text-primary"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Categoría *
                  </label>
                  <select
                    value={editDishCategory}
                    onChange={(e) => setEditDishCategory(e.target.value as MenuItem['category'])}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  >
                    <option value="ceviches">Ceviches</option>
                    <option value="leches">Leches de Tigre</option>
                    <option value="calientes">Calientes</option>
                    <option value="arroces">Arroces</option>
                    <option value="combinados">Combinados</option>
                    <option value="jaleas">Jaleas</option>
                    <option value="bebidas">Bebidas</option>
                  </select>
                </div>
              </div>

              {/* Tamaños y Presentaciones de la Sede */}
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
                    <label className="font-extrabold text-xs text-on-surface uppercase tracking-wide">
                      Tamaños y Presentaciones ({editDishSizes.length})
                    </label>
                  </div>
                  <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded">
                    Por defecto = Mínimo
                  </span>
                </div>

                <p className="text-[11px] text-on-surface-variant">
                  El sistema asigna por defecto el precio <strong>mínimo</strong> al mostrar el plato. Luego en salón el mesero puede seleccionar otros tamaños.
                </p>

                {/* List of existing sizes */}
                {editDishSizes.length > 0 ? (
                  <div className="space-y-1.5">
                    {editDishSizes.map((sz, szIdx) => (
                      <div
                        key={szIdx}
                        className="flex items-center justify-between bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/20 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">{sz.name}</span>
                          {szIdx === 0 && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-black text-[9px] uppercase">
                              ★ Mínimo por Defecto
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-primary">S/ {sz.price.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSizeFromEditDish(szIdx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                            title="Eliminar tamaño"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-surface-container-lowest text-center text-xs text-on-surface-variant border border-dashed border-outline-variant/40">
                    No tiene tamaños configurados aún. El plato tiene un único precio fijo.
                  </div>
                )}

                {/* Add new size input row */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newSizeInputName}
                    onChange={(e) => setNewSizeInputName(e.target.value)}
                    placeholder="Nuevo tamaño (ej. Familiar, Jarra 1L)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-on-surface-variant">
                      S/
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={newSizeInputPrice || ''}
                      onChange={(e) => setNewSizeInputPrice(Number(e.target.value))}
                      placeholder="Precio"
                      className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-surface-container-lowest text-xs text-on-surface font-bold border border-outline-variant/30 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSizeToEditDish}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer hover:bg-secondary/90 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Añadir</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Descripción / Ingredientes Frescos
                </label>
                <textarea
                  rows={2}
                  value={editDishDescription}
                  onChange={(e) => setEditDishDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Etiqueta Destacada
                  </label>
                  <input
                    type="text"
                    value={editDishTag}
                    onChange={(e) => setEditDishTag(e.target.value)}
                    placeholder="ej. MÁS PEDIDO, PESCA DEL DÍA"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Estado en esta Sede
                  </label>
                  <select
                    value={editDishAvailable ? 'true' : 'false'}
                    onChange={(e) => setEditDishAvailable(e.target.value === 'true')}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                  >
                    <option value="true">✅ Disponible</option>
                    <option value="false">❌ Agotado / Quiebre Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Nota de Stock / Motivo de Quiebre (Opcional)
                </label>
                <input
                  type="text"
                  value={editDishStockNote}
                  onChange={(e) => setEditDishStockNote(e.target.value)}
                  placeholder="ej. Solo 6 porciones de pesca fresca disponibles hoy"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: AGREGAR NUEVO PLATO A LA CARTA DE LA SEDE                        */}
      {/* ======================================================================= */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-outline-variant/40 animate-in zoom-in-95 my-8">
            <div className="px-6 py-4 bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-300 text-[24px]">add_circle</span>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Nuevo Plato para {currentBranch?.name}
                  </h3>
                  <p className="text-xs text-teal-200">
                    Crea un nuevo plato o especial del día para la carta de esta sede.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddDishModal(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateNewDish} className="p-6 flex flex-col gap-4">
              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Nombre del Plato *
                </label>
                <input
                  type="text"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="ej. Ceviche Carretillero Especial"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-xs text-on-surface">
                      Precio Base en Sede (S/.) *
                    </label>
                    {newDishSizes.length > 0 && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 font-extrabold px-1.5 py-0.2 rounded">
                        Mínimo automático
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={newDishPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setNewDishPrice(val);
                      if (newDishSizes.length > 0) {
                        const updated = [...newDishSizes];
                        updated[0].price = val;
                        setNewDishSizes(updated.sort((a, b) => a.price - b.price));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-extrabold text-primary"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Categoría *
                  </label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as MenuItem['category'])}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                  >
                    <option value="ceviches">Ceviches</option>
                    <option value="leches">Leches de Tigre</option>
                    <option value="calientes">Calientes</option>
                    <option value="arroces">Arroces</option>
                    <option value="combinados">Combinados</option>
                    <option value="jaleas">Jaleas</option>
                    <option value="bebidas">Bebidas</option>
                  </select>
                </div>
              </div>

              {/* Tamaños y Presentaciones para el Nuevo Plato */}
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
                    <label className="font-extrabold text-xs text-on-surface uppercase tracking-wide">
                      Tamaños y Presentaciones ({newDishSizes.length})
                    </label>
                  </div>
                  <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded">
                    Por defecto = Mínimo
                  </span>
                </div>

                <p className="text-[11px] text-on-surface-variant">
                  El sistema siempre asigna el precio <strong>mínimo</strong> como valor por defecto. Luego en salón el mesero puede seleccionar otros tamaños.
                </p>

                {/* List of existing sizes */}
                {newDishSizes.length > 0 ? (
                  <div className="space-y-1.5">
                    {newDishSizes.map((sz, szIdx) => (
                      <div
                        key={szIdx}
                        className="flex items-center justify-between bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/20 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">{sz.name}</span>
                          {szIdx === 0 && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-black text-[9px] uppercase">
                              ★ Mínimo por Defecto
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-primary">S/ {sz.price.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSizeFromNewDish(szIdx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                            title="Eliminar tamaño"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-surface-container-lowest text-center text-xs text-on-surface-variant border border-dashed border-outline-variant/40">
                    Sin tamaños adicionales. Se utilizará un precio único.
                  </div>
                )}

                {/* Add new size input row */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newDishSizeNameInput}
                    onChange={(e) => setNewDishSizeNameInput(e.target.value)}
                    placeholder="ej. Mediano, Familiar, Jarra 1L"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-on-surface-variant">
                      S/
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={newDishSizePriceInput || ''}
                      onChange={(e) => setNewDishSizePriceInput(Number(e.target.value))}
                      placeholder="Precio"
                      className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-surface-container-lowest text-xs text-on-surface font-bold border border-outline-variant/30 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSizeToNewDish}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer hover:bg-secondary/90 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Añadir</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Descripción / Ingredientes
                </label>
                <textarea
                  rows={2}
                  value={newDishDescription}
                  onChange={(e) => setNewDishDescription(e.target.value)}
                  placeholder="ej. Pesca fresca del día, con pota crocante, camote glaseado y choclo tierno."
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                />
              </div>

              {/* Preset Image Selector */}
              <div>
                <label className="font-bold text-xs text-on-surface block mb-1.5">
                  Foto del Plato (Selecciona una o ingresa URL)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {PRESET_DISH_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewDishImageUrl(preset.url)}
                      className={`relative rounded-lg overflow-hidden border p-1 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        newDishImageUrl === preset.url
                          ? 'border-primary ring-2 ring-primary/40 bg-teal-50'
                          : 'border-outline-variant/30 hover:border-primary/50'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-12 object-cover rounded" />
                      <span className="text-[10px] font-bold text-on-surface truncate w-full text-center">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={newDishImageUrl}
                  onChange={(e) => setNewDishImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-[11px] text-on-surface border border-outline-variant/30 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Etiqueta
                  </label>
                  <input
                    type="text"
                    value={newDishTag}
                    onChange={(e) => setNewDishTag(e.target.value)}
                    placeholder="ESPECIAL DE LA CASA"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Nota de Stock (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newDishStockNote}
                    onChange={(e) => setNewDishStockNote(e.target.value)}
                    placeholder="ej. Pesca del día limitada"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Publicar en Sede</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: AGREGAR / EDITAR PERSONAL (CON ASIGNACIÓN MULTI-SEDE)            */}
      {/* ======================================================================= */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-outline-variant/40 animate-in zoom-in-95 my-8">
            <div className="px-6 py-4 bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-300 text-[24px]">badge</span>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {editingStaffId ? 'Editar Personal' : 'Nuevo Colaborador en Sede'}
                  </h3>
                  <p className="text-xs text-teal-200">
                    Como administrador de sede, puedes asignar este colaborador a una o más sedes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStaffModal(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-6 flex flex-col gap-4">
              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="ej. Daniel Quispe Ramos"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Rol / Cargo *
                  </label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                  >
                    <option value="Mozo Salón">Mozo Salón</option>
                    <option value="Mozo Principal">Mozo Principal</option>
                    <option value="Mozo Terraza">Mozo Terraza</option>
                    <option value="Barman / Bebidas">Barman / Bebidas</option>
                    <option value="Cajero POS">Cajero POS</option>
                    <option value="Cocinero">Cocinero</option>
                    <option value="Jefe de Salón">Jefe de Salón</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    PIN de Terminal (4 dígitos) *
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={staffPin}
                    onChange={(e) => setStaffPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs font-mono font-bold tracking-widest text-primary border border-outline-variant/30 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    placeholder="+51 988 776 543"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Turno Asignado
                  </label>
                  <select
                    value={staffShift}
                    onChange={(e) => setStaffShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  >
                    <option value="Turno Mañana">Turno Mañana (11:00 - 17:00)</option>
                    <option value="Turno Tarde">Turno Tarde (16:00 - 23:00)</option>
                    <option value="Turno Completo">Turno Completo</option>
                    <option value="Rotativo">Rotativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Zona o Mesas Asignadas
                </label>
                <input
                  type="text"
                  value={staffTablesZone}
                  onChange={(e) => setStaffTablesZone(e.target.value)}
                  placeholder="ej. Mesas 1 a 6 / Terraza"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                />
              </div>

              {/* CRITICAL FEATURE: ASIGNACIÓN MULTI-SEDE */}
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 font-extrabold text-xs text-teal-950 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px] text-teal-700">hub</span>
                      <span>ASIGNACIÓN DE SEDES (MULTI-SEDE)</span>
                    </div>
                    <p className="text-[11px] text-teal-800 mt-0.5">
                      Un administrador de sede puede asignar a este mismo colaborador a más de una sede. El personal podrá operar con su mismo PIN en los terminales de las sedes marcadas:
                    </p>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white font-extrabold text-[10px] shrink-0">
                    {staffAssignedBranches.length} Sede(s)
                  </span>
                </div>

                {/* Quick actions for assigning */}
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={handleSelectOnlyCurrentBranchForStaff}
                    className="text-teal-700 font-bold hover:underline cursor-pointer"
                  >
                    Solo Sede Actual
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={handleSelectAllBranchesForStaff}
                    className="text-teal-700 font-bold hover:underline cursor-pointer"
                  >
                    Asignar a Todas las Sedes
                  </button>
                </div>

                {/* Branch Checkboxes */}
                <div className="flex flex-col gap-2 pt-1">
                  {currentChain?.locations.map((loc) => {
                    const isChecked = staffAssignedBranches.includes(loc.id);
                    return (
                      <label
                        key={loc.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-surface-container-lowest border-teal-600 shadow-xs'
                            : 'bg-white/50 border-outline-variant/30 opacity-75'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleStaffBranch(loc.id)}
                            className="w-4 h-4 text-teal-600 rounded border-outline focus:ring-teal-500 cursor-pointer"
                          />
                          <div className="flex flex-col">
                            <span className="font-extrabold text-xs text-on-surface">
                              {loc.name}
                            </span>
                            <span className="text-[10px] text-on-surface-variant">
                              📍 {loc.address} ({loc.tables} mesas)
                            </span>
                          </div>
                        </div>

                        {isChecked && (
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                            Asignado
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-on-surface">
                  <input
                    type="checkbox"
                    checked={staffActive}
                    onChange={(e) => setStaffActive(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-outline"
                  />
                  <span>Colaborador Activo (En Turno)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStaffModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>{editingStaffId ? 'Guardar Cambios' : 'Registrar Personal'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: GESTIONAR SEDES DE UN ADMINISTRADOR DE SEDE                      */}
      {/* ======================================================================= */}
      {managingAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-outline-variant/40 animate-in zoom-in-95 my-8">
            <div className="px-6 py-4 bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-300 text-[24px]">hub</span>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Sedes Asignadas al Administrador
                  </h3>
                  <p className="text-xs text-teal-200">
                    {managingAdmin.name} ({managingAdmin.role})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setManagingAdmin(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <p className="text-xs text-on-surface-variant">
                Un administrador de sede puede estar a cargo de más de una sede. Marca las sedes que este administrador podrá gestionar:
              </p>

              <div className="flex flex-col gap-2.5">
                {currentChain?.locations.map((loc) => {
                  const isChecked = tempAdminBranches.includes(loc.id);
                  return (
                    <label
                      key={loc.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-50/70 border-amber-500 shadow-xs'
                          : 'bg-surface-container-low border-outline-variant/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleAdminBranch(loc.id)}
                          className="w-4 h-4 text-amber-600 rounded border-outline focus:ring-amber-500 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="font-extrabold text-xs text-on-surface">
                            {loc.name}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">
                            📍 {loc.district || 'Lima'} • {loc.tables} mesas
                          </span>
                        </div>
                      </div>

                      {isChecked && (
                        <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                          A Cargo
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setManagingAdmin(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveAdminBranches}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Guardar Asignación</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: AGREGAR SEDE (DESDE ADMINISTRADOR GENERAL)                       */}
      {/* ======================================================================= */}
      {showAddSedeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-outline-variant/40 animate-in zoom-in-95 my-8">
            <div className="px-6 py-4 bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-300 text-[24px]">add_location_alt</span>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Aperturar Sede para {currentChain?.name}
                  </h3>
                  <p className="text-xs text-teal-200">
                    Como Administrador General, agrega una sede y nombra su Administrador de Sede.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddSedeModal(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSedeFromGeneralAdmin} className="p-6 flex flex-col gap-4">
              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Nombre de la Nueva Sede *
                </label>
                <input
                  type="text"
                  value={newSedeName}
                  onChange={(e) => setNewSedeName(e.target.value)}
                  placeholder="ej. Sede San Borja Chacarilla"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Distrito
                  </label>
                  <input
                    type="text"
                    value={newSedeDistrict}
                    onChange={(e) => setNewSedeDistrict(e.target.value)}
                    placeholder="San Borja"
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Mesas
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={80}
                    value={newSedeTables}
                    onChange={(e) => setNewSedeTables(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Dirección Exacta
                </label>
                <input
                  type="text"
                  value={newSedeAddress}
                  onChange={(e) => setNewSedeAddress(e.target.value)}
                  placeholder="Av. Primavera 650, San Borja"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                />
              </div>

              <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/30 flex flex-col gap-2">
                <span className="font-extrabold text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-amber-700">badge</span>
                  Administrador de Sede Designado
                </span>

                <div>
                  <label className="font-bold text-[11px] text-on-surface block mb-0.5">
                    Nombre del Administrador de Sede
                  </label>
                  <input
                    type="text"
                    value={newSedeManager}
                    onChange={(e) => setNewSedeManager(e.target.value)}
                    placeholder="ej. Daniel Arévalo"
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/30 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[11px] text-on-surface block mb-0.5">
                    Teléfono / WhatsApp de la Sede
                  </label>
                  <input
                    type="tel"
                    value={newSedePhone}
                    onChange={(e) => setNewSedePhone(e.target.value)}
                    placeholder="+51 988 554 433"
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddSedeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_location</span>
                  <span>Aperturar Sede</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Pending Changes Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-16 inset-x-4 max-w-2xl mx-auto z-40">
          <div className="bg-primary text-on-primary rounded-xl p-3 shadow-2xl flex items-center justify-between border border-secondary/40 animate-in slide-in-from-bottom-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-on-secondary">
                <span className="material-symbols-outlined text-[18px]">sync</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs">Cambios en Carta y Personal</span>
                <span className="text-[10px] text-primary-fixed-dim">
                  Modificaciones listas para sincronizar en POS y KDS
                </span>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-secondary hover:bg-teal-700 text-on-secondary font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Guardar</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {showToast && (
        <div className="fixed top-20 inset-x-4 max-w-md mx-auto z-50">
          <div className="bg-primary text-on-primary p-3 rounded-xl shadow-xl flex items-center gap-2 border border-secondary text-xs font-bold animate-in fade-in">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              check_circle
            </span>
            <span>{toastText}</span>
          </div>
        </div>
      )}
    </div>
  );
};
