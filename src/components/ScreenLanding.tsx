import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChefHat,
  Clock3,
  Flame,
  Layers,
  LayoutGrid,
  Lock,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
  Wine,
  Zap
} from 'lucide-react';

interface ScreenLandingProps {
  onOpenLogin: () => void;
}

export const ScreenLanding: React.FC<ScreenLandingProps> = ({ onOpenLogin }) => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffdf9] text-slate-900 font-sans selection:bg-teal-700/20 selection:text-teal-950">
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
              <small className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-teal-700">
                Restaurant Cloud
              </small>
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 md:flex">
            <button
              type="button"
              onClick={() => scrollTo('modulos')}
              className="hover:text-teal-800 transition cursor-pointer"
            >
              Módulos
            </button>
            <button
              type="button"
              onClick={() => scrollTo('beneficios')}
              className="hover:text-teal-800 transition cursor-pointer"
            >
              Beneficios
            </button>
            <button
              type="button"
              onClick={() => scrollTo('operacion')}
              className="hover:text-teal-800 transition cursor-pointer"
            >
              Cómo Funciona
            </button>
            <button
              type="button"
              onClick={() => scrollTo('contacto')}
              className="hover:text-teal-800 transition cursor-pointer"
            >
              Contacto
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
              <span className="sm:hidden">Login</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="inicio">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-20">
          <div className="absolute left-1/2 top-0 -z-10 h-[580px] w-[960px] -translate-x-1/2 rounded-full bg-[#ffd06f]/25 blur-3xl pointer-events-none" />
          <div className="absolute right-0 top-1/3 -z-10 h-[400px] w-[500px] rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-800/15 bg-white px-3.5 py-1.5 text-xs font-black text-teal-900 shadow-xs">
                <Sparkles size={14} className="text-teal-700" />
                <span>ORDENA • Sistema Integral para Restaurantes</span>
              </div>

              <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.055em] text-[#102f2e] sm:text-6xl">
                Control total de tu restaurante, desde la mesa hasta la cocina.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                <strong>ORDENA</strong> conecta la comandera móvil de los mozos, la pantalla KDS de cocina en tiempo real, el mapa de mesas y la facturación en una sola plataforma fluida y sin papel.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollTo('modulos')}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#e46d3f] px-6 text-sm font-extrabold text-white shadow-lg shadow-orange-900/15 transition hover:bg-[#ca5b32] cursor-pointer"
                >
                  <span>Explorar Módulos</span>
                  <ArrowRight size={17} />
                </button>
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-900/15 bg-white px-6 text-sm font-extrabold text-[#102f2e] shadow-xs transition hover:border-teal-800/40 hover:bg-slate-50 cursor-pointer"
                >
                  <Lock size={16} className="text-teal-800" />
                  <span>Acceso al Sistema</span>
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200/80 pt-6 text-slate-600">
                <div>
                  <strong className="block text-2xl font-black text-[#102f2e]">+35%</strong>
                  <span className="text-xs font-semibold text-slate-500 leading-tight block">Rotación de mesas</span>
                </div>
                <div>
                  <strong className="block text-2xl font-black text-[#102f2e]">&lt; 1s</strong>
                  <span className="text-xs font-semibold text-slate-500 leading-tight block">Comandas a cocina</span>
                </div>
                <div>
                  <strong className="block text-2xl font-black text-[#102f2e]">100%</strong>
                  <span className="text-xs font-semibold text-slate-500 leading-tight block">Operación en nube</span>
                </div>
              </div>
            </div>

            {/* Live Interactive Mockup Showcase */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#103b39] p-4 shadow-2xl shadow-teal-950/20 sm:p-6 text-white">
                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-[#ffd06f]">
                      <ChefHat size={18} />
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-white">ORDENA Live KDS</h4>
                      <p className="text-[10px] text-teal-200">Servicio en vivo • Salón & Cocina</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-400/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    SINCRONIZADO
                  </span>
                </div>

                {/* Mockup Table / Ticket Card */}
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-[#fffdf9] p-4 text-slate-900 shadow-md">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-teal-800">
                          Comanda #104 • Salón
                        </span>
                        <h4 className="text-base font-black text-slate-900">Mesa 04 (4 personas)</h4>
                      </div>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-extrabold text-amber-800 flex items-center gap-1">
                        <Clock3 size={13} />
                        06m 12s
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-medium">
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-teal-50 text-teal-800 font-bold text-[11px] flex items-center justify-center">2</span>
                          Plato Principal Especial
                        </span>
                        <span className="font-extrabold text-teal-800">Cocina Caliente</span>
                      </div>
                      <div className="flex items-center justify-between font-medium">
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-teal-50 text-teal-800 font-bold text-[11px] flex items-center justify-center">1</span>
                          Entrada Gourmet Marina
                        </span>
                        <span className="font-extrabold text-amber-700">En Preparación</span>
                      </div>
                      <div className="flex items-center justify-between font-medium">
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-orange-50 text-orange-800 font-bold text-[11px] flex items-center justify-center">2</span>
                          Bebidas Naturales de la Casa
                        </span>
                        <span className="font-extrabold text-emerald-700">Listo en Barra ✓</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[10px] font-bold text-slate-400">PEDIDOS</p>
                        <strong className="text-sm font-black text-slate-800">24</strong>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[10px] font-bold text-slate-400">TIEMPO MEDIO</p>
                        <strong className="text-sm font-black text-teal-800">11m</strong>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <p className="text-[10px] font-bold text-slate-400">MESAS</p>
                        <strong className="text-sm font-black text-slate-800">12 / 16</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating micro-badges */}
                <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 font-bold text-teal-100 border border-white/10">
                    <Zap size={13} className="text-[#ffd06f]" />
                    Despacho automático a cocina y barra
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 font-bold text-teal-100 border border-white/10">
                    <Check size={13} className="text-emerald-400" />
                    Cuentas claras y sin errores de cobro
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section id="modulos" className="bg-[#103b39] px-5 py-24 text-white sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#ffd06f]">
                Módulos Especializados
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
                Todo lo que tu restaurante necesita, perfectamente conectado.
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-teal-100 max-w-2xl">
                Cada área de tu negocio comparte información al segundo. Mozo, cocina, caja y administración trabajan en una sola sintonía.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1: Comandera Móvil */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition hover:bg-white/[0.09]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd06f] text-[#103b39] font-black shadow-md">
                  <Smartphone size={24} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white">Comandera Móvil</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-teal-100/90">
                  Toma pedidos directo en mesa desde cualquier teléfono o tablet. Añade notas específicas, términos y preferencias del cliente con interfaz táctil ultra-rápida.
                </p>
              </div>

              {/* Feature 2: Cocina KDS */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition hover:bg-white/[0.09]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-[#103b39] font-black shadow-md">
                  <ChefHat size={24} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white">KDS Pantalla de Cocina</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-teal-100/90">
                  Comandas digitales ordenadas por tiempo de espera y partidas. Semáforo visual para evitar retrasos y aviso instantáneo al mozo cuando un plato sale de cocina.
                </p>
              </div>

              {/* Feature 3: Mapa de Mesas */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition hover:bg-white/[0.09]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e46d3f] text-white font-black shadow-md">
                  <LayoutGrid size={24} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white">Salón & Mapa de Mesas</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-teal-100/90">
                  Visualiza el estado de cada mesa en tiempo real: libre, ocupada, comanda en cocina o pidiendo cuenta. Cambios y unión de mesas con un solo toque.
                </p>
              </div>

              {/* Feature 4: Bandeja de Bebidas */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition hover:bg-white/[0.09]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-[#103b39] font-black shadow-md">
                  <Wine size={24} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-white">Bandeja de Bebidas</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-teal-100/90">
                  Control dedicado para despachar bebidas inmediatamente. Cero bebidas olvidadas y registro de quién sirvió cada orden.
                </p>
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
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="beneficios" className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                  Impacto Inmediato
                </span>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#102f2e] sm:text-4xl">
                  Diseñado para restaurantes que no pueden detenerse ni un minuto.
                </h2>
                <p className="mt-4 text-base text-slate-600 leading-relaxed">
                  En horas pico, cada segundo cuenta. ORDENA elimina las caminatas innecesarias de los mozos, los gritos a cocina y los errores al cobrar.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    {
                      title: 'Cero comandas extraviadas o ilegibles',
                      desc: 'Las notas llegan directo a la pantalla correcta con especificaciones claras.'
                    },
                    {
                      title: 'Atención más rápida y clientes satisfechos',
                      desc: 'Los mozos pasan más tiempo atendiendo al comensal y menos tiempo esperando en la barra.'
                    },
                    {
                      title: 'Seguridad basada en roles y PIN rápido',
                      desc: 'PIN de 6 dígitos para salón y cocina; usuario y contraseña para todos los administradores.'
                    },
                    {
                      title: 'Acceso en la nube desde cualquier equipo',
                      desc: 'Sin servidores locales costosos ni mantenimiento complejo. Funciona en tablets, teléfonos y laptops.'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-black text-xs mt-0.5">
                        ✓
                      </span>
                      <div>
                        <strong className="block text-sm font-extrabold text-slate-900">{item.title}</strong>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-[#fff8ee] p-8 shadow-xl">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-200/60">
                  <div className="h-10 w-10 rounded-xl bg-[#0c3130] text-[#ffd06f] flex items-center justify-center">
                    <Flame size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Eficiencia Comprobada</h3>
                    <p className="text-xs text-slate-500">Métricas reales en el servicio</p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Velocidad de despacho a cocina</span>
                      <span className="text-teal-800">Inmediato (&lt; 1s)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-teal-700 rounded-full w-[95%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Exactitud en cuentas y pedidos</span>
                      <span className="text-teal-800">99.8%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-[#e46d3f] rounded-full w-[99%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Rotación y liberación de mesas</span>
                      <span className="text-teal-800">+35% agilidad</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-[#ffd06f] rounded-full w-[85%]"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-teal-50 border border-teal-200/70 p-4 text-xs text-teal-950 flex items-start gap-2.5">
                  <ShieldCheck size={18} className="text-teal-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Administración Centralizada:</strong> Los restaurantes clientes, sedes y cartas maestras se administran de manera aislada y segura desde la consola del Administrador Global.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="operacion" className="bg-[#fffdf9] border-t border-slate-200/80 px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-teal-800">
                Flujo Operativo
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#102f2e] sm:text-4xl">
                Simple para el equipo. Impecable para el comensal.
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Toma el Pedido',
                  desc: 'El mozo registra los platos y bebidas en la mesa desde su comandera móvil. Las preferencias quedan registradas al detalle.'
                },
                {
                  step: '02',
                  title: 'Cocina & Barra Preparan',
                  desc: 'La comanda aparece en pantalla KDS al instante dividida por partidas (frío, caliente, barra) con tiempos controlados.'
                },
                {
                  step: '03',
                  title: 'Sirve, Cobra y Libera',
                  desc: 'La cocina avisa plato listo con un toque. El mozo entrega a tiempo, emite la pre-cuenta y libera la mesa para el siguiente cliente.'
                }
              ].map((flow) => (
                <div key={flow.step} className="border-t-2 border-teal-800 pt-6">
                  <span className="text-sm font-black text-orange-600">{flow.step}</span>
                  <h3 className="mt-3 text-xl font-extrabold text-[#102f2e]">{flow.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{flow.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="contacto" className="px-5 pb-24 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl bg-[#f7e7c2] p-8 sm:flex-row sm:items-center sm:p-14 border border-[#ecd299]">
            <div className="max-w-2xl">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-orange-800">
                ORDENA Restaurant Cloud
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#102f2e] sm:text-4xl">
                La hospitalidad es tu arte. La sincronización es de ORDENA.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-700">
                Ingresa a la plataforma para gestionar tu operación y brindar un servicio impecable.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenLogin}
              className="shrink-0 inline-flex h-14 items-center gap-3 rounded-2xl bg-[#0c3130] px-7 text-sm font-extrabold text-white shadow-xl shadow-teal-950/20 transition hover:bg-[#124946] active:scale-98 cursor-pointer"
            >
              <Lock size={18} className="text-[#ffd06f]" />
              <span>Acceder al Sistema</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-[#faf8f4] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-slate-500 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <img
              src="/ordena-logo.png"
              alt="ORDENA"
              className="h-7 w-7 rounded-lg object-cover shadow-xs"
            />
            <span className="font-bold text-slate-700">ORDENA Restaurant Cloud</span>
            <span>•</span>
            <span>© 2026 Todos los derechos reservados</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-teal-800">
              <Check size={14} /> Sincronización en la nube en tiempo real
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

