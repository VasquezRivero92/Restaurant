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
  allowSpiceLevel?: boolean; // Activar o desactivar opción de nivel de picante en la carta
  customization?: {
    picante: 'Sin ají' | 'Moderado' | 'Bien Bravo';
    puntoSal: boolean;
    sinCulantro: boolean;
    ajiAparte: boolean;
    cebollaLavada: boolean;
  };
  recipe?: Array<{ inventoryItemId: string; qty: number }>;
  promotion?: { id: string; name: string; type: 'percentage' | 'fixed_price'; value: number; startsAt: string; endsAt: string; active: boolean };
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
  status?: 'pending' | 'cooking' | 'ready' | 'served';
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
  version?: number;
  status?: 'draft' | 'published' | 'archived';
  publishedAt?: number;
  scheduledPublishAt?: number;
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

export type PaymentMethod = 'yape_plin' | 'card' | 'cash' | 'split';

export interface SaleLineItem {
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
  category?: string;
  kind: 'dish' | 'drink';
}

export interface SaleRecord {
  id: string;
  tenantId: string;
  branchId: string;
  tableId: string;
  tableNumber?: string;
  baseAmount: number;
  tipAmount: number;
  amount: number;
  paymentMethod: PaymentMethod;
  documentType: 'boleta' | 'factura';
  customerDoc?: string;
  customerName?: string;
  cashReceived?: number;
  changeAmount?: number;
  lineItems: SaleLineItem[];
  costAmount?: number;
  grossMargin?: number;
  businessDate: string;
  cashierName?: string;
  waiterName?: string;
  createdAt: number;
  createdBy: string;
  status: 'completed' | 'voided';
}

export interface PaymentDetails {
  method: PaymentMethod;
  tipAmount: number;
  documentType: 'boleta' | 'factura';
  customerDoc?: string;
  customerName?: string;
  cashReceived?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  unitCost: number;
  category: 'insumo' | 'bebida' | 'empaque' | 'limpieza';
  updatedAt?: number;
}

export interface CashShift {
  id: string;
  branchId: string;
  businessDate: string;
  status: 'open' | 'closed';
  openingAmount: number;
  expectedAmount?: number;
  countedAmount?: number;
  difference?: number;
  openedAt: number;
  closedAt?: number;
  openedBy: string;
  closedBy?: string;
  notes?: string;
}

export interface CashMovement {
  id: string;
  branchId: string;
  shiftId?: string;
  type: 'income' | 'expense';
  amount: number;
  concept: string;
  createdAt: number;
  createdBy: string;
}

export interface Reservation {
  id: string;
  branchId: string;
  customerName: string;
  phone?: string;
  diners: number;
  scheduledAt: string;
  tableId?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'seated' | 'cancelled';
  createdAt: number;
}

export interface AttendanceRecord {
  id: string;
  branchId: string;
  staffId: string;
  staffName: string;
  businessDate: string;
  checkInAt: number;
  checkOutAt?: number;
  status: 'present' | 'completed';
}

export interface InventoryMovement {
  id: string;
  branchId: string;
  inventoryItemId: string;
  type: 'purchase' | 'waste' | 'sale' | 'adjustment' | 'transfer';
  quantity: number;
  reason?: string;
  createdAt: number;
  createdBy?: string;
}

export interface ApprovalRequest {
  id: string;
  tenantId: string;
  branchId: string;
  type: 'discount' | 'void' | 'refund' | 'price_change' | 'inventory_transfer';
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  requestedBy: string;
  requestedAt: number;
  resolvedBy?: string;
  resolvedAt?: number;
  resolutionNote?: string;
}

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
