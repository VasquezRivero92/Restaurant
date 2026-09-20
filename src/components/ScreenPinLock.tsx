import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import { AppRole, BranchLocation, ScreenType } from '../types';
import { authenticateOperator } from '../services/authService';
import { getErrorMessage } from '../utils/errorHandler';

interface ScreenPinLockProps {
  onUnlock: (role: AppRole, name: string, targetScreen?: ScreenType, staffId?: string) => void;
  activeChainId?: string;
  activeBranchId?: string;
  branches?: BranchLocation[];
  onSelectBranch?: (branchId: string) => void;
  activeChainName?: string;
  activeChainLogo?: string;
  onBackToLanding?: () => void;
  onAdminLogin?: () => void;
}

export const ScreenPinLock: React.FC<ScreenPinLockProps> = ({
  onUnlock,
  activeChainId,
  activeBranchId,
  branches = [],
  onSelectBranch,
  activeChainName = 'Restaurante',
  activeChainLogo,
  onBackToLanding,
  onAdminLogin
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(activeBranchId || branches[0]?.id || '');
  const verifying = useRef(false);

  useEffect(() => {
    if (activeBranchId) {
      setSelectedBranchId(activeBranchId);
    } else if (branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id);
      onSelectBranch?.(branches[0].id);
    }
  }, [activeBranchId, branches]);

  const effectiveBranchId = selectedBranchId || activeBranchId || branches[0]?.id || '';

  const handleBranchChange = (newBranchId: string) => {
    setSelectedBranchId(newBranchId);
    onSelectBranch?.(newBranchId);
  };

  const verifyPin = async (value: string) => {
    const branchToUse = effectiveBranchId;
    if (!activeChainId || !branchToUse) {
      setError('La terminal no tiene una sede configurada.');
      setPin('');
      verifying.current = false;
      return;
    }
    try {
      const session = await authenticateOperator(activeChainId, branchToUse, value);
      setPin('');
      verifying.current = false;
      const destination = session.role === 'cocina'
        ? 'cocina-kds'
        : session.role === 'cajero'
          ? 'cuenta-cobro'
          : 'mesas';
      onUnlock(session.role, session.name, destination, session.id);
    } catch (error) {
      setError(getErrorMessage(error, 'PIN incorrecto o sin acceso a esta sede.'));
      window.setTimeout(() => { setPin(''); setError(''); verifying.current = false; }, 1200);
    }
  };

  const press = (digit: string) => {
    if (verifying.current) return;
    setError('');
    setPin((current) => {
      if (current.length >= 6) return current;
      const next = current + digit;
      if (next.length === 6) {
        verifying.current = true;
        window.setTimeout(() => verifyPin(next), 80);
      }
      return next;
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) press(event.key);
      if (event.key === 'Backspace' && !verifying.current) setPin((value) => value.slice(0, -1));
      if (event.key === 'Escape') { setPin(''); setError(''); verifying.current = false; }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="min-h-screen bg-[#103b39] px-5 py-6 text-white sm:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <button type="button" onClick={onBackToLanding} className="flex items-center gap-2 text-sm font-bold text-teal-100 hover:text-white"><ArrowLeft size={17} /> Inicio</button>
        <button type="button" onClick={onAdminLogin} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/15">Acceso administrativo</button>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-sm flex-col items-center justify-center py-8">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22px] border border-white/10 bg-white/10 text-[#ffd06f] shadow-2xl">
          {activeChainLogo ? <img src={activeChainLogo} alt={activeChainName} className="h-full w-full object-cover" /> : <UtensilsCrossed size={32} />}
        </div>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[.2em] text-[#ffd06f]">Terminal operativa</p>
        <h1 className="mt-2 text-center text-2xl font-black tracking-tight">{activeChainName}</h1>
        <p className="mt-2 text-center text-sm text-teal-100">Ingresa el PIN asignado a tu turno y sede.</p>
        {branches && branches.length > 1 ? (
          <div className="mt-3 flex items-center justify-center">
            <select
              value={effectiveBranchId}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-teal-100 backdrop-blur focus:outline-none focus:ring-2 focus:ring-[#ffd06f]"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#103b39] text-white">
                  📍 {b.name} ({b.district})
                </option>
              ))}
            </select>
          </div>
        ) : (
          branches && branches[0] && (
            <p className="mt-2 text-xs font-semibold text-teal-200">
              📍 {branches[0].name} ({branches[0].district})
            </p>
          )
        )}

        <div className="mt-8 flex h-12 items-center justify-center gap-3" aria-label={`${pin.length} de 6 dígitos ingresados`}>
          {Array.from({ length: 6 }).map((_, index) => <span key={index} className={`h-3.5 w-3.5 rounded-full border transition ${pin.length > index ? 'border-[#ffd06f] bg-[#ffd06f] scale-110' : 'border-white/30 bg-white/10'}`} />)}
        </div>
        <div className="h-8 text-center text-sm font-bold text-rose-300" role="alert">{error}</div>

        <div className="mt-2 grid w-full grid-cols-3 gap-3">
          {['1','2','3','4','5','6','7','8','9'].map((digit) => <button type="button" key={digit} onClick={() => press(digit)} className="h-16 rounded-2xl border border-white/10 bg-white/[.08] text-2xl font-black transition hover:bg-white/15 active:scale-95">{digit}</button>)}
          <button type="button" onClick={() => { setPin(''); setError(''); verifying.current = false; }} className="h-16 rounded-2xl text-xs font-bold text-teal-100 hover:bg-white/10">Limpiar</button>
          <button type="button" onClick={() => press('0')} className="h-16 rounded-2xl border border-white/10 bg-white/[.08] text-2xl font-black transition hover:bg-white/15 active:scale-95">0</button>
          <button type="button" aria-label="Borrar último dígito" onClick={() => !verifying.current && setPin((value) => value.slice(0, -1))} className="flex h-16 items-center justify-center rounded-2xl text-teal-100 hover:bg-white/10"><span className="material-symbols-outlined">backspace</span></button>
        </div>
        <div className="mt-7 flex items-center gap-2 text-xs text-teal-200"><ShieldCheck size={15} /> Acceso exclusivo para salón y cocina</div>
      </main>
    </div>
  );
};
