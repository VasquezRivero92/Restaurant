import React, { useState } from 'react';
import { ScreenType, AppRole } from '../types';

export interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  currentRole: AppRole;
  readyPlatesCount?: number;
  cartCount?: number;
  pendingBillsCount?: number;
  pendingDrinksCount?: number;
  onOpenDrinksTray?: () => void;
  onSelectCartaTab?: (tab: 'carta' | 'sedes' | 'equipo') => void;
  onOpenRoleSwitcher?: () => void;
  onLogout?: () => void;
}

interface NavItemConfig {
  id: ScreenType | 'mas' | 'bebidas-tray' | 'cambiar-perfil';
  label: string;
  icon: string;
  badge?: number | null;
  badgeColor?: string;
  action?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  currentRole,
  readyPlatesCount = 0,
  cartCount = 0,
  pendingBillsCount = 0,
  pendingDrinksCount = 0,
  onOpenDrinksTray,
  onSelectCartaTab,
  onOpenRoleSwitcher,
  onLogout
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Define navigation items according to current active profile
  const getNavItemsForRole = (): NavItemConfig[] => {
    switch (currentRole) {
      case 'cocina':
        return [
          {
            id: 'cocina-kds',
            label: 'Cocina KDS',
            icon: 'soup_kitchen',
            badge: null
          },
          {
            id: 'cambiar-perfil',
            label: 'Cambiar Perfil',
            icon: 'swap_horiz',
            action: onOpenRoleSwitcher
          },
          {
            id: 'pin-lock',
            label: 'Cerrar Sesión',
            icon: 'lock',
            action: () => (onLogout ? onLogout() : onNavigate('pin-lock'))
          }
        ];

      case 'mesero':
        return [
          {
            id: 'mesas',
            label: 'Mesas',
            icon: 'table_restaurant',
            badge: readyPlatesCount > 0 ? readyPlatesCount : null,
            badgeColor: 'bg-on-tertiary-container'
          },
          {
            id: 'cocina-kds',
            label: 'Cocina KDS',
            icon: 'skillet',
            badge: readyPlatesCount > 0 ? readyPlatesCount : null,
            badgeColor: 'bg-error text-white'
          },
          {
            id: 'bebidas-tray',
            label: 'Bebidas',
            icon: 'local_bar',
            badge: pendingDrinksCount > 0 ? pendingDrinksCount : null,
            badgeColor: 'bg-amber-600',
            action: onOpenDrinksTray
          },
          {
            id: 'cuenta-cobro',
            label: 'Cobrar',
            icon: 'point_of_sale',
            badge: pendingBillsCount > 0 ? pendingBillsCount : null,
            badgeColor: 'bg-emerald-600'
          },
          {
            id: 'mas',
            label: '+ Más',
            icon: 'more_horiz',
            badge: cartCount > 0 ? cartCount : null,
            badgeColor: 'bg-secondary',
            action: () => setIsMoreMenuOpen(true)
          }
        ];

      case 'cajero':
        return [
          {
            id: 'cuenta-cobro',
            label: 'Caja y Cobro',
            icon: 'point_of_sale',
            badge: pendingBillsCount > 0 ? pendingBillsCount : null,
            badgeColor: 'bg-emerald-600'
          },
          {
            id: 'pin-lock',
            label: 'Cerrar Sesión',
            icon: 'lock',
            action: () => (onLogout ? onLogout() : onNavigate('pin-lock'))
          }
        ];

      case 'admin_sede':
        return [
          {
            id: 'dashboard-admin',
            label: 'Resumen',
            icon: 'dashboard'
          },
          {
            id: 'mesas',
            label: 'Salón',
            icon: 'table_restaurant',
            badge: readyPlatesCount > 0 ? readyPlatesCount : null,
            badgeColor: 'bg-on-tertiary-container'
          },
          {
            id: 'cocina-kds',
            label: 'Cocina KDS',
            icon: 'skillet'
          },
          {
            id: 'cuenta-cobro',
            label: 'Caja Cobro',
            icon: 'point_of_sale',
            badge: pendingBillsCount > 0 ? pendingBillsCount : null,
            badgeColor: 'bg-emerald-600'
          },
          {
            id: 'carta-sede',
            label: 'Carta Stock',
            icon: 'restaurant_menu',
            action: () => {
              if (onSelectCartaTab) onSelectCartaTab('carta');
              onNavigate('carta-sede');
            }
          },
          {
            id: 'mas',
            label: 'Más Opciones',
            icon: 'grid_view',
            action: () => setIsMoreMenuOpen(true)
          }
        ];

      case 'admin_general':
        return [
          {
            id: 'dashboard-admin',
            label: 'Mis Sedes',
            icon: 'dashboard'
          },
          {
            id: 'mesas',
            label: 'Salón Mesas',
            icon: 'table_restaurant',
            badge: readyPlatesCount > 0 ? readyPlatesCount : null,
            badgeColor: 'bg-on-tertiary-container'
          },
          {
            id: 'cocina-kds',
            label: 'Cocina KDS',
            icon: 'skillet'
          },
          {
            id: 'cuenta-cobro',
            label: 'Caja Cobro',
            icon: 'point_of_sale',
            badge: pendingBillsCount > 0 ? pendingBillsCount : null,
            badgeColor: 'bg-emerald-600'
          },
          {
            id: 'carta-sede',
            label: 'Carta & Sedes',
            icon: 'storefront',
            action: () => {
              if (onSelectCartaTab) onSelectCartaTab('carta');
              onNavigate('carta-sede');
            }
          },
          {
            id: 'mas',
            label: 'Más Opciones',
            icon: 'grid_view',
            action: () => setIsMoreMenuOpen(true)
          }
        ];

      case 'admin_global':
      default:
        return [
          {
            id: 'saas-console',
            label: 'SaaS Global',
            icon: 'public'
          },
          {
            id: 'carta-sede',
            label: 'Carta & Sedes',
            icon: 'storefront',
            action: () => {
              if (onSelectCartaTab) onSelectCartaTab('carta');
              onNavigate('carta-sede');
            }
          },
          {
            id: 'mesas',
            label: 'Salón Mesas',
            icon: 'table_restaurant',
            badge: readyPlatesCount > 0 ? readyPlatesCount : null,
            badgeColor: 'bg-on-tertiary-container'
          },
          {
            id: 'cocina-kds',
            label: 'Cocina KDS',
            icon: 'skillet'
          },
          {
            id: 'mas',
            label: 'Más Opciones',
            icon: 'grid_view',
            action: () => setIsMoreMenuOpen(true)
          }
        ];
    }
  };

