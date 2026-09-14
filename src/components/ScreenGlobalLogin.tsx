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
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="flex items-center justify-between w-full max-w-5xl mx-auto z-10 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25 border border-purple-400/30">
            <span className="material-symbols-outlined text-[24px] text-white">public</span>
          </div>
          <div>
            <h1 className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
              <span>Antigravity SaaS</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold border border-purple-500/40 uppercase">
                Cloud v2.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Plataforma Multi-Restaurante Central</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-[11px]">Sistema Operativo</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md mx-auto my-auto z-10 py-6">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col gap-5 relative">
          <div className="flex flex-col gap-1.5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mx-auto flex items-center justify-center mb-1 shadow-inner">
              <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Administrador Global
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Portal central exclusivo para <strong>José Manuel Vasquez Rivero</strong>. Ingresa con tus credenciales maestras.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <span className="material-symbols-outlined text-[18px] text-rose-400 shrink-0">error</span>
              <span className="leading-tight font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-purple-400">person</span>
                <span>Usuario Administrador</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoFocus
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full h-12 px-4 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-purple-400">lock</span>
                <span>Contraseña</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-12 pl-4 pr-11 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
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
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 hover:from-purple-500 to-indigo-600 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-1"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  <span>Ingresar a Consola Global</span>
                </>
              )}
            </button>
          </form>

          {/* Separation line */}
          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-extrabold tracking-wider">
                Acceso a Clientes
              </span>
            </div>
          </div>

          {/* Quick links to active tenant restaurants */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] text-slate-400 text-center leading-snug">
              Cada restaurante cuenta con su propio enlace directo. Haz clic para visitar su portal:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {chains.map((chain) => {
                const slug = chain.slug || chain.id;
                return (
                  <button
                    key={chain.id}
                    type="button"
                    onClick={() => onNavigateToTenant(slug)}
                    className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 text-left transition-all cursor-pointer flex items-center gap-2.5 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[18px]">restaurant</span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-bold text-xs text-white truncate group-hover:text-teal-300 transition-colors">
                        {chain.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        /{slug}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto z-10 text-center text-xs text-slate-500 py-3 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 Antigravity Restaurant Cloud • Todos los derechos reservados</span>
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <span className="material-symbols-outlined text-[14px] text-purple-400">verified_user</span>
          <span>Acceso Seguro Multi-Inquilino (Multi-Tenancy)</span>
        </span>
      </footer>
    </div>
  );
};
