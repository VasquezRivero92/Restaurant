import React, { useState } from 'react';
import { KDSTicket, ScreenType, AppRole, TableItem } from '../types';
import { isTicketAssignedToWaiter, isDrinkKDSTicketItem } from '../utils/waiterUtils';

interface ScreenCocinaKDSProps {
  tickets: KDSTicket[];
  tables?: TableItem[];
  onUpdateTicketStatus: (ticketId: string, newStatus: 'pending' | 'cooking' | 'ready' | 'served') => void;
  onMarkDishReady?: (ticketId: string, itemIndex: number) => void;
  onMarkDishServed?: (ticketId: string, itemIndex: number) => void;
  onRemoveDish?: (ticketId: string, itemIndex: number) => void;
  onMarkAllDishesReady?: (ticketId: string) => void;
  onMarkAllDishesServed?: (ticketId: string) => void;
  onNavigate: (screen: ScreenType) => void;
  currentRole?: AppRole;
  currentUserName?: string;
  onOpenRoleSwitcher?: () => void;
}

export const ScreenCocinaKDS: React.FC<ScreenCocinaKDSProps> = ({
  tickets,
  tables = [],
  onUpdateTicketStatus,
  onMarkDishReady,
  onMarkDishServed,
  onRemoveDish,
  onMarkAllDishesReady,
  onMarkAllDishesServed,
  onNavigate,
  currentRole = 'cocina',
  currentUserName = 'Chef Mario Quispe',
  onOpenRoleSwitcher
}) => {
  const isWaiter = currentRole === 'mesero';
  const isKitchen = currentRole === 'cocina';
  const isAdmin = currentRole === 'admin_sede' || currentRole === 'admin_general' || currentRole === 'admin_global';

  const [stationFilter, setStationFilter] = useState<'todas' | 'frios' | 'calientes' | 'barra'>('todas');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'cooking' | 'ready'>('all');
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [scopeMode, setScopeMode] = useState<'my_tables' | 'all'>(isWaiter ? 'my_tables' : 'all');
  const [viewMode, setViewMode] = useState<'cascade_fifo' | 'grid'>('cascade_fifo');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal confirmation for removing a dish from an order
  const [dishToRemove, setDishToRemove] = useState<{
    ticketId: string;
    itemIndex: number;
    itemName: string;
    table: string;
  } | null>(null);


  // Play audio chime
  const playAudioChime = (type: 'ready' | 'served' | 'remove' = 'ready') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'ready') {
        // High double-beep for ready dish
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      } else if (type === 'served') {
        // Satisfying chord for served dish
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      } else {
        // Low blip for cancel/remove
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // AudioContext not available in current environment
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Kitchen cooks mark an individual dish as ready; Waiters can also mark drinks as ready
  const handleItemReady = (ticketId: string, itemIndex: number, itemName: string, isDrink: boolean = false) => {
    if (isWaiter && !isDrink) {
      showToast('⚠️ Permiso denegado: Solo cocina puede marcar un plato de comida como preparado');
      return;
    }
    if (onMarkDishReady) {
      onMarkDishReady(ticketId, itemIndex);
    }
    playAudioChime('ready');
    showToast(isDrink ? `🍹 Bebida "${itemName}" preparada y lista para servir.` : `🛎️ Plato "${itemName}" preparado y listo para recoger. Aviso enviado a mozo`);
  };

  // 2. Waiters mark an individual dish as served in salon
  const handleItemServed = (ticketId: string, itemIndex: number, itemName: string, tableStr: string) => {
    if (!isWaiter && !isAdmin) {
      showToast('⚠️ Permiso denegado: Solo el mozo o un administrador puede marcar un plato como servido');
      return;
    }
    if (onMarkDishServed) {
      onMarkDishServed(ticketId, itemIndex);
    }
    playAudioChime('served');
    showToast(`✓ Plato "${itemName}" marcado como servido en ${tableStr}`);
  };

  // 3. Waiter confirms removal of a dish
  const handleConfirmRemove = () => {
    if (!dishToRemove) return;
    const { ticketId, itemIndex, itemName, table } = dishToRemove;
    if (onRemoveDish) {
      onRemoveDish(ticketId, itemIndex);
    }
    playAudioChime('remove');
    showToast(`Plato "${itemName}" retirado del pedido de ${table} por ${currentUserName}`);
    setDishToRemove(null);
  };

  // 4. Ticket-level handlers
  const handleStartPrep = (ticketId: string) => {
    if (isWaiter) {
      showToast('⚠️ Permiso denegado: Solo el personal de cocina puede iniciar la preparación');
      return;
    }
    onUpdateTicketStatus(ticketId, 'cooking');
    playAudioChime('ready');
    showToast(`Comanda #${ticketId} ingresó a los fogones`);
  };

  const handleMarkEntireTicketReady = (ticketId: string) => {
    if (isWaiter) {
      showToast('⚠️ Permiso denegado: Solo cocina puede marcar platos como preparados');
      return;
    }
    if (onMarkAllDishesReady) {
      onMarkAllDishesReady(ticketId);
    } else {
      onUpdateTicketStatus(ticketId, 'ready');
    }
    playAudioChime('ready');
    showToast(`Todos los platos de la Comanda #${ticketId} listos para recoger`);
  };

  const handleServeEntireTicket = (ticketId: string, tableStr: string) => {
    if (!isWaiter && !isAdmin) {
      showToast('⚠️ Permiso denegado: Solo el mozo o un administrador puede marcar un pedido como servido');
      return;
    }
    if (onMarkAllDishesServed) {
      onMarkAllDishesServed(ticketId);
    } else {
      onUpdateTicketStatus(ticketId, 'served');
    }
    playAudioChime('served');
    showToast(`✓ Comanda #${ticketId} de ${tableStr} completada. Todos los platos servidos.`);
  };

  const handleReNotify = (ticketId: string, waiterName: string) => {
    playAudioChime('ready');
    showToast(`Alerta de retiro reenviada al mozo ${waiterName} (Ticket #${ticketId})`);
  };

  const isMyTicket = (t: KDSTicket) => {
    return isTicketAssignedToWaiter(t, currentUserName, tables);
  };

  // A ticket is active if it hasn't been served and NOT all items are ready & served
  // THE CARD DISAPPEARS WHEN ALL ITEMS IN THE ORDER ARE PREPARED AND SERVED!
  const allActiveTickets = tickets.filter((t) => {
    if (t.status === 'served') return false;
    const allDishesCompleted =
      t.items.length > 0 &&
      t.items.every(
        (i) =>
          (i.isReady || (i as any).status === 'ready' || (i as any).status === 'served') &&
          (i.isServed || (i as any).status === 'served')
      );
    return !allDishesCompleted;
  });

  const allCompletedTickets = tickets.filter((t) => {
    return (
      t.status === 'served' ||
      (t.items.length > 0 &&
        t.items.every(
          (i) =>
            (i.isReady || (i as any).status === 'ready' || (i as any).status === 'served') &&
            (i.isServed || (i as any).status === 'served')
        ))
    );
  });

  // El mesero puede alternar entre 'Mis Mesas' y 'Todo el Salón'
  const activeTickets = isWaiter && scopeMode === 'my_tables' ? allActiveTickets.filter(isMyTicket) : allActiveTickets;
  const completedTickets = isWaiter && scopeMode === 'my_tables' ? allCompletedTickets.filter(isMyTicket) : allCompletedTickets;

  const currentList = activeTab === 'active' ? activeTickets : completedTickets;

  const filteredTickets = currentList.filter((t) => {
    const matchesStation =
      stationFilter === 'todas' ||
      t.station === stationFilter ||
      (stationFilter === 'frios' && (t.station === 'frios' || t.items.some(i => (i.substation || '').toUpperCase().includes('FRÍ') || (i.station || '').toLowerCase().includes('frí')))) ||
      (stationFilter === 'calientes' && (t.station === 'calientes' || t.items.some(i => (i.substation || '').toUpperCase().includes('CAL') || (i.substation || '').toUpperCase().includes('SALT') || (i.station || '').toLowerCase().includes('cal')))) ||
      (stationFilter === 'barra' && (t.station === 'barra' || t.items.some(isDrinkKDSTicketItem)));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && t.status === 'pending') ||
      (statusFilter === 'cooking' && t.status === 'cooking') ||
      (statusFilter === 'ready' && t.status === 'ready');

    return matchesStation && matchesStatus;
  });

  // Strict FIFO ordering: earliest arrivals AT THE TOP (arriba), newer arrivals BELOW (abajo)
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const timeA = a.createdAt || (parseInt(a.id, 10) || 0);
    const timeB = b.createdAt || (parseInt(b.id, 10) || 0);
    return timeA - timeB;
  });

  const pendingCount = activeTickets.filter((t) => t.status === 'pending').length;
  const cookingCount = activeTickets.filter((t) => t.status === 'cooking').length;
  const readyTicketsCount = activeTickets.filter((t) => t.status === 'ready').length;

  // Total ready plates waiting to be served by waiters
  const totalReadyToPickupPlates = activeTickets.reduce((acc, t) => {
    return (
      acc +
      t.items.filter(
        (i) =>
          (i.isReady || (i as any).status === 'ready') &&
          !i.isServed &&
          (i as any).status !== 'served'
      ).length
    );
  }, 0);

  return (
    <div className="flex flex-col w-full pb-28 pt-2 px-3 sm:px-4 max-w-7xl mx-auto">
      {/* Role & Order Discipline Alert Banner */}
      <div
        className={`p-3.5 rounded-2xl border mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
          isKitchen
            ? 'bg-amber-50/90 border-amber-300 text-amber-950'
            : isWaiter
            ? 'bg-sky-50/90 border-sky-300 text-sky-950'
            : 'bg-indigo-50/90 border-indigo-300 text-indigo-950'
        }`}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              isKitchen
                ? 'bg-amber-600 text-white'
                : isWaiter
                ? 'bg-sky-600 text-white'
                : 'bg-indigo-600 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isKitchen ? 'soup_kitchen' : isWaiter ? 'room_service' : 'admin_panel_settings'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-xs sm:text-sm">
                {isKitchen
                  ? 'Perfil Cocinero: Chef Mario Quispe (Acceso a Fogones & Preparación)'
                  : isWaiter
                  ? `Perfil Mozo: ${currentUserName} (Recojo y Servicio en Mesa)`
                  : `Perfil: ${currentUserName} (Control Total Cocina)`}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  isKitchen
                    ? 'bg-amber-200 text-amber-900 border-amber-400'
                    : isWaiter
                    ? 'bg-sky-200 text-sky-900 border-sky-400'
                    : 'bg-indigo-200 text-indigo-900 border-indigo-400'
                }`}
              >
                {isKitchen ? 'Solo Cocina' : isWaiter ? 'Mozo' : 'Administrador'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5 leading-snug">
              {isKitchen && (
                <>
                  <strong className="text-amber-900">Cocina:</strong> Marca plato por plato con{' '}
                  <span className="font-bold text-primary">"Ya lo preparé (Listo)"</span>. Cuando el mozo sirva
                  todos los platos, la tarjeta desaparecerá automáticamente.
                </>
              )}
              {isWaiter && (
                <>
                  <strong className="text-sky-900">Mozo:</strong> Puedes ver platos listos para recoger en
                  cocina y presionar <span className="font-bold text-emerald-800">"✓ Ya lo serví"</span>. También
                  puedes <strong>quitar platos</strong> del pedido si el cliente lo solicita.
                </>
              )}
              {isAdmin && (
                <>
                  Supervisión general de cocina con orden de llegada estricto (FIFO), marcado granular y retiro de platos.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action button if role switcher is requested */}
        {onOpenRoleSwitcher && (
          <button
            onClick={onOpenRoleSwitcher}
            className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-white hover:bg-surface-container-high border border-outline-variant/40 text-primary text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">swap_horiz</span>
            <span>Cambiar Perfil</span>
          </button>
        )}
      </div>

      {/* Prominent notification banner for waiters when plates are ready for pickup */}
      {totalReadyToPickupPlates > 0 && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-3.5 rounded-2xl shadow-md border border-emerald-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 animate-bounce">
              <span className="material-symbols-outlined text-[24px]">room_service</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-200 animate-ping"></span>
                <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-100">
                  ¡Atención al Mozo! Platos Listos para Recoger
                </span>
              </div>
              <p className="font-black text-sm text-white mt-0.5">
                Hay <strong>{totalReadyToPickupPlates} plato(s)</strong> preparados por cocina esperando entrega en mesa.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-[11px] bg-white/20 px-3 py-1.5 rounded-xl text-emerald-50 font-extrabold border border-white/30">
              {isWaiter ? 'Recoge y marca "Ya lo serví"' : 'Esperando recojo de mozos'}
            </span>
          </div>
        </div>
      )}

      {/* Top KDS Command Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-low px-4 py-3 rounded-2xl border border-outline-variant/40 shadow-xs mb-4">
        {/* Left: Title & Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-600"></span>
            </span>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-primary tracking-tight leading-none">
                Cocina & Barra KDS
              </h1>
              <span className="text-[11px] text-on-surface-variant font-medium flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-amber-600">arrow_downward</span>
                <span>Orden FIFO: Primeros arriba ➔ Más recientes abajo</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Tabs (Active vs History), Waiter Scope Toggle & Station Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Waiter Scope Selector (Mis Mesas vs Todo el Salón) */}
          {isWaiter && (
            <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
              <button
                onClick={() => setScopeMode('my_tables')}
                className={`h-8 px-2.5 sm:px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  scopeMode === 'my_tables'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`}
                title="Ver comandas de mis mesas asignadas o mesas de turno"
              >
                <span className="material-symbols-outlined text-[16px]">person_check</span>
                <span>Mis Mesas ({allActiveTickets.filter(isMyTicket).length})</span>
              </button>
              <button
                onClick={() => setScopeMode('all')}
                className={`h-8 px-2.5 sm:px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  scopeMode === 'all'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`}
                title="Ver todas las comandas de la cocina en todo el salón"
              >
                <span className="material-symbols-outlined text-[16px]">apps</span>
                <span>Todo el Salón ({allActiveTickets.length})</span>
              </button>
            </div>
          )}

          {/* Active Queue vs Finished History Toggle */}
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('active')}
              className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'active'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">skillet</span>
              <span>En Cocina ({activeTickets.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'history'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span>Servidos ({completedTickets.length})</span>
            </button>
          </div>

          {/* Station Filters */}
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setStationFilter('todas')}
              className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all ${
                stationFilter === 'todas'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => setStationFilter('frios')}
              className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all ${
                stationFilter === 'frios'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              Fríos
            </button>
            <button
              onClick={() => setStationFilter('calientes')}
              className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all ${
                stationFilter === 'calientes'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              Calientes
            </button>
            <button
              onClick={() => setStationFilter('barra')}
              className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all ${
                stationFilter === 'barra'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              Barra
            </button>
          </div>
        </div>

        {/* Right: Layout Toggle & Sound */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
            <button
              onClick={() => setViewMode('cascade_fifo')}
              title="Vista Cascada FIFO"
              className={`h-7 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'cascade_fifo'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">view_agenda</span>
              <span className="hidden md:inline">Cascada FIFO</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Vista Cuadrícula"
              className={`h-7 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">grid_view</span>
              <span className="hidden md:inline">Cuadrícula</span>
            </button>
          </div>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              showToast(soundEnabled ? 'Sonido silenciado' : 'Alertas sonoras activadas');
            }}
            className="h-8 px-2.5 rounded-xl bg-surface-container hover:bg-surface-variant border border-outline-variant/30 flex items-center gap-1 text-on-surface-variant active:scale-95 transition-all text-xs font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
            <span className="hidden lg:inline">{soundEnabled ? 'Audio ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Quick Status Pill Filter */}
      {activeTab === 'active' && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
          <span className="text-xs text-on-surface-variant font-bold shrink-0">Filtrar estado:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              statusFilter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            Todos ({activeTickets.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            Por Iniciar ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('cooking')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              statusFilter === 'cooking'
                ? 'bg-sky-600 text-white'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            En Preparación ({cookingCount})
          </button>
          <button
            onClick={() => setStatusFilter('ready')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              statusFilter === 'ready'
                ? 'bg-emerald-600 text-white'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            Platos Listos ({readyTicketsCount})
          </button>
        </div>
      )}

      {/* Orders Container: Sorted FIFO with Top = Earliest, Bottom = Newest */}
      {sortedTickets.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-12 text-center flex flex-col items-center justify-center my-6 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[32px]">
              {activeTab === 'active' ? 'task_alt' : 'history'}
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-primary">
            {isWaiter
              ? activeTab === 'active'
                ? `Sin comandas pendientes para tus mesas (${currentUserName || 'Mozo'})`
                : 'Sin comandas en tu historial'
              : activeTab === 'active'
              ? '¡Cocina al día! Sin platos pendientes'
              : 'Sin comandas en el historial'}
          </h2>
          <p className="text-xs text-on-surface-variant max-w-md mt-1">
            {isWaiter
              ? activeTab === 'active'
                ? 'No tienes platos en preparación en este momento. Como mozo solo visualizas las comandas de tus mesas asignadas. Aparecerán aquí cuando tomes pedidos.'
                : 'Aquí podrás revisar las comandas de tus mesas que ya fueron completamente servidas.'
              : activeTab === 'active'
              ? 'Todas las comandas han sido preparadas por cocina y servidas en mesa por los mozos. Las tarjetas desaparecen automáticamente al completarse.'
              : 'Aquí podrás revisar las comandas que ya fueron completamente preparadas y entregadas a los comensales.'}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'cascade_fifo'
              ? 'flex flex-col gap-4 w-full'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start w-full'
          }
        >
          {sortedTickets.map((ticket, queueIndex) => {
            const isFirstInQueue = queueIndex === 0 && activeTab === 'active';
            const totalItems = ticket.items.length;
            const readyItemsCount = ticket.items.filter(
              (i) => i.isReady || (i as any).status === 'ready' || (i as any).status === 'served'
            ).length;
            const servedItemsCount = ticket.items.filter(
              (i) => i.isServed || (i as any).status === 'served'
            ).length;
            const readyUnservedCount = ticket.items.filter(
              (i) => (i.isReady || (i as any).status === 'ready') && !i.isServed && (i as any).status !== 'served'
            ).length;
            const pendingCookingCount = ticket.items.filter(
              (i) => !i.isReady && (i as any).status !== 'ready' && (i as any).status !== 'served'
            ).length;

            const isAllReady = totalItems > 0 && readyItemsCount === totalItems;
            const hasAnyReady = readyItemsCount > 0;

            const borderColor = isAllReady
              ? 'border-emerald-500'
              : hasAnyReady
              ? 'border-teal-500'
              : ticket.status === 'cooking'
              ? 'border-secondary'
              : 'border-amber-500';

            return (
              <div
                key={ticket.id}
                className={`bg-surface-container-lowest rounded-2xl shadow-sm p-4 flex flex-col gap-3 border-l-4 ${borderColor} border border-outline-variant/30 transition-all duration-300 hover:shadow-md relative ${
                  isFirstInQueue
                    ? 'ring-2 ring-primary/20 shadow-md bg-amber-50/20'
                    : ''
                }`}
              >
                {/* FIFO Priority Ribbon */}
                {isFirstInQueue && (
                  <div className="flex items-center justify-between bg-amber-500 text-white px-3 py-1 -mt-4 -mx-4 mb-1 rounded-t-xl font-extrabold text-[11px] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] animate-pulse">priority_high</span>
                      <span>1° EN LLEGADA • ATENDER PRIMERO (FIFO)</span>
                    </span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                      Comanda #{ticket.id}
                    </span>
                  </div>
                )}

                {/* Card Header: Table, Order Number, Waiter, Elapsed Time */}
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-outline-variant/20">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base sm:text-lg text-primary leading-tight">
                          {ticket.table || (ticket as any).tableName || ((ticket as any).tableNumber ? `Mesa ${(ticket as any).tableNumber}` : 'Mesa')}
                        </span>
                        <span className="font-mono text-xs text-on-surface-variant font-bold bg-surface-container px-2 py-0.5 rounded-md">
                          #{ticket.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 font-bold text-primary">
                          <span className="material-symbols-outlined text-[14px]">person</span>
                          <span>Mozo: {ticket.waiter || (ticket as any).waiterName || 'Mozo de Turno'}</span>
                        </span>
                        <span>•</span>
                        <span className="font-medium">{ticket.time || '13:30'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Elapsed Timer & Badge */}
                  <div className="flex flex-col items-end shrink-0">
                    <div
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black flex items-center gap-1 shadow-2xs ${
                        isAllReady
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : hasAnyReady
                          ? 'bg-teal-100 text-teal-900 border border-teal-300'
                          : ticket.status === 'cooking'
                          ? 'bg-sky-100 text-sky-900 border border-sky-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{ticket.elapsed || (ticket as any).timeElapsed || '05:00 min'}</span>
                    </div>

                    <span className="text-[10px] font-extrabold text-on-surface-variant uppercase mt-1">
                      {ticket.arrivalOrder ? `Turno #${ticket.arrivalOrder}` : `Orden #${queueIndex + 1}`}
                    </span>
                  </div>
                </div>

                {/* Progress summary bar */}
                <div className="bg-surface-container-low px-3 py-1.5 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-on-surface">
                    Progreso: {servedItemsCount}/{totalItems} servidos
                  </span>
                  <div className="flex items-center gap-2">
                    {readyUnservedCount > 0 && (
                      <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px] animate-pulse">
                        {readyUnservedCount} listo(s) para recoger
                      </span>
                    )}
                    {pendingCookingCount > 0 && (
                      <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">
                        {pendingCookingCount} en fogón
                      </span>
                    )}
                  </div>
                </div>

                {/* Drink note if any */}
                {ticket.drinksNote && (
                  <div className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-900 text-[11px] font-bold border border-sky-200 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-sky-700">local_bar</span>
                    <span>{ticket.drinksNote}</span>
                  </div>
                )}

                {/* Dish Items List with Granular Controls */}
                <div className="flex flex-col gap-2 my-1">
                  {ticket.items.map((item, itemIndex) => {
                    const isItemReady = Boolean(item.isReady || (item as any).status === 'ready' || (item as any).status === 'served');
                    const isItemServed = Boolean(item.isServed || (item as any).status === 'served');
                    const isDrink = isDrinkKDSTicketItem(item);

                    return (
                      <div
                        key={item.id || itemIndex}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isItemServed
                            ? 'bg-emerald-50/60 border-emerald-200 opacity-75'
                            : isItemReady
                            ? isDrink ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-400/40 shadow-xs' : 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/40 shadow-xs'
                            : 'bg-surface-container-high border-outline-variant/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          {/* Item Details */}
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <span
                              className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                                isItemServed
                                  ? 'bg-emerald-200 text-emerald-900'
                                  : isItemReady
                                  ? isDrink ? 'bg-sky-600 text-white animate-pulse' : 'bg-emerald-600 text-white animate-pulse'
                                  : isDrink ? 'bg-sky-700 text-white' : 'bg-primary text-on-primary'
                              }`}
                            >
                              {item.qty}x
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`font-extrabold text-xs sm:text-sm leading-tight ${
                                    isItemServed
                                      ? 'line-through text-on-surface-variant'
                                      : 'text-primary'
                                  }`}
                                >
                                  {item.name}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                  isDrink
                                    ? 'bg-sky-100 text-sky-900 border border-sky-300'
                                    : 'bg-surface-container text-on-surface-variant'
                                }`}>
                                  {isDrink ? 'BEBIDAS (ATENCIÓN MOZO)' : (item.substation || (item as any).station || 'COCINA')}
                                </span>
                              </div>

                              {item.notes && (
                                <span className="text-[11px] text-on-tertiary-container bg-tertiary-fixed font-bold px-2 py-0.5 rounded-md mt-1 inline-block w-fit">
                                  {item.notes}
                                </span>
                              )}

                              {/* Granular status badge */}
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                {isItemServed ? (
                                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px]">done_all</span>
                                    <span>Servido en mesa</span>
                                  </span>
                                ) : isItemReady ? (
                                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 animate-pulse border ${
                                    isDrink
                                      ? 'bg-sky-100 text-sky-950 border-sky-400'
                                      : 'bg-emerald-200 text-emerald-900 border-emerald-400'
                                  }`}>
                                    <span className="material-symbols-outlined text-[14px]">
                                      {isDrink ? 'local_bar' : 'room_service'}
                                    </span>
                                    <span>{isDrink ? '¡Bebida lista para servir!' : '¡Listo para recoger!'}</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px]">
                                      {isDrink ? 'local_bar' : 'skillet'}
                                    </span>
                                    <span>{isDrink ? 'Bebida por atender' : 'En preparación'}</span>
                                  </span>
                                )}

                                {item.readyAt && !isItemServed && (
                                  <span className="text-[10px] text-on-surface-variant font-mono">
                                    ({item.readyAt})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Controls for this specific dish */}
                          <div className="flex items-center gap-1.5 shrink-0 self-center">
                            {/* 1. Preparar Button:
                               - Para bebidas: TANTO el mozo como cocina pueden prepararla.
                               - Para comida: Solo cocina puede prepararla.
                            */}
                            {!isItemReady && (
                              isDrink ? (
                                <button
                                  onClick={() => handleItemReady(ticket.id, itemIndex, item.name, true)}
                                  className="px-2.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                                  title="Preparar bebida y marcarla lista para servir al cliente"
                                >
                                  <span className="material-symbols-outlined text-[16px]">local_bar</span>
                                  <span>Preparar</span>
                                </button>
                              ) : (!isWaiter) ? (
                                <button
                                  onClick={() => handleItemReady(ticket.id, itemIndex, item.name, false)}
                                  className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                                  title="Marcar plato como preparado y avisar al mozo"
                                >
                                  <span className="material-symbols-outlined text-[16px]">check</span>
                                  <span>Listo</span>
                                </button>
                              ) : null
                            )}

                            {/* 2. Mozo Button: Marcar este plato o bebida servido */}
                            {isItemReady && !isItemServed && (isWaiter || isAdmin) && (
                              <button
                                onClick={() =>
                                  handleItemServed(ticket.id, itemIndex, item.name, ticket.table)
                                }
                                className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-md transition-all cursor-pointer active:scale-95 ${
                                  isWaiter
                                    ? isDrink
                                      ? 'bg-sky-600 hover:bg-sky-700 text-white ring-2 ring-sky-400'
                                      : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400'
                                    : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                                }`}
                                title={isDrink ? "Confirmar que ya entregaste esta bebida al cliente" : "Confirmar que ya entregaste este plato al cliente en la mesa"}
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {isDrink ? 'local_bar' : 'done_all'}
                                </span>
                                <span>{isWaiter ? (isDrink ? '✓ Servir Bebida' : '✓ Ya lo serví') : 'Servido'}</span>
                              </button>
                            )}

                            {/* 3. Re-notificar mozo (para cocinero cuando ya está listo) */}
                            {isItemReady && !isItemServed && isKitchen && (
                              <button
                                onClick={() => handleReNotify(ticket.id, ticket.waiter)}
                                className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant text-xs cursor-pointer"
                                title="Re-notificar al mozo para recojo"
                              >
                                <span className="material-symbols-outlined text-[16px] text-amber-700">
                                  notifications_active
                                </span>
                              </button>
                            )}

                            {/* 4. Mozo / Admin: Quitar plato del pedido en cualquier momento */}
                            {(isWaiter || isAdmin) && !isItemServed && (
                              <button
                                onClick={() =>
                                  setDishToRemove({
                                    ticketId: ticket.id,
                                    itemIndex,
                                    itemName: item.name,
                                    table: ticket.table
                                  })
                                }
                                className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-100 hover:text-rose-800 transition-all cursor-pointer flex items-center justify-center"
                                title={`Quitar "${item.name}" del pedido`}
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Action Buttons on the Ticket */}
                <div className="pt-2 border-t border-outline-variant/20 mt-auto flex flex-col gap-2">
                  {/* Case A: Waiter Actions when dishes are ready */}
                  {readyUnservedCount > 0 && (isWaiter || isAdmin) && (
                    <div className="flex flex-col gap-1.5 w-full">
                      <button
                        onClick={() => handleServeEntireTicket(ticket.id, ticket.table)}
                        className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer ring-2 ring-emerald-500/30"
                      >
                        <span className="material-symbols-outlined text-[20px]">done_all</span>
                        <span>
                          {isWaiter
                            ? `✓ Ya Serví Todo el Pedido (${readyUnservedCount} platos)`
                            : 'Marcar Pedido Servido en Mesa'}
                        </span>
                      </button>

                      {isWaiter && (
                        <p className="text-[10px] text-center text-emerald-800 font-medium">
                          Al servir todos los platos preparados, esta tarjeta desaparecerá de la pantalla.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Case B: Kitchen Cook can start or mark all remaining ready */}
                  {!isWaiter && pendingCookingCount > 0 && (
                    <div className="flex flex-col gap-1.5 w-full">
                      {ticket.status === 'pending' ? (
                        <button
                          onClick={() => handleStartPrep(ticket.id)}
                          className="w-full h-10 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">soup_kitchen</span>
                          <span>Iniciar Preparación (Fogón)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkEntireTicketReady(ticket.id)}
                          className="w-full h-10 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-secondary-container text-[18px]">
                            notifications_active
                          </span>
                          <span>Marcar Todos Listos ({pendingCookingCount} pendientes)</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Case C: Informative readout for Waiter when all dishes are still cooking */}
                  {isWaiter && readyUnservedCount === 0 && pendingCookingCount > 0 && (
                    <div className="w-full p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-amber-900">
                      <span className="material-symbols-outlined text-amber-700 text-[18px] shrink-0">
                        skillet
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-extrabold text-xs leading-tight">
                          {pendingCookingCount} plato(s) en preparación en cocina
                        </span>
                        <span className="text-[10px] text-amber-800 leading-tight">
                          Espera a que cocina marque listo para recoger y servir.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Confirmation for Waiter to Remove a Dish */}
      {dishToRemove && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-5 shadow-2xl border border-outline-variant/40 flex flex-col gap-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">delete_sweep</span>
              </div>
              <div>
                <h3 className="font-black text-base text-primary">¿Quitar plato del pedido?</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Acción de Mozo de Salón
                </p>
              </div>
            </div>

            <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/30 text-xs">
              <p className="text-on-surface font-semibold leading-relaxed">
                ¿Seguro que deseas retirar <strong className="text-rose-700">"{dishToRemove.itemName}"</strong> del pedido de <strong>{dishToRemove.table}</strong>?
              </p>
              <p className="text-[11px] text-on-surface-variant mt-2 leading-normal">
                Esta acción eliminará el plato de la comanda de cocina y descontará el monto de la cuenta de la mesa.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setDishToRemove(null)}
                className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Sí, Quitar Plato</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating KDS Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-secondary/30 animate-in fade-in slide-in-from-top-4 max-w-md text-center">
          <span className="material-symbols-outlined text-secondary-container text-[20px] shrink-0">
            check_circle
          </span>
          <span className="font-bold text-xs">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
