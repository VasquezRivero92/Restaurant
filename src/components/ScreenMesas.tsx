import React, { useState } from 'react';
import { TableItem, ScreenType, AppRole } from '../types';

interface ScreenMesasProps {
  tables: TableItem[];
  onNavigate: (screen: ScreenType) => void;
  onSelectTable: (tableId: string) => void;
  onMarkDelivered: (tableId: string) => void;
  onOpenTable: (tableId: string) => void;
  onToggleDrinkServed?: (tableId: string, drinkId: string) => void;
  onServeAllDrinks?: (tableId: string) => void;
  onOpenDrinksTray?: () => void;
  currentRole?: AppRole;
  currentUserName?: string;
}

export const ScreenMesas: React.FC<ScreenMesasProps> = ({
  tables,
  onNavigate,
  onSelectTable,
  onMarkDelivered,
  onOpenTable,
  onToggleDrinkServed,
  onServeAllDrinks,
  onOpenDrinksTray,
  currentRole = 'admin_sede',
  currentUserName = ''
}) => {
  const isWaiter = currentRole === 'mesero';
  const [activeFilter, setActiveFilter] = useState<'all' | 'ready' | 'drinks' | 'occupied' | 'free'>('all');
  const [scopeMode, setScopeMode] = useState<'my_tables' | 'all'>(isWaiter ? 'my_tables' : 'all');
  const [showTopAlert, setShowTopAlert] = useState(true);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const isMyTable = (table: TableItem) => {
    if (!table.waiter) return false;
    const waiterLower = table.waiter.toLowerCase().trim();
    const currentLower = (currentUserName || '').toLowerCase().trim();
    if (!waiterLower || !currentLower) return false;
    const currentFirst = currentLower.split(' ')[0];
    const tableFirst = waiterLower.split(' ')[0];
    return (
      waiterLower === currentLower ||
      (currentFirst && waiterLower.includes(currentFirst)) ||
      (tableFirst && currentLower.includes(tableFirst))
    );
  };

  const myAssignedTables = tables.filter((t) => t.status !== 'free' && isMyTable(t));
  const myAssignedCount = myAssignedTables.length;

  const totalCount = tables.length;
  const freeCount = tables.filter((t) => t.status === 'free').length;
  const occupiedCount = totalCount - freeCount;

  // Para mozo: alertas de cocina y bebidas filtradas a sus mesas asignadas
  const relevantAlertTables = isWaiter ? tables.filter((t) => isMyTable(t)) : tables;
  const readyCount = relevantAlertTables.filter((t) => t.status === 'ready').length;
  const tablesWithPendingDrinks = relevantAlertTables.filter((t) =>
    t.drinks?.some((d) => !d.served)
  );
  const pendingDrinksCount = tablesWithPendingDrinks.length;
  const totalPendingGlasses = relevantAlertTables.reduce((acc, t) => {
    return acc + (t.drinks?.filter((d) => !d.served).length || 0);
  }, 0);

  // Lista base: en modo 'my_tables' el mozo solo ve sus mesas asignadas y las mesas libres para abrir
  const baseTables = (isWaiter && scopeMode === 'my_tables')
    ? tables.filter((t) => t.status === 'free' || isMyTable(t))
    : tables;

  const filteredTables = baseTables.filter((table) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'ready') return table.status === 'ready';
    if (activeFilter === 'drinks') return table.drinks?.some((d) => !d.served);
    if (activeFilter === 'occupied') return table.status !== 'free';
    if (activeFilter === 'free') return table.status === 'free';
    return true;
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
                      ¡Mesa 04 tiene 2 platos listos!
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary/40 text-secondary-fixed text-xs font-bold whitespace-nowrap">
                  Hace 2m
                </span>
              </div>

              <p className="text-sm text-tertiary-fixed leading-snug">
                Barra de Fríos: 1x Ceviche Mixto, 1x Arroz con Mariscos + Ceviche listos para pase inmediato.
              </p>

              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => handleHighlight('mesa-04')}
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
          <div 
            onClick={() => setActiveFilter('all')}
            className={`flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-xl cursor-pointer transition-all ${
              activeFilter === 'all' ? 'bg-surface shadow-sm ring-1 ring-primary/20' : 'bg-surface/60 hover:bg-surface'
            }`}
          >
            <span className="font-extrabold text-xl sm:text-2xl text-primary leading-none">{totalCount}</span>
            <span className="text-[10px] sm:text-xs text-on-surface-variant font-medium mt-1 truncate">Totales</span>
          </div>

          <div 
            onClick={() => setActiveFilter('occupied')}
            className={`flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-xl cursor-pointer transition-all ${
              activeFilter === 'occupied' ? 'bg-primary-container shadow-sm' : 'bg-primary-container/80 hover:bg-primary-container'
            }`}
          >
            <span className="font-extrabold text-xl sm:text-2xl text-secondary-container leading-none">{occupiedCount}</span>
            <span className="text-[10px] sm:text-xs text-on-primary font-medium mt-1 truncate">Ocupadas</span>
          </div>

          <div 
            onClick={() => setActiveFilter('ready')}
            className={`flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-xl cursor-pointer transition-all relative overflow-hidden ${
              activeFilter === 'ready' ? 'bg-tertiary-container ring-2 ring-on-tertiary-container' : 'bg-tertiary-container/90'
            }`}
          >
            {readyCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-on-tertiary-container animate-ping"></span>
            )}
            <span className="font-extrabold text-xl sm:text-2xl text-on-tertiary leading-none">{readyCount}</span>
            <span className="text-[10px] sm:text-xs text-tertiary-fixed font-medium mt-1 truncate">Platos</span>
          </div>

          <div 
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
          </div>
        </div>
      </div>

      {/* Floor Filter Segmented Bar */}
      <div className="px-4 pb-2 pt-1 overflow-x-auto flex gap-2 no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-shrink-0 h-10 px-3.5 rounded-full font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">apps</span>
          <span>Todas ({totalCount})</span>
        </button>

        <button
          onClick={() => setActiveFilter('drinks')}
          className={`flex-shrink-0 h-10 px-3.5 rounded-full font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
            activeFilter === 'drinks'
              ? 'bg-amber-500 text-amber-950 shadow-sm ring-1 ring-amber-600'
              : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">local_bar</span>
          <span>Bebidas ({totalPendingGlasses})</span>
        </button>

        <button
          onClick={() => setActiveFilter('ready')}
          className={`flex-shrink-0 h-10 px-3.5 rounded-full font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
            activeFilter === 'ready'
              ? 'bg-on-tertiary-container text-on-primary shadow-sm'
              : 'bg-surface-container-high text-tertiary-container hover:bg-surface-container-highest'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
          <span>Cocina Lista ({readyCount})</span>
        </button>

        <button
          onClick={() => setActiveFilter('occupied')}
          className={`flex-shrink-0 h-10 px-3.5 rounded-full font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
            activeFilter === 'occupied'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">dining</span>
          <span>Ocupadas ({occupiedCount})</span>
        </button>

        <button
          onClick={() => setActiveFilter('free')}
          className={`flex-shrink-0 h-10 px-3.5 rounded-full font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
            activeFilter === 'free'
              ? 'bg-secondary text-on-secondary shadow-sm'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Libres ({freeCount})</span>
        </button>
      </div>

      {/* Table Cards Layout List */}
      <div className="px-3 sm:px-4 flex flex-col gap-3.5 sm:gap-4 pb-6 max-w-2xl mx-auto w-full">
        {filteredTables.map((table) => {
          const isHighlighted = highlightedId === table.id;
          const hasDrinks = table.drinks && table.drinks.length > 0;
          const hasPendingDrinks = table.drinks?.some((d) => !d.served);

          const isCurrentTableMine = isMyTable(table);
          const isUnassignedTable = !table.waiter || table.waiter.trim() === '' || table.waiter === 'Sin asignar';
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
                    <span>Mozo: <strong className="text-slate-500 font-medium italic">En blanco (Sin asignar)</strong></span>
                  </span>
                  <span className="text-[10px] text-teal-800 font-bold bg-teal-100/70 px-2 py-0.5 rounded-full">
                    Autoasignable
                  </span>
                </div>

                <button
                  onClick={() => onOpenTable(table.id)}
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow cursor-pointer min-h-[44px]"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Abrir Mesa {table.number} {isWaiter ? '(Autoasignarme y Tomar Pedido)' : ''}</span>
                </button>
              </div>
            );
          }

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
                      {onServeAllDrinks && !isOtherWaiterTable && (
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

                      {onToggleDrinkServed && !isOtherWaiterTable && (
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
                        <span>•</span>
                        {isCurrentTableMine && (
                          <span className="px-2 py-0.2 rounded-full bg-teal-100 text-teal-900 font-extrabold text-[10px] flex items-center gap-0.5 border border-teal-300">
                            <span className="material-symbols-outlined text-[12px]">person_check</span>
                            <span>Mi Mesa</span>
                          </span>
                        )}
                        <span className="text-xs text-on-surface-variant truncate">
                          Mozo: <strong className={isCurrentTableMine ? 'text-teal-700 font-bold' : isOtherWaiterTable ? 'text-amber-700 font-bold' : 'text-primary'}>{table.waiter || 'Sin asignar'}</strong>
                        </span>
                      </div>
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
                {isOtherWaiterTable ? (
                  <div className="w-full py-2.5 px-3 rounded-xl bg-surface-container text-xs text-on-surface-variant font-medium text-center border border-outline-variant/30 flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">lock</span>
                    <span>Mesa asignada a <strong>{table.waiter}</strong> • Solo su mozo puede entregar</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onMarkDelivered(table.id)}
                    className="w-full h-11 sm:h-12 rounded-xl bg-secondary hover:bg-teal-700 text-on-secondary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">task_alt</span>
                    <span>Marcar Platos como Entregados</span>
                  </button>
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
                        <span>•</span>
                        {isCurrentTableMine && (
                          <span className="px-2 py-0.2 rounded-full bg-teal-100 text-teal-900 font-extrabold text-[10px] flex items-center gap-0.5 border border-teal-300">
                            <span className="material-symbols-outlined text-[12px]">person_check</span>
                            <span>Mi Mesa</span>
                          </span>
                        )}
                        <span className="text-xs text-on-surface-variant truncate">
                          Mozo: <strong className={isCurrentTableMine ? 'text-teal-700 font-bold' : isOtherWaiterTable ? 'text-amber-700 font-bold' : 'text-primary'}>{table.waiter || 'Sin asignar'}</strong>
                        </span>
                      </div>
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
                {isOtherWaiterTable ? (
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
                        <span>•</span>
                        {isCurrentTableMine && (
                          <span className="px-2 py-0.2 rounded-full bg-teal-100 text-teal-900 font-extrabold text-[10px] flex items-center gap-0.5 border border-teal-300">
                            <span className="material-symbols-outlined text-[12px]">person_check</span>
                            <span>Mi Mesa</span>
                          </span>
                        )}
                        <span className="text-xs text-on-surface-variant truncate">
                          Mozo: <strong className={isCurrentTableMine ? 'text-teal-700 font-bold' : isOtherWaiterTable ? 'text-amber-700 font-bold' : 'text-primary'}>{table.waiter || 'Sin asignar'}</strong>
                        </span>
                      </div>
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
                {isOtherWaiterTable ? (
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
                      onClick={() => onNavigate('cuenta-cobro')}
                      className="h-11 sm:h-12 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">request_quote</span>
                      <span>Pedir Cuenta</span>
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
                      <span>•</span>
                      {isCurrentTableMine && (
                        <span className="px-2 py-0.2 rounded-full bg-teal-100 text-teal-900 font-extrabold text-[10px] flex items-center gap-0.5 border border-teal-300">
                          <span className="material-symbols-outlined text-[12px]">person_check</span>
                          <span>Mi Mesa</span>
                        </span>
                      )}
                      <span className="text-xs text-on-surface-variant truncate">
                        Mozo: <strong className={isCurrentTableMine ? 'text-teal-700 font-bold' : isOtherWaiterTable ? 'text-amber-700 font-bold' : 'text-primary'}>{table.waiter || 'Sin asignar'}</strong>
                      </span>
                    </div>
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
              {isOtherWaiterTable ? (
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
    </div>
  );
};
