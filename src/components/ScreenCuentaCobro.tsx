import React, { useState, useEffect } from 'react';
import { ScreenType, TableItem, AppRole, StaffMember } from '../types';

export interface ScreenCuentaCobroProps {
  onNavigate: (screen: ScreenType) => void;
  onTablePaidAndFreed: (tableId: string) => void;
  tables: TableItem[];
  currentRole: AppRole;
  currentWaiterName: string;
  staffMembers?: StaffMember[];
  selectedTableId?: string;
  onSelectTable?: (tableId: string) => void;
  onUpdateTableWaiter: (tableId: string, newWaiterName: string) => void;
}

export const ScreenCuentaCobro: React.FC<ScreenCuentaCobroProps> = ({
  onNavigate,
  onTablePaidAndFreed,
  tables = [],
  currentRole = 'admin_sede',
  currentWaiterName = 'Carlos Mendoza',
  staffMembers = [],
  selectedTableId,
  onSelectTable,
  onUpdateTableWaiter
}) => {
  const isWaiter = currentRole === 'mesero';
  const isAdmin = currentRole === 'admin_sede' || currentRole === 'admin_general' || currentRole === 'admin_global';

  // Active tables that have open orders/consumption (not free)
  const activeTables = tables.filter((t) => t.status !== 'free');

  // Role-based filtering rule:
  // "para cobrar solo te debe aparacer la mesa donde el mesero tomo la orden y a lado de la mesa decir el nombre del mesero,
  //  el administrador de la sede si puede ver todas las mesas de la sede y el administrador si puede modificar la asignación para cobrar a otro mesero."
  const payableTables = activeTables.filter((t) => {
    if (isWaiter) {
      const tableWaiter = (t.waiter || '').toLowerCase().trim();
      const currentWaiter = (currentWaiterName || '').toLowerCase().trim();
      // Match full name or first name (e.g. Carlos Mendoza vs Carlos M.)
      const currentFirst = currentWaiter.split(' ')[0];
      const tableFirst = tableWaiter.split(' ')[0];
      return tableWaiter === currentWaiter || (currentFirst && tableWaiter.includes(currentFirst)) || (tableFirst && currentWaiter.includes(tableFirst));
    }
    // Administrator can see ALL tables in the branch
    return true;
  });

  // Active selected table ID
  const [activeTableId, setActiveTableId] = useState<string>(() => {
    if (selectedTableId && payableTables.some((t) => t.id === selectedTableId)) {
      return selectedTableId;
    }
    const billRequested = payableTables.find((t) => t.status === 'bill_requested');
    return billRequested ? billRequested.id : (payableTables[0]?.id || '');
  });

  useEffect(() => {
    if (selectedTableId && payableTables.some((t) => t.id === selectedTableId)) {
      setActiveTableId(selectedTableId);
    } else if (payableTables.length > 0 && !payableTables.some((t) => t.id === activeTableId)) {
      const billRequested = payableTables.find((t) => t.status === 'bill_requested');
      setActiveTableId(billRequested ? billRequested.id : payableTables[0].id);
    }
  }, [selectedTableId, payableTables]);

  const currentTable = payableTables.find((t) => t.id === activeTableId) || payableTables[0];

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'card' | 'cash' | 'split'>('yape');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [customTipInput, setCustomTipInput] = useState<string>('0');
  const [docType, setDocType] = useState<'boleta' | 'factura'>('boleta');
  const [customerDoc, setCustomerDoc] = useState('74829104');
  const [customerName, setCustomerName] = useState('Juan Quispe Alvarado');
  const [cashReceived, setCashReceived] = useState('100.00');
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Available waiters for reassigning
  const availableWaiters = staffMembers.filter(
    (s) => s.role.toLowerCase().includes('mozo') || s.role.toLowerCase().includes('salon') || s.role.toLowerCase().includes('terraza') || s.active
  );

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Pricing calculations
  const baseTotal = currentTable?.total || 75.0;
  const grandTotal = baseTotal + tipAmount;
  const subtotal = baseTotal / 1.18;
  const igv = baseTotal - subtotal;
  const change = Math.max(0, parseFloat(cashReceived || '0') - grandTotal);

  const handleSelectTableClick = (tableId: string) => {
    setActiveTableId(tableId);
    if (onSelectTable) onSelectTable(tableId);
    setTipAmount(0);
    setCustomTipInput('0');
    setIsPaidSuccess(false);
  };

  const handleProcessPayment = () => {
    if (!currentTable) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaidSuccess(true);
      onTablePaidAndFreed(currentTable.id);
      triggerToast(`¡Mesa ${currentTable.number} cobrada y liberada con éxito!`);
    }, 1200);
  };

  const handleReassignWaiter = (newWaiterName: string) => {
    if (!currentTable) return;
    onUpdateTableWaiter(currentTable.id, newWaiterName);
    setShowReassignModal(false);
    triggerToast(`Mesa ${currentTable.number} reasignada a "${newWaiterName}" para cobro`);
  };

  // If waiter has no tables assigned to charge
  if (isWaiter && payableTables.length === 0) {
    return (
      <div className="flex flex-col w-full pb-36 pt-4 max-w-xl mx-auto px-4">
        {/* Context Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 text-center shadow-md flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">point_of_sale</span>
          </div>

          <div className="space-y-1.5 max-w-md">
            <h2 className="text-lg sm:text-xl font-black text-primary">
              No tienes mesas pendientes de cobro
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Como <strong>Mozo de Salón ({currentWaiterName})</strong>, solo puedes ver y cobrar las mesas donde tú tomaste la comanda.
            </p>
            <div className="p-3 mt-2 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant text-left flex items-start gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">info</span>
              <span>
                Las mesas atendidas por otros mozos están protegidas y solo el <strong>Administrador de la Sede</strong> puede verlas o reasignarte una mesa si vas a apoyar con el cobro.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('mesas')}
              className="h-11 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
              <span>Ir al Salón de Mesas</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-36 pt-2 max-w-2xl mx-auto px-3 sm:px-4">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-secondary/40 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info & Role Badge */}
      <div className="pb-2.5 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-black text-primary">Caja & Cobro POS</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
              isWaiter 
                ? 'bg-teal-100 text-teal-800 border-teal-300' 
                : 'bg-blue-100 text-blue-800 border-blue-300'
            }`}>
              {isWaiter ? `Mozo: ${currentWaiterName}` : 'Vista Administrador de Sede'}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            {isWaiter 
              ? 'Mostrando exclusivamente las mesas donde tomaste la orden.'
              : 'Supervisión total de mesas de la sede. Puedes reasignar el mozo de cobro.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('mesas')}
          className="h-8 px-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Salón</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------------ */}
      {/* 1. SELECTOR DE MESAS POR COBRAR (A LADO DE LA MESA DICE EL NOMBRE DEL MOZO) */}
      {/* ------------------------------------------------------------------------ */}
      <div className="pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-secondary">table_restaurant</span>
            <span>Mesas Disponibles para Cobro ({payableTables.length})</span>
          </span>
          {isAdmin && (
            <span className="text-[11px] text-secondary font-bold">
              ✓ Todas las mesas visibles
            </span>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
          {payableTables.map((table) => {
            const isSelected = table.id === currentTable?.id;
            const isBillRequested = table.status === 'bill_requested';

            return (
              <div
                key={table.id}
                onClick={() => handleSelectTableClick(table.id)}
                className={`flex-shrink-0 min-w-[170px] sm:min-w-[190px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 relative ${
                  isSelected
                    ? 'bg-primary/5 border-secondary ring-2 ring-secondary/30 shadow-sm'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/30'
                }`}
              >
                {/* Table Number & Status */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      isSelected ? 'bg-secondary text-on-secondary shadow-xs' : 'bg-surface-container text-on-surface'
                    }`}>
                      {table.number}
                    </span>
                    <span className="font-extrabold text-xs text-primary">
                      Mesa {table.number}
                    </span>
                  </div>

                  {isBillRequested && (
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[9px] animate-pulse">
                      Cuenta
                    </span>
                  )}
                </div>

                {/* Amount & Time */}
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-black text-sm text-secondary">
                    S/ {table.total?.toFixed(2) || '0.00'}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-medium truncate max-w-[80px]">
                    {table.timeInSalon || `${table.diners} comens.`}
                  </span>
                </div>

                {/* A LADO DE LA MESA DICE EL NOMBRE DEL MESERO */}
                <div className="pt-1.5 border-t border-outline-variant/15 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0 flex-1" title={`Mozo: ${table.waiter}`}>
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant shrink-0">
                      person
                    </span>
                    <span className="text-[10px] font-bold text-on-surface-variant truncate">
                      {table.waiter}
                    </span>
                  </div>

                  {/* Admin can modify assignment */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTableId(table.id);
                        setShowReassignModal(true);
                      }}
                      className="p-1 rounded-md bg-surface-container hover:bg-secondary/20 hover:text-secondary text-on-surface-variant text-[10px] font-bold shrink-0 transition-colors"
                      title="Reasignar mozo"
                    >
                      <span className="material-symbols-outlined text-[13px]">sync_alt</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------------ */}
      {/* 2. TABLE CONTEXT BANNER (MESA SELECCIONADA + NOMBRE DEL MOZO + REASIGNAR)  */}
      {/* ------------------------------------------------------------------------ */}
      <div className="pb-3">
        <div className="bg-primary text-on-primary rounded-2xl p-4 shadow-md flex flex-col gap-2.5 border border-secondary/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-on-secondary font-black text-xl shadow-sm shrink-0">
                {currentTable.number}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-base text-on-primary">
                    Mesa {currentTable.number}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-extrabold text-[10px]">
                    {currentTable.statusLabel || 'Cuenta Pedida'}
                  </span>
                  <span className="text-xs text-slate-300">
                    • {currentTable.zone} • {currentTable.diners} comensales
                  </span>
                </div>

                {/* NOMBRE DEL MESERO AL LADO DE LA MESA */}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/10 text-white text-xs font-semibold">
                    <span className="material-symbols-outlined text-[15px] text-teal-300">person</span>
                    <span>Mozo: <strong className="text-teal-200">{currentTable.waiter}</strong></span>
                  </div>

                  {/* If Waiter: Show badge confirming it's their table */}
                  {isWaiter && (
                    <span className="px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 text-[10px] font-bold border border-teal-400/30">
                      ✓ Comanda tomada por ti
                    </span>
                  )}

                  {/* If Admin: Show button to modify assignment */}
                  {isAdmin && (
                    <button
                      onClick={() => setShowReassignModal(true)}
                      className="h-6 px-2 rounded-lg bg-teal-400/20 hover:bg-teal-400/30 text-teal-300 border border-teal-400/40 text-[10px] font-extrabold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                      title="Modificar asignación de mesero para cobro"
                    >
                      <span className="material-symbols-outlined text-[13px]">sync_alt</span>
                      <span>Reasignar a otro Mozo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Total Badge */}
            <div className="text-right shrink-0">
              <span className="font-black text-2xl text-secondary-fixed leading-none block">
                S/ {grandTotal.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-300">
                {tipAmount > 0 ? `Inc. S/ ${tipAmount.toFixed(2)} prop.` : 'Sin propina'}
              </span>
            </div>
          </div>

          {currentTable.notes && (
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-200 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-amber-400">sticky_note_2</span>
              <span>Nota: {currentTable.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------------ */}
      {/* 3. DETALLE DE CONSUMO (PLATOS Y BEBIDAS)                                  */}
      {/* ------------------------------------------------------------------------ */}
      <div className="pb-3">
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
            <div className="flex items-center gap-1.5 font-bold text-xs text-primary uppercase tracking-wide">
              <span className="material-symbols-outlined text-secondary text-[18px]">receipt</span>
              <span>Detalle de Consumo • Mesa {currentTable.number}</span>
            </div>
            <button
              onClick={() => setShowPrinterModal(true)}
              className="text-xs text-secondary font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimir Pre-cuenta</span>
            </button>
          </div>

          <div className="flex flex-col gap-1.5 text-xs">
            {currentTable.dishes && currentTable.dishes.length > 0 ? (
              currentTable.dishes.map((dish, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-outline-variant/10">
                  <div>
                    <span className="font-bold text-on-surface">{dish.name}</span>
                    <p className="text-[10px] text-on-surface-variant">{dish.description}</p>
                  </div>
                  <span className="font-bold text-on-surface whitespace-nowrap">
                    S/ {(20.00 + (i * 5)).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-2 text-on-surface-variant text-xs">
                1x Combinado Marino Especial Sabrisimo • S/ {baseTotal.toFixed(2)}
              </div>
            )}

            {/* Drinks list */}
            {currentTable.drinks?.map((drink) => (
              <div key={drink.id} className="flex justify-between py-1 bg-amber-50/70 px-2 rounded-lg text-amber-950">
                <span className="font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-amber-700">local_bar</span>
                  {drink.qty}x {drink.name} {drink.size && `(${drink.size})`}
                </span>
                <span className="font-bold">S/ {(drink.price * drink.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Subtotals & Taxes */}
          <div className="pt-2 border-t border-dashed border-outline-variant/40 flex flex-col gap-1 text-xs">
            <div className="flex justify-between text-on-surface-variant">
              <span>Op. Gravada (Subtotal)</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>I.G.V. (18%)</span>
              <span>S/ {igv.toFixed(2)}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between text-secondary font-bold">
                <span>Propina Voluntaria (Mozo: {currentTable.waiter})</span>
                <span>+ S/ {tipAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-primary pt-1 border-t border-outline-variant/30">
              <span>Total a Cobrar</span>
              <span>S/ {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------ */}
      {/* 4. PROPINA VOLUNTARIA EN SOLES (S/.)                                     */}
      {/* ------------------------------------------------------------------------ */}
      <div className="pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-bold text-xs text-on-surface uppercase tracking-wide flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-amber-500">volunteer_activism</span>
            <span>Propina para {currentTable.waiter} (en Soles)</span>
          </label>
          <span className="text-[11px] font-bold text-secondary">
            {tipAmount > 0 ? `S/ ${tipAmount.toFixed(2)}` : 'S/ 0.00'}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-2">
          {[
            { label: 'S/ 0', val: 0, tag: 'Cero' },
            { label: 'S/ 5', val: 5, tag: '' },
            { label: 'S/ 10', val: 10, tag: '' },
            { label: 'S/ 15', val: 15, tag: '' },
            { label: 'S/ 20', val: 20, tag: '' }
          ].map((tip) => {
            const isSelected = tipAmount === tip.val;
            return (
              <button
                key={tip.val}
                type="button"
                onClick={() => {
                  setTipAmount(tip.val);
                  setCustomTipInput(String(tip.val));
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center border ${
                  isSelected
                    ? 'bg-secondary text-on-secondary shadow-sm ring-2 ring-secondary/50 border-secondary'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border-outline-variant/30'
                }`}
              >
                <span>{tip.label}</span>
                {tip.tag && (
                  <span className={`text-[8px] ${isSelected ? 'text-white/90' : 'text-on-surface-variant'}`}>
                    {tip.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Tip Input */}
        <div className="bg-surface-container-low p-2 rounded-xl border border-outline-variant/30 flex items-center justify-between gap-2">
          <span className="text-[11px] text-on-surface font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-secondary text-[16px]">edit_note</span>
            Monto de propina manual:
          </span>
          <div className="relative max-w-[120px]">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary">
              S/
            </span>
            <input
              type="number"
              step="0.50"
              min="0"
              value={customTipInput}
              onChange={(e) => {
                const val = e.target.value;
                setCustomTipInput(val);
                const p = parseFloat(val);
                setTipAmount(!isNaN(p) && p >= 0 ? p : 0);
              }}
              className="w-full pl-7 pr-2 py-1 rounded-lg bg-surface-container-lowest text-xs font-bold text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------ */}
      {/* 5. MÉTODO DE PAGO                                                        */}
      {/* ------------------------------------------------------------------------ */}
      <div className="pb-3">
        <label className="font-bold text-xs text-on-surface uppercase tracking-wide block mb-1.5">
          Método de Pago
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'yape', label: 'Yape / Plin', icon: 'qr_code_2' },
            { id: 'card', label: 'Tarjeta POS', icon: 'credit_card' },
            { id: 'cash', label: 'Efectivo', icon: 'payments' },
            { id: 'split', label: 'Mixto / Dividir', icon: 'call_split' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setPaymentMethod(m.id as typeof paymentMethod)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all cursor-pointer ${
                paymentMethod === m.id
                  ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/30'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high border border-outline-variant/30'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] mb-0.5">{m.icon}</span>
              <span className="text-[10px] font-bold text-center leading-tight">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Details for Cash */}
        {paymentMethod === 'cash' && (
          <div className="mt-2.5 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-emerald-600">payments</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Efectivo Recibido</span>
                <span className="text-[10px] text-on-surface-variant">Calcular vuelto en caja</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-24">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">S/</span>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="w-full pl-6 pr-2 py-1 text-xs font-black rounded-lg bg-surface-container-lowest border border-outline-variant/40"
                />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-on-surface-variant block">Vuelto</span>
                <span className="text-xs font-black text-emerald-600">S/ {change.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Details for Yape / Plin */}
        {paymentMethod === 'yape' && (
          <div className="mt-2.5 p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-700 text-[20px]">qr_code_scanner</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold">QR Sabrisimo Yape / Plin</span>
                <span className="text-[10px] text-purple-800">Número de operación automático</span>
              </div>
            </div>
            <span className="px-2 py-1 rounded-lg bg-purple-200 text-purple-900 text-xs font-black">
              S/ {grandTotal.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------------ */}
      {/* 6. COMPROBANTE DE PAGO (BOLETA / FACTURA CON DNI / RUC)                  */}
      {/* ------------------------------------------------------------------------ */}
      <div className="pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-bold text-xs text-on-surface uppercase tracking-wide">
            Comprobante Electrónico (SUNAT)
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDocType('boleta')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                docType === 'boleta'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              Boleta
            </button>
            <button
              type="button"
              onClick={() => setDocType('factura')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                docType === 'factura'
                  ? 'bg-secondary text-on-secondary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              Factura
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant block mb-1">
              {docType === 'boleta' ? 'DNI Comensal' : 'RUC Empresa'}
            </label>
            <input
              type="text"
              value={customerDoc}
              onChange={(e) => setCustomerDoc(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant block mb-1">
              {docType === 'boleta' ? 'Nombre Cliente' : 'Razón Social'}
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-bold rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------ */}
      {/* 7. BOTÓN PRINCIPAL DE COBRO Y LIBERACIÓN                                 */}
      {/* ------------------------------------------------------------------------ */}
      <div className="pt-1">
        <button
          onClick={handleProcessPayment}
          disabled={isProcessing || isPaidSuccess}
          className={`w-full h-12 sm:h-14 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer ${
            isPaidSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-secondary hover:bg-teal-700 text-on-secondary'
          }`}
        >
          {isProcessing ? (
            <>
              <span className="material-symbols-outlined text-[22px] animate-spin">progress_activity</span>
              <span>Procesando Cobro Mesa {currentTable.number}...</span>
            </>
          ) : isPaidSuccess ? (
            <>
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
              <span>¡Cobrado y Mesa {currentTable.number} Liberada!</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">point_of_sale</span>
              <span>
                Cobrar S/ {grandTotal.toFixed(2)} y Liberar Mesa {currentTable.number}
              </span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-on-surface-variant mt-2">
          Atendido y registrado por: <strong className="text-on-surface">{currentTable.waiter}</strong>
        </p>
      </div>

      {/* ======================================================================== */}
      {/* MODAL: REASIGNAR MOZO DE COBRO (SOLO ADMINISTRADOR)                     */}
      {/* ======================================================================== */}
      {showReassignModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowReassignModal(false)}
        >
          <div 
            className="bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">sync_alt</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-primary">
                    Reasignar Mesa {currentTable.number} para Cobro
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Mozo actual: <strong className="text-secondary">{currentTable.waiter}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReassignModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* List of Waiters to Reassign To */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5">
              <p className="text-xs text-on-surface-variant mb-2">
                Selecciona al nuevo colaborador responsable de cobrar esta comanda y recibir las propinas/comisiones correspondientes:
              </p>

              {availableWaiters.map((waiter) => {
                const isCurrent = currentTable.waiter.toLowerCase().includes(waiter.name.toLowerCase()) || waiter.name.toLowerCase().includes(currentTable.waiter.toLowerCase());
                
                // Count how many tables this waiter currently has
                const waiterTablesCount = tables.filter((t) => t.status !== 'free' && (t.waiter.toLowerCase().includes(waiter.name.toLowerCase()) || waiter.name.toLowerCase().includes(t.waiter.toLowerCase()))).length;

                return (
                  <div
                    key={waiter.id}
                    onClick={() => handleReassignWaiter(waiter.name)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-secondary/10 border-secondary ring-2 ring-secondary/30'
                        : 'bg-surface hover:bg-surface-container-low border-outline-variant/30 active:scale-98'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${waiter.avatarColor || 'bg-teal-600'} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
                        {waiter.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-primary truncate">
                            {waiter.name}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-bold text-[9px]">
                              Asignado
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5 truncate">
                          {waiter.role} • {waiter.tablesZone || 'Salón'} ({waiterTablesCount} mesas activas)
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReassignWaiter(waiter.name);
                      }}
                      className={`h-8 px-3 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-primary hover:bg-primary-container text-on-primary'
                      }`}
                    >
                      {isCurrent ? 'Actual' : 'Asignar'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-outline-variant/20 bg-surface-container-low/40 flex justify-end">
              <button
                onClick={() => setShowReassignModal(false)}
                className="h-9 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================== */}
      {/* MODAL: IMPRESIÓN DE PRE-CUENTA CON NOMBRE DE MESERO DESTACADO            */}
      {/* ======================================================================== */}
      {showPrinterModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowPrinterModal(false)}
        >
          <div 
            className="bg-white text-slate-900 w-full max-w-sm rounded-3xl shadow-2xl p-5 font-mono text-xs border border-outline-variant/30 flex flex-col gap-3 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center pb-2 border-b border-dashed border-slate-400">
              <h4 className="font-black text-sm tracking-wider">CEVICHERÍA SABRÍSIMO</h4>
              <p className="text-[10px] text-slate-600">RUC: 20608945123</p>
              <p className="text-[10px] text-slate-600">Sede Miraflores • Salón Central</p>
              <div className="mt-1 font-bold text-xs bg-slate-100 py-0.5 rounded">
                *** PRE-CUENTA DE CONSUMO ***
              </div>
            </div>

            <div className="flex flex-col gap-1 text-[11px] pb-2 border-b border-dashed border-slate-400">
              <div className="flex justify-between">
                <span>MESA:</span>
                <span className="font-black">MESA {currentTable.number}</span>
              </div>
              {/* NOMBRE DEL MESERO DESTACADO EN LA PRE-CUENTA */}
              <div className="flex justify-between bg-teal-50 px-1 py-0.5 rounded font-sans">
                <span className="font-bold text-teal-900">MOZO / ATENDIÓ:</span>
                <span className="font-black text-teal-900">{currentTable.waiter}</span>
              </div>
              <div className="flex justify-between">
                <span>FECHA / HORA:</span>
                <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString().slice(0, 5)}</span>
              </div>
              <div className="flex justify-between">
                <span>COMENSALES:</span>
                <span>{currentTable.diners} personas</span>
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-1 pb-2 border-b border-dashed border-slate-400">
              {currentTable.dishes?.map((dish, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="truncate max-w-[180px]">{dish.name}</span>
                  <span className="font-bold">S/ {(20.00 + idx * 5).toFixed(2)}</span>
                </div>
              ))}
              {currentTable.drinks?.map((drink) => (
                <div key={drink.id} className="flex justify-between">
                  <span>{drink.qty}x {drink.name}</span>
                  <span className="font-bold">S/ {(drink.price * drink.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-1 text-[11px]">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>I.G.V. (18%):</span>
                <span>S/ {igv.toFixed(2)}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between font-bold text-teal-800">
                  <span>PROPINA (MOZO):</span>
                  <span>S/ {tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-900">
                <span>TOTAL A PAGAR:</span>
                <span>S/ {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[9px] text-center text-slate-500 pt-1">
              Gracias por su preferencia • Comprobante no válido como boleta fiscal
            </p>

            <button
              onClick={() => {
                setShowPrinterModal(false);
                triggerToast('Pre-cuenta enviada a impresora térmica de salón');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 mt-2 cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimir en Ticketera</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
