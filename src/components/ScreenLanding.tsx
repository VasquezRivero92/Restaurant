import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Clock3,
  Coffee,
  CreditCard,
  DollarSign,
  Flame,
  HelpCircle,
  Laptop,
  Layers,
  LayoutGrid,
  Lock,
  Minus,
  Play,
  Plus,
  QrCode,
  Receipt,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Split,
  Store,
  Timer,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Volume2,
  Wine,
  X,
  Zap
} from 'lucide-react';

interface ScreenLandingProps {
  onOpenLogin: () => void;
}

type ShowcaseTab = 'comandera' | 'kds' | 'mesas' | 'cobro' | 'admin';

export const ScreenLanding: React.FC<ScreenLandingProps> = ({ onOpenLogin }) => {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('comandera');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [simulatedToast, setSimulatedToast] = useState<string | null>(null);

  // --- Interactive State inside Mockups ---
  // 1. Comandera State
  const [comanderaCategory, setComanderaCategory] = useState<'ceviches' | 'trios' | 'bebidas'>('ceviches');
  const [selectedPortion, setSelectedPortion] = useState<'Personal' | 'Fuente' | 'Familiar'>('Personal');
  const [cevicheQty, setCevicheQty] = useState(1);
  const [bebidaQty, setBebidaQty] = useState(2);
  const [immediateDrinks, setImmediateDrinks] = useState(true);

  // 2. KDS Kitchen State
  const [kdsStation, setKdsStation] = useState<'todas' | 'frios' | 'calientes' | 'barra'>('todas');
  const [ticketItemsStatus, setTicketItemsStatus] = useState<{ [key: string]: boolean }>({
    'item-1': true, // Ceviche Listo
    'item-2': false, // Arroz en cocción
    'item-3': true, // Bebidas listas
  });

  // 3. Mesas Map State
  const [tableFilter, setTableFilter] = useState<'todas' | 'libres' | 'ocupadas' | 'listas'>('todas');
  const [selectedMockTable, setSelectedMockTable] = useState<string | null>('mesa-04');

  // 4. Pre-cuenta & Cobro State
  const [selectedTipPercent, setSelectedTipPercent] = useState<number>(10);
  const [splitCount, setSplitCount] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'tarjeta' | 'efectivo'>('yape');

  // 5. Admin Dashboard State
  const [selectedBranch, setSelectedBranch] = useState<'miraflores' | 'san-isidro'>('miraflores');
  const [isCevichePaused, setIsCevichePaused] = useState(false);
  const [isLangostinosPaused, setIsLangostinosPaused] = useState(true);

  const triggerMockToast = (msg: string) => {
    setSimulatedToast(msg);
    setTimeout(() => setSimulatedToast(null), 3000);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Calculations for Cobro Mockup
  const baseBill = 145.00;
  const tipAmount = (baseBill * selectedTipPercent) / 100;
  const totalBill = baseBill + tipAmount;
  const perPerson = totalBill / splitCount;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffdf9] text-slate-900 font-sans selection:bg-teal-700/20 selection:text-teal-950">
      {/* Micro Toast for Mockup interactions */}
      {simulatedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-[#0c3130] px-4 py-3 text-sm font-bold text-white shadow-2xl border border-teal-500/30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles size={16} className="text-[#ffd06f]" />
          <span>{simulatedToast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-900/5 bg-[#fffdf9]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => scrollTo('inicio')}
            className="flex items-center gap-3 text-left group cursor-pointer"
            aria-label="Ir al inicio"
          >
            <img
              src="/ordena-logo.png"
              alt="ORDENA Logo"
              className="h-11 w-11 rounded-2xl object-cover shadow-md shadow-teal-950/15 group-hover:scale-105 transition"
            />
            <span className="leading-tight">
              <strong className="block text-lg font-black tracking-tight text-[#102f2e]">
                ORDENA
              </strong>
              <small className="block text-[11px] font-bold text-teal-800 leading-tight max-w-[280px]">
                Sistema de gestión para restaurantes y cadenas
              </small>
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
            <button
              type="button"
              onClick={() => scrollTo('pantallas')}
              className="hover:text-teal-800 transition cursor-pointer"
            >
              Pantallas del App
            </button>
            <button
              type="button"
              onClick={() => scrollTo('flujo')}
              className="hover:text-teal-800 transition cursor-pointer"
            >
              Cómo Funciona
            </button>
            <button
              type="button"
              onClick={() => scrollTo('comparativa')}
              className="hover:text-teal-800 transition cursor-pointer"
            >
              Antes vs. ORDENA
            </button>
            <button
              type="button"
              onClick={() => scrollTo('modulos')}
              className="hover:text-teal-800 transition cursor-pointer"
            >
              Módulos
            </button>
            <button
              type="button"
              onClick={() => scrollTo('faq')}
              className="hover:text-teal-800 transition cursor-pointer"
            >
              Preguntas
            </button>
          </nav>

          {/* Login Button at Top Right */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0c3130] px-5 text-sm font-extrabold text-white shadow-lg shadow-teal-950/15 transition hover:-translate-y-0.5 hover:bg-[#124946] active:translate-y-0 cursor-pointer"
            >
              <Lock size={15} className="text-[#ffd06f]" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
              <span className="sm:hidden">Acceso</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="inicio">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                             */}
        {/* ========================================================================= */}
        <section className="relative isolate overflow-hidden px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
          <div className="absolute left-1/2 top-0 -z-10 h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-[#ffd06f]/20 blur-3xl pointer-events-none" />
          <div className="absolute right-0 top-1/4 -z-10 h-[380px] w-[450px] rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-800/15 bg-white px-4 py-1.5 text-xs font-black text-teal-900 shadow-xs">
                <Sparkles size={14} className="text-teal-700" />
                <span>ORDENA • Sistema de gestión para restaurantes y cadenas</span>
              </div>

              <h1 className="text-4xl font-black leading-[1.08] tracking-[-0.05em] text-[#102f2e] sm:text-6xl sm:leading-[1.08]">
                El sistema que transforma la hora punta en un servicio fluido y rentable.
              </h1>

              <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-xl font-normal">
                Conecta las <strong>comanderas táctiles de los mozos</strong>, el <strong>KDS de cocina en tiempo real</strong>, el <strong>mapa inteligente de mesas</strong> y el <strong>cobro rápido</strong> en una sola plataforma en la nube sin papel ni complicaciones.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollTo('pantallas')}
                  className="w-full sm:w-auto inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-[#e46d3f] px-7 text-sm font-extrabold text-white shadow-xl shadow-orange-900/20 transition hover:bg-[#ca5b32] active:scale-98 cursor-pointer"
                >
                  <Smartphone size={18} />
                  <span>Ver Pantallas en Vivo</span>
                  <ArrowRight size={17} />
                </button>
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="w-full sm:w-auto inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-slate-900/20 bg-white px-7 text-sm font-extrabold text-[#102f2e] shadow-xs transition hover:border-teal-800/40 hover:bg-slate-50 active:scale-98 cursor-pointer"
                >
                  <Lock size={17} className="text-teal-800" />
                  <span>Ingresar a mi Restaurante</span>
                </button>
              </div>

              {/* Real-time stats pills */}
              <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
                  <span className="flex items-center justify-center gap-1 text-2xl font-black text-[#102f2e]">
                    &lt; 0.5s
                  </span>
                  <p className="mt-1 text-xs font-bold text-slate-500">Sincronización a Cocina</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
                  <span className="flex items-center justify-center gap-1 text-2xl font-black text-teal-800">
                    +35%
                  </span>
                  <p className="mt-1 text-xs font-bold text-slate-500">Mayor Rotación de Mesas</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
                  <span className="flex items-center justify-center gap-1 text-2xl font-black text-[#e46d3f]">
                    0
                  </span>
                  <p className="mt-1 text-xs font-bold text-slate-500">Comandas Extraviadas</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
                  <span className="flex items-center justify-center gap-1 text-2xl font-black text-emerald-700">
                    100%
                  </span>
                  <p className="mt-1 text-xs font-bold text-slate-500">Cuentas y Caja Exacta</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE SCREENS SHOWCASE (PANTALLAS DEL APLICATIVO)                   */}
        {/* ========================================================================= */}
        <section id="pantallas" className="border-y border-slate-200/80 bg-[#0f2e2d] py-20 text-white sm:py-28 relative">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#ffd06f]">
                <Layers size={14} />
                Explorador Interactivo
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                Pantallas reales creadas para la máxima velocidad de servicio.
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-teal-100/90">
                Haz clic en cada pestaña para experimentar cómo interactúa cada área de tu restaurante: desde el mozo tomando la orden en el teléfono, hasta la pantalla táctil de la cocina y el cierre de caja.
              </p>
            </div>

            {/* Screen Selection Tabs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {[
                { id: 'comandera', label: 'Comandera Móvil', role: 'Mozos', icon: Smartphone },
                { id: 'kds', label: 'Pantalla KDS', role: 'Cocina & Bar', icon: ChefHat },
                { id: 'mesas', label: 'Mapa de Salón', role: 'Supervisión', icon: LayoutGrid },
                { id: 'cobro', label: 'Pre-Cuenta & Cobro', role: 'Caja', icon: Receipt },
                { id: 'admin', label: 'Panel SaaS & Sedes', role: 'Gerencia', icon: BarChart3 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as ShowcaseTab)}
                    className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                      isCurrent
                        ? 'bg-[#ffd06f] text-[#0c3130] shadow-lg shadow-black/20 scale-102'
                        : 'bg-white/10 text-teal-100 hover:bg-white/15'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-left">
                      <span className="block leading-tight">{tab.label}</span>
                      <small className={`text-[10px] font-bold block ${isCurrent ? 'text-teal-900' : 'text-teal-300/80'}`}>
                        {tab.role}
                      </small>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Showcase Stage Display */}
            <div className="mt-10 rounded-3xl border border-white/15 bg-white/[0.04] p-4 sm:p-8 backdrop-blur-md shadow-2xl">
              {/* Context Summary Bar for active screen */}
              <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white/10 p-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffd06f] text-[#0c3130] font-black">
                    {activeTab === 'comandera' && <Smartphone size={16} />}
                    {activeTab === 'kds' && <ChefHat size={16} />}
                    {activeTab === 'mesas' && <LayoutGrid size={16} />}
                    {activeTab === 'cobro' && <Receipt size={16} />}
                    {activeTab === 'admin' && <BarChart3 size={16} />}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-white text-base">
                      {activeTab === 'comandera' && 'Comandera Táctil para Teléfonos y Tablets'}
                      {activeTab === 'kds' && 'KDS Pantalla de Cocina & Barra en Tiempo Real'}
                      {activeTab === 'mesas' && 'Monitor de Mesas con Semáforo de Tiempos'}
                      {activeTab === 'cobro' && 'Módulo de Facturación, Pre-Cuenta y División'}
                      {activeTab === 'admin' && 'Consola Central SaaS y Gestión Multi-Sede'}
                    </h3>
                    <p className="text-xs text-teal-200">
                      {activeTab === 'comandera' && 'Toma de pedidos en mesa con modificadores, notas de alergia y despacho directo.'}
                      {activeTab === 'kds' && 'Separación por partidas (frío, caliente, barra), cronómetro y alerta de plato listo.'}
                      {activeTab === 'mesas' && 'Control visual instantáneo de qué mesa necesita atención, cuál tiene platos listos o pide la cuenta.'}
                      {activeTab === 'cobro' && 'División exacta entre comensales, cálculo de propina y pago con Yape, Plin o POS.'}
                      {activeTab === 'admin' && 'Pausa platos agotados por sede al instante para evitar errores de venta.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    SIMULADOR INTERACTIVO
                  </span>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* TAB 1: COMANDERA MOVIL MOCKUP                                  */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'comandera' && (
                <div className="grid gap-8 lg:grid-cols-[400px_1fr] items-center">
                  {/* Smartphone Mockup */}
                  <div className="mx-auto w-full max-w-[360px] rounded-[44px] border-[10px] border-slate-900 bg-slate-900 p-2.5 shadow-2xl ring-1 ring-white/20">
                    <div className="overflow-hidden rounded-[34px] bg-[#fffdf9] text-slate-900 flex flex-col h-[650px]">
                      {/* Phone Top Notch / Status */}
                      <div className="flex items-center justify-between bg-[#0c3130] px-5 py-2.5 text-white text-[11px] font-bold">
                        <span>12:45 PM</span>
                        <div className="h-4 w-20 rounded-full bg-black/40 flex items-center justify-center">
                          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Zap size={11} className="text-[#ffd06f]" /> 100%
                        </span>
                      </div>

                      {/* Header App Bar */}
                      <div className="bg-[#0c3130] px-4 pb-4 pt-1 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">
                              Servicio en Salón
                            </span>
                            <h4 className="text-base font-black flex items-center gap-1.5">
                              Mesa 05 <span className="text-xs font-semibold text-teal-200">(4 pax)</span>
                            </h4>
                          </div>
                          <span className="rounded-xl bg-white/10 px-2.5 py-1 text-[11px] font-bold text-teal-100">
                            Mozo: Carlos M.
                          </span>
                        </div>

                        {/* Category Selector Tabs inside phone */}
                        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 text-xs">
                          {(['ceviches', 'trios', 'bebidas'] as const).map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setComanderaCategory(cat)}
                              className={`rounded-xl px-3 py-1.5 font-extrabold capitalize cursor-pointer shrink-0 transition ${
                                comanderaCategory === cat
                                  ? 'bg-[#ffd06f] text-[#0c3130]'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Phone Menu Items Scroll Area */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {comanderaCategory === 'ceviches' && (
                          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] font-bold uppercase text-teal-800">Partida Fría</span>
                                <h5 className="text-sm font-black text-slate-900">Ceviche de Pescado</h5>
                                <p className="text-[11px] text-slate-500">Pesca del día, leche de tigre, camote glaseado y choclo.</p>
                              </div>
                              <span className="text-sm font-black text-[#0c3130]">
                                S/ {selectedPortion === 'Personal' ? '20.00' : selectedPortion === 'Fuente' ? '35.00' : '55.00'}
                              </span>
                            </div>

                            {/* Portion selector buttons */}
                            <div className="mt-2.5 flex items-center gap-1.5">
                              {(['Personal', 'Fuente', 'Familiar'] as const).map((sz) => (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => setSelectedPortion(sz)}
                                  className={`flex-1 rounded-lg py-1 text-[10px] font-extrabold cursor-pointer border ${
                                    selectedPortion === sz
                                      ? 'border-teal-700 bg-teal-50 text-teal-900 font-black'
                                      : 'border-slate-200 bg-slate-50 text-slate-600'
                                  }`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>

                            {/* Quantity Counter & Notes */}
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                                🌶️ Nota: Sin ají
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setCevicheQty(Math.max(1, cevicheQty - 1))}
                                  className="h-6 w-6 rounded-md bg-slate-100 font-bold flex items-center justify-center hover:bg-slate-200"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-xs font-black w-4 text-center">{cevicheQty}</span>
                                <button
                                  type="button"
                                  onClick={() => setCevicheQty(cevicheQty + 1)}
                                  className="h-6 w-6 rounded-md bg-teal-800 text-white font-bold flex items-center justify-center hover:bg-teal-700"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {comanderaCategory === 'trios' && (
                          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
                            <span className="text-[10px] font-bold uppercase text-orange-700">Partida Mixta</span>
                            <h5 className="text-sm font-black text-slate-900">Trío Marino Clásico</h5>
                            <p className="text-[11px] text-slate-500">Ceviche clásico + Chicharrón de calamar + Arroz con mariscos.</p>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-sm font-black text-slate-900">S/ 25.00</span>
                              <button
                                type="button"
                                onClick={() => triggerMockToast('Trío Marino agregado al carrito')}
                                className="rounded-lg bg-teal-800 px-3 py-1 text-xs font-bold text-white hover:bg-teal-700"
                              >
                                + Agregar
                              </button>
                            </div>
                          </div>
                        )}

                        {comanderaCategory === 'bebidas' && (
                          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
                            <span className="text-[10px] font-bold uppercase text-sky-700">Barra & Refrescos</span>
                            <h5 className="text-sm font-black text-slate-900">Chicha Morada de la Casa</h5>
                            <p className="text-[11px] text-slate-500">Hervida con piña, membrillo, canela y toques de limón fresco.</p>
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                              <span className="text-sm font-black text-slate-900">Jarra 1L: S/ 8.00</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setBebidaQty(Math.max(1, bebidaQty - 1))}
                                  className="h-6 w-6 rounded-md bg-slate-100 font-bold flex items-center justify-center hover:bg-slate-200"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-xs font-black w-4 text-center">{bebidaQty}</span>
                                <button
                                  type="button"
                                  onClick={() => setBebidaQty(bebidaQty + 1)}
                                  className="h-6 w-6 rounded-md bg-teal-800 text-white font-bold flex items-center justify-center hover:bg-teal-700"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Direct drink dispatch toggle */}
                        <div className="rounded-xl bg-teal-50/70 border border-teal-200/80 p-2.5 text-xs flex items-center justify-between">
                          <span className="font-bold text-teal-950 flex items-center gap-1.5">
                            <Wine size={14} className="text-teal-700" /> Despachar bebidas de inmediato
                          </span>
                          <input
                            type="checkbox"
                            checked={immediateDrinks}
                            onChange={(e) => setImmediateDrinks(e.target.checked)}
                            className="h-4 w-4 accent-teal-800 rounded cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Phone Bottom Send Bar */}
                      <div className="border-t border-slate-200 bg-white p-3 shadow-lg">
                        <div className="flex items-center justify-between mb-2 text-xs">
                          <span className="font-bold text-slate-500">{cevicheQty + bebidaQty} productos ordenados</span>
                          <strong className="font-black text-slate-900 text-sm">
                            S/ {(cevicheQty * (selectedPortion === 'Personal' ? 20 : selectedPortion === 'Fuente' ? 35 : 55) + bebidaQty * 8).toFixed(2)}
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerMockToast('🚀 ¡Comanda enviada a Cocina y Barra en 0.3s!')}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#e46d3f] py-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-[#ca5b32] active:scale-98 cursor-pointer"
                        >
                          <Zap size={14} /> Enviar Comanda a Cocina
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Explanation Column */}
                  <div className="space-y-5 text-teal-100">
                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffd06f] text-[#0c3130] font-black">
                          1
                        </span>
                        <h4 className="text-lg font-bold text-white">Interfaz Ultra Rápida para el Mozo</h4>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-teal-100/90">
                        Diseñada para ser operada con una sola mano desde cualquier teléfono inteligente (Android o iPhone) o tablet de salón. No requiere descargas de tiendas de aplicaciones; funciona de manera nativa y ligera.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400 text-[#0c3130] font-black">
                          2
                        </span>
                        <h4 className="text-lg font-bold text-white">Porciones, Términos y Notas Específicas</h4>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-teal-100/90">
                        Permite seleccionar el tamaño del plato (Personal, Fuente, Familiar), nivel de picante, o notas críticas de alergia (&ldquo;sin cebolla&rdquo;, &ldquo;sin mariscos&rdquo;), evitando los errores habituales de la letra escrita a mano.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-[#0c3130] font-black">
                          3
                        </span>
                        <h4 className="text-lg font-bold text-white">Despacho Inmediato de Bebidas</h4>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-teal-100/90">
                        Las bebidas pueden enviarse a la barra mientras el cliente todavía está decidiendo sus platos de fondo. Los comensales tienen su bebida servida en menos de 2 minutos.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 2: KDS COCINA EN VIVO MOCKUP                               */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'kds' && (
                <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
                  {/* Widescreen Kitchen Terminal Mockup */}
                  <div className="rounded-3xl border border-slate-700/80 bg-[#142323] p-4 sm:p-6 text-white shadow-2xl">
                    {/* KDS Header Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400 text-[#0c3130] font-black">
                          <ChefHat size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white">KDS Pantalla de Cocina Principal</h4>
                          <span className="text-[11px] text-teal-300">Sede Miraflores • 3 Comandas Activas</span>
                        </div>
                      </div>

                      {/* Station Filters */}
                      <div className="flex items-center gap-1.5 text-xs">
                        {(['todas', 'frios', 'calientes', 'barra'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setKdsStation(st)}
                            className={`rounded-xl px-2.5 py-1 font-bold capitalize transition cursor-pointer ${
                              kdsStation === st ? 'bg-teal-400 text-[#0c3130]' : 'bg-white/10 text-teal-200 hover:bg-white/20'
                            }`}
                          >
                            {st === 'frios' ? 'Cevichería' : st === 'calientes' ? 'Cocina Caliente' : st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tickets Stream (Cascade FIFO) */}
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {/* Ticket 1: Mesa 05 */}
                      <div className="rounded-2xl border border-emerald-500/40 bg-[#1d3534] p-4 text-white shadow-md">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                              Ticket #042 • Salón
                            </span>
                            <h5 className="text-base font-black text-white">Mesa 05 (4 pax)</h5>
                            <small className="text-[11px] text-teal-300">Mozo: Carlos M.</small>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2 py-0.5 text-xs font-black text-emerald-300 border border-emerald-500/30">
                              <Timer size={12} /> 05m 18s
                            </span>
                            <small className="block text-[10px] text-teal-200 mt-0.5">A tiempo</small>
                          </div>
                        </div>

                        {/* Dish items inside ticket */}
                        <div className="mt-3 space-y-2.5 text-xs">
                          <div className={`flex items-start justify-between rounded-xl p-2 transition ${ticketItemsStatus['item-1'] ? 'bg-emerald-950/40 border border-emerald-500/30' : 'bg-white/5'}`}>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-teal-300 text-[#0c3130] font-black text-[11px]">
                                  1
                                </span>
                                <strong className="font-extrabold text-white">Ceviche de Pescado (Personal)</strong>
                              </div>
                              <p className="ml-7 text-[11px] text-amber-300 font-semibold">Nota: Sin ají para los niños</p>
                              <span className="ml-7 text-[10px] text-teal-400">Partida Fría</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setTicketItemsStatus((prev) => ({ ...prev, 'item-1': !prev['item-1'] }));
                                triggerMockToast('Estado de Ceviche actualizado');
                              }}
                              className={`rounded-lg px-2.5 py-1 text-[10px] font-black cursor-pointer ${
                                ticketItemsStatus['item-1'] ? 'bg-emerald-400 text-[#0c3130]' : 'bg-white/15 text-white hover:bg-white/25'
                              }`}
                            >
                              {ticketItemsStatus['item-1'] ? 'Listo ✓' : 'Marcar'}
                            </button>
                          </div>

                          <div className={`flex items-start justify-between rounded-xl p-2 transition ${ticketItemsStatus['item-2'] ? 'bg-emerald-950/40 border border-emerald-500/30' : 'bg-white/5'}`}>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-teal-300 text-[#0c3130] font-black text-[11px]">
                                  1
                                </span>
                                <strong className="font-extrabold text-white">Arroz con Mariscos Especial</strong>
                              </div>
                              <span className="ml-7 text-[10px] text-orange-300">Partida Caliente</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setTicketItemsStatus((prev) => ({ ...prev, 'item-2': !prev['item-2'] }));
                                triggerMockToast('Estado de Arroz actualizado');
                              }}
                              className={`rounded-lg px-2.5 py-1 text-[10px] font-black cursor-pointer ${
                                ticketItemsStatus['item-2'] ? 'bg-emerald-400 text-[#0c3130]' : 'bg-white/15 text-white hover:bg-white/25'
                              }`}
                            >
                              {ticketItemsStatus['item-2'] ? 'Listo ✓' : 'Marcar'}
                            </button>
                          </div>
                        </div>

                        {/* Ticket Action Button */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => triggerMockToast('🔔 Mozo Carlos notificado: ¡Orden lista para recoger!')}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 cursor-pointer shadow-md"
                          >
                            <Bell size={14} /> Notificar Mozo: Todo Listo
                          </button>
                        </div>
                      </div>

                      {/* Ticket 2: Mesa 02 (Alerta de Tiempo) */}
                      <div className="rounded-2xl border border-amber-500/50 bg-[#28271e] p-4 text-white shadow-md">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                              Ticket #040 • Salón
                            </span>
                            <h5 className="text-base font-black text-white">Mesa 02 (2 pax)</h5>
                            <small className="text-[11px] text-amber-200">Moza: Lucía R.</small>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-2 py-0.5 text-xs font-black text-amber-300 border border-amber-500/40">
                              <Clock3 size={12} /> 14m 45s
                            </span>
                            <small className="block text-[10px] text-amber-300 font-bold mt-0.5">Prioridad Alta</small>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between rounded-xl bg-white/5 p-2">
                            <span className="font-bold flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-amber-400 text-slate-950 font-black flex items-center justify-center">2</span>
                              Tacu Tacu en Salsa de Mariscos
                            </span>
                            <span className="text-[10px] font-bold text-amber-400">En Fuego</span>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-2">
                            <span className="font-bold flex items-center gap-2 text-emerald-200">
                              <span className="w-5 h-5 rounded-md bg-emerald-400 text-slate-950 font-black flex items-center justify-center">1</span>
                              Causa Acevichada
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400">Listo ✓</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => triggerMockToast('Despacho de Mesa 02 completado')}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 cursor-pointer shadow-md"
                          >
                            <Check size={14} /> Despachar Plato Principal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* KDS Explanatory Panel */}
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <div className="flex items-center gap-2 text-[#ffd06f] font-black text-sm">
                        <Zap size={16} /> Semáforo Inteligente de Tiempos
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-teal-100/90">
                        Los tickets cambian automáticamente de verde (a tiempo) a amarillo (&gt; 12 min) y rojo (&gt; 18 min) para alertar al jefe de cocina y priorizar pedidos demorados.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <div className="flex items-center gap-2 text-teal-300 font-black text-sm">
                        <Layers size={16} /> Separación Automática por Partidas
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-teal-100/90">
                        El ceviche va al cocinero de fríos, las frituras y salteados a la cocina caliente, y los cócteles al bar, todo desde una sola orden tomada por el mozo.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
                        <Volume2 size={16} /> Alerta Sonora y Visual al Mozo
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-teal-100/90">
                        Con un toque en la pantalla de cocina, el mozo recibe una notificación sonora y vibración en su teléfono para retirar el plato caliente de inmediato.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 3: SALON & MAPA DE MESAS MOCKUP                            */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'mesas' && (
                <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
                  {/* Tablet Frame with Table Grid */}
                  <div className="rounded-3xl border border-white/15 bg-white p-5 text-slate-900 shadow-2xl">
                    {/* Mesas Header & Filters */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-teal-800">
                          Plano del Restaurante
                        </span>
                        <h4 className="text-lg font-black text-[#102f2e]">Mapa de Salón en Tiempo Real</h4>
                      </div>

                      {/* Status Legend Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        {[
                          { id: 'todas', label: 'Todas (8)' },
                          { id: 'libres', label: 'Libres (3)' },
                          { id: 'ocupadas', label: 'Ocupadas (3)' },
                          { id: 'listas', label: '¡Platos Listos! (2)' },
                        ].map((flt) => (
                          <button
                            key={flt.id}
                            type="button"
                            onClick={() => setTableFilter(flt.id as any)}
                            className={`rounded-xl px-3 py-1 text-xs font-extrabold cursor-pointer transition ${
                              tableFilter === flt.id
                                ? 'bg-teal-800 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {flt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Table Cards Grid */}
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { id: 'mesa-01', num: '01', status: 'libre', pax: 2, mozo: '-', time: '-', total: '-' },
                        { id: 'mesa-02', num: '02', status: 'ocupada', pax: 4, mozo: 'Lucía R.', time: '14m', total: 'S/ 115.00' },
                        { id: 'mesa-03', num: '03', status: 'libre', pax: 4, mozo: '-', time: '-', total: '-' },
                        { id: 'mesa-04', num: '04', status: 'listo', pax: 4, mozo: 'Pedro C.', time: '08m', total: 'S/ 94.00' },
                        { id: 'mesa-05', num: '05', status: 'ocupada', pax: 4, mozo: 'Carlos M.', time: '05m', total: 'S/ 58.00' },
                        { id: 'mesa-06', num: '06', status: 'cuenta', pax: 6, mozo: 'Carlos M.', time: '42m', total: 'S/ 185.00' },
                        { id: 'mesa-07', num: '07', status: 'libre', pax: 6, mozo: '-', time: '-', total: '-' },
                        { id: 'mesa-08', num: '08', status: 'listo', pax: 2, mozo: 'Lucía R.', time: '12m', total: 'S/ 48.00' },
                      ].map((t) => {
                        const isSelected = selectedMockTable === t.id;
                        let borderClass = 'border-slate-200 bg-white hover:border-slate-300';
                        let badgeColor = 'bg-slate-100 text-slate-600';
                        let badgeText = 'Libre';

                        if (t.status === 'ocupada') {
                          borderClass = 'border-teal-300 bg-teal-50/40';
                          badgeColor = 'bg-teal-100 text-teal-800';
                          badgeText = 'En Cocina';
                        } else if (t.status === 'listo') {
                          borderClass = 'border-amber-400 bg-amber-50/70 ring-2 ring-amber-400/30';
                          badgeColor = 'bg-amber-400 text-slate-950 font-black';
                          badgeText = '¡Plato Listo!';
                        } else if (t.status === 'cuenta') {
                          borderClass = 'border-purple-300 bg-purple-50/60';
                          badgeColor = 'bg-purple-100 text-purple-800';
                          badgeText = 'Pide Cuenta';
                        } else if (t.status === 'libre') {
                          borderClass = 'border-emerald-200 bg-emerald-50/30';
                          badgeColor = 'bg-emerald-100 text-emerald-800';
                          badgeText = 'Disponible';
                        }

                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setSelectedMockTable(t.id);
                              triggerMockToast(`Mesa ${t.num} seleccionada`);
                            }}
                            className={`rounded-2xl border-2 p-3 text-left transition cursor-pointer relative ${borderClass} ${isSelected ? 'ring-2 ring-[#0c3130]' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <strong className="text-base font-black text-slate-900">Mesa {t.num}</strong>
                              <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase ${badgeColor}`}>
                                {badgeText}
                              </span>
                            </div>
                            <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                              <p className="font-semibold text-slate-700">{t.pax} comensales</p>
                              {t.mozo !== '-' && <p className="text-[10px] text-slate-500">Mozo: {t.mozo}</p>}
                              {t.total !== '-' && <strong className="block text-xs font-black text-[#0c3130] mt-1">{t.total}</strong>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detail Panel of Selected Table */}
                  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ffd06f]">
                      Detalle de Atención Rápida
                    </span>
                    <h4 className="text-xl font-black text-white">Mesa 04 (4 personas)</h4>

                    <div className="space-y-2 rounded-xl bg-white/10 p-3 text-xs text-teal-100 border border-white/10">
                      <div className="flex justify-between">
                        <span>Estado:</span>
                        <strong className="text-amber-300 font-black">🔔 1 plato listo en cocina</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Mozo responsable:</span>
                        <strong className="text-white">Pedro C.</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Tiempo sentado:</span>
                        <strong className="text-white">08 min</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Consumo acumulado:</span>
                        <strong className="text-[#ffd06f] font-black">S/ 94.00</strong>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={() => triggerMockToast('Mozo Pedro avisado para retirar plato')}
                        className="w-full rounded-xl bg-amber-400 py-3 text-xs font-extrabold text-[#0c3130] hover:bg-amber-300 cursor-pointer shadow-md"
                      >
                        Recoger Platos de Cocina
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerMockToast('Pre-cuenta generada para Mesa 04')}
                        className="w-full rounded-xl bg-white/15 py-3 text-xs font-extrabold text-white hover:bg-white/25 cursor-pointer"
                      >
                        Emitir Pre-Cuenta
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 4: PRE-CUENTA & COBRO RAPIDO                               */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'cobro' && (
                <div className="grid gap-8 lg:grid-cols-[450px_1fr] items-start">
                  {/* Bill / Checkout Terminal Mockup */}
                  <div className="rounded-3xl border border-slate-200 bg-[#fffdf9] p-5 text-slate-900 shadow-2xl">
                    <div className="border-b border-slate-200 pb-4 text-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-800">
                        ORDENA POS • Terminal de Caja
                      </span>
                      <h4 className="text-lg font-black text-slate-900 mt-0.5">Pre-Cuenta: Mesa 06 (Salón)</h4>
                      <p className="text-xs text-slate-500">Atendido por Carlos M. • 4 comensales</p>
                    </div>

                    {/* Receipt Items Breakdown */}
                    <div className="my-4 space-y-2 text-xs border-b border-slate-200 pb-3">
                      <div className="flex justify-between font-medium">
                        <span>2x Ceviche de Pescado (Personal)</span>
                        <span className="font-bold">S/ 40.00</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>1x Arroz con Mariscos Especial</span>
                        <span className="font-bold">S/ 42.00</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>1x Trío Marino Familiar</span>
                        <span className="font-bold">S/ 45.00</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>2x Jarra Chicha Morada (1L)</span>
                        <span className="font-bold">S/ 18.00</span>
                      </div>
                    </div>

                    {/* Subtotal, IGV & Propina */}
                    <div className="space-y-1.5 text-xs text-slate-600 border-b border-slate-200 pb-3">
                      <div className="flex justify-between">
                        <span>Subtotal Neto:</span>
                        <span>S/ {(baseBill / 1.18).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IGV (18%):</span>
                        <span>S/ ({(baseBill - baseBill / 1.18).toFixed(2)})</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Total Consumo:</span>
                        <span>S/ {baseBill.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Tip Selector */}
                    <div className="mt-3">
                      <span className="block text-[11px] font-extrabold text-slate-700 mb-1.5">
                        Propina Sugerida para el Mozo:
                      </span>
                      <div className="flex gap-2 text-xs">
                        {[0, 10, 15].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setSelectedTipPercent(pct)}
                            className={`flex-1 rounded-xl py-1.5 font-black border cursor-pointer ${
                              selectedTipPercent === pct
                                ? 'bg-teal-800 text-white border-teal-800'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {pct === 0 ? 'Sin Propina' : `${pct}% (+S/ ${(baseBill * pct / 100).toFixed(2)})`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Division of bill */}
                    <div className="mt-3 rounded-xl bg-slate-100 p-2.5 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Split size={14} /> Dividir Cuenta:
                      </span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 4].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setSplitCount(num)}
                            className={`h-7 px-2.5 rounded-lg text-xs font-black cursor-pointer ${
                              splitCount === num ? 'bg-teal-800 text-white' : 'bg-white text-slate-700'
                            }`}
                          >
                            {num === 1 ? '1 Solo Pago' : `Entre ${num}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Total Display */}
                    <div className="mt-4 rounded-2xl bg-[#0c3130] p-4 text-white text-center">
                      <span className="text-[11px] uppercase font-bold text-teal-300">
                        {splitCount > 1 ? `Total por Comensal (${splitCount} personas)` : 'Total Final a Cobrar'}
                      </span>
                      <div className="text-3xl font-black text-[#ffd06f]">
                        S/ {perPerson.toFixed(2)}
                      </div>
                      {splitCount > 1 && (
                        <p className="text-[11px] text-teal-200 mt-0.5">Total global de la mesa: S/ {totalBill.toFixed(2)}</p>
                      )}
                    </div>

                    {/* Payment methods */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('yape');
                          triggerMockToast('Cobro registrado vía Yape / Plin');
                        }}
                        className={`rounded-xl py-2 font-black cursor-pointer border text-center ${
                          paymentMethod === 'yape'
                            ? 'bg-purple-800 text-white border-purple-800'
                            : 'bg-white text-purple-950 border-slate-200'
                        }`}
                      >
                        📱 Yape / Plin
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('tarjeta');
                          triggerMockToast('Cobro registrado vía Tarjeta POS');
                        }}
                        className={`rounded-xl py-2 font-black cursor-pointer border text-center ${
                          paymentMethod === 'tarjeta'
                            ? 'bg-teal-800 text-white border-teal-800'
                            : 'bg-white text-slate-900 border-slate-200'
                        }`}
                      >
                        💳 Tarjeta POS
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('efectivo');
                          triggerMockToast('Cobro registrado en Efectivo');
                        }}
                        className={`rounded-xl py-2 font-black cursor-pointer border text-center ${
                          paymentMethod === 'efectivo'
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-white text-slate-900 border-slate-200'
                        }`}
                      >
                        💵 Efectivo
                      </button>
                    </div>

                    {/* Close table button */}
                    <button
                      type="button"
                      onClick={() => triggerMockToast('✅ Mesa 06 cobrada y liberada para el siguiente comensal')}
                      className="mt-3 w-full rounded-xl bg-[#e46d3f] py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#ca5b32] cursor-pointer shadow-md"
                    >
                      Cobrar y Liberar Mesa
                    </button>
                  </div>

                  {/* Highlights Cobro */}
                  <div className="space-y-4 text-teal-100">
                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-400" />
                        Cero Errores y Cuentas Claras
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-teal-100/90">
                        Cada plato enviado por los mozos queda registrado de forma inmutable en la orden de la mesa. Al momento de pedir la cuenta, la suma es instantánea, sin sorpresas ni ítems olvidados.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Split size={18} className="text-[#ffd06f]" />
                        División de Cuentas en Segundos
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-teal-100/90">
                        El mozo o cajero puede dividir la cuenta entre cualquier número de personas con un solo clic, permitiendo cobros mixtos (ej. dos pagan con Yape y dos con tarjeta).
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Receipt size={18} className="text-sky-300" />
                        Liberación Automática de Mesas
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-teal-100/90">
                        Al marcar el cobro como completado, la mesa cambia automáticamente a color verde &ldquo;Disponible&rdquo; en el mapa de mesas para recibir de inmediato al siguiente comensal.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 5: PANEL SAAS & MULTI-SEDE                                 */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'admin' && (
                <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
                  {/* Dashboard Mockup */}
                  <div className="rounded-3xl border border-white/15 bg-[#142928] p-5 text-white shadow-2xl space-y-5">
                    {/* Top Admin Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#ffd06f]">
                          Control Gerencial Centralizado
                        </span>
                        <h4 className="text-base font-black text-white">Consola SaaS • Restaurantes & Sedes</h4>
                      </div>

                      {/* Branch Switcher in mockup */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-teal-200">Sede Activa:</span>
                        <select
                          value={selectedBranch}
                          onChange={(e) => {
                            setSelectedBranch(e.target.value as any);
                            triggerMockToast(`Cambiaste a la ${e.target.value === 'miraflores' ? 'Sede Miraflores' : 'Sede San Isidro'}`);
                          }}
                          className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white border border-white/20 cursor-pointer focus:outline-none"
                        >
                          <option value="miraflores" className="text-slate-900">Sede Miraflores (Principal)</option>
                          <option value="san-isidro" className="text-slate-900">Sede San Isidro (Sucursal)</option>
                        </select>
                      </div>
                    </div>

                    {/* Key Metric Tiles */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
                        <span className="text-[10px] font-bold text-teal-300 uppercase">Venta del Día</span>
                        <strong className="block text-xl font-black text-[#ffd06f] mt-1">
                          {selectedBranch === 'miraflores' ? 'S/ 4,820.50' : 'S/ 3,190.00'}
                        </strong>
                        <small className="text-[10px] text-emerald-400 font-bold">+18% vs semana pasada</small>
                      </div>

                      <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
                        <span className="text-[10px] font-bold text-teal-300 uppercase">Mesas Atendidas</span>
                        <strong className="block text-xl font-black text-white mt-1">
                          {selectedBranch === 'miraflores' ? '46 mesas' : '31 mesas'}
                        </strong>
                        <small className="text-[10px] text-teal-200 font-bold">100% cobradas</small>
                      </div>

                      <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
                        <span className="text-[10px] font-bold text-teal-300 uppercase">Tiempo Medio KDS</span>
                        <strong className="block text-xl font-black text-emerald-400 mt-1">
                          11 min 20s
                        </strong>
                        <small className="text-[10px] text-teal-200 font-bold">Objetivo: &lt; 15 min</small>
                      </div>

                      <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
                        <span className="text-[10px] font-bold text-teal-300 uppercase">Ticket Promedio</span>
                        <strong className="block text-xl font-black text-white mt-1">
                          {selectedBranch === 'miraflores' ? 'S/ 104.80' : 'S/ 102.90'}
                        </strong>
                        <small className="text-[10px] text-teal-200 font-bold">Por mesa</small>
                      </div>
                    </div>

                    {/* Real-time Stock Disabler (Pausar plato agotado) */}
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                            <SlidersHorizontal size={14} className="text-[#ffd06f]" />
                            Disponibilidad Inmediata de Carta por Sede
                          </h5>
                          <p className="text-[11px] text-teal-200">
                            Pausa platos cuando se agote un insumo para que ningún mozo pueda ofrecerlo.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between rounded-xl bg-white/5 p-2.5">
                          <div>
                            <strong className="text-white">Ceviche Clásico de Pescado</strong>
                            <span className="block text-[10px] text-teal-300">En carta • S/ 20.00</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCevichePaused(!isCevichePaused);
                              triggerMockToast(isCevichePaused ? 'Ceviche reactivado en carta' : 'Ceviche pausado por falta de insumo');
                            }}
                            className={`rounded-xl px-3 py-1 font-bold text-xs cursor-pointer transition ${
                              isCevichePaused
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isCevichePaused ? 'PAUSADO (Agotado)' : 'DISPONIBLE ✓'}
                          </button>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-white/5 p-2.5">
                          <div>
                            <strong className="text-white">Langostinos Jumbo al Ajo</strong>
                            <span className="block text-[10px] text-amber-300">Insumo agotado en lonja</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsLangostinosPaused(!isLangostinosPaused);
                              triggerMockToast(!isLangostinosPaused ? 'Langostinos pausados' : 'Langostinos reactivados');
                            }}
                            className={`rounded-xl px-3 py-1 font-bold text-xs cursor-pointer transition ${
                              isLangostinosPaused
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isLangostinosPaused ? 'PAUSADO (Agotado)' : 'DISPONIBLE ✓'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Details Column */}
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <div className="flex items-center gap-2 text-[#ffd06f] font-black text-sm">
                        <Store size={16} /> Cartas Maestras & Sedes Independientes
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-teal-100/90">
                        Crea una carta centralizada y asígnala a una o múltiples sedes, permitiendo precios diferenciados y disponibilidad según el stock real de cada local.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <div className="flex items-center gap-2 text-teal-300 font-black text-sm">
                        <Users size={16} /> Control de Personal por PIN Rápido
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-teal-100/90">
                        Cada mesero, cocinero y cajero ingresa con su PIN personal de 6 dígitos. Podrás saber con total exactitud quién tomó cada comanda, quién cobró y cuánto vendió cada turno.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
                      <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
                        <TrendingUp size={16} /> Cierres de Turno sin Descuadres
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-teal-100/90">
                        Reporte automático de ventas por método de pago: efectivo, Yape, Plin y tarjetas POS, eliminando horas de cuadres manuales al final de la jornada.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS SECTION (EL VIAJE DE UNA ORDEN)                             */}
        {/* ========================================================================= */}
        <section id="flujo" className="px-5 py-24 sm:px-8 bg-[#fffdf9]">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#e46d3f]">
                Paso a Paso
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#102f2e] sm:text-5xl">
                El viaje de una comanda con ORDENA: Cero papel, cero fricción.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Descubre cómo un pedido viaja desde que el comensal entra al salón hasta que se despacha el último plato y se cuadra la caja, todo en menos de un segundo de latencia.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-5">
              {[
                {
                  step: '01',
                  time: 'Minuto 0',
                  icon: LayoutGrid,
                  title: 'Asignación de Mesa',
                  desc: 'El mozo o anfitrión abre la mesa con un toque en el mapa visual. El salón queda enterado de la ocupación al instante.'
                },
                {
                  step: '02',
                  time: 'Minuto 2',
                  icon: Smartphone,
                  title: 'Toma del Pedido',
                  desc: 'El mozo añade platos, porciones y notas especiales en su teléfono. Las bebidas se envían de inmediato para no hacer esperar al cliente.'
                },
                {
                  step: '03',
                  time: 'Minuto 2.1s',
                  icon: ChefHat,
                  title: 'Enrutamiento KDS',
                  desc: 'La comanda aparece en el monitor de cocina separada por estaciones: fríos a cevichería, calientes a fogones y cócteles a barra.'
                },
                {
                  step: '04',
                  time: 'Minuto 12',
                  icon: Bell,
                  title: 'Aviso & Servicio',
                  desc: 'El cocinero toca "Listo". El mozo recibe un aviso con sonido y vibración en su móvil para recoger y servir la comida caliente.'
                },
                {
                  step: '05',
                  time: 'Minuto 45',
                  icon: Receipt,
                  title: 'Pre-Cuenta y Cuadre',
                  desc: 'Pre-cuenta instantánea, división automática entre los comensales, pago con Yape/tarjeta y liberación inmediata de la mesa.'
                }
              ].map((flow) => {
                const Icon = flow.icon;
                return (
                  <div
                    key={flow.step}
                    className="relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#e46d3f]">{flow.step}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600">
                        {flow.time}
                      </span>
                    </div>
                    <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0c3130] text-[#ffd06f]">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-[#102f2e]">{flow.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{flow.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BEFORE VS AFTER (COMPARATIVA OPERATIVA)                                   */}
        {/* ========================================================================= */}
        <section id="comparativa" className="border-t border-slate-200/80 bg-[#fbf9f4] px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-teal-800">
                Transformación Digital
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#102f2e] sm:text-4xl">
                ¿Qué cambia realmente en tu restaurante con ORDENA?
              </h2>
              <p className="mt-4 text-base text-slate-600">
                Compara el día a día tradicional frente a la fluidez de un restaurante conectado en tiempo real.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {/* Traditional Way */}
              <div className="rounded-3xl border border-rose-200/80 bg-rose-50/30 p-8">
                <div className="flex items-center gap-3 pb-6 border-b border-rose-200/60">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                    <X size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-rose-950">El Método Tradicional (o con sistemas lentos)</h3>
                    <p className="text-xs text-rose-700/80">Comandas en papel, caminatas y demoras</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-xs sm:text-sm text-rose-950">
                  <div className="flex items-start gap-3">
                    <span className="font-black text-rose-600 text-base mt-0.5">✕</span>
                    <p>
                      <strong>Comandas ilegibles o manchadas:</strong> La cocina no entiende la letra del mozo o se pierden notas como &ldquo;sin sal&rdquo; o &ldquo;sin mariscos&rdquo;.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-black text-rose-600 text-base mt-0.5">✕</span>
                    <p>
                      <strong>Mozos perdiendo tiempo caminando:</strong> Tienen que ir físicamente a la cocina a dejar el papel y luego regresar a la barra para los tragos.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-black text-rose-600 text-base mt-0.5">✕</span>
                    <p>
                      <strong>Platos fríos en el pase:</strong> La comida sale pero el mozo está ocupado y nadie le avisa; el comensal recibe su comida fría.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-black text-rose-600 text-base mt-0.5">✕</span>
                    <p>
                      <strong>Cuentas demoradas y reclamos:</strong> Cuando el cliente pide la cuenta, esperar 10 minutos a que sumen boletas genera fricción al despedirse.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-black text-rose-600 text-base mt-0.5">✕</span>
                    <p>
                      <strong>Se siguen vendiendo platos agotados:</strong> La cocina se queda sin insumos pero los mozos siguen ofreciéndolo porque nadie les avisó.
                    </p>
                  </div>
                </div>
              </div>

              {/* ORDENA Cloud Way */}
              <div className="rounded-3xl border border-teal-300 bg-gradient-to-br from-white to-teal-50/50 p-8 shadow-lg">
                <div className="flex items-center gap-3 pb-6 border-b border-teal-200/80">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c3130] text-[#ffd06f]">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#102f2e]">Con ORDENA Restaurant Cloud</h3>
                    <p className="text-xs text-teal-800">Sincronización digital en menos de 1 segundo</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-800">
                  <div className="flex items-start gap-3">
                    <span className="font-black text-emerald-600 text-base mt-0.5">✓</span>
                    <p>
                      <strong>Comandas claras y precisas:</strong> Términos, porciones y notas especiales destacadas en pantalla táctil con semáforo de tiempo.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-black text-emerald-600 text-base mt-0.5">✓</span>
                    <p>
                      <strong>El mozo no abandona el salón:</strong> Pide desde la mesa y el pedido se divide automáticamente a barra y cocina al instante.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-black text-emerald-600 text-base mt-0.5">✓</span>
                    <p>
                      <strong>Alerta sonora inmediata &ldquo;Plato Listo&rdquo;:</strong> Cocina avisa con un toque y el mozo retira el plato en el momento exacto.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-black text-emerald-600 text-base mt-0.5">✓</span>
                    <p>
                      <strong>Pre-cuenta y cobro al toque:</strong> Emisión de cuenta en 1 segundo, división equitativa y cobro con Yape, Plin o POS.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-black text-emerald-600 text-base mt-0.5">✓</span>
                    <p>
                      <strong>Pausa de platos agotados en vivo:</strong> Con un switch en el panel se bloquea el plato en todas las comanderas al instante.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MODULES SECTION (DETALLE DE LOS MÓDULOS)                                   */}
        {/* ========================================================================= */}
        <section id="modulos" className="bg-[#103b39] px-5 py-24 text-white sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#ffd06f]">
                Suite Completa Integrada
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
                Todo lo que tu operación necesita, perfectamente sincronizado.
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-teal-100 max-w-2xl">
                Cada área cuenta con una vista especializada y libre de distracciones. Sin software pesado, sin instalaciones complejas.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1: Comandera Móvil */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition hover:bg-white/[0.09]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd06f] text-[#103b39] font-black shadow-md">
                  <Smartphone size={24} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white">Comandera Móvil para Mozos</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-teal-100/90">
                  Toma pedidos en mesa desde cualquier teléfono o tablet. Añade notas específicas, términos de cocción y preferencias con interfaz táctil ultra-rápida.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-teal-200">
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Portabilidad total</span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Notas de alergias</span>
                </div>
              </div>

              {/* Feature 2: Cocina KDS */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition hover:bg-white/[0.09]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-[#103b39] font-black shadow-md">
                  <ChefHat size={24} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white">KDS Pantalla de Cocina</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-teal-100/90">
                  Comandas digitales ordenadas por orden de llegada (FIFO) y partidas. Semáforo visual para evitar retrasos y aviso instantáneo al mozo cuando un plato sale de cocina.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-teal-200">
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Cronómetro visual</span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Aviso sonoro</span>
                </div>
              </div>

              {/* Feature 3: Mapa de Mesas */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition hover:bg-white/[0.09]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e46d3f] text-white font-black shadow-md">
                  <LayoutGrid size={24} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white">Salón & Mapa de Mesas</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-teal-100/90">
                  Visualiza el estado de cada mesa en tiempo real: libre, ocupada, comanda en cocina o pidiendo cuenta. Reasignación de mozos y cambio de mesas con un solo toque.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-teal-200">
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Estados en tiempo real</span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Gestión de tiempos</span>
                </div>
              </div>

              {/* Feature 4: Bandeja de Bebidas */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition hover:bg-white/[0.09]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-[#103b39] font-black shadow-md">
                  <Wine size={24} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white">Bandeja de Bebidas & Bar</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-teal-100/90">
                  Control dedicado para despachar bebidas inmediatamente. Cero cócteles olvidados en barra y registro transparente de quién sirvió cada orden.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-teal-200">
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Despacho en barra</span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Control de botellas</span>
                </div>
              </div>

              {/* Feature 5: Cartas y Sedes */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition hover:bg-white/[0.09]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-300 text-[#103b39] font-black shadow-md">
                  <Layers size={24} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white">Cartas Maestras & Sedes</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-teal-100/90">
                  Administra cartas centrales con precios y disponibilidad por sede. Pausa platos agotados al instante para evitar decepciones en el cliente.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-teal-200">
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Multi-sucursal</span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Pausa de stock instantánea</span>
                </div>
              </div>

              {/* Feature 6: Facturación y Auditoría */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition hover:bg-white/[0.09]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-[#103b39] font-black shadow-md">
                  <BarChart3 size={24} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white">Cuentas, Cobro & Cierre</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-teal-100/90">
                  División de cuentas ágil, emisión de pre-cuentas y control de métodos de pago (efectivo, tarjetas, transferencias). Cuadre de caja sin discrepancias.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-teal-200">
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Yape / Plin / POS</span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5">Cierre de caja en 1 clic</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECURITY & ROLES SECTION (DOBLE AUTENTICACION Y ROLES)                    */}
        {/* ========================================================================= */}
        <section id="roles" className="border-t border-slate-200/80 bg-[#fffdf9] px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-teal-800">
                  Seguridad Operativa
                </span>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#102f2e] sm:text-4xl">
                  Acceso por PIN táctil para el personal y credenciales para administradores.
                </h2>
                <p className="mt-4 text-base text-slate-600 leading-relaxed">
                  En el ritmo frenético del restaurante, el personal no tiene tiempo para escribir correos y contraseñas largas. Por eso creamos una arquitectura de autenticación de doble nivel.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800 font-black">
                      <Lock size={18} />
                    </div>
                    <div>
                      <strong className="text-sm font-black text-slate-900">PIN Táctil de 6 Dígitos para Salón y Cocina</strong>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        Los mozos, azafatas, cocineros y baristas desbloquean su terminal en un segundo con su PIN numérico. Al terminar la comanda, el equipo puede auto-bloquearse para evitar confusiones.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 font-black">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <strong className="text-sm font-black text-slate-900">Usuario y Contraseña para Administradores</strong>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        Los administradores de sede y los dueños de cadenas cuentan con acceso seguro por contraseña para configurar precios, personal, informes financieros y cartas maestras.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-800 font-black">
                      <Store size={18} />
                    </div>
                    <div>
                      <strong className="text-sm font-black text-slate-900">Aislamiento por Restaurante y Sede</strong>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        Cada cadena cuenta con su propio enlace directo (ej. <code>/la-barra</code>) para que su personal ingrese directamente sin ver la información de otros locales.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual PIN Screen Mockup */}
              <div className="rounded-3xl border border-slate-200 bg-[#0c3130] p-7 text-white shadow-2xl">
                <div className="text-center pb-4 border-b border-white/10">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd06f] text-[#0c3130] font-black shadow-lg">
                    <Lock size={22} />
                  </div>
                  <h3 className="mt-3 text-lg font-black">Terminal de Servicio Rápido</h3>
                  <p className="text-xs text-teal-200">Ingresa tu PIN de 6 dígitos</p>
                </div>

                {/* PIN dots */}
                <div className="my-6 flex justify-center gap-3">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <div
                      key={idx}
                      className={`h-4 w-4 rounded-full border-2 transition ${
                        idx < 4 ? 'bg-[#ffd06f] border-[#ffd06f]' : 'border-white/30 bg-white/5'
                      }`}
                    />
                  ))}
                </div>

                {/* Numeric Keypad Simulation */}
                <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map((keyVal) => (
                    <button
                      key={String(keyVal)}
                      type="button"
                      onClick={() => triggerMockToast(`Tecla ${keyVal} presionada en el teclado PIN`)}
                      className="flex h-12 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-white hover:bg-white/20 active:bg-[#ffd06f] active:text-[#0c3130] transition cursor-pointer"
                    >
                      {keyVal}
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-white/5 p-3 text-center border border-white/10">
                  <span className="text-[11px] text-teal-200 font-semibold">
                    Acceso autorizado al instante sin demoras
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FAQ SECTION (PREGUNTAS FRECUENTES)                                        */}
        {/* ========================================================================= */}
        <section id="faq" className="border-t border-slate-200/80 bg-[#fbf9f4] px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#e46d3f]">
                Dudas Comunes
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#102f2e] sm:text-4xl">
                Preguntas Frecuentes sobre ORDENA
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                Todo lo que necesitas saber antes de modernizar la atención de tu restaurante.
              </p>
            </div>

            <div className="mt-12 space-y-3">
              {[
                {
                  q: '¿Necesito comprar servidores o equipos caros para usar ORDENA?',
                  a: 'No. ORDENA funciona 100% en la nube a través de cualquier navegador moderno. Puedes usar los teléfonos inteligentes de tus mozos (Android o iOS), tablets económicas para el salón y pantallas de TV o monitores para la cocina.'
                },
                {
                  q: '¿Qué tan rápido se refleja una orden en la cocina?',
                  a: 'Menos de medio segundo (< 0.5s). Gracias a nuestra arquitectura sincronizada con Firebase Realtime Database, en cuanto el mozo presiona "Enviar Comanda", el ticket aparece al instante con sonido y alerta en la pantalla KDS de la cocina.'
                },
                {
                  q: '¿Qué ocurre si se corta la conexión a internet temporalmente?',
                  a: 'El aplicativo cuenta con caché local inteligente. Las comandas activas se mantienen en pantalla y, en cuanto la señal se restablece, el sistema sincroniza automáticamente todos los tickets y estados con el servidor central sin pérdida de información.'
                },
                {
                  q: '¿Puedo manejar varias sedes con cartas y precios diferentes?',
                  a: 'Sí. ORDENA está concebido como una plataforma SaaS multi-sede. Puedes tener una Carta Maestra centralizada y ajustar precios, platos disponibles o promociones específicas para cada sucursal.'
                },
                {
                  q: '¿Cuánto tiempo tarda capacitar al personal del restaurante?',
                  a: 'Menos de 15 minutos. Las interfaces han sido diseñadas pensando en la usabilidad del personal de gastronomía: botones grandes táctiles, fotos de platos, semáforo de colores intuitivo y teclado numérico de PIN rápido.'
                }
              ].map((item, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs transition"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-extrabold text-slate-900 cursor-pointer hover:bg-slate-50 transition"
                    >
                      <span className="text-sm sm:text-base flex items-center gap-3">
                        <HelpCircle size={18} className="text-teal-700 shrink-0" />
                        {item.q}
                      </span>
                      <span className="text-slate-400 shrink-0 ml-2">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CALL TO ACTION SECTION                                                    */}
        {/* ========================================================================= */}
        <section id="contacto" className="px-5 py-20 sm:px-8 bg-[#fffdf9]">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl bg-[#0c3130] p-8 text-white sm:flex-row sm:items-center sm:p-14 border border-teal-800 shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute right-0 top-0 -z-0 h-64 w-64 rounded-full bg-[#ffd06f]/10 blur-3xl pointer-events-none" />

            <div className="max-w-2xl relative z-10">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#ffd06f]">
                ORDENA • Sistema de gestión para restaurantes y cadenas
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Lleva la operación de tu restaurante al siguiente nivel hoy mismo.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-teal-100/90 leading-relaxed">
                Ingresa al sistema para gestionar comandas, cocina, mesas y facturación con total sincronización y sin papel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#ffd06f] px-8 text-sm font-black text-[#0c3130] shadow-xl transition hover:bg-[#f3c25b] active:scale-98 cursor-pointer"
              >
                <Lock size={18} />
                <span>Acceder al Sistema</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-[#faf8f4] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <img
              src="/ordena-logo.png"
              alt="ORDENA"
              className="h-8 w-8 rounded-xl object-cover shadow-xs"
            />
            <div>
              <strong className="block font-black text-slate-800 text-sm">ORDENA</strong>
              <span className="text-[11px] text-slate-500">Sistema de gestión para restaurantes y cadenas</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600 font-bold">
            <button type="button" onClick={() => scrollTo('pantallas')} className="hover:text-teal-900 cursor-pointer">
              Pantallas
            </button>
            <button type="button" onClick={() => scrollTo('flujo')} className="hover:text-teal-900 cursor-pointer">
              Flujo
            </button>
            <button type="button" onClick={() => scrollTo('modulos')} className="hover:text-teal-900 cursor-pointer">
              Módulos
            </button>
            <button type="button" onClick={() => scrollTo('faq')} className="hover:text-teal-900 cursor-pointer">
              Preguntas
            </button>
            <button type="button" onClick={onOpenLogin} className="text-teal-800 hover:text-teal-950 cursor-pointer flex items-center gap-1">
              <Lock size={12} /> Acceso Personal
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl mt-6 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>© 2026 ORDENA Cloud. Todos los derechos reservados.</span>
          <span className="flex items-center gap-1 text-teal-800 font-semibold">
            <Check size={13} className="text-teal-700" /> Latencia ultrabaja &lt; 0.5s en tiempo real
          </span>
        </div>
      </footer>
    </div>
  );
};
