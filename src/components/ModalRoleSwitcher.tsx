import React from 'react';
import { AppRole } from '../types';

interface ModalRoleSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: AppRole;
  onSelectRole: (role: AppRole) => void;
  isMobileFrame?: boolean;
  onToggleFrame?: () => void;
  onResetData?: () => void;
  onLogout?: () => void;
}

export const ModalRoleSwitcher: React.FC<ModalRoleSwitcherProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  isMobileFrame = false,
  onToggleFrame,
  onResetData,
  onLogout
}) => {
  if (!isOpen) return null;

  const rolesList: {
    key: AppRole;
    title: string;
    person: string;
    scope: string;
    icon: string;
    badge: string;
    badgeColor: string;
    optionsDesc: string;
  }[] = [
    {
      key: 'mesero',
      title: 'Mozo de Salón',
      person: 'Carlos Mendoza',
      scope: 'Sede Miraflores • Salón Central',
      icon: 'room_service',
      badge: 'OPERATIVO',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      optionsDesc: 'Mesas de salón, toma rápida de pedidos, bandeja de bebidas, consulta de KDS para marcar pedidos servidos y bloqueo PIN.'
    },
    {
      key: 'cocina',
      title: 'Personal de Cocina (Chef KDS)',
      person: 'Chef Mario Quispe',
      scope: 'Fogones & Estación Fríos (Exclusivo Cocina)',
      icon: 'soup_kitchen',
      badge: 'SOLO COCINA',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      optionsDesc: 'Acceso exclusivo a pantalla de Cocina KDS por orden estricto de llegada (FIFO), inicio de cocción y aviso de platos listos.'
    },
    {
      key: 'admin_sede',
      title: 'Administrador de Sede',
      person: 'Roberto Morales',
      scope: 'Sede Miraflores (Gestión local)',
      icon: 'storefront',
      badge: 'ADMIN SEDE',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      optionsDesc: 'Monitoreo de salón, Cocina KDS, Caja & Cobro POS, Carta & Stock (pausar platos 86) y gestión de Mozos con PINs.'
    },
    {
      key: 'admin_general',
      title: 'Administrador General',
      person: 'Mariana Alva',
      scope: 'Cadena "La Barra Sabrisimo" (3 Sedes)',
      icon: 'corporate_fare',
      badge: 'DUEÑO / CADENA',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      optionsDesc: 'Control de todas las sedes, carta maestra, auditoría de KDS y ventas consolidadas de la marca.'
    },
    {
      key: 'admin_global',
      title: 'Administrador Global',
      person: 'José Manuel Vasquez Rivero',
      scope: 'Plataforma SaaS Cloud (Multi-Empresa)',
      icon: 'public',
      badge: 'SUPERADMIN',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      optionsDesc: 'Consola SaaS, alta de restaurantes/cadenas, gestión de RUCs, asignación de planes y auditoría global.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-primary leading-tight">
                Cambiar Perfil de Usuario
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                El menú de opciones se adapta automáticamente a los permisos de cada rol.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Roles List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {rolesList.map((r) => {
            const isSelected = currentRole === r.key;
            return (
              <div
                key={r.key}
                onClick={() => {
                  if (r.key === currentRole) {
                    onClose();
                  } else {
                    onClose();
                    if (onLogout) {
                      onLogout();
                    } else {
                      onSelectRole(r.key);
                    }
                  }
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative ${
                  isSelected
                    ? 'bg-primary/5 border-secondary ring-2 ring-secondary/20 shadow-sm'
                    : 'bg-surface hover:bg-surface-container-low border-outline-variant/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-secondary text-on-secondary shadow-sm'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{r.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-primary">{r.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${r.badgeColor}`}>
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                        {r.person} • <span className="text-secondary font-bold">{r.scope}</span>
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-extrabold flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-[12px]">check</span>
                      <span>Activo</span>
                    </span>
                  )}
                </div>

                <div className="mt-1 pt-2 border-t border-outline-variant/15 flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">menu</span>
                  <span className="text-[11px] leading-relaxed">
                    <strong className="text-on-surface font-semibold">Opciones visibles:</strong> {r.optionsDesc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Utilities */}
        <div className="p-3 sm:p-4 border-t border-outline-variant/20 bg-surface-container-low/40 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {onToggleFrame && (
              <button
                onClick={onToggleFrame}
                className="h-8 px-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Alternar marco de simulación móvil"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isMobileFrame ? 'smartphone' : 'devices'}
                </span>
                <span>{isMobileFrame ? 'Marco Móvil' : 'Pantalla Completa'}</span>
              </button>
            )}

            {onResetData && (
              <button
                onClick={() => {
                  onResetData();
                  onClose();
                }}
                className="h-8 px-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-error text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Restablecer datos de prueba"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset Datos</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {onLogout && (
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="h-9 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-red-200"
                title="Cerrar sesión actual y bloquear terminal con PIN de 6 dígitos"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Cerrar Sesión</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="h-9 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
