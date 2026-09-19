export type ScreenType = 
  | 'mesas'
  | 'tomar-pedido'
  | 'cocina-kds'
  | 'cuenta-cobro'
  | 'carta-sede'
  | 'dashboard-admin'
  | 'saas-console'
  | 'pin-lock';

export interface DrinkOrder {
  id: string;
  name: string;
  qty: number;
  price: number;
  size?: string;
  served: boolean;
  servedAt?: string;
}

export interface TableDishItem {
  id?: string;
  dishId?: number;
  name: string;
  qty: number;
  price?: number;
  station: string;
  description: string;
  status?: 'ready' | 'cooking' | 'served';
  notes?: string;
}

export interface TableCanceledItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  reason: string;
  canceledBy: string;
  canceledAt: string;
}

export interface TableItem {
  id: string;
  number: string;
  status: 'ready' | 'occupied' | 'eating' | 'cooking' | 'bill_requested' | 'free';
  statusLabel: string;
  zone: string;
  waiter: string;
  diners: number;
  timeInSalon?: string;
  total?: number;
  notes?: string;
  dishes?: TableDishItem[];
  drinks?: DrinkOrder[];
  canceledItems?: TableCanceledItem[];
  progress?: number;
  estRemaining?: string;
  branchId?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: 'ceviches' | 'leches' | 'calientes' | 'arroces' | 'combinados' | 'trios' | 'jaleas' | 'bebidas';
  price: number;
  description: string;
  tag?: string;
  isDrink?: boolean;
  image: string;
  available: boolean;
  stockNote?: string;
  portionCount?: number;
  sizes?: { name: string; price: number }[];
  customization?: {
    picante: 'Sin ají' | 'Moderado' | 'Bien Bravo';
    puntoSal: boolean;
    sinCulantro: boolean;
    ajiAparte: boolean;
    cebollaLavada: boolean;
  };
}

export interface CartItem {
  id: string; // Key format: `${dishId}__${sizeName || 'default'}`
  dishId: number;
  dishName: string;
  category: MenuItem['category'];
  isDrink?: boolean;
  selectedSize?: string;
  price: number; // Selected size price or minimum price
  qty: number;
  notes?: string;
  customization?: {
    picante?: 'Sin ají' | 'Moderado' | 'Bien Bravo';
    puntoSal?: boolean;
    sinCulantro?: boolean;
    ajiAparte?: boolean;
    cebollaLavada?: boolean;
  };
}

export interface KDSTicketItem {
  id?: string;
  dishId?: number;
  name: string;
  qty: number;
  price?: number;
  substation: string;
  notes?: string;
  isServed?: boolean;
  isReady?: boolean;
  readyAt?: string;
  servedAt?: string;
}

export interface KDSTicket {
  id: string;
  table: string;
  station: 'frios' | 'calientes' | 'barra';
  status: 'pending' | 'cooking' | 'ready' | 'served';
  waiter: string;
  elapsed: string;
  time?: string;
  createdAt?: number; // Timestamp en milisegundos para orden estricto de llegada (FIFO)
  arrivalOrder?: number; // Número secuencial de orden de llegada (1 = primero en llegar)
  drinksNote?: string;
  items: KDSTicketItem[];
  branchId?: string;
}

export interface BranchLocation {
  id: string;
  name: string;
  address: string;
  city?: string;
  district?: string;
  phone?: string;
  tables: number;
  todaySales: number;
  active: boolean;
  managerName: string; // Administrador de Sede
  managerDocType?: 'DNI' | 'CE' | 'Pasaporte';
  managerDocNumber?: string;
  managerEmail?: string;
  managerPhone?: string;
}

export interface MasterCarta {
  id: string;
  name: string;
  description: string;
  dishes: MenuItem[];
  createdAt?: string;
  assignedChainIds?: string[];
}

export interface ChainBrand {
  id: string;
  slug?: string; // Enlace único de acceso web: dominio/:slug
  name: string;
  legalName: string;
  ruc: string;
  plan: 'Enterprise' | 'Pro' | 'Básico';
  status: 'Activa' | 'En Onboarding' | 'Suspendida';
  adminName: string; // Administrador General
  adminDocType?: 'DNI' | 'CE' | 'Pasaporte' | 'RUC';
  adminDocNumber?: string;
  adminEmail: string;
  adminPhone: string;
}

export interface BranchLocation {
  id: string;
  name: string;
  address: string;
  city?: string;
  district?: string;
  phone?: string;
  tables: number;
  todaySales: number;
  active: boolean;
  managerName: string; // Administrador de Sede
  managerDocType?: 'DNI' | 'CE' | 'Pasaporte';
  managerDocNumber?: string;
  managerEmail?: string;
  managerPhone?: string;
}

export interface MasterCarta {
  id: string;
  name: string;
  description: string;
  dishes: MenuItem[];
  createdAt?: string;
  assignedChainIds?: string[];
}

export interface ChainBrand {
  id: string;
  slug?: string; // Enlace único de acceso web: dominio/:slug
  name: string;
  legalName: string;
  ruc: string;
  plan: 'Enterprise' | 'Pro' | 'Básico';
  status: 'Activa' | 'En Onboarding' | 'Suspendida';
  adminName: string; // Administrador General
  adminDocType?: 'DNI' | 'CE' | 'Pasaporte' | 'RUC';
  adminDocNumber?: string;
  adminEmail: string;
  adminPhone: string;
  locationsCount: number;
  locations: BranchLocation[];
  assignedCartaId?: string; // ID de la carta maestra asignada a este restaurante
  logoUrl?: string; // URL o avatar del logo distintivo de la marca/restaurante
}

export type AppRole = 'admin_global' | 'admin_general' | 'admin_sede' | 'mesero' | 'cocina' | 'cajero';

export interface AppUser {
  id: string;
  name: string;
  email?: string;
  username?: string;
  phone?: string;
  docType?: 'DNI' | 'CE' | 'Pasaporte' | 'RUC';
  docNumber?: string;
  role: string; // Título legible: ej. 'Administrador Global', 'Mozo Principal', 'Jefe de Cocina'
  roleKey: AppRole; // Identificador canónico del rol de acceso
  tenantId?: string; // ID del restaurante / cadena (null para admin_global)
  brandId?: string; // Alias de tenantId para compatibilidad
  brand?: string; // Nombre del restaurante
  branchName?: string;
  branchId?: string;
  assignedBranchIds: string[]; // Sedes donde labora o administra (Multi-Sede)
  initials?: string;
  pin?: string; // PIN de 6 dígitos para terminal táctil
  pinHash?: string; // Hash seguro bcrypt para Firestore
  authUid?: string; // UID vinculado a Firebase Authentication
  tablesZone?: string; // ej. "Mesas 1 a 6", "Terraza Marina"
  shift?: string; // "Turno Mañana", "Turno Tarde", "Completo"
  avatarColor?: string;
  active: boolean;
  createdAt?: number;
  updatedAt?: number;
}

// Aliases para compatibilidad con componentes existentes
export type AdminUser = AppUser;
export type StaffMember = AppUser;
