export type ScreenType = 
  | 'mesas'
  | 'tomar-pedido'
  | 'cocina-kds'
  | 'cuenta-cobro'
  | 'carta-sede'
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
  managerEmail?: string;
  managerPhone?: string;
}

export interface ChainBrand {
  id: string;
  name: string;
  legalName: string;
  ruc: string;
  plan: 'Enterprise' | 'Pro' | 'Básico';
  status: 'Activa' | 'En Onboarding' | 'Suspendida';
  adminName: string; // Administrador General
  adminEmail: string;
  adminPhone: string;
  locationsCount: number;
  locations: BranchLocation[];
}

export type AppRole = 'admin_global' | 'admin_general' | 'admin_sede' | 'mesero' | 'cocina';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Administrador Global' | 'Administrador General' | 'Administrador de Sede' | 'Jefe de Salón' | 'Mesero' | 'Jefe de Cocina';
  roleKey: AppRole;
  brand: string;
  brandId?: string;
  branchName?: string;
  branchId?: string;
  assignedBranchIds?: string[]; // Sedes asignadas a este administrador (puede gestionar más de una)
  initials: string;
  active?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  pin: string;
  phone?: string;
  assignedBranchIds: string[]; // Sedes donde labora este colaborador (Multi-Sede)
  brandId: string; // Cadena/Restaurante
  tablesZone?: string; // ej. "Mesas 1 a 6", "Terraza Marina"
  shift?: string; // "Turno Mañana", "Turno Tarde", "Completo"
  active: boolean;
  avatarColor?: string;
}
