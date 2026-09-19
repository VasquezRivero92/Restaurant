import React from 'react';
import { ArrowRight, Banknote, ChefHat, CircleAlert, Clock3, MapPin, Store, TrendingUp, Users } from 'lucide-react';
import { AdminUser, ChainBrand, KDSTicket, ScreenType, TableItem } from '../types';

interface ScreenAdminDashboardProps {
  admin: AdminUser;
  chain: ChainBrand;
  activeBranchId: string;
  tables: TableItem[];
  tickets: KDSTicket[];
  onSelectBranch: (branchId: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ScreenAdminDashboard: React.FC<ScreenAdminDashboardProps> = ({ admin, chain, activeBranchId, tables, tickets, onSelectBranch, onNavigate }) => {
  const assignedIds = admin.roleKey === 'admin_general' || admin.roleKey === 'admin_global'
    ? chain.locations.map((location) => location.id)
    : (admin.assignedBranchIds?.length ? admin.assignedBranchIds : admin.branchId ? [admin.branchId] : []);
  const branches = chain.locations.filter((location) => assignedIds.includes(location.id));
  const activeBranch = branches.find((branch) => branch.id === activeBranchId) || branches[0];
  const visibleTables = tables.filter((table) => !table.branchId || table.branchId === activeBranch?.id);
  const visibleTickets = tickets.filter((ticket) => !ticket.branchId || ticket.branchId === activeBranch?.id);
  const occupied = visibleTables.filter((table) => table.status !== 'free').length;
  const pending = visibleTickets.filter((ticket) => ticket.status !== 'served').length;
  const bills = visibleTables.filter((table) => table.status === 'bill_requested').length;
  const totalSales = branches.reduce((sum, branch) => sum + Number(branch.todaySales || 0), 0);

  if (!activeBranch) {
    return <div className="flex flex-1 items-center justify-center p-8"><div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center"><CircleAlert className="mx-auto text-amber-700" /><h2 className="mt-3 font-extrabold">Sin sedes asignadas</h2><p className="mt-2 text-sm text-slate-600">Un administrador general debe asignar al menos una sede a esta cuenta.</p></div></div>;
  }

  return (
    <div className="flex-1 bg-[#fffdf9] px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-orange-600">Resumen administrativo</p><h1 className="mt-2 text-3xl font-black tracking-tight text-[#103b39]">Hola, {admin.name.split(' ')[0]}</h1><p className="mt-2 text-sm text-slate-500">Así avanza la operación de tus sedes hoy.</p></div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Sede en pantalla
            <select value={activeBranch.id} onChange={(event) => onSelectBranch(event.target.value)} className="mt-2 block h-11 min-w-64 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold normal-case tracking-normal text-[#103b39] outline-none focus:border-teal-700">
              {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Ventas de mis sedes', value: `S/ ${totalSales.toLocaleString('es-PE')}`, icon: Banknote, tone: 'bg-emerald-50 text-emerald-700' },
            { label: 'Mesas activas', value: `${occupied} / ${visibleTables.length}`, icon: Users, tone: 'bg-sky-50 text-sky-700' },
            { label: 'Comandas pendientes', value: String(pending), icon: ChefHat, tone: 'bg-orange-50 text-orange-700' },
            { label: 'Cuentas solicitadas', value: String(bills), icon: Clock3, tone: 'bg-amber-50 text-amber-700' }
          ].map(({ label, value, icon: Icon, tone }) => <article key={label} className="rounded-2xl border border-slate-900/5 bg-white p-5 shadow-sm"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={20} /></span><p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><strong className="mt-1 block text-2xl font-black text-[#103b39]">{value}</strong></article>)}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <section className="rounded-2xl border border-slate-900/5 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between"><div><h2 className="font-extrabold text-[#103b39]">Estado de sedes</h2><p className="mt-1 text-xs text-slate-500">Solo se muestran sedes permitidas para tu cuenta.</p></div><TrendingUp size={20} className="text-teal-700" /></div>
            <div className="mt-5 space-y-3">{branches.map((branch) => <button type="button" key={branch.id} onClick={() => onSelectBranch(branch.id)} className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${branch.id === activeBranch.id ? 'border-teal-700 bg-teal-50/60' : 'border-slate-100 hover:border-teal-700/30'}`}><span className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103b39] text-[#ffd06f]"><MapPin size={18} /></span><span><strong className="block text-sm text-slate-800">{branch.name}</strong><small className="text-slate-500">{branch.district || branch.city || branch.address}</small></span></span><span className="text-right"><strong className="block text-sm text-[#103b39]">S/ {Number(branch.todaySales || 0).toLocaleString('es-PE')}</strong><small className={branch.active ? 'text-emerald-600' : 'text-slate-400'}>{branch.active ? 'Operativa' : 'Pausada'}</small></span></button>)}</div>
          </section>

          <section className="rounded-2xl bg-[#103b39] p-5 text-white shadow-lg sm:p-6"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#ffd06f]">Accesos rápidos</p><h2 className="mt-2 text-xl font-black">{activeBranch.name}</h2><div className="mt-5 space-y-2">{[
            ['Ver salón', 'mesas', Store], ['Revisar cocina', 'cocina-kds', ChefHat], ['Carta y equipo', 'carta-sede', Users]
          ].map(([label, screen, icon]) => { const Icon = icon as typeof Store; return <button type="button" key={label as string} onClick={() => onNavigate(screen as ScreenType)} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[.07] p-3.5 text-sm font-bold transition hover:bg-white/[.12]"><span className="flex items-center gap-2"><Icon size={17} className="text-[#ffd06f]" />{label as string}</span><ArrowRight size={16} /></button>; })}</div></section>
        </div>
      </div>
    </div>
  );
};
