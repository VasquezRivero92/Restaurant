import React, { useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { ChainBrand } from '../types';

interface ScreenGlobalLoginProps {
  onLoginSuccess: () => void;
  chains?: ChainBrand[];
  onNavigateToTenant?: (slug: string) => void;
  onBack?: () => void;
}

export const ScreenGlobalLogin: React.FC<ScreenGlobalLoginProps> = ({
  onLoginSuccess,
  onBack
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
    <div className="flex flex-col w-full min-h-screen bg-[#fffdf9] font-sans text-slate-900 selection:bg-teal-700/20 selection:text-teal-950">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-900/5 bg-[#fffdf9]/90 backdrop-blur-xl py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs"
              >
                <ArrowLeft size={16} />
                <span>Volver a la web</span>
              </button>
            )}

            <div className="flex items-center gap-2 pl-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0c3130] text-[#ffd06f] font-black text-sm">
                O
              </span>
              <div>
                <strong className="block text-sm font-extrabold tracking-tight text-[#102f2e] leading-tight">
                  ORDENA
                </strong>
                <small className="block text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700 leading-none">
                  Portal Central
                </small>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-xs font-bold text-teal-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Servidor Operativo</span>
              <span className="sm:hidden">En línea</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white rounded-3xl shadow-xl shadow-teal-950/5 border border-slate-200/80 overflow-hidden">
            {/* Top Accent Gradient Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#0c3130] via-teal-600 to-[#e46d3f]"></div>

            <div className="p-7 sm:p-9 flex flex-col gap-6">
              {/* Header inside card */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-[#0c3130] text-[#ffd06f] flex items-center justify-center shadow-lg shadow-teal-950/15 mb-1">
                  <Lock size={26} />
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-extrabold tracking-wider uppercase">
                  <Sparkles size={12} />
                  Acceso Restringido
                </div>
                <h1 className="text-2xl font-black text-[#102f2e] tracking-tight">
                  Panel de Administración
                </h1>
                <p className="text-xs text-slate-500 max-w-xs">
                  Ingresa tus credenciales maestras para gestionar la plataforma ORDENA y configurar tu operación.
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                  <span className="shrink-0 text-rose-600 font-bold">✕</span>
                  <span className="font-medium leading-tight">{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Username */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User size={14} className="text-teal-700" />
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
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 text-sm text-slate-900 border border-slate-200 focus:outline-none focus:border-teal-700 focus:bg-white font-medium transition"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock size={14} className="text-teal-700" />
                    <span>Contraseña Maestra</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-slate-50 text-sm text-slate-900 border border-slate-200 focus:outline-none focus:border-teal-700 focus:bg-white font-mono transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1"
                      title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Quick Hint */}
                <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3 text-[11px] text-amber-900 flex items-start gap-2">
                  <span className="font-bold text-amber-700">Tip:</span>
                  <span>Credenciales por defecto: <strong>admin</strong> / <strong>Popocito123</strong></span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-[#0c3130] hover:bg-[#124946] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-950/15 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 mt-1"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                      <span>Verificando acceso...</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar al Panel Global</span>
                      <ShieldCheck size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Security info */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <ShieldCheck size={14} className="text-teal-700" />
                <span>Sesión segura • Gestión centralizada ORDENA</span>
              </div>
            </div>
          </div>

          {/* Bottom helper */}
          {onBack && (
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-semibold text-slate-500 hover:text-teal-800 transition cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Regresar a la presentación de ORDENA</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-5 px-4 text-center text-xs text-slate-400">
        © 2026 ORDENA Restaurant Cloud. Todos los derechos reservados.
      </footer>
    </div>
  );
};
