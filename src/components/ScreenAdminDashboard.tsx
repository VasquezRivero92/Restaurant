import React, { useState } from 'react';
import {
  ArrowRight,
  Banknote,
  ChefHat,
  CircleAlert,
  Clock3,
  MapPin,
  Store,
  TrendingUp,
  Users,
  UtensilsCrossed,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  LayoutGrid,
  BarChart3,
  Power,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  LogOut,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { AdminUser, AttendanceRecord, CashShift, ChainBrand, InventoryItem, KDSTicket, ScreenType, TableItem, MenuItem, Reservation, SaleRecord, StaffMember } from '../types';

interface ScreenAdminDashboardProps {
  admin: AdminUser;
  chain: ChainBrand;
  activeBranchId: string;
  tables: TableItem[];
  tickets: KDSTicket[];
  menuItems?: MenuItem[];
  staffMembers?: StaffMember[];
  sales?: SaleRecord[];
  tenantSales?: SaleRecord[];
  inventory?: InventoryItem[];
  cashShifts?: CashShift[];
  reservations?: Reservation[];
  attendance?: AttendanceRecord[];
  onSelectBranch: (branchId: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectCartaTab?: (tab: 'carta' | 'sedes' | 'equipo') => void;
  onToggleItemAvailability?: (itemId: number) => void;
  onToggleBranchActive?: (branchId: string) => void;
  onSelectTable?: (tableId: string) => void;
  onAdjustInventory?: (itemId: string, adjustment: number) => void;
  onOpenCashShift?: (openingAmount: number) => void;
  onCloseCashShift?: (shiftId: string, countedAmount: number) => void;
  onCashMovement?: (type: 'income' | 'expense', amount: number, concept: string) => Promise<void> | void;
  onCreateReservation?: (reservation: Omit<Reservation, 'id' | 'branchId' | 'createdAt' | 'status'>) => void;
  onUpdateReservationStatus?: (reservationId: string, status: Reservation['status']) => void;
  onToggleAttendance?: (staff: StaffMember) => void;
  onOpenRoleSwitcher?: () => void;
  onLogout?: () => void;
}

export const ScreenAdminDashboard: React.FC<ScreenAdminDashboardProps> = ({
  admin,
  chain,
  activeBranchId,
  tables,
  tickets,
  menuItems = [],
  staffMembers = [],
  sales = [],
  tenantSales = [],
  inventory = [],
  cashShifts = [],
  reservations = [],
  attendance = [],
  onSelectBranch,
  onNavigate,
  onSelectCartaTab,
  onToggleItemAvailability,
  onToggleBranchActive,
  onSelectTable,
  onAdjustInventory,
  onOpenCashShift,
  onCloseCashShift,
  onCashMovement,
  onCreateReservation,
  onUpdateReservationStatus,
  onToggleAttendance,
  onOpenRoleSwitcher,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'rendimiento' | 'stock' | 'operacion'>('monitor');
  const [stockSearch, setStockSearch] = useState('');
  const [openingAmount, setOpeningAmount] = useState('0');
  const [countedAmount, setCountedAmount] = useState('0');
  const [cashMovementAmount, setCashMovementAmount] = useState('');
  const [cashMovementConcept, setCashMovementConcept] = useState('');
  const [reservationName, setReservationName] = useState('');
  const [reservationPhone, setReservationPhone] = useState('');
  const [reservationDiners, setReservationDiners] = useState('2');
  const [reservationTime, setReservationTime] = useState('');
  const [reportFrom, setReportFrom] = useState('');
  const [reportTo, setReportTo] = useState('');
  const [reportProduct, setReportProduct] = useState('');
  const [reportStaff, setReportStaff] = useState('');
  const [reportPayment, setReportPayment] = useState('');
  const [reportCategory, setReportCategory] = useState('');

  const assignedIds =
    admin.roleKey === 'admin_general' || admin.roleKey === 'admin_global'
      ? chain.locations.map((loc) => loc.id)
      : admin.assignedBranchIds?.length
      ? admin.assignedBranchIds
      : admin.branchId
      ? [admin.branchId]
      : [];

  const branches = chain.locations.filter((location) => assignedIds.includes(location.id));
  const activeBranch = branches.find((branch) => branch.id === activeBranchId) || branches[0] || chain.locations[0];

  // Sede-scoped data
  const visibleTables = tables.filter((table) => !table.branchId || table.branchId === activeBranch?.id);
  const visibleTickets = tickets.filter((ticket) => !ticket.branchId || ticket.branchId === activeBranch?.id);
  const visibleStaff = staffMembers.filter((s) => !s.assignedBranchIds || s.assignedBranchIds.length === 0 || s.assignedBranchIds.includes(activeBranch?.id) || s.branchId === activeBranch?.id);

  // Key operational counts
  const occupiedTables = visibleTables.filter((table) => table.status !== 'free');
  const cookingTables = visibleTables.filter((table) => table.status === 'cooking');
  const eatingTables = visibleTables.filter((table) => table.status === 'eating');
  const billRequestedTables = visibleTables.filter((table) => table.status === 'bill_requested');
  const freeTables = visibleTables.filter((table) => table.status === 'free');

  const pendingTickets = visibleTickets.filter((ticket) => ticket.status !== 'served');
  const delayedTickets = pendingTickets.filter((ticket) => {
    // Flag if in cooking/pending for > 15 mins
    const elapsedMinutes = ticket.createdAt ? (Date.now() - ticket.createdAt) / 60000 : 0;
    return elapsedMinutes > 15 || ticket.elapsed?.includes('20') || ticket.elapsed?.includes('25');
  });

  const coldStationTickets = pendingTickets.filter(
    (t) => t.station === 'frios' || t.items.some((i) => i.substation === 'FRÍOS')
  );
  const hotStationTickets = pendingTickets.filter(
    (t) => t.station === 'calientes' || t.items.some((i) => i.substation === 'CALIENTES')
  );

  const pendingBillsAmount = billRequestedTables.reduce((sum, t) => sum + Number(t.total || 0), 0);
  const totalOccupiedAmount = occupiedTables.reduce((sum, t) => sum + Number(t.total || 0), 0);
  const businessDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());
  const salesToday = sales.filter((sale) => sale.status === 'completed' && sale.businessDate === businessDate);
  const branchSales = salesToday.reduce((sum, sale) => sum + Number(sale.amount || 0), 0);
  const totalSales = branches.reduce((sum, branch) => sum + Number(branch.todaySales || 0), 0);
  const avgTicket = salesToday.length > 0 ? branchSales / salesToday.length : 0;
  const paymentTotals = salesToday.reduce<Record<string, number>>((result, sale) => {
    result[sale.paymentMethod] = (result[sale.paymentMethod] || 0) + Number(sale.amount || 0);
    return result;
  }, {});
  const paymentBreakdown = [
    { key: 'card', label: 'Tarjetas POS', color: 'bg-teal-600' },
    { key: 'cash', label: 'Efectivo en Caja', color: 'bg-emerald-500' },
    { key: 'yape_plin', label: 'Yape / Plin', color: 'bg-purple-600' },
    { key: 'split', label: 'Pagos mixtos', color: 'bg-amber-500' }
  ].filter(({ key }) => paymentTotals[key] > 0).map(({ key, label, color }) => ({
    label, amount: paymentTotals[key], pct: branchSales > 0 ? Math.round((paymentTotals[key] / branchSales) * 100) : 0, color
  }));
  const topDishes = Object.values(salesToday.flatMap((sale) => sale.lineItems || []).reduce<Record<string, { name: string; qty: number; revenue: number; cat: string }>>((result, item) => {
    const key = `${item.kind}:${item.name}`;
    const existing = result[key] || { name: item.name, qty: 0, revenue: 0, cat: item.category || (item.kind === 'drink' ? 'Bebidas' : 'Carta') };
    existing.qty += Number(item.qty || 0);
    existing.revenue += Number(item.total || 0);
    result[key] = existing;
    return result;
  }, {})).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const averageKdsMinutes = pendingTickets.length > 0
    ? Math.round(pendingTickets.reduce((sum, ticket) => sum + (ticket.createdAt ? (Date.now() - ticket.createdAt) / 60000 : 0), 0) / pendingTickets.length)
    : 0;
  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minimumStock);
  const activeCashShift = cashShifts.find((shift) => shift.status === 'open');
  const reportSource = tenantSales.length > 0 ? tenantSales : sales;
  const historicalSales = reportSource.filter((sale) => sale.status === 'completed'
    && (!reportFrom || sale.businessDate >= reportFrom)
    && (!reportTo || sale.businessDate <= reportTo)
    && (!reportStaff || (sale.waiterName || '').toLowerCase().includes(reportStaff.toLowerCase()))
    && (!reportPayment || sale.paymentMethod === reportPayment)
    && (!reportProduct || (sale.lineItems || []).some((item) => item.name.toLowerCase().includes(reportProduct.toLowerCase())))
    && (!reportCategory || (sale.lineItems || []).some((item) => (item.category || '').toLowerCase().includes(reportCategory.toLowerCase()))));
  const historicalRevenue = historicalSales.reduce((sum, sale) => sum + sale.amount, 0);
  const historicalMargin = historicalSales.reduce((sum, sale) => sum + Number(sale.grossMargin ?? sale.amount - (sale.costAmount || 0)), 0);
  const activeReservations = reservations.filter((reservation) => reservation.status === 'pending' || reservation.status === 'confirmed');
  const attendanceDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());
  const presentStaffIds = new Set(attendance.filter((record) => record.businessDate === attendanceDate && record.status === 'present').map((record) => record.staffId));

  const exportTodaySales = () => {
    const header = 'Fecha;Mesa;Total;Método de pago;Comprobante;Mozo';
    const rows = salesToday.map((sale) => [sale.businessDate, sale.tableNumber || sale.tableId, sale.amount.toFixed(2), sale.paymentMethod, sale.documentType, sale.waiterName || ''].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(';'));
    const url = URL.createObjectURL(new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ventas-${businessDate}-${activeBranch?.id || 'sede'}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const occupancyRate = visibleTables.length > 0 ? Math.round((occupiedTables.length / visibleTables.length) * 100) : 0;

  // Time / shift detection
  const currentHour = new Date().getHours();
  const shiftName = currentHour < 12 ? 'Turno Mañana' : currentHour < 18 ? 'Turno Almuerzo' : 'Turno Noche';
  const currentDateFormatted = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  if (!activeBranch) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-[#fffdf9]">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center shadow-lg">
          <CircleAlert className="mx-auto text-amber-700" size={40} />
          <h2 className="mt-4 text-xl font-extrabold text-[#103b39]">Sin sedes asignadas</h2>
          <p className="mt-2 text-sm text-slate-600">
            Un administrador general debe asignar al menos una sede a esta cuenta para acceder a la operación.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('saas-console')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#103b39] px-5 py-2.5 text-sm font-bold text-[#ffd06f] hover:bg-[#0c2e2c]"
          >
            Ir a Consola General
          </button>
        </div>
      </div>
    );
  }

  // Filtered dishes for fast stock controls
  const filteredDishes = menuItems.filter(
    (d) =>
      !stockSearch ||
      d.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
      d.category.toLowerCase().includes(stockSearch.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#fffdf9] text-slate-800 pb-28 sm:pb-32">
      {/* 1. Header Banner & Context */}
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-white to-[#faf7f0]/60 px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left title & context */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/80 px-3 py-1 text-xs font-black uppercase tracking-wider text-teal-900">
                  <ShieldCheck size={14} className="text-teal-700" />
                  {admin.roleKey === 'admin_global'
                    ? 'Super Administrador'
                    : admin.roleKey === 'admin_general'
                    ? 'Administrador General'
                    : 'Administrador de Sede'}
                </span>
                <span className="text-xs font-bold text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500 capitalize">{currentDateFormatted}</span>
                <span className="text-xs font-bold text-slate-400">•</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-700">
                  <Clock3 size={13} /> {shiftName}
                </span>
              </div>

              <h1 className="mt-2.5 text-3xl font-black tracking-tight text-[#103b39] sm:text-4xl">
                Hola, {admin.name.split(' ')[0]} 👋
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Monitorea en tiempo real las ventas, salón, cocina y personal de tus sedes.
              </p>
            </div>

            {/* Right: Branch Selector & Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Branch Selector Dropdown */}
              <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103b39] text-[#ffd06f]">
                    <MapPin size={18} />
                  </div>
                  <div className="pr-2">
                    <label htmlFor="branch-select" className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Sede Activa
                    </label>
                    <select
                      id="branch-select"
                      value={activeBranch.id}
                      onChange={(e) => onSelectBranch(e.target.value)}
                      className="bg-transparent text-sm font-extrabold text-[#103b39] outline-none cursor-pointer"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.district || 'Lima'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Branch Active Toggle (Quick Operational Switch) */}
              <button
                type="button"
                onClick={() => onToggleBranchActive?.(activeBranch.id)}
                title="Cambiar estado operativo de la sede"
                className={`flex items-center gap-2 rounded-2xl border px-3.5 py-3 text-xs font-bold transition shadow-xs cursor-pointer ${
                  activeBranch.active !== false
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    activeBranch.active !== false ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span>{activeBranch.active !== false ? 'Sede Operativa' : 'Sede Pausada'}</span>
              </button>

              {/* Quick Profile switcher & Logout */}
              {onOpenRoleSwitcher && (
                <button
                  type="button"
                  onClick={onOpenRoleSwitcher}
                  title="Cambiar de perfil operativo"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#103b39] transition shadow-xs cursor-pointer"
                >
                  <SlidersHorizontal size={18} />
                </button>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Cerrar sesión / Bloquear terminal"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-rose-600 hover:bg-rose-50 transition shadow-xs cursor-pointer"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Executive KPI Cards */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* KPI 1: Ventas del día */}
          <article className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                <Banknote size={22} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
                <TrendingUp size={12} /> Hoy
              </span>
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400">Ventas Registradas</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#103b39]">
                S/ {branchSales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              Ticket promedio: <strong className="text-slate-700">S/ {avgTicket.toFixed(2)}</strong> por comanda
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-emerald-100/70 pt-2 text-[11px] font-bold text-emerald-800">
              <span>{branches.length > 1 ? `Total cadena: S/ ${totalSales.toLocaleString('es-PE')}` : 'Al día con caja'}</span>
              <button
                type="button"
                onClick={() => onNavigate('cuenta-cobro')}
                className="hover:underline flex items-center gap-0.5 text-teal-800 cursor-pointer"
              >
                Caja POS <ArrowRight size={12} />
              </button>
            </div>
          </article>

          {/* KPI 2: Salón y Ocupación */}
          <article className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/40 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700">
                <Users size={22} />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-extrabold text-sky-800">
                {occupancyRate}% Ocupado
              </span>
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400">Ocupación de Salón</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#103b39]">
                {occupiedTables.length} <span className="text-lg font-bold text-slate-400">/ {visibleTables.length} mesas</span>
              </span>
            </div>
            {/* Visual multi-state progress bar */}
            <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                style={{ width: `${(eatingTables.length / Math.max(1, visibleTables.length)) * 100}%` }}
                className="bg-sky-500"
                title={`${eatingTables.length} Comiendo`}
              />
              <div
                style={{ width: `${(cookingTables.length / Math.max(1, visibleTables.length)) * 100}%` }}
                className="bg-orange-500"
                title={`${cookingTables.length} En cocina`}
              />
              <div
                style={{ width: `${(billRequestedTables.length / Math.max(1, visibleTables.length)) * 100}%` }}
                className="bg-amber-500"
                title={`${billRequestedTables.length} Por cobrar`}
              />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-sky-100/70 pt-2 text-[11px] font-bold text-slate-500">
              <span>{freeTables.length} mesas disponibles</span>
              <button
                type="button"
                onClick={() => onNavigate('mesas')}
                className="text-sky-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Ver Salón <ArrowRight size={12} />
              </button>
            </div>
          </article>

          {/* KPI 3: Ritmo de Cocina KDS */}
          <article className="relative overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-700">
                <ChefHat size={22} />
              </span>
              {delayedTickets.length > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-extrabold text-rose-700 animate-pulse">
                  <AlertTriangle size={12} /> {delayedTickets.length} demora
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
                  <CheckCircle2 size={12} /> Fluido
                </span>
              )}
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400">Cocina KDS</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#103b39]">
                {pendingTickets.length}{' '}
                <span className="text-base font-bold text-slate-400">
                  {pendingTickets.length === 1 ? 'comanda activa' : 'comandas activas'}
                </span>
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              Fríos: <strong className="text-slate-700">{coldStationTickets.length}</strong> • Calientes:{' '}
              <strong className="text-slate-700">{hotStationTickets.length}</strong>
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-orange-100/70 pt-2 text-[11px] font-bold text-orange-800">
              <span>{averageKdsMinutes > 0 ? `Promedio actual: ${averageKdsMinutes} min` : 'Sin comandas pendientes'}</span>
              <button
                type="button"
                onClick={() => onNavigate('cocina-kds')}
                className="text-orange-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Ver KDS <ArrowRight size={12} />
              </button>
            </div>
          </article>

          {/* KPI 4: Cuentas y Cobro POS */}
          <article className="relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-br from-white to-amber-50/40 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700">
                <Receipt size={22} />
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                  billRequestedTables.length > 0
                    ? 'bg-amber-200 text-amber-900 animate-bounce'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Clock3 size={12} /> {billRequestedTables.length} por cobrar
              </span>
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400">Cuentas Solicitadas</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#103b39]">
                S/ {pendingBillsAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {billRequestedTables.length > 0 ? 'Mesas esperando cobro en salón' : 'Sin demoras de facturación'}
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-amber-100/70 pt-2 text-[11px] font-bold text-amber-800">
              <span>Monto en espera</span>
              <button
                type="button"
                onClick={() => onNavigate('cuenta-cobro')}
                className="text-amber-800 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Cobrar Ahora <ArrowRight size={12} />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* 3. Interactive Main Management Tabs */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-8">
        {/* Navigation Tabs Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="ux-tab-strip items-center rounded-2xl bg-slate-100 p-1" role="tablist" aria-label="Secciones del panel administrativo">
            <button
              type="button"
              onClick={() => setActiveTab('monitor')}
              role="tab"
              aria-selected={activeTab === 'monitor'}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeTab === 'monitor'
                  ? 'bg-white text-[#103b39] shadow-xs'
                  : 'text-slate-600 hover:text-[#103b39]'
              }`}
            >
              <LayoutGrid size={16} />
              <span>Monitor en Vivo</span>
              {pendingTickets.length > 0 && (
                <span className="rounded-full bg-orange-100 px-1.5 py-0.2 text-[10px] font-black text-orange-700">
                  {pendingTickets.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rendimiento')}
              role="tab"
              aria-selected={activeTab === 'rendimiento'}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeTab === 'rendimiento'
                  ? 'bg-white text-[#103b39] shadow-xs'
                  : 'text-slate-600 hover:text-[#103b39]'
              }`}
            >
              <BarChart3 size={16} />
              <span>Rendimiento & Ventas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stock')}
              role="tab"
              aria-selected={activeTab === 'stock'}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeTab === 'stock'
                  ? 'bg-white text-[#103b39] shadow-xs'
                  : 'text-slate-600 hover:text-[#103b39]'
              }`}
            >
              <Flame size={16} />
              <span>Stock Rápido & Carta</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('operacion')}
              role="tab"
              aria-selected={activeTab === 'operacion'}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                activeTab === 'operacion'
                  ? 'bg-white text-[#103b39] shadow-xs'
                  : 'text-slate-600 hover:text-[#103b39]'
              }`}
            >
              <Banknote size={16} />
              <span>Turno e Inventario</span>
              {lowStockItems.length > 0 && <span className="rounded-full bg-rose-100 px-1.5 py-0.2 text-[10px] font-black text-rose-700">{lowStockItems.length}</span>}
            </button>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Mostrando datos de: <strong className="text-[#103b39]">{activeBranch.name}</strong>
          </div>
        </div>

        {/* Tab 1: Monitor en Vivo */}
        {activeTab === 'monitor' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            {/* Left: Interactive Tables Grid */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-[#103b39]">Distribución de Mesas en Salón</h2>
                  <p className="text-xs text-slate-500">Haz clic en cualquier mesa para abrirla o cobrar.</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('mesas')}
                  className="flex items-center gap-1.5 text-xs font-black text-teal-800 hover:underline cursor-pointer"
                >
                  Ver Salón Completo <ArrowUpRight size={14} />
                </button>
              </div>

              {/* Visual Grid of Tables */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {visibleTables.map((tbl) => {
                  const isFree = tbl.status === 'free';
                  const isCooking = tbl.status === 'cooking';
                  const isEating = tbl.status === 'eating';
                  const isBill = tbl.status === 'bill_requested';

                  return (
                    <button
                      type="button"
                      key={tbl.id}
                      onClick={() => {
                        onSelectTable?.(tbl.id);
                        if (isBill) {
                          onNavigate('cuenta-cobro');
                        } else {
                          onNavigate('mesas');
                        }
                      }}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                        isFree
                          ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50'
                          : isCooking
                          ? 'border-orange-200 bg-orange-50/50 hover:bg-orange-50'
                          : isEating
                          ? 'border-sky-200 bg-sky-50/50 hover:bg-sky-50'
                          : 'border-amber-300 bg-amber-100/70 hover:bg-amber-100 animate-pulse'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-[#103b39]">Mesa {tbl.number}</span>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isFree
                              ? 'bg-emerald-500'
                              : isCooking
                              ? 'bg-orange-500'
                              : isEating
                              ? 'bg-sky-500'
                              : 'bg-amber-600'
                          }`}
                        />
                      </div>

                      <div className="mt-3">
                        <p className="text-[11px] font-bold text-slate-600 truncate">
                          {isFree ? 'Libre' : tbl.waiter || 'Sin mozo'}
                        </p>
                        <p className="text-xs font-black text-[#103b39]">
                          {isFree ? `Cap: ${tbl.capacity}p` : `S/ ${Number(tbl.total || 0).toFixed(2)}`}
                        </p>
                      </div>

                      <div className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        {isFree ? 'Abrir' : isBill ? 'Cobrar 💳' : isCooking ? 'Cocina 🍳' : 'Comiendo 🍽️'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Status Legend */}
              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-600 border border-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Libres ({freeTables.length})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-500" /> En Cocina ({cookingTables.length})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-500" /> Comiendo ({eatingTables.length})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> Cuenta Pedida ({billRequestedTables.length})
                </span>
              </div>
            </div>

            {/* Right: Live Kitchen Tickets Feed */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-[#103b39]">Comandas en Cocina (KDS)</h2>
                  <p className="text-xs text-slate-500">Últimos pedidos despachándose en vivo.</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('cocina-kds')}
                  className="flex items-center gap-1.5 text-xs font-black text-orange-700 hover:underline cursor-pointer"
                >
                  Abrir KDS <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {pendingTickets.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                    <p className="mt-2 text-sm font-bold text-slate-600">Cocina al día</p>
                    <p className="text-xs">No hay tickets pendientes en preparación en este momento.</p>
                  </div>
                ) : (
                  pendingTickets.map((ticket) => {
                    const ticketNum = String(ticket.id).replace(/^kds-?/i, '');
                    const tableName = ticket.table || (ticket as any).tableName || ((ticket as any).tableNumber ? `Mesa ${(ticket as any).tableNumber}` : 'Salón');
                    const timeLabel = ticket.time || ticket.elapsed || (ticket as any).timeElapsed || 'En curso';
                    const stationLabel = ticket.station === 'frios' || (ticket as any).station === 'Barra Fría' ? 'Barra Fría' : 'Calientes';

                    return (
                      <div
                        key={ticket.id}
                        className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 transition hover:border-orange-300 hover:bg-orange-50/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-[#103b39] text-[#ffd06f] text-xs font-black tracking-wide shrink-0">
                              #{ticketNum}
                            </span>
                            <span className="text-sm font-black text-[#103b39]">{tableName}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500">{timeLabel}</span>
                        </div>

                        <div className="mt-2.5 space-y-1.5">
                          {ticket.items.map((item, idx) => {
                            const isReady = item.isReady === true || (item as any).status === 'ready';
                            return (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-700">
                                  {item.qty}x {item.name}
                                </span>
                                <span
                                  className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                                    isReady
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {isReady ? 'Listo' : 'Preparando'}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                          <span>Mozo: {ticket.waiter || 'Asignado a salón'}</span>
                          <span className="text-orange-700 font-bold uppercase tracking-wider text-[10px]">
                            {stationLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Rendimiento & Ventas */}
        {activeTab === 'rendimiento' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs lg:col-span-3"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black text-[#103b39]">Reporte histórico</h3><p className="text-xs text-slate-500">Sede activa: {activeBranch.name}. Administrador general: consolidado de cadena.</p></div><div className="flex flex-wrap gap-2"><input type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} className="rounded-lg border p-2 text-xs"/><input type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} className="rounded-lg border p-2 text-xs"/><input value={reportProduct} onChange={(e) => setReportProduct(e.target.value)} placeholder="Producto" className="rounded-lg border p-2 text-xs"/><input value={reportStaff} onChange={(e) => setReportStaff(e.target.value)} placeholder="Colaborador" className="rounded-lg border p-2 text-xs"/><select value={reportPayment} onChange={(e) => setReportPayment(e.target.value)} className="rounded-lg border p-2 text-xs"><option value="">Todo pago</option><option value="cash">Efectivo</option><option value="card">Tarjeta</option><option value="yape_plin">Yape/Plin</option><option value="split">Mixto</option></select><input value={reportCategory} onChange={(e) => setReportCategory(e.target.value)} placeholder="Categoría" className="rounded-lg border p-2 text-xs"/></div></div><div className="mt-4 grid grid-cols-3 gap-3 text-xs"><div className="rounded-xl bg-slate-50 p-3"><span className="block text-slate-500">Ventas</span><strong>{historicalSales.length}</strong></div><div className="rounded-xl bg-slate-50 p-3"><span className="block text-slate-500">Ingresos</span><strong>S/ {historicalRevenue.toFixed(2)}</strong></div><div className="rounded-xl bg-emerald-50 p-3"><span className="block text-emerald-700">Margen bruto</span><strong>S/ {historicalMargin.toFixed(2)}</strong></div></div></div>
            {/* Box 1: Métodos de Pago */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-[#103b39]">Desglose de Cobros</h3>
                <div className="flex items-center gap-2"><button type="button" onClick={exportTodaySales} disabled={salesToday.length === 0} className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-black text-teal-800 disabled:opacity-40">Exportar CSV</button><Banknote size={18} className="text-emerald-700" /></div>
              </div>

              <div className="mt-5 space-y-4">
                {paymentBreakdown.length === 0 ? <p className="py-6 text-center text-xs text-slate-400">Aún no hay cobros cerrados hoy.</p> : paymentBreakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="text-[#103b39]">
                        S/ {item.amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({item.pct}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
                <p className="font-bold text-slate-700">Arqueo Proyectado</p>
                <p className="mt-1 text-slate-500">
                  Las comisiones POS y propinas de mozos se calculan automáticamente al cerrar cada comanda.
                </p>
              </div>
            </div>

            {/* Box 2: Top 5 Platos Más Vendidos */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-[#103b39]">Top Platos de Hoy</h3>
                <Flame size={18} className="text-orange-600" />
              </div>

              <div className="mt-4 space-y-3">
                {topDishes.length === 0 ? <p className="py-6 text-center text-xs text-slate-400">El ranking aparecerá al cerrar ventas.</p> : topDishes.map((dish, i) => (
                  <div key={dish.name} className="flex items-center justify-between rounded-xl bg-slate-50/70 p-2.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#103b39] text-[#ffd06f] font-black text-[11px]">
                        {i + 1}
                      </span>
                      <div>
                        <strong className="block text-slate-800 leading-tight">{dish.name}</strong>
                        <span className="text-[10px] text-slate-500 font-semibold">{dish.cat}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <strong className="block text-[#103b39]">{dish.qty} vend.</strong>
                      <span className="text-[10px] text-emerald-700 font-bold">S/ {dish.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 3: Personal en Turno */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-[#103b39]">Personal de Turno</h3>
                  <p className="text-xs text-slate-500">{visibleStaff.length} colaboradores activos</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCartaTab?.('equipo');
                    onNavigate('carta-sede');
                  }}
                  className="text-xs font-black text-teal-800 hover:underline cursor-pointer"
                >
                  Gestionar <ArrowRight size={12} />
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                {visibleStaff.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">Sin personal registrado para esta sede.</p>
                ) : (
                  visibleStaff.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-800 font-black text-xs">
                          {(member.name || 'P').charAt(0)}
                        </span>
                        <div>
                          <strong className="block text-slate-800">{member.name}</strong>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {member.role === 'mesero' ? 'Mozo Salón' : member.role === 'cocina' ? 'Cocina' : 'Caja'}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          member.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {member.active !== false ? 'En Turno' : 'Libre'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Turno e Inventario */}
        {activeTab === 'operacion' && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div><h3 className="font-black text-[#103b39]">Caja del turno</h3><p className="text-xs text-slate-500">Apertura, arqueo y diferencia de efectivo.</p></div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${activeCashShift ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{activeCashShift ? 'TURNO ABIERTO' : 'SIN TURNO'}</span>
              </div>
              {!activeCashShift ? (
                <div className="mt-5 flex items-end gap-3"><label className="flex-1 text-xs font-bold text-slate-600">Fondo inicial (S/)<input value={openingAmount} onChange={(e) => setOpeningAmount(e.target.value)} min="0" step="0.5" type="number" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-700" /></label><button type="button" onClick={() => onOpenCashShift?.(Number(openingAmount))} className="rounded-xl bg-[#103b39] px-4 py-2.5 text-xs font-black text-[#ffd06f]">Abrir caja</button></div>
              ) : (
                <div className="mt-5 space-y-3"><div className="grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl bg-slate-50 p-3"><span className="block text-slate-500">Fondo inicial</span><strong>S/ {activeCashShift.openingAmount.toFixed(2)}</strong></div><div className="rounded-xl bg-slate-50 p-3"><span className="block text-slate-500">Efectivo esperado</span><strong>S/ {(activeCashShift.openingAmount + (paymentTotals.cash || 0)).toFixed(2)}</strong></div></div><div className="flex gap-2"><input value={cashMovementConcept} onChange={(e) => setCashMovementConcept(e.target.value)} placeholder="Concepto de ingreso/gasto" className="min-w-0 flex-1 rounded-lg border px-2 py-1.5 text-xs"/><input value={cashMovementAmount} onChange={(e) => setCashMovementAmount(e.target.value)} placeholder="S/" type="number" className="w-20 rounded-lg border px-2 py-1.5 text-xs"/><button type="button" onClick={() => onCashMovement?.('income', Number(cashMovementAmount), cashMovementConcept)} className="rounded-lg bg-teal-100 px-2 text-xs font-black text-teal-800">Ingreso</button><button type="button" onClick={() => onCashMovement?.('expense', Number(cashMovementAmount), cashMovementConcept)} className="rounded-lg bg-rose-100 px-2 text-xs font-black text-rose-800">Gasto</button></div><div className="flex items-end gap-3"><label className="flex-1 text-xs font-bold text-slate-600">Efectivo contado (S/)<input value={countedAmount} onChange={(e) => setCountedAmount(e.target.value)} min="0" step="0.5" type="number" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-700" /></label><button type="button" onClick={() => onCloseCashShift?.(activeCashShift.id, Number(countedAmount))} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-black text-white">Cerrar y cuadrar</button></div></div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><h3 className="font-black text-[#103b39]">Inventario crítico</h3><p className="text-xs text-slate-500">Actualiza existencias y evita quiebres de stock.</p></div><span className="text-xs font-black text-rose-700">{lowStockItems.length} alertas</span></div>
              <div className="mt-4 space-y-2.5">{inventory.length === 0 ? <p className="py-6 text-center text-xs text-slate-400">No hay insumos registrados.</p> : inventory.map((item) => { const isLow = item.currentStock <= item.minimumStock; return <div key={item.id} className={`flex items-center justify-between rounded-xl border p-3 text-xs ${isLow ? 'border-rose-200 bg-rose-50/50' : 'border-slate-100 bg-slate-50/60'}`}><div><strong className="block text-slate-800">{item.name}</strong><span className={isLow ? 'font-bold text-rose-700' : 'text-slate-500'}>{item.currentStock} {item.unit} · mínimo {item.minimumStock} {item.unit}</span></div><div className="flex gap-1"><button type="button" onClick={() => onAdjustInventory?.(item.id, -1)} className="rounded-lg bg-white px-2 py-1 font-black text-rose-700 shadow-sm">−</button><button type="button" onClick={() => onAdjustInventory?.(item.id, 1)} className="rounded-lg bg-[#103b39] px-2 py-1 font-black text-[#ffd06f]">+</button></div></div>; })}</div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><h3 className="font-black text-[#103b39]">Reservas y lista de espera</h3><p className="text-xs text-slate-500">Organiza la llegada de clientes y confirma su atención.</p></div><span className="text-xs font-black text-teal-800">{activeReservations.length} activas</span></div>
              <form onSubmit={(event) => { event.preventDefault(); if (!reservationName.trim() || !reservationTime) return; onCreateReservation?.({ customerName: reservationName.trim(), phone: reservationPhone.trim(), diners: Math.max(1, Number(reservationDiners)), scheduledAt: reservationTime }); setReservationName(''); setReservationPhone(''); }} className="mt-4 grid gap-2 sm:grid-cols-5"><input required value={reservationName} onChange={(e) => setReservationName(e.target.value)} placeholder="Cliente" className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-teal-700" /><input value={reservationPhone} onChange={(e) => setReservationPhone(e.target.value)} placeholder="Teléfono" className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-teal-700" /><input required type="number" min="1" value={reservationDiners} onChange={(e) => setReservationDiners(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-teal-700" /><input required type="datetime-local" value={reservationTime} onChange={(e) => setReservationTime(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-teal-700" /><button className="rounded-xl bg-[#103b39] px-3 py-2 text-xs font-black text-[#ffd06f]">Registrar</button></form>
              <div className="mt-4 space-y-2">{activeReservations.length === 0 ? <p className="py-4 text-center text-xs text-slate-400">No hay reservas pendientes.</p> : activeReservations.map((reservation) => <div key={reservation.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 text-xs"><div><strong className="text-slate-800">{reservation.customerName}</strong><span className="ml-2 text-slate-500">{reservation.diners} pers. · {new Date(reservation.scheduledAt).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}</span></div><div className="flex gap-1"><button type="button" onClick={() => onUpdateReservationStatus?.(reservation.id, 'confirmed')} className="rounded-lg bg-teal-100 px-2 py-1 font-bold text-teal-800">Confirmar</button><button type="button" onClick={() => onUpdateReservationStatus?.(reservation.id, 'seated')} className="rounded-lg bg-emerald-100 px-2 py-1 font-bold text-emerald-800">Llegó</button><button type="button" onClick={() => onUpdateReservationStatus?.(reservation.id, 'cancelled')} className="rounded-lg bg-rose-100 px-2 py-1 font-bold text-rose-800">Cancelar</button></div></div>)}</div>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><h3 className="font-black text-[#103b39]">Asistencia del personal</h3><p className="text-xs text-slate-500">Control de ingreso y salida del equipo de esta sede.</p></div><span className="text-xs font-black text-emerald-700">{presentStaffIds.size} en turno</span></div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{visibleStaff.map((member) => { const isPresent = presentStaffIds.has(member.id); return <div key={member.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs"><div><strong className="block text-slate-800">{member.name}</strong><span className="text-slate-500">{member.role}</span></div><button type="button" onClick={() => onToggleAttendance?.(member)} className={`rounded-lg px-2.5 py-1.5 font-black ${isPresent ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{isPresent ? 'Marcar salida' : 'Marcar ingreso'}</button></div>; })}</div>
            </div>
          </div>
        )}

        {/* Tab 4: Stock Rápido & Carta */}
        {activeTab === 'stock' && (
          <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#103b39]">Control Rápido de Disponibilidad de Platos</h3>
                <p className="text-xs text-slate-500">
                  Activa o pausa instantáneamente los platos que se agoten en cocina durante el turno.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Buscar plato o categoría..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-[#fffdf9] px-3 py-1.5 text-xs font-semibold outline-none focus:border-teal-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    onSelectCartaTab?.('carta');
                    onNavigate('carta-sede');
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#103b39] px-3.5 py-1.5 text-xs font-bold text-[#ffd06f] hover:bg-[#0c2e2c] cursor-pointer"
                >
                  Editor de Carta Completa <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDishes.slice(0, 18).map((dish) => (
                <div
                  key={dish.id}
                  className={`flex items-center justify-between rounded-2xl border p-3 transition ${
                    dish.available !== false
                      ? 'border-slate-200/80 bg-white'
                      : 'border-rose-200 bg-rose-50/50 opacity-80'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <strong className="block text-xs font-bold text-[#103b39] truncate">{dish.name}</strong>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="capitalize">{dish.category}</span>
                      <span>•</span>
                      <span className="font-extrabold text-emerald-800">S/ {Number(dish.price).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleItemAvailability?.(dish.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                      dish.available !== false
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    }`}
                  >
                    <Power size={13} />
                    <span>{dish.available !== false ? 'Activo' : 'Agotado'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. Executive Quick Access Dock (Accesos Directos Rápidos) */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#103b39]">Accesos Rápidos del Restaurante</h2>
            <p className="text-xs text-slate-500">Navega directamente a las terminales y herramientas operativas.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Card 1: Salón de Mesas */}
          <button
            type="button"
            onClick={() => onNavigate('mesas')}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-xs transition hover:-translate-y-1 hover:border-teal-700/40 hover:shadow-md cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-800 group-hover:bg-[#103b39] group-hover:text-[#ffd06f] transition">
              <Store size={22} />
            </div>
            <div className="mt-4">
              <strong className="block text-sm font-black text-[#103b39]">Salón y Mesas</strong>
              <p className="mt-1 text-xs text-slate-500 leading-snug">
                Distribución de mesas, estado de comensales y apertura.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-teal-800 group-hover:underline">
              Ir al salón <ChevronRight size={14} />
            </span>
          </button>

          {/* Card 2: Cocina KDS */}
          <button
            type="button"
            onClick={() => onNavigate('cocina-kds')}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-xs transition hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-md cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-700 group-hover:bg-orange-600 group-hover:text-white transition">
              <ChefHat size={22} />
            </div>
            <div className="mt-4">
              <strong className="block text-sm font-black text-[#103b39]">Cocina KDS</strong>
              <p className="mt-1 text-xs text-slate-500 leading-snug">
                Monitor en vivo de comandas, barra fría y cocina caliente.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-orange-700 group-hover:underline">
              Ir a cocina <ChevronRight size={14} />
            </span>
          </button>

          {/* Card 3: Caja y Cobro POS */}
          <button
            type="button"
            onClick={() => onNavigate('cuenta-cobro')}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-xs transition hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Receipt size={22} />
            </div>
            <div className="mt-4">
              <strong className="block text-sm font-black text-[#103b39]">Caja y Cobro</strong>
              <p className="mt-1 text-xs text-slate-500 leading-snug">
                Cobro de cuentas, boletas, facturas y propinas del turno.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 group-hover:underline">
              Ir a cobrar <ChevronRight size={14} />
            </span>
          </button>

          {/* Card 4: Carta y Precios */}
          <button
            type="button"
            onClick={() => {
              onSelectCartaTab?.('carta');
              onNavigate('carta-sede');
            }}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-xs transition hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-md cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition">
              <UtensilsCrossed size={22} />
            </div>
            <div className="mt-4">
              <strong className="block text-sm font-black text-[#103b39]">Carta y Precios</strong>
              <p className="mt-1 text-xs text-slate-500 leading-snug">
                Ajustar precios por sede, porciones, fotos y categorías.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 group-hover:underline">
              Editar carta <ChevronRight size={14} />
            </span>
          </button>

          {/* Card 5: Equipo y Personal */}
          <button
            type="button"
            onClick={() => {
              onSelectCartaTab?.('equipo');
              onNavigate('carta-sede');
            }}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-xs transition hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-md cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition">
              <Users size={22} />
            </div>
            <div className="mt-4">
              <strong className="block text-sm font-black text-[#103b39]">Equipo y Turnos</strong>
              <p className="mt-1 text-xs text-slate-500 leading-snug">
                Mozos, cocineros, asignación de PINs y sedes operativas.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-purple-700 group-hover:underline">
              Ver equipo <ChevronRight size={14} />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
