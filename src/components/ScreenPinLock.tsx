import React, { useState } from 'react';
import { ScreenType, AppRole, StaffMember, AdminUser } from '../types';

interface ScreenPinLockProps {
  onUnlock: (role: AppRole, name: string, targetScreen?: ScreenType) => void;
  onNavigate?: (screen: ScreenType) => void;
  staffMembers?: StaffMember[];
  admins?: AdminUser[];
}

export const ScreenPinLock: React.FC<ScreenPinLockProps> = ({
  onUnlock,
  onNavigate,
  staffMembers = [],
  admins = []
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorShake, setErrorShake] = useState(false);
  const isVerifyingRef = React.useRef(false);
  const [selectedStaff, setSelectedStaff] = useState<{ name: string; role: string; pin: string }>({
    name: 'José Manuel Vasquez Rivero',
    role: 'Admin Global',
    pin: '999999'
  });

  const handleKeyPress = (num: string) => {
    if (isVerifyingRef.current) return;
    setPin((prev) => {
      if (prev.length >= 6) return prev;
      const nextPin = prev + num;
      if (nextPin.length === 6) {
        isVerifyingRef.current = true;
        setTimeout(() => {
          verifyPin(nextPin);
        }, 40);
      }
      return nextPin;
    });
  };

  const handleBackspace = () => {
    if (isVerifyingRef.current) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorShake(false);
  };

  const handleClear = () => {
    isVerifyingRef.current = false;
    setPin('');
    setErrorShake(false);
  };

  const verifyPin = (enteredPin: string) => {
    const cleanEntered = String(enteredPin || '').trim();
    const matchesPin = (p?: string | number) => {
      if (p === undefined || p === null) return false;
      return String(p).trim() === cleanEntered;
    };

    // 1. Buscar en lista dinámica de administradores
    const foundAdmin = admins.find((a) => a.active !== false && matchesPin(a.pin));
    if (foundAdmin) {
      isVerifyingRef.current = false;
      setPin('');
      const targetScreen: ScreenType = foundAdmin.roleKey === 'admin_global' ? 'saas-console' : 'carta-sede';
      onUnlock(foundAdmin.roleKey, foundAdmin.name, targetScreen);
      return;
    }

    // 2. Buscar en lista dinámica de colaboradores / mozos / cocina
    const foundStaff = staffMembers.find((s) => s.active !== false && matchesPin(s.pin));
    if (foundStaff) {
      const isCocina =
        foundStaff.role.toLowerCase().includes('cocina') ||
        foundStaff.role.toLowerCase().includes('chef');
      const role: AppRole = isCocina ? 'cocina' : 'mesero';
      const targetScreen: ScreenType = isCocina ? 'cocina-kds' : 'mesas';
      isVerifyingRef.current = false;
      setPin('');
      onUnlock(role, foundStaff.name, targetScreen);
      return;
    }

    // 3. Códigos PIN por defecto de 6 dígitos (presets de fábrica)
    if (cleanEntered === '123456') {
      isVerifyingRef.current = false;
      setPin('');
      onUnlock('mesero', 'Carlos Mendoza', 'mesas');
    } else if (cleanEntered === '555555') {
      isVerifyingRef.current = false;
      setPin('');
      onUnlock('cocina', 'Chef Mario Quispe', 'cocina-kds');
    } else if (cleanEntered === '999999' || cleanEntered === '000000') {
      isVerifyingRef.current = false;
      setPin('');
      onUnlock('admin_global', 'José Manuel Vasquez Rivero', 'saas-console');
    } else if (cleanEntered === '888888') {
      isVerifyingRef.current = false;
      setPin('');
      onUnlock('admin_general', 'Roberto Morales', 'carta-sede');
    } else if (cleanEntered === '777777') {
      isVerifyingRef.current = false;
      setPin('');
      onUnlock('admin_sede', 'Lucía Ramos', 'carta-sede');
    } else {
      setErrorShake(true);
      setTimeout(() => {
        setPin('');
        setErrorShake(false);
        isVerifyingRef.current = false;
      }, 700);
    }
  };

  // Soporte para teclado físico (0-9, Backspace, Escape)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#071626] text-white flex flex-col items-center justify-between p-6 select-none">
      {/* Background caustic subtle gradient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,168,150,0.15),transparent_70%)] pointer-events-none"></div>

      {/* Top Brand Header */}
      <div className="flex flex-col items-center text-center mt-6 z-10">
        <div className="w-20 h-20 rounded-2xl bg-white/5 p-3 flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md mb-3">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBemFHcm7d_pLGEXdgD_W1iczDDc8OGtAmJ6iQcrCUFmeUWKETuKzA0oQ73FVZEA9tHLEnmbm5zmLzA9TjSBoPt8eVP-2oZF4-Uaz9Zs30XTdPq9rQZVwZakA706jnrlPzVwtMDNqd1xejo6R6OjNWOUr3vUSIukM-dSZyHqjidCUhrVwrmECC7O2_0incyxeyDtpRZMYZxaiBeOS02v7RP3ZYVoFjp7brMZ2CYVCDFEACbeE4ugsmeAQ"
            alt="Puerto Azul Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="font-extrabold text-2xl tracking-tight text-white">Puerto Azul</h1>
        <p className="text-xs text-teal-300/80 font-medium mt-0.5">
          Terminal POS & KDS • Acceso Protegido por PIN
        </p>

        {/* Selected Staff Pill */}
        <div className="mt-4 flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
          <div className="w-6 h-6 rounded-full bg-[#00A896] flex items-center justify-center text-white text-xs font-bold">
            {selectedStaff.name.charAt(0)}
          </div>
          <span className="text-xs font-bold text-slate-100">{selectedStaff.name}</span>
          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
            {selectedStaff.role}
          </span>
        </div>
      </div>

      {/* PIN Dots Display (6 Dígitos) */}
      <div className={`flex flex-col items-center gap-3 my-4 z-10 ${errorShake ? 'animate-shake' : ''}`}>
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
          <span className="material-symbols-outlined text-[16px] text-[#00A896]">lock</span>
          <span>Ingresa tu PIN de 6 dígitos en el teclado</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-[#00A896] scale-125 shadow-[0_0_12px_rgba(0,168,150,0.8)]'
                    : 'bg-white/20 border border-white/30'
                }`}
              ></div>
            );
          })}
        </div>
        {errorShake && (
          <span className="text-xs font-bold text-red-400 animate-fade-in text-center max-w-xs">
            PIN Incorrecto. Digita los 6 dígitos exactos asignados por tu Administrador.
          </span>
        )}
      </div>

      {/* 10-Key Keypad */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-3.5 z-10">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleKeyPress(digit)}
            className="h-16 rounded-2xl bg-white/8 hover:bg-white/15 active:scale-95 text-white font-extrabold text-2xl flex items-center justify-center border border-white/10 backdrop-blur-md transition-all shadow-sm cursor-pointer"
          >
            {digit}
          </button>
        ))}

        <button
          onClick={handleClear}
          className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 font-bold text-xs flex flex-col items-center justify-center border border-white/5 transition-all cursor-pointer"
        >
          <span>Limpiar</span>
        </button>

        <button
          onClick={() => handleKeyPress('0')}
          className="h-16 rounded-2xl bg-white/8 hover:bg-white/15 active:scale-95 text-white font-extrabold text-2xl flex items-center justify-center border border-white/10 backdrop-blur-md transition-all shadow-sm cursor-pointer"
        >
          0
        </button>

        <button
          onClick={handleBackspace}
          aria-label="Borrar último dígito"
          className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 flex items-center justify-center border border-white/5 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">backspace</span>
        </button>
      </div>

      {/* Guía de Credenciales (Sin bypass: Obliga a teclear los 6 dígitos) */}
      <div className="mt-4 flex flex-col items-center gap-2 z-10 w-full max-w-sm">
        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-teal-400">lock_clock</span>
          <span>PINs de acceso autorizado (Digita los 6 dígitos):</span>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full text-left">
          <div
            onClick={() => {
              setSelectedStaff({ name: 'José Manuel Vasquez Rivero', role: 'Admin Global', pin: '999999' });
              handleClear();
            }}
            className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 text-xs border border-purple-500/25 transition-all cursor-pointer flex flex-col"
            title="Seleccionar perfil (debes teclear 999999)"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">🌐 Admin Global</span>
              <span className="font-mono font-black text-white bg-purple-500/30 px-1.5 py-0.2 rounded text-[10px]">999999</span>
            </div>
            <span className="text-[10px] text-purple-300/70 truncate mt-0.5">José Manuel Vasquez Rivero</span>
          </div>

          <div
            onClick={() => {
              setSelectedStaff({ name: 'Roberto Morales', role: 'Admin General', pin: '888888' });
              handleClear();
            }}
            className="p-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-200 text-xs border border-teal-500/25 transition-all cursor-pointer flex flex-col"
            title="Seleccionar perfil (debes teclear 888888)"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">🏢 Admin General</span>
              <span className="font-mono font-black text-white bg-teal-500/30 px-1.5 py-0.2 rounded text-[10px]">888888</span>
            </div>
            <span className="text-[10px] text-teal-300/70 truncate mt-0.5">Roberto Morales</span>
          </div>

          <div
            onClick={() => {
              setSelectedStaff({ name: 'Lucía Ramos', role: 'Admin Sede', pin: '777777' });
              handleClear();
            }}
            className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 text-xs border border-amber-500/25 transition-all cursor-pointer flex flex-col"
            title="Seleccionar perfil (debes teclear 777777)"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">📍 Admin Sede</span>
              <span className="font-mono font-black text-white bg-amber-500/30 px-1.5 py-0.2 rounded text-[10px]">777777</span>
            </div>
            <span className="text-[10px] text-amber-300/70 truncate mt-0.5">Lucía Ramos</span>
          </div>

          <div
            onClick={() => {
              setSelectedStaff({ name: 'Carlos Mendoza', role: 'Mozo Salón', pin: '123456' });
              handleClear();
            }}
            className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-200 text-xs border border-sky-500/25 transition-all cursor-pointer flex flex-col"
            title="Seleccionar perfil (debes teclear 123456)"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">🍽️ Mozo Salón</span>
              <span className="font-mono font-black text-white bg-sky-500/30 px-1.5 py-0.2 rounded text-[10px]">123456</span>
            </div>
            <span className="text-[10px] text-sky-300/70 truncate mt-0.5">Carlos Mendoza</span>
          </div>

          <div
            onClick={() => {
              setSelectedStaff({ name: 'Chef Mario Quispe', role: 'Chef KDS', pin: '555555' });
              handleClear();
            }}
            className="col-span-2 p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-200 text-xs border border-red-500/25 transition-all cursor-pointer flex flex-col"
            title="Seleccionar perfil (debes teclear 555555)"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">👨‍🍳 Chef / Cocina KDS</span>
              <span className="font-mono font-black text-white bg-red-500/30 px-1.5 py-0.2 rounded text-[10px]">555555</span>
            </div>
            <span className="text-[10px] text-red-300/70 truncate mt-0.5">Chef Mario Quispe (Cocina)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
