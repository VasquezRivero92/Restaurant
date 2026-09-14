import React, { useState } from 'react';
import { ChainBrand } from '../types';

interface ScreenGlobalLoginProps {
  onLoginSuccess: () => void;
  chains: ChainBrand[];
  onNavigateToTenant: (slug: string) => void;
}

export const ScreenGlobalLogin: React.FC<ScreenGlobalLoginProps> = ({
  onLoginSuccess,
  chains,
  onNavigateToTenant
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Total summary metrics for the bottom preview cards
  const totalLocations = chains.reduce((acc, c) => acc + (c.locations?.length || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMsg('Por favor ingresa tu usuario y contraseña.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (cleanUser === 'admin' && cleanPass === 'Popocito123') {
        setIsSubmitting(false);
        onLoginSuccess();
      } else {
        setIsSubmitting(false);
        setErrorMsg('Usuario o contraseña incorrectos. Acceso exclusivo para el Administrador Global.');
      }
    }, 300);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface pb-12 font-sans selection:bg-secondary/20 selection:text-secondary">
      {/* Top Header Bar with SaaS Branding & Status Indicator */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/30 py-3.5 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-extrabold shadow-sm">
              <span className="material-symbols-outlined text-[22px] text-teal-300">public</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-primary tracking-tight">
                  Antigravity SaaS
                </span>
                <span className="px-2 py-0.2 rounded-full bg-teal-500/15 text-teal-800 text-[10px] font-extrabold border border-teal-500/30 uppercase">
                  Cloud v2.0
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-none mt-0.5">
                Portal de Administración Global Multi-Restaurante
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 text-xs font-bold text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Servidor Operativo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 w-full pt-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Hero Banner: Exact SaaS Console Authority Theme */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0A2540] to-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-inner shrink-0">
                  <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-extrabold text-[11px] tracking-wider uppercase border border-teal-400/30">
                      ACCESO RESTRINGIDO • ADMINISTRADOR GLOBAL
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[11px] font-medium">
                      José Manuel Vasquez Rivero
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                    Consola de Gestión y Despliegue de Restaurantes
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    Ingresa con tu cuenta maestra para administrar la plataforma gastronómica, auditar ventas consolidadas, sedes y cartas maestras.
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="hidden lg:flex flex-col items-end shrink-0 text-right">
                <span className="text-[11px] uppercase tracking-wider text-teal-300 font-extrabold">Red SaaS Activa</span>
                <span className="text-sm font-bold text-white mt-0.5">{chains.length} Clientes • {totalLocations} Sedes</span>
              </div>
            </div>
          </div>

          {/* Center 2-Column Grid: Left Login Card + Right Restaurants Client Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
            {/* Left Column (5 cols): Login Card */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-all">
              {/* Top Accent Gradient Bar */}
              <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-teal-400"></div>

              <div className="p-6 sm:p-7 flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px] text-teal-700">lock</span>
                    </div>
                    <div>
                      <h2 className="font-extrabold text-base text-primary">Iniciar Sesión Maestro</h2>
                      <p className="text-[11px] text-on-surface-variant">Credenciales de Administrador Global</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container font-bold text-[10px] text-on-surface-variant uppercase">
                    Admin Root
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">error</span>
                    <span className="font-medium leading-tight">{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Username */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">person</span>
                      <span>Usuario Administrador</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      autoFocus
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container font-medium"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">key</span>
                      <span>Contraseña Maestra</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:bg-surface-container font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1"
                        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">login</span>
                        <span>Ingresar al Portal de Administración</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20 flex items-center gap-2.5 text-[11px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-teal-700 shrink-0">verified_user</span>
                  <span>Acceso seguro protegido. Sesión autorizada para José Manuel Vasquez Rivero.</span>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Direct Restaurant Links for Clients & Waiters */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">storefront</span>
                    <span>Enlaces Directos a Restaurantes</span>
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Cada restaurante cliente cuenta con su propio link independiente para ingresar con PIN de 6 dígitos.
                  </p>
                </div>
                <span className="text-xs text-on-surface-variant font-bold">
                  {chains.length} registrados
                </span>
              </div>

              {/* List of client cards matching SaaS Console styling */}
              <div className="flex flex-col gap-3">
                {chains.map((chain) => {
                  const slug = chain.slug || chain.id;
                  const directUrl = `${window.location.origin}/${slug}`;
                  return (
                    <div
                      key={chain.id}
                      className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold text-lg shadow-sm border border-secondary/20 shrink-0">
                          {chain.id === 'la-barra' ? (
                            <span className="material-symbols-outlined text-[24px] text-teal-300">phishing</span>
                          ) : (
                            chain.name.substring(0, 2).toUpperCase()
                          )}
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-sm sm:text-base text-primary">{chain.name}</h3>
                            <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              {chain.status}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-surface-container font-bold text-[10px] text-on-surface-variant">
                              Plan {chain.plan}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5 font-mono">
                            <span className="font-bold text-teal-800">/{slug}</span>
                            <span>•</span>
                            <span>{chain.locations?.length || 1} sedes activas</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(directUrl);
                            alert(`¡Link copiado: ${directUrl}!`);
                          }}
                          className="h-9 px-3 rounded-lg bg-surface-container-highest hover:bg-surface-container text-on-surface font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-outline-variant/30"
                          title="Copiar link"
                        >
                          <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          <span>Copiar Link</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onNavigateToTenant(slug)}
                          className="h-9 px-3.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                          title={`Ingresar al terminal de ${chain.name}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">login</span>
                          <span>Acceder</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Info Callout */}
              <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/30 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-amber-700 shrink-0 mt-0.5">info</span>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  <strong>Acceso para Mozos, Cocina y Gerentes de Sede:</strong> Deben acceder mediante el enlace directo de su respectivo restaurante para ingresar con su PIN de 6 dígitos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global SaaS Footer */}
        <footer className="mt-8 pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-variant">
          <span>© 2026 Antigravity Restaurant Cloud • Consola de Gestión Central</span>
          <div className="flex items-center gap-1 text-[11px] font-medium text-teal-800">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span>Multi-Tenancy Aislado con Firebase RTDB</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
