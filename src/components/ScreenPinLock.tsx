import React, { useState } from 'react';
import { ScreenType, AppRole, StaffMember, AdminUser } from '../types';

interface ScreenPinLockProps {
  onUnlock: (role: AppRole, name: string) => void;
  onNavigate: (screen: ScreenType) => void;
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
  const [selectedStaff, setSelectedStaff] = useState<{ name: string; role: string; pin: string }>({
    name: 'Ing. Alejandro Vega',
    role: 'Admin Global',
    pin: '999999'
  });

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const verifyPin = (enteredPin: string) => {
    // 1. Buscar en lista dinámica de administradores
    const foundAdmin = admins.find((a) => a.active !== false && a.pin === enteredPin);
    if (foundAdmin) {
      onUnlock(foundAdmin.roleKey, foundAdmin.name);
      if (foundAdmin.roleKey === 'admin_global') {
        onNavigate('saas-console');
      } else {
        onNavigate('carta-sede');
      }
      return;
    }

    // 2. Buscar en lista dinámica de colaboradores / mozos / cocina
    const foundStaff = staffMembers.find((s) => s.active && s.pin === enteredPin);
    if (foundStaff) {
      const isCocina =
        foundStaff.role.toLowerCase().includes('cocina') ||
        foundStaff.role.toLowerCase().includes('chef');
      const role: AppRole = isCocina ? 'cocina' : 'mesero';
      onUnlock(role, foundStaff.name);
      onNavigate(isCocina ? 'cocina-kds' : 'mesas');
      return;
    }

    // 3. Códigos PIN por defecto de 6 dígitos (presets de fábrica)
    if (enteredPin === '123456') {
      onUnlock('mesero', 'Carlos Mendoza');
      onNavigate('mesas');
    } else if (enteredPin === '555555') {
      onUnlock('cocina', 'Chef Mario Quispe');
      onNavigate('cocina-kds');
    } else if (enteredPin === '999999' || enteredPin === '000000') {
      onUnlock('admin_global', 'Ing. Alejandro Vega');
      onNavigate('saas-console');
    } else if (enteredPin === '888888') {
      onUnlock('admin_general', 'Roberto Morales');
      onNavigate('carta-sede');
    } else if (enteredPin === '777777') {
      onUnlock('admin_sede', 'Lucía Ramos');
      onNavigate('carta-sede');
    } else {
      setErrorShake(true);
      setTimeout(() => {
        setPin('');
        setErrorShake(false);
      }, 700);
    }
  };

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
          Terminal POS & KDS • Sede Miraflores
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
          <span>Ingresa tu código PIN de 6 dígitos</span>
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
            PIN Incorrecto (6 dígitos). Consulta con tu Administrador General o Global.
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
          onClick={() => {
            setPin('');
            setErrorShake(false);
          }}
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

      {/* Quick Access Test Shortcuts */}
      <div className="mt-4 flex flex-col items-center gap-2 z-10 w-full max-w-sm">
        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-teal-400">vpn_key</span>
          <span>PINs de acceso (6 dígitos):</span>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            onClick={() => {
              setPin('999999');
              verifyPin('999999');
            }}
            className="py-2 px-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-bold border border-purple-500/30 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1"
          >
            <span>🌐 Admin Global (999999)</span>
          </button>

          <button
            onClick={() => {
              setPin('888888');
              verifyPin('888888');
            }}
            className="py-2 px-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 text-xs font-bold border border-teal-500/30 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1"
          >
            <span>🏢 Admin General (888888)</span>
          </button>

          <button
            onClick={() => {
              setPin('777777');
              verifyPin('777777');
            }}
            className="py-2 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold border border-amber-500/30 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1"
          >
            <span>📍 Admin Sede (777777)</span>
          </button>

          <button
            onClick={() => {
              setPin('123456');
              verifyPin('123456');
            }}
            className="py-2 px-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 text-xs font-bold border border-sky-500/30 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1"
          >
            <span>🍽️ Mozo Salón (123456)</span>
          </button>

          <button
            onClick={() => {
              setPin('555555');
              verifyPin('555555');
            }}
            className="col-span-2 py-2 px-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold border border-red-500/30 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1"
          >
            <span>👨‍🍳 Chef / Cocina KDS (555555)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
