import React from 'react';
import { ScreenType } from '../types';

interface ViewSwitcherProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onResetData: () => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentScreen,
  onSelectScreen,
  isMobileFrame,
  onToggleFrame,
  onResetData
}) => {
  const screens: { id: ScreenType; label: string; icon: string; badge?: string }[] = [
    { id: 'mesas', label: '1. Mesas Salón', icon: 'table_restaurant' },
    { id: 'tomar-pedido', label: '2. Tomar Pedido', icon: 'edit_note' },
    { id: 'cocina-kds', label: '3. Cocina KDS', icon: 'skillet', badge: 'EN VIVO' },
    { id: 'cuenta-cobro', label: '4. Cobro POS', icon: 'point_of_sale' },
    { id: 'carta-sede', label: '5. Admin General / Sede', icon: 'storefront', badge: 'ADMIN' },
    { id: 'saas-console', label: '6. Admin Global (Web)', icon: 'public', badge: 'WEB' },
    { id: 'pin-lock', label: '7. Lock PIN', icon: 'lock' }
  ];

  return (
    <aside aria-label="Selector de pantallas del sistema" className="bg-[#0A2540] text-white px-2 sm:px-4 py-1.5 sm:py-2 border-b border-white/10 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Branding & Screen Pills (Horizontally Scrollable) */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1 font-bold text-xs text-teal-300 shrink-0">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">layers</span>
            <span className="hidden lg:inline">PANTALLAS:</span>
          </div>

          {/* Screen Pills with smooth mobile scroll */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
            {screens.map((s) => {
              const active = currentScreen === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectScreen(s.id)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    active
                      ? 'bg-[#00A896] text-white shadow-sm ring-1 ring-white/40'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px] sm:text-[15px]">{s.icon}</span>
                  <span className="hidden xs:inline sm:inline">{s.label}</span>
                  <span className="xs:hidden sm:hidden">{s.label.split('.')[0]}</span>
                  {s.badge && (
                    <span className="text-[8px] sm:text-[9px] px-1 py-0.2 rounded bg-white/20 font-extrabold ml-0.5 hidden sm:inline">
                      {s.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Layout tools */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={onToggleFrame}
            className="px-2 sm:px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] sm:text-xs font-bold flex items-center gap-1 text-slate-200 transition-all cursor-pointer"
            title="Alternar marco de teléfono móvil / vista completa"
          >
            <span className="material-symbols-outlined text-[15px] sm:text-[16px]">
              {isMobileFrame ? 'smartphone' : 'devices'}
            </span>
            <span className="hidden md:inline">
              {isMobileFrame ? 'Marco Móvil' : 'Pantalla Completa'}
            </span>
          </button>

          <button
            onClick={onResetData}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] sm:text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer"
            title="Reiniciar datos de prueba"
          >
            <span className="material-symbols-outlined text-[14px] sm:text-[15px]">restart_alt</span>
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
