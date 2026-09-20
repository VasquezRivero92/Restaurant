import React, { useState } from 'react';
import {
  MenuItem,
  ScreenType,
  ChainBrand,
  AdminUser,
  BranchLocation,
  AppRole,
  StaffMember,
  MasterCarta
} from '../types';
import { DEFAULT_DISH_PLACEHOLDER_IMAGE } from '../data/mockData';

interface ScreenCartaSedeProps {
  menuItems: MenuItem[];
  onToggleItemAvailability: (itemId: number) => void;
  onUpdateMenuItem?: (item: MenuItem) => void;
  onAddMenuItem?: (item: MenuItem) => void;
  onDeleteMenuItem?: (itemId: number) => void;
  onRestoreMenuItem?: (itemId: number) => void;
  onResetBranchMenu?: () => void;
  onNavigate: (screen: ScreenType) => void;
  chains?: ChainBrand[];
  admins?: AdminUser[];
  staff?: StaffMember[];
  masterCartas?: MasterCarta[];
  onAddStaff?: (staff: StaffMember) => void;
  onUpdateStaff?: (staff: StaffMember) => void;
  onDeleteStaff?: (staffId: string) => void;
  onUpdateAdminBranches?: (adminId: string, branchIds: string[]) => void;
  activeChainId?: string;
  activeBranchId?: string;
  onSelectBranch?: (branchId: string) => void;
  onSelectChain?: (chainId: string) => void;
  onAddLocation?: (chainId: string, newLocation: BranchLocation, managerAdmin?: AdminUser) => void;
  onUpdateLocation?: (chainId: string, updatedLocation: BranchLocation, managerAdmin?: AdminUser) => void;
  onUpdateChain?: (chain: ChainBrand) => void;
  currentRole?: AppRole;
  currentAdminName?: string;
  initialTab?: 'carta' | 'sedes' | 'equipo';
  onTabChange?: (tab: 'carta' | 'sedes' | 'equipo') => void;
}