  const navItems = getNavItemsForRole();

  const handleItemClick = (item: NavItemConfig) => {
    if (item.action) {
      item.action();
    } else if (item.id !== 'mas' && item.id !== 'bebidas-tray' && item.id !== 'cambiar-perfil') {
      onNavigate(item.id as ScreenType);
    }
  };

  return (
    <>
      {/* Bottom Bar Container */}
      <nav 
        aria-label="Navegación principal inferior"
        className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(10,37,64,0.08)] border-t border-outline-variant/30 overflow-hidden"
      >
        <div className={`grid items-center h-16 mx-auto px-1 sm:px-2 ${
          navItems.length === 3
            ? 'grid-cols-3 max-w-sm'
            : navItems.length === 4
            ? 'grid-cols-4 max-w-md'
            : navItems.length === 6
            ? 'grid-cols-6 max-w-2xl'
            : 'grid-cols-5 max-w-xl'
        }`}>
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`flex flex-col items-center justify-center gap-0.5 h-14 rounded-xl active:scale-95 transition-all relative cursor-pointer min-w-0 px-0.5 overflow-hidden ${
                  isActive
                    ? 'text-secondary font-extrabold'
                    : 'text-on-surface-variant hover:text-on-surface font-semibold'
                }`}
              >
                <div className="relative shrink-0">
                  <span 
                    className={`material-symbols-outlined text-[20px] sm:text-[23px] transition-transform ${
                      isActive ? 'scale-110 text-secondary' : ''
                    }`}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                    <span className={`absolute -top-1 -right-2 min-w-[15px] h-3.5 px-1 rounded-full ${item.badgeColor || 'bg-secondary'} text-white font-extrabold text-[8.5px] flex items-center justify-center ring-2 ring-surface animate-pulse`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9.5px] sm:text-[11px] tracking-tight text-center leading-tight truncate w-full px-0.5">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Drawer: "+ Más Opciones" for extended administrative capabilities */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="bg-surface-container-lowest w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-primary leading-tight">
                    Más Opciones del Perfil
                  </h3>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 capitalize">
                    {currentRole.replace('_', ' ')} • Herramientas adicionales
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                {currentRole === 'mesero' ? 'Acciones Adicionales del Mozo' : 'Módulos de Gestión Disponibles'}
              </div>

              {currentRole === 'mesero' ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Tomar Pedido */}
                  <button
                    onClick={() => {
                      onNavigate('tomar-pedido');
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-3.5 rounded-2xl bg-surface border border-outline-variant/30 hover:border-secondary/40 hover:bg-surface-container-low flex flex-col gap-2 text-left transition-all active:scale-98 cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">edit_note</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-primary block">Tomar Pedido</span>
                        {cartCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-secondary text-on-secondary font-extrabold text-[9px]">
                            {cartCount} items
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-on-surface-variant leading-tight block mt-0.5">
                        {cartCount > 0 ? 'Comanda actual lista para enviar' : 'Cargar comanda o productos a mesa'}
                      </span>
                    </div>
                  </button>

                  {/* Cambiar Perfil */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      if (onOpenRoleSwitcher) onOpenRoleSwitcher();
                    }}
                    className="p-3.5 rounded-2xl bg-surface border border-outline-variant/30 hover:border-secondary/40 hover:bg-surface-container-low flex flex-col gap-2 text-left transition-all active:scale-98 cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">switch_account</span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-primary block">Cambiar Perfil</span>
                      <span className="text-[10px] text-on-surface-variant leading-tight block mt-0.5">
                        Cambiar a Administrador u otro rol
                      </span>
                    </div>
                  </button>

                  {/* Bloquear Terminal */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      if (onLogout) onLogout();
                      else onNavigate('pin-lock');
                    }}
                    className="p-3.5 rounded-2xl bg-surface border border-outline-variant/30 hover:border-red-300 hover:bg-red-50/50 flex flex-col gap-2 text-left transition-all active:scale-98 cursor-pointer group col-span-2"
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-primary block">Bloquear Terminal / Cerrar Turno</span>
                      <span className="text-[10px] text-on-surface-variant leading-tight block mt-0.5">
                        Bloqueo seguro con PIN al terminar el turno o en descanso
                      </span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {/* 1. Personal, Mozos y PINs */}
                  <button
                    onClick={() => {
                      if (onSelectCartaTab) onSelectCartaTab('equipo');
                      onNavigate('carta-sede');
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-surface border border-outline-variant/30 hover:border-secondary/40 hover:bg-surface-container-low flex flex-col gap-1.5 text-left transition-all active:scale-98 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-primary block">Personal & Mozos</span>
                      <span className="text-[10px] text-on-surface-variant leading-tight block mt-0.5">
                        Gestión de meseros, turnos y PINs
                      </span>
                    </div>
                  </button>

                  {/* 2. Sedes de la Cadena */}
                  <button
                    onClick={() => {
                      if (onSelectCartaTab) onSelectCartaTab('sedes');
                      onNavigate('carta-sede');
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-surface border border-outline-variant/30 hover:border-secondary/40 hover:bg-surface-container-low flex flex-col gap-1.5 text-left transition-all active:scale-98 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">storefront</span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-primary block">Gestión de Sedes</span>
                      <span className="text-[10px] text-on-surface-variant leading-tight block mt-0.5">
                        Locales físicos y asignaciones
                      </span>
                    </div>
                  </button>

                  {/* 3. Tomar Pedido de Apoyo */}
                  <button
                    onClick={() => {
                      onNavigate('tomar-pedido');
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-surface border border-outline-variant/30 hover:border-secondary/40 hover:bg-surface-container-low flex flex-col gap-1.5 text-left transition-all active:scale-98 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-primary block">Tomar Pedido</span>
                      <span className="text-[10px] text-on-surface-variant leading-tight block mt-0.5">
                        Modo apoyo salón / comanda
                      </span>
                    </div>
                  </button>

                  {/* 4. Caja & Cobro POS (Para Admin Global) */}
                  <button
                    onClick={() => {
                      onNavigate('cuenta-cobro');
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-surface border border-outline-variant/30 hover:border-secondary/40 hover:bg-surface-container-low flex flex-col gap-1.5 text-left transition-all active:scale-98 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-primary block">Caja & Cobro POS</span>
                      <span className="text-[10px] text-on-surface-variant leading-tight block mt-0.5">
                        Pre-cuentas y cobranza
                      </span>
                    </div>
                  </button>

                  {/* 5. Bandeja Rápida de Bebidas */}
                  <button
                    onClick={() => {
                      if (onOpenDrinksTray) onOpenDrinksTray();
                      setIsMoreMenuOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-surface border border-outline-variant/30 hover:border-secondary/40 hover:bg-surface-container-low flex flex-col gap-1.5 text-left transition-all active:scale-98 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">local_bar</span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-primary block">Bandeja Bebidas</span>
                      <span className="text-[10px] text-on-surface-variant leading-tight block mt-0.5">
                        Despacho y mozo de bebidas
                      </span>
                    </div>
                  </button>

                  {/* 6. Consola SaaS (Para Admin General / Sede) */}
                  {currentRole !== 'admin_global' && (
                    <button
                      onClick={() => {
                        onNavigate('saas-console');
                        setIsMoreMenuOpen(false);
                      }}
                      className="p-3 rounded-2xl bg-surface border border-outline-variant/30 hover:border-secondary/40 hover:bg-surface-container-low flex flex-col gap-1.5 text-left transition-all active:scale-98 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[18px]">public</span>
                      </div>
                      <div>
                        <span className="font-bold text-xs text-primary block">Consola SaaS Web</span>
                        <span className="text-[10px] text-on-surface-variant leading-tight block mt-0.5">
                          Vista global multi-empresa
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* Bottom Quick Tools */}
              <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between gap-2">
                {onOpenRoleSwitcher && (
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      onOpenRoleSwitcher();
                    }}
                    className="flex-1 h-10 px-3 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                    <span>Cambiar Perfil / Rol</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    if (onLogout) onLogout();
                    else onNavigate('pin-lock');
                  }}
                  className="h-10 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-red-200"
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>Cerrar Sesión (PIN)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
