import React, { useState } from 'react';
import { TableItem, AppRole } from '../types';

interface ModalBandejaBebidasProps {
  isOpen: boolean;
  onClose: () => void;
  tables: TableItem[];
  onToggleDrinkServed: (tableId: string, drinkId: string) => void;
  onServeAllDrinks: (tableId: string) => void;
  currentRole?: AppRole;
  currentUserName?: string;
}

export const ModalBandejaBebidas: React.FC<ModalBandejaBebidasProps> = ({
  isOpen,
  onClose,
  tables,
  onToggleDrinkServed,
  onServeAllDrinks,
  currentRole = 'admin_sede',
  currentUserName = ''
}) => {
  if (!isOpen) return null;

  const isWaiter = currentRole === 'mesero';
  const [scopeFilter, setScopeFilter] = useState<'my_tables' | 'all'>(isWaiter ? 'my_tables' : 'all');

  const isMyTable = (t: TableItem) => {
    if (!t.waiter) return false;
    const w = t.waiter.toLowerCase().trim();
    const c = (currentUserName || '').toLowerCase().trim();
    if (!w || !c) return false;
    const cFirst = c.split(' ')[0];
    const wFirst = w.split(' ')[0];
    return w === c || (cFirst && w.includes(cFirst)) || (wFirst && c.includes(wFirst));
  };

  // Tables with drinks
  const tablesWithDrinks = tables.filter((t) => {
    if (!t.drinks || t.drinks.length === 0) return false;
    if (isWaiter && scopeFilter === 'my_tables') {
      return isMyTable(t);
    }
    return true;
  });

  // Split into tables with pending drinks vs all served
  const tablesWithPending = tablesWithDrinks.filter((t) =>
    t.drinks?.some((d) => !d.served)
  );

  const tablesAllServed = tablesWithDrinks.filter((t) =>
    t.drinks?.every((d) => d.served)
  );

  const totalPendingDrinksCount = tablesWithDrinks.reduce((acc, t) => {
    return acc + (t.drinks?.filter((d) => !d.served).length || 0);
  }, 0);

  const handleServeAllGlobal = () => {
    tablesWithPending.forEach((t) => onServeAllDrinks(t.id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl border border-outline-variant/40 overflow-hidden animate-in slide-in-from-bottom-6">
        
        {/* Header */}
        <div className="p-4 bg-primary text-on-primary flex items-center justify-between border-b border-secondary/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <span className="material-symbols-outlined text-[24px]">local_bar</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-on-primary">
                  Bandeja de Bebidas del Mozo
                </h3>
                {totalPendingDrinksCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-extrabold text-[11px] animate-pulse">
                    {totalPendingDrinksCount} pendientes
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold text-[11px]">
                    Al día
                  </span>
                )}
              </div>
              <p className="text-xs text-primary-fixed-dim">
                Atención directa en salón • No depende de cocina
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar bandeja"
            className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary-container/80 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Waiter Scope Filter Tabs */}
        {isWaiter && (
          <div className="px-4 py-2 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-xl text-xs font-bold w-full">
              <button
                onClick={() => setScopeFilter('my_tables')}
                className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center cursor-pointer ${
                  scopeFilter === 'my_tables'
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-black'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Mis Mesas ({tables.filter((t) => t.drinks && t.drinks.length > 0 && isMyTable(t)).length})
              </button>
              <button
                onClick={() => setScopeFilter('all')}
                className={`flex-1 py-1.5 px-3 rounded-lg transition-all text-center cursor-pointer ${
                  scopeFilter === 'all'
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-black'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Todo el Salón ({tables.filter((t) => t.drinks && t.drinks.length > 0).length})
              </button>
            </div>
          </div>
        )}
        {totalPendingDrinksCount > 0 && (
          <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">info</span>
              <span>Lleva las botellas y jarras frías a las mesas</span>
            </div>
            <button
              onClick={handleServeAllGlobal}
              className="h-8 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              <span>Servir Todo</span>
            </button>
          </div>
        )}

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {tablesWithDrinks.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-outline text-[40px]">wine_bar</span>
              <p className="font-bold text-sm">No hay bebidas ordenadas actualmente.</p>
              <p className="text-xs">Los pedidos con refrescos o cervezas aparecerán aquí.</p>
            </div>
          ) : null}

          {/* Pending Section */}
          {tablesWithPending.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span className="font-bold text-xs uppercase tracking-wider text-amber-900">
                  Por Servir en Salón ({tablesWithPending.length} mesas)
                </span>
              </div>

              {tablesWithPending.map((table) => {
                const pendingCount = table.drinks?.filter((d) => !d.served).length || 0;

                return (
                  <div
                    key={table.id}
                    className="bg-surface-container-lowest rounded-xl p-3.5 border-2 border-amber-300 shadow-sm flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-extrabold text-base shadow">
                          {table.number}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-on-surface">
                              Mesa {table.number}
                            </span>
                            <span className="text-[11px] text-on-surface-variant">
                              • {table.zone}
                            </span>
                          </div>
                          <span className="text-[11px] text-amber-700 font-medium">
                            Mozo: {table.waiter} • {pendingCount} {pendingCount === 1 ? 'bebida pendiente' : 'bebidas pendientes'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onServeAllDrinks(table.id)}
                        className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                        title="Marcar todas las bebidas de esta mesa como servidas"
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        <span>Servir Mesa</span>
                      </button>
                    </div>

                    {/* Drink items checklist */}
                    <div className="space-y-1.5 pt-1">
                      {table.drinks?.map((drink) => (
                        <div
                          key={drink.id}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                            drink.served
                              ? 'bg-emerald-50/60 border border-emerald-200/50'
                              : 'bg-amber-50/70 border border-amber-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="material-symbols-outlined text-[18px] text-amber-700">
                              {drink.name.toLowerCase().includes('cerveza') ? 'sports_bar' : 'local_drink'}
                            </span>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-on-surface">
                                {drink.qty}x {drink.name} {drink.size && <span className="font-normal text-on-surface-variant">({drink.size})</span>}
                              </span>
                              <span className="text-[10px] text-on-surface-variant">
                                S/ {(drink.price * drink.qty).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => onToggleDrinkServed(table.id, drink.id)}
                            className={`h-7 px-2.5 rounded-md font-bold text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer ${
                              drink.served
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {drink.served ? 'check_circle' : 'done'}
                            </span>
                            <span>{drink.served ? 'Entregado' : 'Marcar'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Already Served Section */}
          {tablesAllServed.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                Bebidas Entregadas ({tablesAllServed.length} mesas)
              </span>

              {tablesAllServed.map((table) => (
                <div
                  key={table.id}
                  className="bg-surface-container-lowest/80 rounded-xl p-3 border border-outline-variant/30 flex items-center justify-between opacity-85 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-surface-container text-on-surface flex items-center justify-center font-bold text-sm">
                      {table.number}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-on-surface">
                        Mesa {table.number} • {table.drinks?.length} bebidas servidas
                      </span>
                      <p className="text-[11px] text-on-surface-variant truncate">
                        {table.drinks?.map((d) => `${d.qty}x ${d.name}`).join(', ')}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ Servidas
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container border-t border-outline-variant/30 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            Las bebidas se cargan directamente a la pre-cuenta de la mesa
          </span>
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-lg bg-primary text-on-primary font-bold text-xs active:scale-95 transition-all cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