// Preset appetizing images for Cevichería dishes
const PRESET_DISH_IMAGES = [
  { label: 'Sin imagen (Por defecto)', url: DEFAULT_DISH_PLACEHOLDER_IMAGE },
  { label: 'Ceviche Clásico', url: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=600&q=80' },
  { label: 'Ceviche Mixto', url: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=600&q=80' },
  { label: 'Arroz con Mariscos', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80' },
  { label: 'Arroz Chaufa Marino', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Jalea / Chicharrón', url: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=600&q=80' },
  { label: 'Parihuela / Sudado', url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80' },
  { label: 'Causa Limeña', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Arroz con Pollo Criollo', url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80' },
  { label: 'Chicha Morada Natural', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cerveza Helada', url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=600&q=80' }
];


export const ScreenCartaSede: React.FC<ScreenCartaSedeProps> = ({
  menuItems,
  onToggleItemAvailability,
  onUpdateMenuItem,
  onAddMenuItem,
  onDeleteMenuItem,
  onRestoreMenuItem,
  onResetBranchMenu,
  onNavigate,
  chains = [],
  admins = [],
  staff = [],
  masterCartas = [],
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onUpdateAdminBranches,
  activeChainId = 'la-barra',
  activeBranchId = 'loc-miraflores',
  onSelectBranch,
  onSelectChain,
  onAddLocation,
  onUpdateLocation,
  onUpdateChain,
  currentRole = 'admin_general',
  currentAdminName = 'Roberto Morales',
  initialTab,
  onTabChange
}) => {
  const currentChain = chains.find((c) => c.id === activeChainId) || chains[0];
  const currentBranch = currentChain?.locations.find((l) => l.id === activeBranchId) || currentChain?.locations[0];

  // Restaurant logo editing state
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [logoInputUrl, setLogoInputUrl] = useState(currentChain?.logoUrl || '');

  React.useEffect(() => {
    setLogoInputUrl(currentChain?.logoUrl || '');
  }, [currentChain?.id, currentChain?.logoUrl]);

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

  // Branch dish delete & restore state
  const [dishToDelete, setDishToDelete] = useState<MenuItem | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Identify assigned master carta
  const assignedMasterCarta = masterCartas.find((c) => c.id === currentChain?.assignedCartaId) ||
    masterCartas.find((c) => c.id === 'carta-la-barra');

  // Compute dishes present in assigned master carta but deleted from this specific branch
  const deletedDishesFromBranch: MenuItem[] = assignedMasterCarta
    ? assignedMasterCarta.dishes.filter((masterItem) => !menuItems.some((m) => m.id === masterItem.id))
    : [];

  // Filter in Personal
  const [staffFilterMode, setStaffFilterMode] = useState<'current_sede' | 'all_managed'>('current_sede');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  // Helper to load and optimize uploaded image files
  const handleImageFileUpload = (
    file: File,
    setImageUrl: (url: string) => void
  ) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      triggerToast('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            setImageUrl(compressed);
            triggerToast('Foto cargada y optimizada.');
          } else {
            setImageUrl(result);
            triggerToast('Foto cargada.');
          }
        };
        img.onerror = () => {
          setImageUrl(result);
          triggerToast('Foto cargada.');
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

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
  const [editDishImageUrl, setEditDishImageUrl] = useState('');
  const [editDishAllowSpiceLevel, setEditDishAllowSpiceLevel] = useState<boolean>(false);

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
    setEditDishImageUrl(dish.image || DEFAULT_DISH_PLACEHOLDER_IMAGE);
    setEditDishAllowSpiceLevel(
      dish.allowSpiceLevel !== undefined
        ? dish.allowSpiceLevel
        : ['ceviches', 'leches', 'calientes'].includes(dish.category)
    );
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
      available: editDishAvailable,
      image: editDishImageUrl.trim() || DEFAULT_DISH_PLACEHOLDER_IMAGE,
      allowSpiceLevel: editDishAllowSpiceLevel
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
  const [newDishImageUrl, setNewDishImageUrl] = useState(DEFAULT_DISH_PLACEHOLDER_IMAGE);
  const [newDishStockNote, setNewDishStockNote] = useState('');
  const [newDishAllowSpiceLevel, setNewDishAllowSpiceLevel] = useState<boolean>(true);

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
      image: newDishImageUrl.trim() || DEFAULT_DISH_PLACEHOLDER_IMAGE,
      available: true,
      stockNote: newDishStockNote.trim() || undefined,
      isDrink: newDishCategory === 'bebidas',
      allowSpiceLevel: newDishAllowSpiceLevel
    };

    if (onAddMenuItem) {
      onAddMenuItem(newDish);
    }
    setShowAddDishModal(false);
    setNewDishName('');
    setNewDishDescription('');
    setNewDishStockNote('');
    setNewDishImageUrl(DEFAULT_DISH_PLACEHOLDER_IMAGE);
    setNewDishAllowSpiceLevel(true);
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
  const [staffDocType, setStaffDocType] = useState<'DNI' | 'CE' | 'Pasaporte'>('DNI');
  const [staffDocNumber, setStaffDocNumber] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffTablesZone, setStaffTablesZone] = useState('Mesas 1 a 6');
  const [staffShift, setStaffShift] = useState('Turno Mañana');
  const [staffAssignedBranches, setStaffAssignedBranches] = useState<string[]>([currentBranch?.id || 'loc-miraflores']);
  const [staffActive, setStaffActive] = useState(true);

  // Solo la administración de la marca puede crear, editar o eliminar personal.
  const canManagePin = currentRole === 'admin_global' || currentRole === 'admin_general';
  const canManageStaff = canManagePin;

  const getStaffRoleKey = (role: string): AppRole => {
    const normalized = role.toLowerCase();
    if (normalized.includes('cocin')) return 'cocina';
    if (normalized.includes('caj')) return 'cajero';
    return 'mesero';
  };

  const openAddStaffModal = () => {
    if (!canManageStaff) {
      triggerToast('Solo el Administrador General o Global puede gestionar personal.');
      return;
    }
    setEditingStaffId(null);
    setStaffName('');
    setStaffRole('Mozo Salón');
    setStaffDocType('DNI');
    setStaffDocNumber('');
    setStaffEmail('');
    setStaffPin(Math.floor(100000 + Math.random() * 900000).toString());
    setStaffPhone('');
    setStaffTablesZone('Mesas 1 a 6');
    setStaffShift('Turno Mañana');
    // Pre-select current branch by default
    setStaffAssignedBranches([currentBranch?.id || 'loc-miraflores']);
    setStaffActive(true);
    setShowStaffModal(true);
  };

  const openEditStaffModal = (member: StaffMember) => {
    if (!canManageStaff) {
      triggerToast('Solo el Administrador General o Global puede gestionar personal.');
      return;
    }
    setEditingStaffId(member.id);
    setStaffName(member.name);
    setStaffRole(member.role);
    setStaffDocType(member.docType || 'DNI');
    setStaffDocNumber(member.docNumber || '');
    setStaffEmail(member.email || '');
    setStaffPin('');
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
    if (!canManageStaff) {
      triggerToast('No tienes permiso para gestionar personal.');
      return;
    }
    if (!staffName.trim()) {
      triggerToast('Ingresa el nombre del colaborador');
      return;
    }
    if (canManagePin && (staffPin.length !== 6 || !/^\d{6}$/.test(staffPin))) {
      triggerToast('El PIN debe tener exactamente 6 dígitos numéricos');
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
        roleKey: getStaffRoleKey(staffRole),
        pin: staffPin.trim(),
        docType: staffDocType,
        docNumber: staffDocNumber.trim() || undefined,
        email: staffEmail.trim() || undefined,
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
        roleKey: getStaffRoleKey(staffRole),
        pin: staffPin.trim(),
        docType: staffDocType,
        docNumber: staffDocNumber.trim() || undefined,
        email: staffEmail.trim() || undefined,
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

  // --------------------------------------------------------------------------
  // MODAL 6: EDITAR SEDE (ADMINISTRADOR GENERAL O GLOBAL)
  // --------------------------------------------------------------------------
  const [editingSede, setEditingSede] = useState<BranchLocation | null>(null);
  const [editSedeName, setEditSedeName] = useState('');
  const [editSedeAddress, setEditSedeAddress] = useState('');
  const [editSedeDistrict, setEditSedeDistrict] = useState('San Isidro');
  const [editSedeTables, setEditSedeTables] = useState(14);
  const [editSedeManager, setEditSedeManager] = useState('');
  const [editSedePhone, setEditSedePhone] = useState('');
  const [editSedeActive, setEditSedeActive] = useState(true);

  const handleOpenEditSede = (loc: BranchLocation) => {
    setEditingSede(loc);
    setEditSedeName(loc.name);
    setEditSedeAddress(loc.address);
    setEditSedeDistrict(loc.district || 'San Isidro');
    setEditSedeTables(loc.tables || 12);
    setEditSedeManager(loc.managerName || '');
    setEditSedePhone(loc.phone || '');
    setEditSedeActive(loc.active !== false);
  };

  const handleSaveEditSede = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSede || !currentChain) return;
    if (!editSedeName.trim()) {
      triggerToast('Ingresa el nombre de la sede');
      return;
    }

    const updatedLocation: BranchLocation = {
      ...editingSede,
      name: editSedeName.trim(),
      address: editSedeAddress.trim() || 'Av. Principal 100',
      district: editSedeDistrict.trim() || 'San Isidro',
      tables: Math.max(1, Number(editSedeTables) || 12),
      managerName: editSedeManager.trim() || editingSede.managerName,
      phone: editSedePhone.trim() || '+51 1 445-0000',
      active: editSedeActive
    };

    if (onUpdateLocation) {
      onUpdateLocation(currentChain.id, updatedLocation);
    }
    setEditingSede(null);
    triggerToast(`Sede "${updatedLocation.name}" actualizada con éxito`);
  };

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
    <div className="flex flex-col w-full pb-36 pt-2 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Global Superadmin Management Bar */}
      {currentRole === 'admin_global' && (
        <div className="mb-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 rounded-2xl border-2 border-amber-400/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              {currentChain?.logoUrl ? (
                <img src={currentChain.logoUrl} alt={currentChain.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                  Panel de Control Global • Superadmin
                </span>
                <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded text-[10px] font-extrabold">
                  ORDENA SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Administrando restaurante: <strong className="text-white">{currentChain?.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {chains.length > 1 && onSelectChain && (
              <div className="relative flex-1 sm:w-56">
                <select
                  value={activeChainId}
                  onChange={(e) => onSelectChain(e.target.value)}
                  aria-label="Seleccionar restaurante para administrar"
                  className="w-full text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl px-2.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  {chains.map((chain) => (
                    <option key={chain.id} value={chain.id} className="bg-slate-900 text-white">
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => onNavigate('saas-console')}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Consola Global</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Breadcrumb Context */}
      <div className="py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant flex-wrap">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span className="font-extrabold text-on-surface">{currentChain?.name || 'La Barra Sabrisimo'}</span>
          <span>•</span>
          <span className="font-bold text-secondary">{currentBranch?.name || 'Sede Principal La Mar'}</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container font-extrabold text-[10px] text-primary uppercase">
            {currentRole === 'admin_sede'
              ? 'Administrador de Sede'
              : currentRole === 'admin_global'
              ? 'Administrador Global'
              : 'Administrador General'}
          </span>
        </div>

        <button
          onClick={() => onNavigate(currentRole === 'admin_global' ? 'saas-console' : 'dashboard-admin')}
          className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">
            {currentRole === 'admin_global' ? 'public' : 'dashboard'}
          </span>
          <span>{currentRole === 'admin_global' ? 'Consola Global' : 'Panel de Resumen'}</span>
        </button>
      </div>

      {/* Role & Restaurant Scope Card */}
      <div className="pb-3">
        <div className="bg-primary text-on-primary rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col gap-3.5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 shadow-sm">
                {currentChain?.logoUrl ? (
                  <img src={currentChain.logoUrl} alt={currentChain.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[24px]">
                    {currentRole === 'admin_sede'
                      ? 'storefront'
                      : currentRole === 'admin_global'
                      ? 'admin_panel_settings'
                      : 'corporate_fare'}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-teal-400/20 text-teal-300 text-[10px] font-extrabold uppercase tracking-wider">
                    {currentRole === 'admin_sede'
                      ? 'ADMINISTRADOR DE SEDE'
                      : currentRole === 'admin_global'
                      ? 'ADMINISTRADOR GLOBAL'
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
                    : currentRole === 'admin_global'
                    ? (currentAdminName || 'José Manuel Vasquez Rivero (Admin Global)')
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
          {/* Base Carta Matriz Info Banner */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-teal-500/10 border border-primary/20 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px]">menu_book</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-primary truncate">
                    Carta Matriz: {assignedMasterCarta?.name || 'Carta Oficial'}
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-primary/10 text-primary font-extrabold text-[10px]">
                    {assignedMasterCarta?.dishes.length || 38} platos base
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Asignada desde el Panel Global • Cada sede puede desactivar, retirar o sumar platos propios
                </span>
              </div>
            </div>

            {onResetBranchMenu && (
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(true)}
                className="px-2.5 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer self-end sm:self-center"
                title="Restablecer toda la carta de esta sede al menú base asignado por el Admin Global"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Restablecer Carta Matriz</span>
              </button>
            )}
          </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
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
                  <div className="relative group shrink-0">
                    <img
                      src={item.image || DEFAULT_DISH_PLACEHOLDER_IMAGE}
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_DISH_PLACEHOLDER_IMAGE;
                      }}
                      referrerPolicy="no-referrer"
                      className={`w-14 h-14 rounded-lg object-cover flex-shrink-0 border ${
                        item.available ? 'border-outline-variant/30' : 'grayscale opacity-60 border-red-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => openEditDishModal(item)}
                      title="Editar foto y plato"
                      className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 rounded-lg flex flex-col items-center justify-center text-white transition-opacity cursor-pointer text-[10px] font-bold gap-0.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </button>
                  </div>

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

                      {/* Botón rápido / Badge para Activar o Desactivar Picante */}
                      {item.category !== 'bebidas' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onUpdateMenuItem) {
                              const nextSpice = item.allowSpiceLevel === false ? true : false;
                              onUpdateMenuItem({ ...item, allowSpiceLevel: nextSpice });
                              triggerToast(`Nivel de picante para "${item.name}" ${nextSpice ? 'ACTIVADO' : 'DESACTIVADO'}`);
                            }
                          }}
                          title={
                            item.allowSpiceLevel
                              ? 'Opción de picante activada. Clic para desactivar'
                              : 'Opción de picante desactivada. Clic para activar'
                          }
                          className={`px-2 py-0.5 rounded text-[9px] font-black flex items-center gap-1 cursor-pointer transition-all border ${
                            item.allowSpiceLevel
                              ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 shadow-2xs'
                              : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high'
                          }`}
                        >
                          <span>🌶️</span>
                          <span>{item.allowSpiceLevel ? 'Picante: Sí' : 'Picante: No'}</span>
                        </button>
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

                  {/* Delete Dish from this Sede Button */}
                  {onDeleteMenuItem && (
                    <button
                      onClick={() => setDishToDelete(item)}
                      title="Retirar plato de esta sede"
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-all cursor-pointer flex items-center justify-center border border-red-200"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
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

          {/* Platos Retirados de esta Sede (Recuperables desde la Carta Matriz) */}
          {deletedDishesFromBranch.length > 0 && (
            <div className="mt-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 text-[20px]">inventory_2</span>
                  <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
                    Platos retirados de esta sede ({deletedDishesFromBranch.length})
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Carta Matriz
                </span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Estos platos pertenecen a la Carta Matriz asignada ({assignedMasterCarta?.name}), pero han sido retirados de {currentBranch?.name || 'esta sede'}. Puedes volver a incorporarlos en cualquier momento:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {deletedDishesFromBranch.map((delDish) => (
                  <div
                    key={delDish.id}
                    className="bg-white rounded-xl p-2.5 border border-amber-200/60 shadow-xs flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={delDish.image || DEFAULT_DISH_PLACEHOLDER_IMAGE}
                        alt={delDish.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_DISH_PLACEHOLDER_IMAGE;
                        }}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover grayscale opacity-70 shrink-0 border border-amber-200"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-extrabold text-on-surface truncate">
                          {delDish.name}
                        </span>
                        <span className="text-[10px] text-primary font-bold">
                          Desde S/ {delDish.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {onRestoreMenuItem && (
                      <button
                        type="button"
                        onClick={() => {
                          onRestoreMenuItem(delDish.id);
                          triggerToast(`Plato "${delDish.name}" restaurado a la carta de esta sede`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0 transition-colors shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        <span>Restaurar</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: PERSONAL & MOZOS (AGREGAR PERSONAL Y ASIGNACIÓN MULTI-SEDE)      */}
      {/* ======================================================================= */}
      {activeTab === 'equipo' && (
        <div className="flex flex-col gap-3">
          {/* Header & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-primary">
                Personal de Salón, Barra y Caja
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Como administrador de sede, puedes registrar personal y asignarlo a una o más sedes a tu cargo con su mismo PIN.
              </p>
            </div>

            {/* Button: + Agregar Personal */}
            <button
              onClick={openAddStaffModal}
              disabled={!canManageStaff}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0 min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span>+ Agregar Personal</span>
            </button>
          </div>

          {/* Filter & Search for Staff */}
          <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                placeholder="Buscar personal por nombre o rol..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary min-h-[40px]"
              />
            </div>

            {/* Sede Scope Filter Toggle */}
            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg text-xs font-bold shrink-0">
              <button
                onClick={() => setStaffFilterMode('current_sede')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-all cursor-pointer text-center ${
                  staffFilterMode === 'current_sede'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Esta Sede ({staffInCurrentBranchCount})
              </button>
              <button
                onClick={() => setStaffFilterMode('all_managed')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition-all cursor-pointer text-center ${
                  staffFilterMode === 'all_managed'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Multi-Sede ({staff.length})
              </button>
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

                        <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-bold text-slate-800 border border-slate-200">
                            {member.docType || 'DNI'}: {member.docNumber || 'No registrado'}
                          </span>
                          {member.email && (
                            <span className="text-[11px] text-slate-600 truncate max-w-[200px]">
                              ✉️ {member.email}
                            </span>
                          )}
                          <span>•</span>
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

                        {/* PIN terminal badge (6 dígitos) */}
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-teal-300 font-mono text-[10px] font-bold tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-teal-400">key</span>
                            <span>PIN (6 DÍGITOS): {canManagePin ? member.pin : '••••••'}</span>
                          </span>
                          {canManagePin ? (
                            <button
                              type="button"
                              onClick={() => openEditStaffModal(member)}
                              disabled={!canManageStaff}
                              className="text-[10px] text-teal-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              <span>Cambiar PIN</span>
                            </button>
                          ) : (
                            <span className="text-[9px] text-on-surface-variant italic">
                              (Definido por Admin General/Global)
                            </span>
                          )}
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
                        disabled={!canManageStaff}
                        title="Editar personal y asignación de sedes"
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>

                      {/* Delete Button */}
                      {canManageStaff && onDeleteStaff && (
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
                        disabled={!canManageStaff}
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
                  disabled={!canManageStaff}
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

          {/* Restaurant Branding & Logo Management Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-surface-container border border-outline-variant/40 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {currentChain?.logoUrl ? (
                    <img src={currentChain.logoUrl} alt={currentChain.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[28px] text-on-surface-variant">restaurant</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-primary">
                      Logo & Identidad de Marca: {currentChain?.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-extrabold">
                      En Línea
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Este logo brandea el login con PIN de tu personal, comandas móviles, KDS de cocina y panel de control.
                  </p>
                </div>
              </div>

              {(currentRole === 'admin_general' || currentRole === 'admin_global') && !isEditingLogo && (
                <button
                  type="button"
                  onClick={() => {
                    setLogoInputUrl(currentChain?.logoUrl || '');
                    setIsEditingLogo(true);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-secondary text-secondary hover:bg-secondary/10 font-extrabold text-xs flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Cambiar Logo</span>
                </button>
              )}
            </div>

            {isEditingLogo && (
              <div className="pt-3 border-t border-outline-variant/20 flex flex-col gap-2.5">
                <label className="font-bold text-xs text-on-surface">
                  URL de la imagen del logo del restaurante
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={logoInputUrl}
                    onChange={(e) => setLogoInputUrl(e.target.value)}
                    placeholder="https://... URL de la imagen del logo"
                    className="flex-1 px-3 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-medium"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentChain && onUpdateChain) {
                          onUpdateChain({
                            ...currentChain,
                            logoUrl: logoInputUrl.trim() || undefined
                          });
                          triggerToast(`¡Logo de ${currentChain.name} actualizado!`);
                        }
                        setIsEditingLogo(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-black shadow-sm cursor-pointer"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingLogo(false)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-on-surface-variant font-medium">Logos sugeridos:</span>
                  {[
                    { label: 'Cevichería', url: 'https://images.unsplash.com/photo-1535399831379-5b7eb9bf6316?auto=format&fit=crop&w=200&q=80' },
                    { label: 'Marino Azul', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80' },
                    { label: 'Pescadería', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80' },
                    { label: 'Gourmet', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setLogoInputUrl(preset.url)}
                      className="px-2 py-0.5 rounded-md bg-surface-container hover:bg-secondary/20 text-[10px] font-bold text-secondary border border-outline-variant/20 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
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

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(currentRole === 'admin_general' || currentRole === 'admin_global') && (
                        <button
                          onClick={() => handleOpenEditSede(loc)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                          title="Editar datos de esta sede"
                        >
                          <span className="material-symbols-outlined text-[15px] text-amber-700">edit</span>
                          <span>Editar Sede</span>
                        </button>
                      )}

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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-2xl lg:max-w-3xl max-h-[92dvh] sm:max-h-[90vh] flex flex-col overflow-hidden border-t sm:border border-outline-variant/40 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            {/* Header del Modal - Siempre fijo en la parte superior */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 bg-primary text-on-primary flex items-center justify-between shrink-0 border-b border-white/10 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-teal-300 shrink-0">
                  <span className="material-symbols-outlined text-[22px]">edit_note</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                    Editar Plato en {currentBranch?.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-teal-200 truncate">
                    Ajusta precios, foto, variantes, picante y stock del día para esta sede
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingDish(null)}
                className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer shrink-0 transition-colors"
                title="Cerrar modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveDishChanges} className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Cuerpo del Formulario con scroll independiente y fluido */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
                {/* Bloque 1: Datos Principales */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Nombre del Plato *
                    </label>
                    <input
                      type="text"
                      value={editDishName}
                      onChange={(e) => setEditDishName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-xs text-on-surface">
                        Precio Base (S/.) *
                      </label>
                      {editDishSizes.length > 0 && (
                        <span className="text-[9px] text-emerald-700 bg-emerald-100 font-extrabold px-1 rounded">
                          Mínimo
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
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-extrabold text-primary"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Categoría *
                    </label>
                    <select
                      value={editDishCategory}
                      onChange={(e) => setEditDishCategory(e.target.value as MenuItem['category'])}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
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

                {/* Bloque 2: Descripción */}
                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Descripción / Ingredientes Frescos
                  </label>
                  <textarea
                    rows={2}
                    value={editDishDescription}
                    onChange={(e) => setEditDishDescription(e.target.value)}
                    placeholder="Describe los ingredientes principales o sugerencias del chef..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Bloque 3: Tamaños y Presentaciones */}
                <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-2xl border border-outline-variant/30 space-y-2.5">
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
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {editDishSizes.map((sz, szIdx) => (
                        <div
                          key={szIdx}
                          className="flex items-center justify-between bg-surface-container-lowest px-3 py-2 rounded-xl border border-outline-variant/20 text-xs"
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
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer transition-colors"
                              title="Eliminar tamaño"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-surface-container-lowest text-center text-xs text-on-surface-variant border border-dashed border-outline-variant/40">
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
                      className="flex-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                        className="w-full pl-7 pr-2 py-1.5 rounded-xl bg-surface-container-lowest text-xs text-on-surface font-bold border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSizeToEditDish}
                      className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer shrink-0 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Añadir</span>
                    </button>
                  </div>
                </div>

                {/* Bloque 4: Fotografía del Plato */}
                <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-2xl border border-outline-variant/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-primary">add_photo_alternate</span>
                      <label className="font-extrabold text-xs text-on-surface uppercase tracking-wide">
                        Fotografía del Plato
                      </label>
                    </div>
                    {editDishImageUrl === DEFAULT_DISH_PLACEHOLDER_IMAGE ? (
                      <span className="text-[10px] text-amber-800 bg-amber-100 font-extrabold px-2 py-0.5 rounded">
                        Imagen por Defecto
                      </span>
                    ) : editDishImageUrl.startsWith('data:') ? (
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 font-extrabold px-2 py-0.5 rounded">
                        Foto desde Equipo
                      </span>
                    ) : (
                      <span className="text-[10px] text-blue-800 bg-blue-100 font-extrabold px-2 py-0.5 rounded">
                        Foto Catálogo / Web
                      </span>
                    )}
                  </div>

                  {/* Previsualización actual + Acciones de Carga */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-outline-variant/40 shadow-xs bg-surface-container-lowest">
                      <img
                        src={editDishImageUrl || DEFAULT_DISH_PLACEHOLDER_IMAGE}
                        alt="Vista previa"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_DISH_PLACEHOLDER_IMAGE;
                        }}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                          <span className="material-symbols-outlined text-[16px]">upload</span>
                          <span>Subir Foto del Plato</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleImageFileUpload(e.target.files[0], setEditDishImageUrl);
                              }
                            }}
                          />
                        </label>

                        {editDishImageUrl !== DEFAULT_DISH_PLACEHOLDER_IMAGE && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditDishImageUrl(DEFAULT_DISH_PLACEHOLDER_IMAGE);
                              triggerToast('Foto restablecida a imagen por defecto');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-bold text-[11px] flex items-center gap-1 border border-outline-variant/30 cursor-pointer transition-colors"
                            title="Restablecer imagen por defecto"
                          >
                            <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                            <span>Quitar / Por Defecto</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-on-surface-variant">
                        Formatos JPG, PNG o WebP. Se redimensionan automáticamente para carga ultra rápida.
                      </p>
                    </div>
                  </div>

                  {/* Galería de Selección Rápida */}
                  <div>
                    <span className="text-[11px] font-bold text-on-surface block mb-1.5">
                      O selecciona una fotografía sugerida del catálogo:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_DISH_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditDishImageUrl(preset.url)}
                          className={`relative rounded-xl overflow-hidden border p-1 flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
                            editDishImageUrl === preset.url
                              ? 'border-primary ring-2 ring-primary/40 bg-teal-50 shadow-xs'
                              : 'border-outline-variant/30 hover:border-primary/50 bg-surface-container-lowest'
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-11 object-cover rounded-lg"
                          />
                          <span className="text-[9px] font-bold text-on-surface truncate w-full text-center mt-0.5">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Campo URL directo */}
                  <div>
                    <label className="text-[11px] font-bold text-on-surface block mb-1">
                      O pega el enlace web de la imagen (URL directa):
                    </label>
                    <input
                      type="url"
                      value={editDishImageUrl}
                      onChange={(e) => setEditDishImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-xl bg-surface-container-lowest text-[11px] text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                    />
                  </div>
                </div>

                {/* Bloque 5: Configuración de Salón y Cocina */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Etiqueta Destacada
                    </label>
                    <input
                      type="text"
                      value={editDishTag}
                      onChange={(e) => setEditDishTag(e.target.value)}
                      placeholder="ej. MÁS PEDIDO, PESCA DEL DÍA"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Estado en esta Sede
                    </label>
                    <select
                      value={editDishAvailable ? 'true' : 'false'}
                      onChange={(e) => setEditDishAvailable(e.target.value === 'true')}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Opción de Nivel de Picante */}
                <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0">🌶️</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="font-extrabold text-xs text-on-surface">
                          Nivel de Picante al Ordenar
                        </label>
                        {editDishAllowSpiceLevel ? (
                          <span className="text-[10px] text-red-800 bg-red-100 font-extrabold px-1.5 py-0.2 rounded border border-red-200">
                            Activado en salón
                          </span>
                        ) : (
                          <span className="text-[10px] text-on-surface-variant bg-surface-container font-extrabold px-1.5 py-0.2 rounded">
                            Desactivado
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {editDishAllowSpiceLevel
                          ? 'Los meseros y clientes podrán elegir el picante (Sin ají, Moderado o Bien Bravo) al tomar el pedido.'
                          : 'El plato se preparará de manera estándar sin solicitar nivel de picante.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditDishAllowSpiceLevel(!editDishAllowSpiceLevel)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      editDishAllowSpiceLevel ? 'bg-red-600' : 'bg-surface-container-highest'
                    }`}
                    title={editDishAllowSpiceLevel ? 'Desactivar nivel de picante' : 'Activar nivel de picante'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        editDishAllowSpiceLevel ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Pie del Modal: Siempre visible / Sticky con botones cómodos */}
              <div className="shrink-0 bg-surface-container-lowest px-4 py-3 sm:px-6 sm:py-3.5 border-t border-outline-variant/20 flex items-center justify-end gap-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all cursor-pointer min-h-[42px] flex items-center justify-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer min-h-[42px]"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-2xl lg:max-w-3xl max-h-[92dvh] sm:max-h-[90vh] flex flex-col overflow-hidden border-t sm:border border-outline-variant/40 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            {/* Header del Modal - Siempre visible */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 bg-primary text-on-primary flex items-center justify-between shrink-0 border-b border-white/10 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-teal-300 shrink-0">
                  <span className="material-symbols-outlined text-[22px]">add_circle</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                    Nuevo Plato para {currentBranch?.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-teal-200 truncate">
                    Crea un nuevo plato o especial del día para la carta de esta sede
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDishModal(false)}
                className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer shrink-0 transition-colors"
                title="Cerrar modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateNewDish} className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Cuerpo del Formulario Desplazable */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
                {/* Bloque 1: Datos Principales */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Nombre del Plato *
                    </label>
                    <input
                      type="text"
                      value={newDishName}
                      onChange={(e) => setNewDishName(e.target.value)}
                      placeholder="ej. Ceviche Carretillero Especial"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-xs text-on-surface">
                        Precio Base (S/.) *
                      </label>
                      {newDishSizes.length > 0 && (
                        <span className="text-[9px] text-emerald-700 bg-emerald-100 font-extrabold px-1 rounded">
                          Mínimo
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
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-extrabold text-primary"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Categoría *
                    </label>
                    <select
                      value={newDishCategory}
                      onChange={(e) => setNewDishCategory(e.target.value as MenuItem['category'])}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
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

                {/* Bloque 2: Descripción */}
                <div>
                  <label className="font-bold text-xs text-on-surface block mb-1">
                    Descripción / Ingredientes
                  </label>
                  <textarea
                    rows={2}
                    value={newDishDescription}
                    onChange={(e) => setNewDishDescription(e.target.value)}
                    placeholder="ej. Pesca fresca del día, con pota crocante, camote glaseado y choclo tierno."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Bloque 3: Tamaños y Presentaciones */}
                <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-2xl border border-outline-variant/30 space-y-2.5">
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
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {newDishSizes.map((sz, szIdx) => (
                        <div
                          key={szIdx}
                          className="flex items-center justify-between bg-surface-container-lowest px-3 py-2 rounded-xl border border-outline-variant/20 text-xs"
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
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer transition-colors"
                              title="Eliminar tamaño"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-surface-container-lowest text-center text-xs text-on-surface-variant border border-dashed border-outline-variant/40">
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
                      className="flex-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                        className="w-full pl-7 pr-2 py-1.5 rounded-xl bg-surface-container-lowest text-xs text-on-surface font-bold border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSizeToNewDish}
                      className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer shrink-0 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Añadir</span>
                    </button>
                  </div>
                </div>

                {/* Bloque 4: Fotografía del Plato */}
                <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-2xl border border-outline-variant/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-primary">add_photo_alternate</span>
                      <label className="font-extrabold text-xs text-on-surface uppercase tracking-wide">
                        Fotografía del Plato
                      </label>
                    </div>
                    {newDishImageUrl === DEFAULT_DISH_PLACEHOLDER_IMAGE ? (
                      <span className="text-[10px] text-amber-800 bg-amber-100 font-extrabold px-2 py-0.5 rounded">
                        Por Defecto (Sin imagen)
                      </span>
                    ) : newDishImageUrl.startsWith('data:') ? (
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 font-extrabold px-2 py-0.5 rounded">
                        Foto desde Equipo
                      </span>
                    ) : (
                      <span className="text-[10px] text-blue-800 bg-blue-100 font-extrabold px-2 py-0.5 rounded">
                        Foto Catálogo / Web
                      </span>
                    )}
                  </div>

                  {/* Previsualización y Carga de Archivo */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-outline-variant/40 shadow-xs bg-surface-container-lowest">
                      <img
                        src={newDishImageUrl || DEFAULT_DISH_PLACEHOLDER_IMAGE}
                        alt="Vista previa nuevo plato"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_DISH_PLACEHOLDER_IMAGE;
                        }}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                          <span className="material-symbols-outlined text-[16px]">upload</span>
                          <span>Subir Foto del Plato</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleImageFileUpload(e.target.files[0], setNewDishImageUrl);
                              }
                            }}
                          />
                        </label>

                        {newDishImageUrl !== DEFAULT_DISH_PLACEHOLDER_IMAGE && (
                          <button
                            type="button"
                            onClick={() => {
                              setNewDishImageUrl(DEFAULT_DISH_PLACEHOLDER_IMAGE);
                              triggerToast('Foto restablecida a imagen por defecto');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant font-bold text-[11px] flex items-center gap-1 border border-outline-variant/30 cursor-pointer transition-colors"
                            title="Restablecer imagen por defecto"
                          >
                            <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                            <span>Por Defecto</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-on-surface-variant">
                        Por defecto se asigna el ícono oficial sin imagen hasta que subas una foto o selecciones una de la galería.
                      </p>
                    </div>
                  </div>

                  {/* Galería de Selección Rápida */}
                  <div>
                    <span className="text-[11px] font-bold text-on-surface block mb-1.5">
                      O selecciona una fotografía sugerida del catálogo:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_DISH_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewDishImageUrl(preset.url)}
                          className={`relative rounded-xl overflow-hidden border p-1 flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
                            newDishImageUrl === preset.url
                              ? 'border-primary ring-2 ring-primary/40 bg-teal-50 shadow-xs'
                              : 'border-outline-variant/30 hover:border-primary/50 bg-surface-container-lowest'
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-11 object-cover rounded-lg"
                          />
                          <span className="text-[9px] font-bold text-on-surface truncate w-full text-center mt-0.5">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Campo URL directo */}
                  <div>
                    <label className="text-[11px] font-bold text-on-surface block mb-1">
                      O pega el enlace web de la imagen (URL):
                    </label>
                    <input
                      type="url"
                      value={newDishImageUrl}
                      onChange={(e) => setNewDishImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-xl bg-surface-container-lowest text-[11px] text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                    />
                  </div>
                </div>

                {/* Bloque 5: Configuración de Salón y Cocina */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Etiqueta
                    </label>
                    <input
                      type="text"
                      value={newDishTag}
                      onChange={(e) => setNewDishTag(e.target.value)}
                      placeholder="ESPECIAL DE LA CASA"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Opción de Nivel de Picante para el Nuevo Plato */}
                <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0">🌶️</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="font-extrabold text-xs text-on-surface">
                          Nivel de Picante al Ordenar
                        </label>
                        {newDishAllowSpiceLevel ? (
                          <span className="text-[10px] text-red-800 bg-red-100 font-extrabold px-1.5 py-0.2 rounded border border-red-200">
                            Activado en salón
                          </span>
                        ) : (
                          <span className="text-[10px] text-on-surface-variant bg-surface-container font-extrabold px-1.5 py-0.2 rounded">
                            Desactivado
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {newDishAllowSpiceLevel
                          ? 'Al ordenar, se solicitará al cliente o mesero el grado de ají deseado (Sin ají, Moderado o Bien Bravo).'
                          : 'El plato se ordenará directamente sin opción de nivel de picante.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNewDishAllowSpiceLevel(!newDishAllowSpiceLevel)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      newDishAllowSpiceLevel ? 'bg-red-600' : 'bg-surface-container-highest'
                    }`}
                    title={newDishAllowSpiceLevel ? 'Desactivar nivel de picante' : 'Activar nivel de picante'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        newDishAllowSpiceLevel ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Pie del Modal: Fijo y siempre visible */}
              <div className="shrink-0 bg-surface-container-lowest px-4 py-3 sm:px-6 sm:py-3.5 border-t border-outline-variant/20 flex items-center justify-end gap-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all cursor-pointer min-h-[42px] flex items-center justify-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer min-h-[42px]"
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
      {/* ======================================================================= */}
      {/* MODAL: AGREGAR / EDITAR PERSONAL (RESPONSIVO MÓVIL Y DESKTOP)            */}
      {/* ======================================================================= */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[92dvh] sm:max-h-[90vh] flex flex-col overflow-hidden border-t sm:border border-outline-variant/40 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            {/* Header del Modal */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-primary text-on-primary flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-teal-300 shrink-0">
                  <span className="material-symbols-outlined text-[22px]">badge</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                    {editingStaffId ? 'Editar Personal' : 'Nuevo Colaborador en Sede'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-teal-200 truncate">
                    Asigna este colaborador y sedes con PIN de 6 dígitos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStaffModal(false)}
                className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer shrink-0 transition-colors"
                title="Cerrar"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Cuerpo del Formulario desplazable */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 overscroll-contain">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Tipo de Doc. *
                    </label>
                    <select
                      value={staffDocType}
                      onChange={(e) => setStaffDocType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold min-h-[44px]"
                    >
                      <option value="DNI">DNI (8 dígitos)</option>
                      <option value="CE">Carnet Extr. (CE)</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      N° de Documento *
                    </label>
                    <input
                      type="text"
                      maxLength={staffDocType === 'DNI' ? 8 : 15}
                      value={staffDocNumber}
                      onChange={(e) => setStaffDocNumber(e.target.value.replace(staffDocType === 'DNI' ? /\D/g : /[^a-zA-Z0-9]/g, ''))}
                      placeholder={staffDocType === 'DNI' ? '48201945' : 'N° Documento'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono font-bold min-h-[44px]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      placeholder="ej. Daniel Quispe Ramos"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold min-h-[44px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="daniel.quispe@restaurante.pe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Rol / Cargo *
                    </label>
                    <select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold min-h-[44px]"
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-xs text-on-surface flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-teal-600">lock</span>
                        <span>PIN de Terminal (6 dígitos) *</span>
                      </label>
                      {canManagePin && (
                        <button
                          type="button"
                          onClick={() => setStaffPin(Math.floor(100000 + Math.random() * 900000).toString())}
                          className="text-[10px] text-teal-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5 bg-teal-50 px-2 py-0.5 rounded-md"
                        >
                          <span className="material-symbols-outlined text-[13px]">autorenew</span>
                          <span>Generar</span>
                        </button>
                      )}
                    </div>

                    {canManagePin ? (
                      <div>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          value={staffPin}
                          onChange={(e) => setStaffPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="6 dígitos"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-sm font-mono font-bold tracking-widest text-primary border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
                          required
                        />
                        <p className="text-[10px] text-teal-800 font-semibold mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-teal-600">verified_user</span>
                          <span>PIN de 6 dígitos para ingresar al terminal</span>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="password"
                          value="••••••"
                          disabled
                          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-highest/60 text-sm font-mono font-bold tracking-widest text-slate-500 border border-outline-variant/20 cursor-not-allowed min-h-[44px]"
                        />
                        <p className="text-[10px] text-amber-700 font-medium mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">lock</span>
                          <span>Solo Admin General o Global define este PIN</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={staffPhone}
                      onChange={(e) => setStaffPhone(e.target.value)}
                      placeholder="+51 988 776 543"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-xs text-on-surface block mb-1">
                      Turno Asignado
                    </label>
                    <select
                      value={staffShift}
                      onChange={(e) => setStaffShift(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
                  />
                </div>

                {/* CRITICAL FEATURE: ASIGNACIÓN MULTI-SEDE */}
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3.5 sm:p-4 flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-extrabold text-xs text-teal-950 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[16px] text-teal-700">hub</span>
                        <span>ASIGNACIÓN DE SEDES (MULTI-SEDE)</span>
                      </div>
                      <p className="text-[11px] text-teal-800 mt-0.5">
                        Asigna este colaborador a una o más sedes. Podrá operar con su PIN de 6 dígitos en los terminales de las sedes marcadas:
                      </p>
                    </div>

                    <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-teal-600 text-white font-extrabold text-[10px] shrink-0 shadow-xs">
                      {staffAssignedBranches.length} Sede(s)
                    </span>
                  </div>

                  {/* Quick actions for assigning */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] pt-0.5">
                    <button
                      type="button"
                      onClick={handleSelectOnlyCurrentBranchForStaff}
                      className="text-teal-700 font-bold hover:underline cursor-pointer bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-1 rounded-md transition-colors"
                    >
                      Solo Sede Actual
                    </button>
                    <span className="text-teal-400">•</span>
                    <button
                      type="button"
                      onClick={handleSelectAllBranchesForStaff}
                      className="text-teal-700 font-bold hover:underline cursor-pointer bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-1 rounded-md transition-colors"
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
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer min-h-[48px] ${
                            isChecked
                              ? 'bg-surface-container-lowest border-teal-600 shadow-xs ring-1 ring-teal-600/30'
                              : 'bg-white/60 border-outline-variant/30 opacity-80'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleStaffBranch(loc.id)}
                              className="w-5 h-5 text-teal-600 rounded border-outline focus:ring-teal-500 cursor-pointer shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="font-extrabold text-xs text-on-surface truncate">
                                {loc.name}
                              </span>
                              <span className="text-[10px] text-on-surface-variant truncate">
                                📍 {loc.address} ({loc.tables} mesas)
                              </span>
                            </div>
                          </div>

                          {isChecked && (
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full shrink-0">
                              Asignado
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pie del Modal: Sticky para móvil y escritorio */}
              <div className="shrink-0 bg-surface-container-lowest px-4 py-3 sm:px-6 sm:py-3.5 border-t border-outline-variant/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-on-surface py-1">
                  <input
                    type="checkbox"
                    checked={staffActive}
                    onChange={(e) => setStaffActive(e.target.checked)}
                    className="w-5 h-5 text-teal-600 rounded border-outline focus:ring-teal-500 cursor-pointer"
                  />
                  <span>Colaborador Activo (En Turno)</span>
                </label>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowStaffModal(false)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all cursor-pointer min-h-[44px] flex items-center justify-center text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer min-h-[44px]"
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

      {/* ========================================================================= */}
      {/* MODAL 6: EDITAR SEDE (ADMIN GENERAL / GLOBAL)                             */}
      {/* ========================================================================= */}
      {editingSede && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-outline-variant/40 animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-secondary">edit_location</span>
                <h3 className="font-extrabold text-sm sm:text-base text-on-primary">
                  Editar Sede: {editingSede.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingSede(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEditSede} className="p-5 flex flex-col gap-3.5">
              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Nombre de la Sede *
                </label>
                <input
                  type="text"
                  value={editSedeName}
                  onChange={(e) => setEditSedeName(e.target.value)}
                  placeholder="ej. Sede San Borja Chacarilla"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
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
                    value={editSedeDistrict}
                    onChange={(e) => setEditSedeDistrict(e.target.value)}
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
                    max={120}
                    value={editSedeTables}
                    onChange={(e) => setEditSedeTables(Number(e.target.value))}
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
                  value={editSedeAddress}
                  onChange={(e) => setEditSedeAddress(e.target.value)}
                  placeholder="Av. Primavera 650, San Borja"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-on-surface block mb-1">
                  Estado Operativo
                </label>
                <select
                  value={editSedeActive ? 'active' : 'paused'}
                  onChange={(e) => setEditSedeActive(e.target.value === 'active')}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none font-bold"
                >
                  <option value="active">Activa (En Operación)</option>
                  <option value="paused">Pausada</option>
                </select>
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
                    value={editSedeManager}
                    onChange={(e) => setEditSedeManager(e.target.value)}
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
                    value={editSedePhone}
                    onChange={(e) => setEditSedePhone(e.target.value)}
                    placeholder="+51 988 554 433"
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setEditingSede(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR RETIRAR/ELIMINAR PLATO DE ESTA SEDE */}
      {dishToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-outline-variant/30 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">delete_forever</span>
            </div>

            <div className="text-center">
              <h3 className="font-black text-base text-on-surface">
                ¿Retirar plato de esta sede?
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Estás a punto de retirar <strong className="text-on-surface">"{dishToDelete.name}"</strong> únicamente de <span className="font-bold text-primary">{currentBranch?.name}</span>.
              </p>
              <div className="mt-2.5 p-2.5 bg-surface-container-low rounded-xl text-[11px] text-on-surface-variant text-left flex items-start gap-2 border border-outline-variant/20">
                <span className="material-symbols-outlined text-teal-700 text-[16px] shrink-0 mt-0.5">info</span>
                <span>Las demás sedes de la cadena mantendrán este plato intacto en su carta. Podrás volver a agregarlo en cualquier momento desde la Carta Matriz.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setDishToDelete(null)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteMenuItem && dishToDelete) {
                    onDeleteMenuItem(dishToDelete.id);
                    triggerToast(`Plato "${dishToDelete.name}" retirado de ${currentBranch?.name || 'esta sede'}`);
                  }
                  setDishToDelete(null);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors shadow-sm cursor-pointer"
              >
                Retirar Plato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMAR RESTABLECER A CARTA MATRIZ */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-outline-variant/30 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">restart_alt</span>
            </div>

            <div className="text-center">
              <h3 className="font-black text-base text-on-surface">
                ¿Restablecer Carta Matriz?
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Se sincronizará el menú completo de <strong className="text-on-surface">{currentBranch?.name}</strong> con la Carta Matriz oficial <span className="font-bold text-primary">"{assignedMasterCarta?.name || 'Oficial'}"</span> ({assignedMasterCarta?.dishes.length || 38} platos).
              </p>
              <div className="mt-2.5 p-2.5 bg-amber-50 rounded-xl text-[11px] text-amber-900 text-left flex items-start gap-2 border border-amber-200">
                <span className="material-symbols-outlined text-amber-700 text-[16px] shrink-0 mt-0.5">warning</span>
                <span>Se recuperarán todos los platos retirados y los platos pausados volverán a estar disponibles.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onResetBranchMenu) {
                    onResetBranchMenu();
                    triggerToast(`Carta de ${currentBranch?.name || 'la sede'} restablecida a la Carta Matriz`);
                  }
                  setShowResetConfirmModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-black text-xs transition-colors shadow-sm cursor-pointer"
              >
                Restablecer
              </button>
            </div>
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
