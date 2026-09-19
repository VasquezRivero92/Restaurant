import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { AdminUser } from '../types';
import { authenticateAdmin } from '../services/authService';

interface ScreenGlobalLoginProps {
  onLoginSuccess: (admin: AdminUser) => void;
  admins?: AdminUser[];
  chains?: unknown[];
  restaurantName?: string;
  onNavigateToTenant?: (slug: string) => void;
  onCancel?: () => void;
  onBack?: () => void;
}

export const ScreenGlobalLogin: React.FC<ScreenGlobalLoginProps> = ({
  onLoginSuccess,
  admins = [],
  restaurantName,
  onCancel,
  onBack
}) => {
  const handleBack = onCancel || onBack || (() => {});
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      onLoginSuccess(await authenticateAdmin(identifier, password, admins));
    } catch (error) {
      const code = (error as { code?: string }).code;
      setErrorMsg(code === 'auth/invalid-credential' || code === 'auth/user-not-found'
        ? 'Usuario o contraseña incorrectos.'
        : error instanceof Error ? error.message : 'No fue posible iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf9] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <button type="button" onClick={handleBack} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#103b39] cursor-pointer"><ArrowLeft size={17} /> Volver</button>
        <div className="flex items-center gap-2 font-extrabold text-[#103b39]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#103b39] text-[#ffd06f]"><UtensilsCrossed size={18} /></span>ORDENA</div>
      </div>

      <main className="mx-auto grid min-h-[calc(100vh-110px)] max-w-6xl items-center gap-12 py-10 lg:grid-cols-2">
        <section className="hidden lg:block">
          <span className="inline-flex rounded-full bg-[#f7e7c2] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-orange-800">Portal administrativo</span>
          <h1 className="mt-6 max-w-lg text-5xl font-black leading-tight tracking-[-0.045em] text-[#103b39]">Decisiones claras para un restaurante que nunca se detiene.</h1>
          <p className="mt-5 max-w-md leading-relaxed text-slate-600">Consulta tus sedes, ventas y operación con el alcance asignado a tu cuenta.</p>
          <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-slate-600"><ShieldCheck className="text-teal-700" /> Acceso seguro mediante Firebase Authentication</div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-[28px] border border-slate-900/5 bg-white p-6 shadow-2xl shadow-teal-950/10 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#103b39] text-[#ffd06f]"><LockKeyhole size={23} /></div>
          <h2 className="mt-6 text-2xl font-black tracking-tight text-[#103b39]">Iniciar sesión</h2>
          <p className="mt-2 text-sm text-slate-500">{restaurantName ? `Administración de ${restaurantName}` : 'Administradores de plataforma, empresa y sede'}</p>
          {errorMsg && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{errorMsg}</div>}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-bold text-slate-700">Usuario o Correo electrónico
              <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" required className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#fffdf9] px-4 font-medium outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10" placeholder="admin@ordena.pe o tu@restaurante.com" />
            </label>
            <label className="block text-sm font-bold text-slate-700">Contraseña
              <span className="relative mt-2 block"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className="h-12 w-full rounded-xl border border-slate-200 bg-[#fffdf9] px-4 pr-12 font-medium outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10" placeholder="••••••••" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span>
            </label>
            <button type="submit" disabled={isSubmitting} className="flex h-12 w-full items-center justify-center rounded-xl bg-[#e46d3f] text-sm font-extrabold text-white shadow-lg shadow-orange-900/10 transition hover:bg-[#ca5b32] disabled:cursor-wait disabled:opacity-60 cursor-pointer">{isSubmitting ? 'Verificando…' : 'Ingresar al panel'}</button>
          </form>

          <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">El personal operativo debe ingresar desde la terminal de su restaurante con su PIN.</p>
        </section>
      </main>
    </div>
  );
};
