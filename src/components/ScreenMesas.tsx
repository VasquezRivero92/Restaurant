import React, { useState } from 'react';
import { TableItem, ScreenType, AppRole, StaffMember, KDSTicket, QrCustomerOrder } from '../types';
import {
  isGenericWaiter,
  isTableAssignedToWaiter,
  isDrinkKDSTicketItem,
  extractDrinksFromTickets,
  matchesTable
} from '../utils/waiterUtils';

interface ScreenMesasProps {
  tables: TableItem[];
  kdsTickets?: KDSTicket[];
  staffMembers?: StaffMember[];
  onNavigate: (screen: ScreenType) => void;
  onSelectTable: (tableId: string) => void;
  onMarkDelivered: (tableId: string) => void;
  onRequestBill?: (tableId: string) => void;
  onOpenTable: (tableId: string) => void;
  onUpdateTableWaiter?: (tableId: string, newWaiterName: string) => void;
  onToggleDrinkServed?: (tableId: string, drinkId: string) => void;
  onServeAllDrinks?: (tableIdOrIds?: string | string[]) => void;
  onOpenDrinksTray?: () => void;
  currentRole?: AppRole;
  currentUserName?: string;
  qrOrders?: QrCustomerOrder[];
  onConfirmQrOrder?: (order: QrCustomerOrder) => Promise<void>;
}

