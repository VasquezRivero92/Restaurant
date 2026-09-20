import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Minus, Plus, QrCode, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { MenuItem, TableItem } from '../types';

interface Props { slug: string; branchId: string; }

export const ScreenCartaQR: React.FC<Props> = ({ slug, branchId }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [branchName, setBranchName] = useState('');
  const [tableId, setTableId] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState('');
  const [state, setState] = useState<'loading' | 'ready' | 'sending' | 'sent' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/public/menu/${encodeURIComponent(slug)}/${encodeURIComponent(branchId)}`)
      .then(async r => { if (!r.ok) throw new Error('No pudimos abrir esta carta.'); return r.json(); })
      .then(data => { setMenu(data.menu || []); setTables(data.tables || []); setBranchName(data.branchName || 'nuestra sede'); setState('ready'); })
      .catch(e => { setError(e.message); setState('error'); });
  }, [slug, branchId]);

  const selectedTable = tables.find(t => t.id === tableId);
  const lines = useMemo(() => menu.filter(item => cart[item.id]).map(item => ({ item, qty: cart[item.id] })), [menu, cart]);
  const total = lines.reduce((sum, line) => sum + line.item.price * line.qty, 0);
  const change = (id: number, delta: number) => setCart(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  const submit = async () => {
    if (!selectedTable || !lines.length) return;
    setState('sending');
    try {
      const response = await fetch(`/api/public/order/${encodeURIComponent(slug)}/${encodeURIComponent(branchId)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, items: lines.map(({ item, qty }) => ({ dishId: item.id, qty })), notes })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo enviar el pedido.');
      setState('sent');
    } catch (e) { setError(e instanceof Error ? e.message : 'Intenta nuevamente.'); setState('ready'); }
  };

  if (state === 'sent') return <main className="min-h-screen bg-[#fffdf9] p-6 flex items-center justify-center"><section className="max-w-sm text-center rounded-3xl bg-white p-8 shadow-xl border border-emerald-100"><CheckCircle2 className="mx-auto text-emerald-600" size={54}/><h1 className="mt-4 text-2xl font-black text-slate-900">Pedido solicitado</h1><p className="mt-3 text-sm leading-relaxed text-slate-600">Un mozo recibirá la alerta de la Mesa {selectedTable?.number}, se acercará a confirmar el pedido y recién entonces será enviado a cocina.</p><p className="mt-5 text-xs font-bold text-emerald-700">Puedes cerrar esta pantalla.</p></section></main>;
  if (state === 'loading') return <main className="min-h-screen grid place-items-center bg-[#fffdf9] text-teal-900 font-bold">Abriendo carta…</main>;
  if (state === 'error') return <main className="min-h-screen grid place-items-center bg-[#fffdf9] p-6 text-center text-slate-700">{error}</main>;
  return <main className="min-h-screen bg-[#fffdf9] pb-44 text-slate-900"><header className="sticky top-0 z-10 bg-[#0c3130] px-5 py-4 text-white shadow-lg"><div className="mx-auto flex max-w-xl items-center gap-3"><div className="rounded-xl bg-amber-300 p-2 text-[#0c3130]"><QrCode size={20}/></div><div><p className="text-xs font-bold text-amber-200">CARTA DIGITAL</p><h1 className="font-black">{branchName}</h1></div></div></header><div className="mx-auto max-w-xl p-4"><section className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm"><label className="text-sm font-black text-teal-950">Primero, ¿en qué mesa estás?</label><select value={tableId} onChange={e => setTableId(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"><option value="">Selecciona tu mesa</option>{tables.map(t => <option key={t.id} value={t.id}>Mesa {t.number} · {t.zone}</option>)}</select><p className="mt-2 text-xs text-slate-500">Esto avisa al equipo exactamente dónde acercarse.</p></section><div className="mt-5 space-y-3">{menu.filter(i => i.available).map(item => <article key={item.id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm border border-slate-100"><img src={item.image} alt="" className="h-20 w-20 rounded-xl object-cover bg-slate-100"/><div className="min-w-0 flex-1"><h2 className="text-sm font-black">{item.name}</h2><p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.description}</p><div className="mt-2 flex items-center justify-between"><strong className="text-teal-800">S/ {item.price.toFixed(2)}</strong><div className="flex items-center gap-2"><button aria-label={`Quitar ${item.name}`} onClick={() => change(item.id,-1)} className="rounded-lg bg-slate-100 p-1.5"><Minus size={15}/></button><span className="w-4 text-center text-sm font-black">{cart[item.id] || 0}</span><button aria-label={`Agregar ${item.name}`} onClick={() => change(item.id,1)} className="rounded-lg bg-teal-700 p-1.5 text-white"><Plus size={15}/></button></div></div></div></article>)}</div><label className="mt-5 block text-xs font-bold text-slate-600">Indicaciones para el mozo<textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Ej.: sin ají" className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"/></label></div><footer className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-4 backdrop-blur"><div className="mx-auto flex max-w-xl items-center gap-3"><div className="min-w-0 flex-1"><p className="text-xs text-slate-500">{lines.reduce((s,l)=>s+l.qty,0)} productos</p><strong>S/ {total.toFixed(2)}</strong></div><button disabled={!tableId || !lines.length || state === 'sending'} onClick={submit} className="rounded-xl bg-[#0c3130] px-4 py-3 text-xs font-black text-white disabled:opacity-40 flex items-center gap-2"><ShoppingBag size={16}/>{state === 'sending' ? 'Enviando…' : 'Solicitar pedido'}</button></div></footer></main>;
};
