import React from 'react';
import { ScreenType, AppRole } from '../types';

interface HeaderTopProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  currentRole: AppRole;
  staffName?: string;
  roleBadge?: string;
  alertsCount?: number;
  pendingDrinksCount?: number;
  onOpenDrinksTray?: () => void;
  onOpenRoleSwitcher?: () => void;
  activeBranchName?: string;
}

export const HeaderTop: React.FC<HeaderTopProps> = ({
  currentScreen,
  onNavigate,
  currentRole,
  staffName = 'Carlos M.',
  roleBadge,
  alertsCount = 2,
  pendingDrinksCount = 0,
  onOpenDrinksTray,
  onOpenRoleSwitcher,
  activeBranchName = 'Sede Miraflores'
}) => {
  const getSubTitle = () => {
    switch (currentScreen) {
      case 'cocina':
        return 'Cocina KDS • Solo Cocina';
      case 'mesas':
        return 'Mesas & Salón';
      case 'tomar-pedido':
        return 'Tomar Pedido • Mesa 05';
      case 'cocina-kds':
        return 'Cocina KDS en vivo';
      case 'cuenta-cobro':
        return 'Caja & Cobro POS';
      case 'carta-sede':
        return 'Carta, Sedes & Personal';
      case 'saas-console':
        return 'Consola SaaS Global';
      default:
        return 'Operativo';
    }
  };

  const getRoleDisplayName = () => {
    switch (currentRole) {
      case 'cocina':
        return 'Jefe Cocina';
      case 'mesero':
        return 'Mozo Salón';
      case 'admin_sede':
        return 'Admin Sede';
      case 'admin_general':
        return 'Admin General';
      case 'admin_global':
        return 'Admin Global';
      default:
        return 'Operativo';
    }
  };

  const isGlobal = currentRole === 'admin_global';
  const isCocina = currentRole === 'cocina';

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(10,37,64,0.06)] border-b border-outline-variant/30">
      <div className="h-14 sm:h-16 px-3 sm:px-4 max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand logo & Sede Context */}
        <div 
          onClick={() => onNavigate(isGlobal ? 'saas-console' : isCocina ? 'cocina-kds' : 'mesas')} 
          className="flex items-center gap-2 sm:gap-2.5 min-w-0 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-sm border border-secondary/30">
            <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-secondary-container">
              {isGlobal ? 'public' : isCocina ? 'soup_kitchen' : 'phishing'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-primary truncate leading-none">
                {isGlobal ? 'Puerto Azul' : 'La Barra'}
              </span>
              <span className="text-secondary font-bold text-xs italic truncate leading-none">
                {isGlobal ? 'SaaS' : 'Sabrisimo'}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="text-[11px] sm:text-xs text-on-surface-variant truncate font-medium">
                {isGlobal ? 'Multi-Restaurante' : activeBranchName} • {getSubTitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Profile Selector Pill */}
        <div className="flex items-center">
          <button
            onClick={onOpenRoleSwitcher}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface transition-all active:scale-95 cursor-pointer shadow-xs"
            title="Cambiar perfil de usuario y permisos del menú"
          >
            <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-secondary">
              {currentRole === 'admin_global'
                ? 'public'
                : currentRole === 'admin_general'
                ? 'corporate_fare'
                : currentRole === 'admin_sede'
                ? 'storefront'
                : currentRole === 'cocina'
                ? 'soup_kitchen'
                : 'room_service'}
            </span>
            <span className="font-extrabold text-[11px] sm:text-xs text-primary whitespace-nowrap">
              {getRoleDisplayName()}
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium hidden md:inline truncate max-w-[100px]">
              ({staffName})
            </span>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant">expand_more</span>
          </button>
        </div>

        {/* Right: Operational Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Quick Drinks Tray Button for Waiters or Pending Drinks */}
          {pendingDrinksCount > 0 && onOpenDrinksTray && (
            <button
              onClick={onOpenDrinksTray}
              className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center gap-1 font-bold text-xs active:scale-95 transition-all shadow-sm border border-amber-300 animate-pulse cursor-pointer"
              title="Bebidas pendientes de servir por mesero"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-amber-700">local_bar</span>
              <span className="hidden sm:inline">Servir ({pendingDrinksCount})</span>
              <span className="sm:hidden font-extrabold">{pendingDrinksCount}</span>
            </button>
          )}

          {/* Kitchen alerts button */}
          <button
            onClick={() => onNavigate('cocina-kds')}
            aria-label="Alertas de cocina"
            className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:text-primary active:scale-95 transition-all cursor-pointer"
            title="Ver alertas de cocina KDS"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">notifications</span>
            {alertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface animate-ping"></span>
            )}
            {alertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
            )}
          </button>

          {/* Lock terminal PIN button */}
          <button
            onClick={() => onNavigate('pin-lock')}
            aria-label="Bloquear terminal o cambiar turno"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 active:scale-90 transition-transform shadow-sm hover:ring-2 hover:ring-secondary cursor-pointer text-on-primary"
            title="Bloquear terminal (PIN)"
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[19px]">lock</span>
          </button>
        </div>
      </div>
    </header>
  );
};