export const ScreenMesas: React.FC<ScreenMesasProps> = ({
  tables,
  kdsTickets = [],
  staffMembers = [],
  onNavigate,
  onSelectTable,
  onMarkDelivered,
  onRequestBill,
  onOpenTable,
  onUpdateTableWaiter,
  onToggleDrinkServed,
  onServeAllDrinks,
  onOpenDrinksTray,
  currentRole = 'admin_sede',
  currentUserName = '',
  qrOrders = [],
  onConfirmQrOrder
}) => {
  const isWaiter = currentRole === 'mesero';
  const isAdmin = currentRole === 'admin_sede' || currentRole === 'admin_general' || currentRole === 'admin_global';
  const canManageService = isWaiter || isAdmin;
  const canCollectPayment = canManageService || currentRole === 'cajero';
  const canCollectOtherWaiterPayments = isAdmin || currentRole === 'cajero';

  const [activeFilter, setActiveFilter] = useState<'all' | 'ready' | 'drinks' | 'occupied' | 'free'>('all');
  const [scopeMode, setScopeMode] = useState<'my_tables' | 'all'>(isWaiter ? 'my_tables' : 'all');
  const [showTopAlert, setShowTopAlert] = useState(true);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Modal para reasignación de mesa exclusiva por Administrador
  const [reassignModalTable, setReassignModalTable] = useState<TableItem | null>(null);
  const [selectedNewWaiter, setSelectedNewWaiter] = useState<string>('');
  const [customWaiterName, setCustomWaiterName] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [confirmingQrOrderId, setConfirmingQrOrderId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const availableWaiters = staffMembers.filter((s) => s.active);

  const isMyTable = (table: TableItem) => {
    return isTableAssignedToWaiter(table, currentUserName, isWaiter);
  };

  // Harmonize tables with active KDS comanda tickets so drinks and dishes in preparation/ready are always visible to the waiter
  const effectiveTables = tables.map((t) => {
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
      const ticketWaiter =
        activeTicket.waiter && !isGenericWaiter(activeTicket.waiter)
          ? activeTicket.waiter
          : (t.waiter && !isGenericWaiter(t.waiter) ? t.waiter : (isWaiter ? (currentUserName || 'Carlos Mendoza') : t.waiter));

      const newStatus =
        t.status === 'free'
          ? (foodItems.length > 0 && allFoodReady ? 'ready' : 'cooking')
          : (allFoodReady && t.status !== 'bill_requested' ? 'ready' : t.status);

      const ticketDishes = foodItems.map((fi, idx) => ({
        id: fi.id || `tdish-${idx}`,
        name: `${fi.qty}x ${fi.name}`,
        qty: fi.qty,
        price: fi.price,
        station: (fi.substation || (fi as any).station || 'Cocina').includes('FRÍ') ? 'Barra Fría' : 'Calientes',
        description: fi.notes || 'Preparado por cocina',
        status: (fi.isServed ? 'served' : fi.isReady ? 'ready' : 'cooking') as 'cooking' | 'ready' | 'served'
      }));

      const combinedDishes = t.dishes && t.dishes.length > 0 ? t.dishes : ticketDishes;

      return {
        ...t,
        status: newStatus,
        waiter: ticketWaiter,
        dishes: combinedDishes,
        drinks: combinedDrinks
      };
    }

    return {
      ...t,
      drinks: combinedDrinks
    };
  });

  const myAssignedTables = effectiveTables.filter((t) => t.status !== 'free' && isMyTable(t));
  const myAssignedCount = myAssignedTables.length;

  const totalCount = effectiveTables.length;
  const freeCount = effectiveTables.filter((t) => t.status === 'free').length;
  const occupiedCount = totalCount - freeCount;

  // Para mozo: alertas de cocina y bebidas filtradas a sus mesas asignadas
  const relevantAlertTables = isWaiter ? effectiveTables.filter((t) => isMyTable(t)) : effectiveTables;
  const readyCount = relevantAlertTables.filter((t) => t.status === 'ready').length;
  const firstReadyTable = relevantAlertTables.find((t) => t.status === 'ready');
  const tablesWithPendingDrinks = relevantAlertTables.filter((t) =>
    t.drinks?.some((d) => !d.served)
  );
  const pendingDrinksCount = tablesWithPendingDrinks.length;
  const totalPendingGlasses = relevantAlertTables.reduce((acc, t) => {
    return acc + (t.drinks?.filter((d) => !d.served).length || 0);
  }, 0);

  // Lista base: en modo 'my_tables' el mozo solo ve sus mesas asignadas y las mesas libres para abrir
  const baseTables = (isWaiter && scopeMode === 'my_tables')
    ? effectiveTables.filter((t) => t.status === 'free' || isMyTable(t))
    : effectiveTables;

  const filteredTables = baseTables.filter((table) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'ready') return table.status === 'ready';
    if (activeFilter === 'drinks') return table.drinks?.some((d) => !d.served);
    if (activeFilter === 'occupied') return table.status !== 'free';
    if (activeFilter === 'free') return table.status === 'free';
    return true;
  }).sort((a, b) => {
    // El salón siempre muestra primero lo que exige una acción inmediata.
    const urgency: Record<TableItem['status'], number> = {
      bill_requested: 0,
      ready: 1,
      cooking: 2,
      eating: 3,
      occupied: 4,
      free: 5
    };
    const aDrinks = a.drinks?.some((drink) => !drink.served) ? -0.5 : 0;
    const bDrinks = b.drinks?.some((drink) => !drink.served) ? -0.5 : 0;
    return urgency[a.status] + aDrinks - (urgency[b.status] + bDrinks);
  });

  const handleHighlight = (tableId: string) => {
    setHighlightedId(tableId);
    const el = document.getElementById(tableId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => setHighlightedId(null), 1500);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2">
      {canManageService && qrOrders.length > 0 && (
        <section className="mx-4 mb-2 rounded-2xl border-2 border-violet-300 bg-violet-50 p-4 shadow-sm" aria-live="polite">
          <div className="flex items-start gap-3"><div className="rounded-xl bg-violet-600 p-2 text-white animate-pulse"><span className="material-symbols-outlined">notifications_active</span></div><div className="min-w-0 flex-1"><p className="text-xs font-black tracking-wide text-violet-700">NUEVO PEDIDO DESDE QR</p><h2 className="text-base font-black text-violet-950">{qrOrders.length} {qrOrders.length === 1 ? 'mesa espera' : 'mesas esperan'} confirmación</h2><p className="mt-1 text-xs text-violet-900">Acércate, revisa el pedido y confírmalo. Nada se envía a cocina antes de tu confirmación.</p></div></div>
          <div className="mt-3 space-y-2">{qrOrders.map(order => <div key={order.id} className="rounded-xl bg-white p-3 border border-violet-200"><div className="flex items-center justify-between gap-2"><div><strong className="text-sm text-slate-900">Mesa {order.tableNumber}</strong><p className="text-xs text-slate-600">{order.items.map(i => `${i.qty}x ${i.dishName}`).join(' · ')}</p></div><strong className="text-sm text-violet-800">S/ {order.total.toFixed(2)}</strong></div>{order.notes && <p className="mt-2 text-xs italic text-slate-500">“{order.notes}”</p>}<button disabled={confirmingQrOrderId === order.id} onClick={async () => { if (!onConfirmQrOrder) return; setConfirmingQrOrderId(order.id); try { await onConfirmQrOrder(order); showToast(`Pedido QR de Mesa ${order.tableNumber} enviado a cocina.`); } catch (error) { showToast(error instanceof Error ? error.message : 'No se pudo confirmar el pedido.'); } finally { setConfirmingQrOrderId(null); } }} className="mt-3 w-full rounded-lg bg-violet-700 py-2.5 text-xs font-black text-white hover:bg-violet-800 disabled:opacity-50">{confirmingQrOrderId === order.id ? 'Confirmando…' : 'Confirmar pedido y enviar a cocina'}</button></div>)}</div>
        </section>
      )}
      {/* Top Live Alerts Ticker Banner */}
      {showTopAlert && (
        <div className="px-4 pt-1 pb-2">
          {totalPendingGlasses > 0 ? (
            <div className="relative overflow-hidden rounded-xl bg-amber-500 text-amber-950 p-4 shadow-lg flex flex-col gap-2.5 border border-amber-400">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-amber-800 flex items-center justify-center flex-shrink-0 animate-bounce shadow">
                    <span className="material-symbols-outlined text-[24px]">local_bar</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-900 animate-ping"></span>
                      <span className="font-extrabold text-xs text-amber-950 tracking-wider uppercase">
                        Bebidas por Servir en Salón
                      </span>
                    </div>
                    <p className="font-black text-base text-amber-950 leading-tight mt-0.5">
                      {totalPendingGlasses} bebidas pendientes en {pendingDrinksCount} {pendingDrinksCount === 1 ? 'mesa' : 'mesas'}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-black/15 text-amber-950 text-xs font-black whitespace-nowrap">
                  Atención Mozo
                </span>
              </div>

              <p className="text-xs text-amber-950/90 leading-snug">
                Las bebidas no esperan a cocina. Sírvelas de inmediato para mejorar la experiencia del cliente.
              </p>

              <div className="flex items-center gap-2 mt-1">
                {onOpenDrinksTray && (
                  <button
                    onClick={onOpenDrinksTray}
                    className="flex-1 h-10 rounded-lg bg-amber-950 hover:bg-black text-amber-100 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">liquor</span>
                    <span>Abrir Bandeja de Bebidas ({totalPendingGlasses})</span>
                  </button>
                )}
                <button
                  aria-label="Descartar"
                  onClick={() => setShowTopAlert(false)}
                  className="w-10 h-10 rounded-lg bg-black/10 hover:bg-black/20 text-amber-950 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          ) : readyCount > 0 ? (
            <div className="relative overflow-hidden rounded-xl bg-tertiary-container text-on-tertiary p-4 shadow-lg flex flex-col gap-3 border border-orange-500/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-on-tertiary-container flex items-center justify-center text-on-primary flex-shrink-0 animate-bounce shadow">
                    <span className="material-symbols-outlined text-[24px]">notifications_active</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
                      <span className="font-bold text-xs text-secondary-container tracking-wider uppercase">
                        Listo en Cocina
                      </span>
                    </div>
                    <p className="font-bold text-lg text-on-primary leading-tight mt-0.5">
                      ¡Mesa {firstReadyTable?.number} tiene {firstReadyTable?.dishes?.length || 1} {firstReadyTable?.dishes?.length === 1 ? 'plato listo' : 'platos listos'}!
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary/40 text-secondary-fixed text-xs font-bold whitespace-nowrap">
                  Hace 2m
                </span>
              </div>

              <p className="text-sm text-tertiary-fixed leading-snug">
                {firstReadyTable?.dishes?.map((dish) => `${dish.qty}x ${dish.name}`).join(', ') || 'Platos listos para pase inmediato.'}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => firstReadyTable && handleHighlight(firstReadyTable.id)}
                  className="flex-1 h-11 rounded-lg bg-on-tertiary-container hover:bg-orange-600 text-on-primary font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">room_service</span>
                  <span>Ver y Recoger</span>
                </button>
                <button
                  aria-label="Descartar"
                  onClick={() => setShowTopAlert(false)}
                  className="w-11 h-11 rounded-lg bg-primary/40 hover:bg-primary/60 text-on-tertiary flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Waiter Scope Selector (Mis Mesas vs Salón Completo) */}
      {isWaiter && (
        <div className="px-3 sm:px-4 pt-1 pb-1.5">
          <div className="bg-surface-container-low p-2.5 rounded-2xl border border-outline-variant/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {currentUserName ? currentUserName.charAt(0) : 'M'}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-xs text-on-surface truncate">
                    Mozo: {currentUserName}
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                    {myAssignedCount} mesa(s) a tu cargo
                  </span>
                </div>
                <span className="text-[11px] text-teal-700 font-medium truncate">
                  {scopeMode === 'my_tables'
                    ? 'Mostrando solo tus mesas asignadas y libres para atender'
                    : 'Modo exploración: Viendo todo el salón'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setScopeMode('my_tables')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  scopeMode === 'my_tables'
                    ? 'bg-primary text-on-primary shadow-xs font-black'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">assignment_ind</span>
                <span>Mis Mesas ({myAssignedCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setScopeMode('all')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  scopeMode === 'all'
                    ? 'bg-primary text-on-primary shadow-xs font-black'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">grid_view</span>
                <span>Todo el Salón ({totalCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Salón Stats Matrix */}
      <div className="px-3 sm:px-4 py-2">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 bg-surface-container-low p-1.5 sm:p-2 rounded-2xl border border-outline-variant/30">
          <button
            type="button"
            aria-pressed={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            className={`flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-xl cursor-pointer transition-all ${
              activeFilter === 'all' ? 'bg-surface shadow-sm ring-1 ring-primary/20' : 'bg-surface/60 hover:bg-surface'
            }`}
          >
            <span className="font-extrabold text-xl sm:text-2xl text-primary leading-none">{totalCount}</span>
            <span className="text-[10px] sm:text-xs text-on-surface-variant font-medium mt-1 truncate">Totales</span>
          </button>

          <button
            type="button"
            aria-pressed={activeFilter === 'occupied'}
            onClick={() => setActiveFilter('occupied')}
            className={`flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-xl cursor-pointer transition-all ${
              activeFilter === 'occupied' ? 'bg-primary-container shadow-sm' : 'bg-primary-container/80 hover:bg-primary-container'
            }`}
          >
            <span className="font-extrabold text-xl sm:text-2xl text-secondary-container leading-none">{occupiedCount}</span>
            <span className="text-[10px] sm:text-xs text-on-primary font-medium mt-1 truncate">Ocupadas</span>
          </button>

          <button
            type="button"
            aria-pressed={activeFilter === 'ready'}
            onClick={() => setActiveFilter('ready')}
            className={`flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-xl cursor-pointer transition-all relative overflow-hidden ${
              activeFilter === 'ready' ? 'bg-tertiary-container ring-2 ring-on-tertiary-container' : 'bg-tertiary-container/90'
            }`}
          >
            {readyCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-on-tertiary-container animate-ping"></span>
            )}
            <span className="font-extrabold text-xl sm:text-2xl text-on-tertiary leading-none">{readyCount}</span>
            <span className="text-[10px] sm:text-xs text-tertiary-fixed font-medium mt-1 truncate">Listas</span>
          </button>

          <button
            type="button"
            aria-pressed={activeFilter === 'drinks'}
            onClick={() => setActiveFilter('drinks')}
            className={`flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-xl cursor-pointer transition-all relative overflow-hidden ${
              activeFilter === 'drinks' ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-600' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
            }`}
          >
            {totalPendingGlasses > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-700 animate-ping"></span>
            )}
            <span className="font-extrabold text-xl sm:text-2xl leading-none">{totalPendingGlasses}</span>
            <span className="text-[10px] sm:text-xs font-bold mt-1 truncate">Bebidas</span>
          </button>
        </div>
      </div>

      {/* Table Cards Layout List */}
      <div className="px-3 sm:px-4 flex flex-col gap-3.5 sm:gap-4 pb-6 max-w-2xl mx-auto w-full">
        {filteredTables.map((table) => {
          const isHighlighted = highlightedId === table.id;
          const hasDrinks = table.drinks && table.drinks.length > 0;
          const hasPendingDrinks = table.drinks?.some((d) => !d.served);

          const isCurrentTableMine = isMyTable(table);
          const isUnassignedTable = !table.waiter || isGenericWaiter(table.waiter);
          const isOtherWaiterTable = isWaiter && !isCurrentTableMine && !isUnassignedTable;

          // Free table render (en blanco / sin asignar)
          if (table.status === 'free') {
            return (
              <div
                key={table.id}
                id={table.id}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col justify-between gap-3 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-surface-container text-on-surface flex items-center justify-center font-bold text-lg">
                    {table.number}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] uppercase tracking-wide border border-emerald-200">
                    Libre
                  </span>
                </div>

                <div>
                  <p className="text-xs text-on-surface-variant font-medium">Capacidad: {table.diners} personas</p>
                  <p className="text-xs text-on-surface-variant">{table.notes || table.zone}</p>
                </div>

                <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-slate-400">person_off</span>
                    <span>Mozo: <strong className="text-slate-500 font-medium italic">{table.waiter || 'En blanco (Sin asignar)'}</strong></span>
                  </span>
                  {isAdmin && onUpdateTableWaiter ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setReassignModalTable(table);
                        setSelectedNewWaiter(table.waiter || '');
                        setCustomWaiterName('');
                      }}
                      className="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1 border border-amber-300 transition-all cursor-pointer active:scale-95"
                      title="Asignar mozo previamente (Solo Administrador)"
                    >
                      <span className="material-symbols-outlined text-[12px] text-amber-700">person_add</span>
                      <span>Asignar</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-teal-800 font-bold bg-teal-100/70 px-2 py-0.5 rounded-full">
                      Autoasignable
                    </span>
                  )}
                </div>

                {canManageService ? (
                  <button
                    onClick={() => onOpenTable(table.id)}
                    className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow cursor-pointer min-h-[44px]"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Abrir Mesa {table.number} {isWaiter ? '(Autoasignarme y Tomar Pedido)' : ''}</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-3 rounded-xl bg-surface-container text-xs text-on-surface-variant font-medium text-center border border-outline-variant/30 flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>La apertura de mesas es exclusiva de salón</span>
                  </div>
                )}
              </div>
            );
          }

          // Render waiter info with admin fast-reassign buttons
          const renderWaiterHeaderInfo = () => (
            <div className="flex items-center gap-1.5 flex-wrap mt-1 w-full">
              {isCurrentTableMine && (
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 font-extrabold text-[10px] flex items-center gap-0.5 border border-teal-300">
                  <span className="material-symbols-outlined text-[12px]">person_check</span>
                  <span>Mi Mesa</span>
                </span>
              )}
              <span className="text-xs text-on-surface-variant truncate">
                Mozo:{' '}
                <strong
                  className={
                    isCurrentTableMine
                      ? 'text-teal-700 font-bold'
                      : isOtherWaiterTable
                      ? 'text-amber-700 font-bold'
                      : 'text-primary font-bold'
                  }
                >
                  {table.waiter || 'En blanco (Sin asignar)'}
                </strong>
              </span>

              {/* Acciones exclusivas de Administrador: Atender yo mismo o Reasignar a otro personal */}
              {isAdmin && onUpdateTableWaiter && (
                <div className="flex items-center gap-1 ml-auto flex-wrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateTableWaiter(table.id, currentUserName || 'Administrador');
                      showToast(`✓ Mesa ${table.number} ahora está a tu cargo (${currentUserName || 'Administrador'})`);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center gap-0.5 border border-indigo-200 transition-all cursor-pointer active:scale-95"
                    title="Atender esta mesa directamente como Administrador"
                  >
                    <span className="material-symbols-outlined text-[12px]">person_pin</span>
                    <span>Atender yo</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setReassignModalTable(table);
                      setSelectedNewWaiter(table.waiter || '');
                      setCustomWaiterName('');
                    }}
                    className="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-0.5 border border-amber-300 transition-all cursor-pointer active:scale-95"
                    title="Reasignar esta mesa a otro mozo (Solo Administrador)"
                  >
                    <span className="material-symbols-outlined text-[12px] text-amber-700">swap_horiz</span>
                    <span>Reasignar</span>
                  </button>
                </div>
              )}
            </div>
          );

          // Drinks UI Box per table
          const renderDrinksSection = () => {
            if (!hasDrinks) return null;

            return (
              <div className="rounded-xl bg-amber-50/80 border border-amber-200/90 p-3 sm:p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0">local_bar</span>
                    <span className="font-extrabold text-xs text-amber-950 truncate">
                      Bebidas (Servicio por Mozo)
                    </span>
                  </div>

                  {hasPendingDrinks ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px] animate-pulse whitespace-nowrap">
                        ⏳ Por Servir
                      </span>
                      {canManageService && onServeAllDrinks && !isOtherWaiterTable && (
                        <button
                          onClick={() => onServeAllDrinks(table.id)}
                          className="h-7 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] sm:text-[11px] flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                          title="Servir todas las bebidas de esta mesa"
                        >
                          <span className="material-symbols-outlined text-[13px]">done_all</span>
                          <span>Servir Todo</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <span className="material-symbols-outlined text-[12px]">check</span>
                      <span>Bebidas Servidas</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {table.drinks?.map((drink) => (
                    <div
                      key={drink.id}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
                        drink.served
                          ? 'bg-white/60 border border-emerald-200/50 text-on-surface-variant'
                          : 'bg-white border border-amber-300 shadow-xs text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className={`material-symbols-outlined text-[18px] shrink-0 ${drink.served ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {drink.name.toLowerCase().includes('cerveza') ? 'sports_bar' : 'local_drink'}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className={`font-bold text-xs truncate ${drink.served ? 'line-through opacity-70' : ''}`}>
                            {drink.qty}x {drink.name} {drink.size && <span className="font-normal text-on-surface-variant">({drink.size})</span>}
                          </span>
                          {drink.served && drink.servedAt && (
                            <span className="text-[9px] text-emerald-700 font-medium">
                              Servido a las {drink.servedAt}
                            </span>
                          )}
                        </div>
                      </div>

                      {canManageService && onToggleDrinkServed && !isOtherWaiterTable && (
                        <button
                          onClick={() => onToggleDrinkServed(table.id, drink.id)}
                          className={`h-7 px-2.5 rounded-lg font-bold text-[10px] sm:text-[11px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0 ${
                            drink.served
                              ? 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {drink.served ? 'undo' : 'check'}
                          </span>
                          <span>{drink.served ? 'Revertir' : 'Entregar'}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          };

          // Mesa Listo para recoger (Ready)
          if (table.status === 'ready') {
            return (
              <div
                key={table.id}
                id={table.id}
                className={`relative bg-surface-container-lowest rounded-2xl p-4 shadow-md border-2 border-secondary flex flex-col gap-3.5 transition-all duration-300 ${
                  isHighlighted ? 'scale-[1.02] ring-4 ring-secondary/30' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex flex-col items-center justify-center font-bold text-xl shadow shrink-0">
                      <span>{table.number}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container animate-ping shrink-0"></span>
                        <span className="font-bold text-xs text-tertiary-container uppercase tracking-wide truncate">
                          ¡Listo para recoger!
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span className="text-xs text-on-surface-variant">Zona: {table.zone}</span>
                      </div>
                      {renderWaiterHeaderInfo()}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-xs font-bold shrink-0">
                    {table.timeInSalon}
                  </span>
                </div>

                {/* Dish ready slip preview */}
                <div className="rounded-xl bg-surface-container-high p-3 flex flex-col gap-2 border border-outline-variant/30">
                  {table.dishes?.map((dish, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between text-on-surface">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">
                            {dish.station.includes('Fría') ? 'set_meal' : 'skillet'}
                          </span>
                          <span className="font-bold text-xs truncate">{dish.name}</span>
                        </div>
                        <span className="text-[10px] bg-surface px-2 py-0.5 rounded text-tertiary-container font-bold shrink-0">
                          {dish.station}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant pl-6 leading-tight">
                        {dish.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Drinks Section */}
                {renderDrinksSection()}

                {/* Action Button: restricted for other waiters */}
                {!canManageService || isOtherWaiterTable ? (
                  <div className="w-full py-2.5 px-3 rounded-xl bg-surface-container text-xs text-on-surface-variant font-medium text-center border border-outline-variant/30 flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">lock</span>
                    <span>Mesa asignada a <strong>{table.waiter}</strong> • Solo su mozo puede entregar</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={() => onNavigate('cocina-kds')}
                      className="h-11 sm:h-12 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">skillet</span>
                      <span>Ver en KDS</span>
                    </button>
                    <button
                      onClick={() => onMarkDelivered(table.id)}
                      className="h-11 sm:h-12 rounded-xl bg-secondary hover:bg-teal-700 text-on-secondary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">task_alt</span>
                      <span>Entregar Platos</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // Mesa Cuenta pedida / Por cobrar
          if (table.status === 'bill_requested') {
            return (
              <div
                key={table.id}
                id={table.id}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-md border border-outline-variant/30 flex flex-col gap-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex flex-col items-center justify-center font-bold text-xl shrink-0">
                      <span>{table.number}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
                        <span className="font-bold text-xs text-secondary uppercase tracking-wide truncate">
                          Cuenta Pedida
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span className="text-xs text-on-surface-variant">{table.diners} Personas • {table.timeInSalon}</span>
                      </div>
                      {renderWaiterHeaderInfo()}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-xl sm:text-2xl text-primary leading-none block">
                      S/ {table.total?.toFixed(2)}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-on-surface-variant">Total consumo</span>
                  </div>
                </div>

                {/* Drinks Section */}
                {renderDrinksSection()}

                {table.notes && (
                  <div className="flex items-center gap-2 bg-surface-container-low p-2 rounded-lg text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-[18px] text-secondary">payments</span>
                    <span>{table.notes}</span>
                  </div>
                )}

                {/* Action Buttons: restricted for other waiters */}
                {(!canCollectPayment || (isOtherWaiterTable && !canCollectOtherWaiterPayments)) ? (
                  <div className="w-full py-2.5 px-3 rounded-xl bg-surface-container text-xs text-on-surface-variant font-medium text-center border border-outline-variant/30 flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">lock</span>
                    <span>Mesa a cargo de <strong>{table.waiter}</strong> • Cobro exclusivo por su mozo</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        onSelectTable(table.id);
                        onNavigate('cuenta-cobro');
                      }}
                      className="h-11 sm:h-12 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                      <span>Ver Pre-cuenta</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectTable(table.id);
                        onNavigate('cuenta-cobro');
                      }}
                      className="h-11 sm:h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                      <span>Cobrar y Liberar</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // Mesa Comiendo
          if (table.status === 'eating') {
            return (
              <div
                key={table.id}
                id={table.id}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-md border border-outline-variant/30 flex flex-col gap-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex flex-col items-center justify-center font-bold text-xl shrink-0">
                      <span>{table.number}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="font-bold text-xs text-primary uppercase tracking-wide truncate">
                          Comiendo
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span className="text-xs text-on-surface-variant">{table.diners} comensales</span>
                      </div>
                      {renderWaiterHeaderInfo()}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-lg sm:text-xl text-primary leading-none block">
                      S/ {table.total?.toFixed(2)}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-on-surface-variant">{table.timeInSalon}</span>
                  </div>
                </div>

                {/* Drinks Section */}
                {renderDrinksSection()}

                {/* Action Buttons: restricted for other waiters */}
                {!canManageService || isOtherWaiterTable ? (
                  <div className="w-full py-2.5 px-3 rounded-xl bg-surface-container text-xs text-on-surface-variant font-medium text-center border border-outline-variant/30 flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">lock</span>
                    <span>Mesa a cargo de <strong>{table.waiter}</strong> • Seguimiento exclusivo de su mozo</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        onSelectTable(table.id);
                        onNavigate('tomar-pedido');
                      }}
                      className="h-11 sm:h-12 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_circle</span>
                      <span>Agregar Pedido</span>
                    </button>
                    <button
                      onClick={() => {
                        onRequestBill?.(table.id);
                        onSelectTable(table.id);
                        onNavigate('cuenta-cobro');
                      }}
                      className="h-11 sm:h-12 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">request_quote</span>
                      <span>Solicitar Cuenta</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // Mesa En Preparación (Cooking)
          return (
            <div
              key={table.id}
              id={table.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-md border border-outline-variant/30 flex flex-col gap-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex flex-col items-center justify-center font-bold text-xl shrink-0">
                    <span>{table.number}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shrink-0"></span>
                      <span className="font-bold text-xs text-on-surface uppercase tracking-wide truncate">
                        En Preparación (Cocina)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span className="text-xs text-on-surface-variant">{table.diners} comensales • {table.timeInSalon}</span>
                    </div>
                    {renderWaiterHeaderInfo()}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold shrink-0">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>{table.estRemaining || '~8 min'}</span>
                </div>
              </div>

              {/* Kitchen Dish Progress */}
              <div className="bg-surface-container-low p-2.5 rounded-xl flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface font-medium truncate">
                    {table.dishes?.[0]?.name || 'Platos de cevichería'}
                  </span>
                  <span className="text-secondary font-bold shrink-0">
                    {table.dishes?.[0]?.station || 'En Fogones'}
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full transition-all duration-500"
                    style={{ width: `${table.progress || 50}%` }}
                  ></div>
                </div>
              </div>

              {/* Drinks Section */}
              {renderDrinksSection()}

              {/* Action Buttons: restricted for other waiters */}
              {!canManageService || isOtherWaiterTable ? (
                <div className="w-full py-2.5 px-3 rounded-xl bg-surface-container text-xs text-on-surface-variant font-medium text-center border border-outline-variant/30 flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-slate-500">lock</span>
                  <span>Mesa a cargo de <strong>{table.waiter}</strong> • En preparación para su mozo</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      onSelectTable(table.id);
                      onNavigate('tomar-pedido');
                    }}
                    className="h-11 sm:h-12 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Añadir Más</span>
                  </button>
                  <button
                    onClick={() => onNavigate('cocina-kds')}
                    className="h-11 sm:h-12 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">skillet</span>
                    <span>Ver en KDS</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredTables.length === 0 && (
          <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-dashed border-outline-variant/40 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[32px]">assignment_ind</span>
            </div>
            <div className="max-w-sm">
              <h4 className="font-extrabold text-sm text-on-surface">No hay mesas en esta vista</h4>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                {isWaiter && scopeMode === 'my_tables'
                  ? 'Actualmente no tienes mesas asignadas con este filtro. Puedes abrir cualquier mesa libre del salón para tomar la orden y se te autoasignará de inmediato.'
                  : 'No se encontraron mesas con los criterios de filtro seleccionados.'}
              </p>
            </div>
            {isWaiter && (
              <button
                type="button"
                onClick={() => {
                  setScopeMode('all');
                  setActiveFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                <span>Ver Todo el Salón</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Drinks Tray Trigger Button for Mozo */}
      {totalPendingGlasses > 0 && onOpenDrinksTray && (
        <div className="fixed bottom-20 left-4 z-30">
          <button
            onClick={onOpenDrinksTray}
            className="h-12 px-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-amber-950 flex items-center gap-2 shadow-xl active:scale-90 transition-transform cursor-pointer border border-amber-300 font-extrabold text-xs"
            title="Abrir Bandeja de Bebidas"
          >
            <span className="material-symbols-outlined text-[20px]">local_bar</span>
            <span>Bebidas ({totalPendingGlasses})</span>
          </button>
        </div>
      )}

      {/* Floating Kitchen Alert Trigger Button */}
      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={() => onNavigate('cocina-kds')}
          className="w-13 h-13 rounded-full bg-tertiary-container hover:bg-orange-950 text-on-tertiary flex items-center justify-center shadow-xl active:scale-90 transition-transform relative cursor-pointer border border-orange-400/30"
          title="Ver KDS Cocina"
        >
          <span className="material-symbols-outlined text-[26px]">soup_kitchen</span>
          {readyCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center font-bold text-[11px] text-on-secondary ring-2 ring-surface">
              {readyCount}
            </span>
          )}
        </button>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <span className="material-symbols-outlined text-[18px] text-amber-400">info</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Modal Reasignar Mozo (Exclusivo Administrador) */}
      {reassignModalTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-outline-variant/30 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-primary">
                    Reasignar Mesa {reassignModalTable.number}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Autoridad de Administrador de Sede
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReassignModalTable(null)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Info context */}
            <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/20 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Mozo actualmente asignado:</span>
                <span className="font-black text-primary">
                  {reassignModalTable.waiter || 'En blanco (Sin asignar)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Estado actual de la mesa:</span>
                <span className="font-bold text-teal-700 uppercase text-[11px]">
                  {reassignModalTable.statusLabel || reassignModalTable.status}
                </span>
              </div>
            </div>

            {/* Admin Fast Actions */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Acciones Rápidas de Administración
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (onUpdateTableWaiter) {
                      onUpdateTableWaiter(reassignModalTable.id, currentUserName || 'Administrador');
                      showToast(`✓ Mesa ${reassignModalTable.number} ahora está a cargo de ${currentUserName || 'Administrador'}`);
                      setReassignModalTable(null);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-indigo-700 text-[20px]">person_pin</span>
                  <span>Atender yo mismo</span>
                  <span className="text-[10px] text-indigo-600 font-normal">({currentUserName || 'Administrador'})</span>
                </button>

                <button
                  onClick={() => {
                    if (onUpdateTableWaiter) {
                      onUpdateTableWaiter(reassignModalTable.id, '');
                      showToast(`✓ Mesa ${reassignModalTable.number} quedó en blanco (Sin asignar)`);
                      setReassignModalTable(null);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-slate-600 text-[20px]">person_off</span>
                  <span>Dejar en blanco</span>
                  <span className="text-[10px] text-slate-500 font-normal">(Cualquier mozo podrá autoasignarse)</span>
                </button>
              </div>
            </div>

            {/* Waiter Selection List */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Seleccionar Mozo del Personal
              </span>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                {availableWaiters.map((staff) => {
                  const isSelected = selectedNewWaiter === staff.name;
                  return (
                    <button
                      key={staff.id}
                      onClick={() => setSelectedNewWaiter(staff.name)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 shadow-xs ring-1 ring-amber-400'
                          : 'bg-surface hover:bg-surface-container-low border-outline-variant/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full ${staff.avatarColor || 'bg-amber-600'} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                          {staff.name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-xs text-primary truncate">
                            {staff.name}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">
                            {staff.role} • {staff.shift}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">
                          check_circle
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Name input if not in list */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant">
                O ingresar nombre manualmente:
              </label>
              <input
                type="text"
                placeholder="Ej: Pedro Ramos"
                value={customWaiterName}
                onChange={(e) => {
                  setCustomWaiterName(e.target.value);
                  if (e.target.value.trim()) {
                    setSelectedNewWaiter(e.target.value.trim());
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setReassignModalTable(null)}
                className="flex-1 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const finalWaiter = (customWaiterName.trim() || selectedNewWaiter.trim());
                  if (!finalWaiter) {
                    showToast('⚠️ Por favor selecciona o escribe un mozo');
                    return;
                  }
                  if (onUpdateTableWaiter) {
                    onUpdateTableWaiter(reassignModalTable.id, finalWaiter);
                    showToast(`✓ Mesa ${reassignModalTable.number} reasignada a ${finalWaiter}`);
                    setReassignModalTable(null);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Confirmar Reasignación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
