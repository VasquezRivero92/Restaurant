import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Minus, Plus, QrCode, Search, ShoppingBag } from 'lucide-react';
import { MenuItem, TableItem } from '../types';

interface Props {
  slug: string;
  branchId: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  ceviches: 'Ceviches',
  leches: 'Leches de tigre',
  calientes: 'Calientes',
  arroces: 'Arroces',
  combinados: 'Combinados',
  trios: 'Tríos',
  jaleas: 'Jaleas',
  bebidas: 'Bebidas'
};

const createRequestId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `qr-${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
};

export const ScreenCartaQR: React.FC<Props> = ({ slug, branchId }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [branchName, setBranchName] = useState('');
  const [tableId, setTableId] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [state, setState] = useState<'loading' | 'ready' | 'sending' | 'sent' | 'error'>('loading');
  const [error, setError] = useState('');
  const requestId = useRef(createRequestId());

  useEffect(() => {
    const controller = new AbortController();
    setState('loading');
    fetch(`/api/public/menu/${encodeURIComponent(slug)}/${encodeURIComponent(branchId)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('No pudimos abrir esta carta.');
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) throw new Error('La carta no está disponible en este momento.');
        return response.json();
      })
      .then((data) => {
        setMenu(data.menu || []);
        setTables(data.tables || []);
        setBranchName(data.branchName || 'nuestra sede');
        setState('ready');
      })
      .catch((reason) => {
        if (reason?.name === 'AbortError') return;
        setError(reason instanceof Error ? reason.message : 'No pudimos abrir esta carta.');
        setState('error');
      });
    return () => controller.abort();
  }, [slug, branchId]);

  const selectedTable = tables.find((table) => table.id === tableId);
  const categories = useMemo(() => Array.from(new Set(menu.map((item) => item.category))), [menu]);
  const visibleMenu = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('es');
    return menu.filter((item) => {
      if (!item.available || (category !== 'all' && item.category !== category)) return false;
      return !term || `${item.name} ${item.description}`.toLocaleLowerCase('es').includes(term);
    });
  }, [category, menu, search]);
  const lines = useMemo(
    () => menu.filter((item) => cart[item.id]).map((item) => ({ item, qty: cart[item.id] })),
    [menu, cart]
  );
  const total = lines.reduce((sum, line) => sum + line.item.price * line.qty, 0);

  const change = (id: number, delta: number) => {
    setCart((previous) => ({ ...previous, [id]: Math.max(0, (previous[id] || 0) + delta) }));
  };

  const submit = async () => {
    if (!selectedTable || !lines.length || state === 'sending') return;
    setState('sending');
    setError('');
    try {
      const response = await fetch(`/api/public/order/${encodeURIComponent(slug)}/${encodeURIComponent(branchId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: requestId.current,
          tableId,
          items: lines.map(({ item, qty }) => ({ dishId: item.id, qty })),
          notes
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'No se pudo enviar el pedido.');
      setState('sent');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Intenta nuevamente.');
      setState('ready');
    }
  };

  if (state === 'sent') {
    return (
      <main className="min-h-screen bg-[#fffdf9] p-6 flex items-center justify-center">
        <section className="max-w-sm text-center rounded-3xl bg-white p-8 shadow-xl border border-emerald-100">
          <CheckCircle2 className="mx-auto text-emerald-600" size={54} />
          <h1 className="mt-4 text-2xl font-black text-slate-900">Pedido solicitado</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">Un mozo recibirá la alerta de la Mesa {selectedTable?.number}, se acercará a confirmar el pedido y recién entonces será enviado a cocina.</p>
          <p className="mt-5 text-xs font-bold text-emerald-700">Puedes cerrar esta pantalla.</p>
        </section>
      </main>
    );
  }
  if (state === 'loading') return <main className="min-h-screen grid place-items-center bg-[#fffdf9] text-teal-900 font-bold">Abriendo carta…</main>;
  if (state === 'error') return <main className="min-h-screen grid place-items-center bg-[#fffdf9] p-6 text-center text-slate-700">{error}</main>;

  return (
    <main className="min-h-screen bg-[#fffdf9] pb-36 text-slate-900">
      <header className="sticky top-0 z-20 bg-[#0c3130] px-5 py-4 text-white shadow-lg">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="rounded-xl bg-amber-300 p-2 text-[#0c3130]"><QrCode size={20} /></div>
          <div><p className="text-xs font-bold text-amber-200">CARTA DIGITAL</p><h1 className="font-black">{branchName}</h1></div>
        </div>
      </header>

      <div className="mx-auto max-w-xl p-4">
        <section className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
          <label htmlFor="qr-table" className="text-sm font-black text-teal-950">Primero, ¿en qué mesa estás?</label>
          <select id="qr-table" value={tableId} onChange={(event) => setTableId(event.target.value)} disabled={!tables.length} className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold disabled:opacity-60">
            <option value="">{tables.length ? 'Selecciona tu mesa' : 'No hay mesas activas disponibles'}</option>
            {tables.map((table) => <option key={table.id} value={table.id}>Mesa {table.number} · {table.zone}</option>)}
          </select>
          <p className="mt-2 text-xs text-slate-500">Solo aparecen mesas que están atendiendo clientes.</p>
        </section>

        <section className="sticky top-[76px] z-10 -mx-4 mt-4 border-y border-slate-200 bg-[#fffdf9]/95 px-4 py-3 backdrop-blur">
          <label htmlFor="qr-search" className="sr-only">Buscar en la carta</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input id="qr-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar platos o bebidas" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10" />
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por categoría">
            <button type="button" onClick={() => setCategory('all')} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black ${category === 'all' ? 'bg-teal-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Todo</button>
            {categories.map((itemCategory) => (
              <button key={itemCategory} type="button" onClick={() => setCategory(itemCategory)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black ${category === itemCategory ? 'bg-teal-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>{CATEGORY_NAMES[itemCategory] || itemCategory}</button>
            ))}
          </div>
        </section>

        {error && <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}
        <div className="mt-4 space-y-3">
          {visibleMenu.map((item) => (
            <article key={item.id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
              <img src={item.image} alt={item.name} loading="lazy" className="h-20 w-20 rounded-xl object-cover bg-slate-100" />
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-black">{item.name}</h2>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <strong className="text-teal-800">S/ {item.price.toFixed(2)}</strong>
                  <div className="flex items-center gap-2">
                    <button type="button" aria-label={`Quitar ${item.name}`} disabled={!cart[item.id]} onClick={() => change(item.id, -1)} className="rounded-lg bg-slate-100 p-2 disabled:opacity-40"><Minus size={15} /></button>
                    <span className="w-5 text-center text-sm font-black" aria-live="polite">{cart[item.id] || 0}</span>
                    <button type="button" aria-label={`Agregar ${item.name}`} onClick={() => change(item.id, 1)} className="rounded-lg bg-teal-700 p-2 text-white"><Plus size={15} /></button>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {!visibleMenu.length && <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500">No encontramos productos con ese filtro.</p>}
        </div>

        <label className="mt-5 block text-xs font-bold text-slate-600">Indicaciones para el mozo
          <textarea value={notes} maxLength={300} onChange={(event) => setNotes(event.target.value)} placeholder="Ej.: sin ají" className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm" />
        </label>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1"><p className="text-xs text-slate-500">{lines.reduce((sum, line) => sum + line.qty, 0)} productos</p><strong>S/ {total.toFixed(2)}</strong></div>
          <button type="button" disabled={!tableId || !lines.length || state === 'sending'} onClick={submit} className="rounded-xl bg-[#0c3130] px-4 py-3 text-xs font-black text-white disabled:opacity-40 flex items-center gap-2"><ShoppingBag size={16} />{state === 'sending' ? 'Enviando…' : 'Solicitar pedido'}</button>
        </div>
      </footer>
    </main>
  );
};
