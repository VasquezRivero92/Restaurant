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
  activeChainName?: string;
  isCloudConnected?: boolean;
  onLogout?: () => void;
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
  activeBranchName = 'Sede Miraflores',
  activeChainName,
  isCloudConnected = true,
  onLogout
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
        return 'Panel General • Carta & Sedes';
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
        return 'Personal';
    }
  };

  const isCocina = currentRole === 'cocina';
  const isGlobal = currentRole === 'admin_global';
  const isGlobalManagingRestaurant = isGlobal && currentScreen !== 'saas-console';

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 px-3 sm:px-4 py-2 sm:py-2.5 transition-all shadow-xs">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Brand Identity & Subtitle */}
        <div
          onClick={() => onNavigate(isGlobal ? 'saas-console' : isCocina ? 'cocina-kds' : 'mesas')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group min-w-0"
        >
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
              isGlobal && currentScreen === 'saas-console'
                ? 'bg-[#0c3130] text-[#ffd06f]'
                : isGlobalManagingRestaurant
                ? 'bg-teal-700 text-white'
                : isCocina
                ? 'bg-amber-500 text-amber-950'
                : 'bg-primary text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
              {isGlobal && currentScreen === 'saas-console'
                ? 'public'
                : isGlobalManagingRestaurant
                ? 'store'
                : isCocina
                ? 'soup_kitchen'
                : 'restaurant'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-primary truncate leading-none">
                {isGlobal && currentScreen === 'saas-console'
                  ? 'ORDENA'
                  : activeChainName || 'Restaurante'}
              </span>
              <span className="text-secondary font-bold text-xs italic truncate leading-none">
                {isGlobal && currentScreen === 'saas-console'
                  ? 'Cloud'
                  : isGlobalManagingRestaurant
                  ? 'Panel General'
                  : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
                <span className="text-[11px] sm:text-xs text-on-surface-variant truncate font-medium">
                  {isGlobal && currentScreen === 'saas-console'
                    ? 'Consola Multi-Restaurante'
                    : `${activeBranchName} • ${getSubTitle()}`}
                </span>
              </span>
              <span
                className={`hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-black tracking-wider uppercase ${
                  isCloudConnected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
                title="Conectado en tiempo real a Firebase Realtime Database"
              >
                <span className="material-symbols-outlined text-[11px]">cloud_done</span>
                <span>Firebase RTDB</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center / Profile Selector Pill & Return to Global Console Button */}
        <div className="flex items-center gap-2">
          {isGlobalManagingRestaurant && (
            <button
              onClick={() => onNavigate('saas-console')}
              className="h-8 px-2.5 sm:px-3 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer border border-teal-700"
              title="Volver al panel central de Administrador Global"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              <span className="hidden sm:inline">Consola Global</span>
              <span className="sm:hidden">Global</span>
            </button>
          )}

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

          {/* Botón Cerrar Sesión (Bloquear terminal con PIN de 6 dígitos) */}
          <button
            onClick={() => {
              if (onLogout) onLogout();
              else onNavigate('pin-lock');
            }}
            aria-label="Cerrar sesión y bloquear terminal"
            className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 flex items-center gap-1 shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer"
            title="Cerrar sesión (Requiere PIN de 6 dígitos para reingresar)"
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[19px]">lock</span>
            <span className="hidden sm:inline text-[11px] font-bold">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};
