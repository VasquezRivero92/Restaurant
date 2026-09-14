import { MenuItem, ScreenType, CartItem, TableItem, AppRole } from '../types';

interface ScreenTomarPedidoProps {
  menuItems: MenuItem[];
  cart: { [cartKey: string]: CartItem };
  onUpdateQty: (
    dishId: number,
    delta: number,
    sizeName?: string,
    price?: number,
    customization?: CartItem['customization'],
    notes?: string
  ) => void;
  onSendComanda: (notes: string, serveDrinksNow?: boolean) => void;
  onNavigate: (screen: ScreenType) => void;
  selectedTableNumber?: string;
  selectedTable?: TableItem;
  onRemoveTableDish?: (dishIndex: number) => void;
  onRemoveTableDrink?: (drinkId: string) => void;
  currentRole?: AppRole;
  currentUserName?: string;
}

export const ScreenTomarPedido: React.FC<ScreenTomarPedidoProps> = ({
  menuItems,
  cart,
  onUpdateQty,
  onSendComanda,
  onNavigate,
  selectedTableNumber = '05',
  selectedTable,
  onRemoveTableDish,
  onRemoveTableDrink,
  currentRole = 'mesero',
  currentUserName = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [comandaNotes, setComandaNotes] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showDrinkDispatchPrompt, setShowDrinkDispatchPrompt] = useState(false);
  const [showCartBreakdown, setShowCartBreakdown] = useState(false);
  
  // Track active size selection for each dish card (defaults to minimum price size)
  const [selectedCardSizes, setSelectedCardSizes] = useState<{ [dishId: number]: string }>({});

  // Customization modal state
  const [customizingDish, setCustomizingDish] = useState<MenuItem | null>(null);
  const [customPicante, setCustomPicante] = useState<'Sin ají' | 'Moderado' | 'Bien Bravo'>('Moderado');
  const [prefSal, setPrefSal] = useState(true);
  const [prefSinCulantro, setPrefSinCulantro] = useState(false);
  const [prefAjiAparte, setPrefAjiAparte] = useState(true);
  const [prefCebollaLavada, setPrefCebollaLavada] = useState(false);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [modalQty, setModalQty] = useState(1);

  // Exact categories matching the uploaded menu image
  const categories = [
    { id: 'all', label: 'Todos', icon: 'restaurant_menu' },
    { id: 'ceviches', label: 'Ceviches', icon: 'set_meal' },
    { id: 'leches', label: 'Leches de Tigre', icon: 'local_drink' },
    { id: 'calientes', label: 'Calientes & Sudados', icon: 'soup_kitchen' },
    { id: 'combinados', label: 'Combinados', icon: 'lunch_dining' },
    { id: 'arroces', label: 'Arroces', icon: 'rice_bowl' },
    { id: 'trios', label: 'Tríos', icon: 'bento' },
    { id: 'jaleas', label: 'Jaleas', icon: 'skillet' },
    { id: 'bebidas', label: 'Bebidas (Mozo)', icon: 'local_bar' }
  ];

  const filteredDishes = menuItems.filter((dish) => {
    const matchesCategory = activeCategory === 'all' || dish.category === activeCategory;
    const matchesQuery =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const totalItemsCount = (Object.values(cart) as CartItem[]).reduce((sum, item) => sum + item.qty, 0);
  
  // Separate food dishes from drinks and calculate real price using selected sizes
  let foodItemsCount = 0;
  let drinksItemsCount = 0;
  let totalPrice = 0;

  (Object.values(cart) as CartItem[]).forEach((item) => {
    if (item.qty > 0) {
      totalPrice += item.price * item.qty;
      if (item.category === 'bebidas' || item.isDrink) {
        drinksItemsCount += item.qty;
      } else {
        foodItemsCount += item.qty;
      }
    }
  });

  const handleStartDispatch = () => {
    if (totalItemsCount === 0) return;

    // If there are drinks, ask waiter if they want to serve them right now
    if (drinksItemsCount > 0) {
      setShowDrinkDispatchPrompt(true);
    } else {
      executeDispatch(false);
    }
  };

  const executeDispatch = (serveDrinksNow: boolean) => {
    setShowDrinkDispatchPrompt(false);
    setShowToast(true);
    onSendComanda(comandaNotes, serveDrinksNow);
    setTimeout(() => {
      setShowToast(false);
      onNavigate('mesas');
    }, 1500);
  };

  const openCustomize = (dish: MenuItem) => {
    setCustomizingDish(dish);
    const activeSzName = selectedCardSizes[dish.id];
    const initialIndex = dish.sizes && activeSzName
      ? Math.max(0, dish.sizes.findIndex((s) => s.name === activeSzName))
      : 0;
    setSelectedSizeIndex(initialIndex);
    setModalQty(1);

    if (dish.customization) {
      setCustomPicante(dish.customization.picante);
      setPrefSal(dish.customization.puntoSal);
      setPrefSinCulantro(dish.customization.sinCulantro);
      setPrefAjiAparte(dish.customization.ajiAparte);
      setPrefCebollaLavada(dish.customization.cebollaLavada);
    } else {
      setCustomPicante('Moderado');
      setPrefSal(true);
      setPrefSinCulantro(false);
      setPrefAjiAparte(true);
      setPrefCebollaLavada(false);
    }
  };

  const isWaiter = currentRole === 'mesero';

  const isMyTable = () => {
    if (!selectedTable?.waiter) return true; // Mesa libre o sin asignar -> se autoasigna
    const w = selectedTable.waiter.toLowerCase().trim();
    const u = (currentUserName || '').toLowerCase().trim();
    if (!w || !u || w === 'sin asignar') return true;
    const curFirst = u.split(' ')[0];
    const tableFirst = w.split(' ')[0];
    return w === u || (curFirst && w.includes(curFirst)) || (tableFirst && u.includes(tableFirst));
  };

  const isOtherWaiterTable = isWaiter && selectedTable && selectedTable.status !== 'free' && !isMyTable();

  if (isOtherWaiterTable) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[65vh] text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 shadow-sm border border-amber-300">
          <span className="material-symbols-outlined text-[36px]">lock</span>
        </div>
        <h2 className="text-xl font-black text-primary mb-1">
          Mesa Asignada a {selectedTable?.waiter}
        </h2>
        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
          Esta mesa fue tomada por <strong>{selectedTable?.waiter}</strong>. Por control del salón, todo el proceso de pedido y atención debe ser realizado por el mozo asignado. Solo el Administrador de la Sede puede reasignarla o atenderla directamente.
        </p>
        <button
          onClick={() => onNavigate('mesas')}
          className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Volver a Mis Mesas</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-48 pt-2">
      {/* Table Context Banner */}
      <div className="px-4 pt-1 pb-2">
        <div className="bg-primary-container text-on-primary rounded-xl p-4 shadow-md flex items-center justify-between gap-3 border border-secondary/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 text-on-secondary shadow-sm font-bold">
              <span className="material-symbols-outlined text-[26px]">table_restaurant</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-on-primary">Mesa {selectedTableNumber}</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[11px] tracking-wide">
                  3 Comensales
                </span>
              </div>
              <span className="text-xs text-teal-200 truncate font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">person</span>
                <span>
                  {selectedTable?.waiter && selectedTable.waiter !== 'Sin asignar'
                    ? `Mozo: ${selectedTable.waiter}`
                    : `Autoasignando a: ${currentUserName || 'Mozo en turno'}`}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 bg-primary/40 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-xs text-primary-fixed">En vivo</span>
          </div>
        </div>
      </div>

      {/* Notice on Drinks vs Kitchen */}
      {activeCategory === 'bebidas' && (
        <div className="px-4 pb-1">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-950">
            <span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0">local_bar</span>
            <span>
              <strong>Bebidas directas:</strong> Las bebidas no dependen de cocina. Tú las sirves directamente en la mesa desde el salón.
            </span>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="px-4 py-1">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[22px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ceviche, combinado, trío o bebida..."
            className="w-full h-11 pl-11 pr-10 rounded-xl bg-surface-container-low text-on-surface text-sm placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-colors border border-outline-variant/30"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : (
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              tune
            </span>
          )}
        </div>
      </div>

      {/* Categories Horizontal Slider */}
      <div className="py-2">
        <div className="flex items-center gap-2 overflow-x-auto px-4 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold active:scale-95 transition-all shadow-sm cursor-pointer ${
                  isActive
                    ? cat.id === 'bebidas' 
                      ? 'bg-amber-500 text-amber-950 ring-1 ring-amber-600'
                      : 'bg-secondary text-on-secondary ring-1 ring-secondary'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                <span className="whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes Menu List */}
      <div className="px-4 space-y-3">
        {filteredDishes.map((dish) => {
          const isDrink = dish.category === 'bebidas' || dish.isDrink;

          // By default, minimum size is the first in sizes
          const defaultSize = dish.sizes && dish.sizes.length > 0 ? dish.sizes[0] : undefined;
          const activeSizeName = selectedCardSizes[dish.id] || (defaultSize ? defaultSize.name : undefined);
          const activeSize = dish.sizes ? dish.sizes.find((s) => s.name === activeSizeName) || defaultSize : undefined;
          const minPrice = defaultSize ? defaultSize.price : dish.price;
          const currentPrice = activeSize ? activeSize.price : dish.price;
          const isMinimumPrice = currentPrice === minPrice;

          // Active cart key for this specific size
          const currentCartKey = `${dish.id}__${activeSizeName || 'default'}`;
          const currentQty = cart[currentCartKey]?.qty || 0;

          // All ordered items for this dish across different sizes
          const orderedForDish = (Object.values(cart) as CartItem[]).filter((c) => c.dishId === dish.id && c.qty > 0);
          const totalDishQty = orderedForDish.reduce((sum, c) => sum + c.qty, 0);

          return (
            <article
              key={dish.id}
              className={`bg-surface-container-lowest rounded-2xl p-3.5 sm:p-4 shadow-sm border flex flex-col gap-3 transition-all hover:shadow-md ${
                totalDishQty > 0 
                  ? isDrink ? 'border-amber-400 ring-1 ring-amber-300' : 'border-secondary/40 ring-1 ring-secondary/20' 
                  : 'border-outline-variant/30'
              }`}
            >
              {/* Top Row: Image + Title + Info */}
              <div className="flex items-start gap-3">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 shadow-sm border border-outline-variant/20"
                />

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-on-surface leading-snug">
                      {dish.name}
                    </h3>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {!dish.available && (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-black text-[10px] flex items-center gap-1 border border-red-300">
                        <span className="material-symbols-outlined text-[12px]">block</span>
                        AGOTADO EN ESTA SEDE {dish.stockNote ? `(${dish.stockNote})` : ''}
                      </span>
                    )}
                    {isDrink && dish.available && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1 border border-amber-300/60">
                        <span className="material-symbols-outlined text-[12px]">local_bar</span>
                        Servicio Mozo
                      </span>
                    )}
                    {dish.tag && !isDrink && (
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[10px]">
                        {dish.tag}
                      </span>
                    )}
                    {dish.sizes && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                        {dish.sizes.length} presentaciones
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sizes / Presentations Interactive Selector (Default price is always minimum) */}
              {dish.sizes && dish.sizes.length > 0 && (
                <div className="bg-surface-container-low/70 rounded-xl p-2.5 border border-outline-variant/20 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">format_size</span>
                      Seleccionar Tamaño:
                    </span>
                    <span className="text-[11px] text-primary font-bold">
                      Activo: {activeSizeName} (S/ {currentPrice.toFixed(2)})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {dish.sizes.map((sz, idx) => {
                      const isSelected = activeSizeName === sz.name;
                      const isMin = sz.price === minPrice;
                      const countInCart = cart[`${dish.id}__${sz.name}`]?.qty || 0;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setSelectedCardSizes((prev) => ({ ...prev, [dish.id]: sz.name }))
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-on-primary border-primary shadow-xs ring-1 ring-primary/40'
                              : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/20'
                          }`}
                        >
                          <span>{sz.name}</span>
                          <span className={`font-extrabold ${isSelected ? 'text-teal-200' : 'text-primary'}`}>
                            S/ {sz.price.toFixed(2)}
                          </span>
                          {isMin && (
                            <span
                              className={`text-[9px] px-1 rounded font-black ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              Mín
                            </span>
                          )}
                          {countInCart > 0 && (
                            <span
                              className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                                isSelected ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary'
                              }`}
                            >
                              {countInCart}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Already ordered summary for this dish across all presentations */}
              {orderedForDish.length > 0 && (
                <div className="bg-emerald-50 rounded-xl px-3 py-2 text-xs flex items-center justify-between text-emerald-900 border border-emerald-200 font-medium">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-emerald-700">check_circle</span>
                    En comanda ({totalDishQty}):
                  </span>
                  <span className="truncate ml-1 font-semibold">
                    {orderedForDish.map((it) => `${it.qty}x ${it.selectedSize || 'Estándar'}`).join(' • ')}
                  </span>
                </div>
              )}

              {/* Dedicated Full-Width Price and Counter Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <div className="flex flex-col min-w-0 pr-2">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-black text-lg sm:text-xl text-primary">
                      S/ {currentPrice.toFixed(2)}
                    </span>
                    {dish.sizes && (
                      <span className="text-[11px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                        {activeSizeName}
                      </span>
                    )}
                  </div>
                  {dish.sizes && (
                    <span className={`text-[10px] sm:text-[11px] font-semibold mt-0.5 ${isMinimumPrice ? 'text-emerald-700' : 'text-on-surface-variant'}`}>
                      {isMinimumPrice ? '✓ Precio mínimo por defecto' : `Mínimo: S/ ${minPrice.toFixed(2)}`}
                    </span>
                  )}
                </div>

                {/* Direct Thumb-Friendly Stepper or Agotado Notice */}
                {!dish.available ? (
                  <div className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5 shrink-0">
                    <span className="material-symbols-outlined text-[16px]">do_not_disturb_on</span>
                    <span>No disponible</span>
                  </div>
                ) : (
                  <div className="flex items-center bg-surface-container-high rounded-xl p-1 border border-outline-variant/30 shrink-0">
                    <button
                      onClick={() => onUpdateQty(dish.id, -1, activeSizeName, currentPrice)}
                      disabled={currentQty === 0}
                      aria-label="Disminuir cantidad"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30 cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[20px]">remove</span>
                    </button>
                    <span className="w-8 sm:w-9 text-center font-black text-base text-on-surface">
                      {currentQty}
                    </span>
                    <button
                      onClick={() => onUpdateQty(dish.id, 1, activeSizeName, currentPrice)}
                      aria-label="Aumentar cantidad"
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center active:scale-90 transition-transform shadow-sm cursor-pointer ${
                        isDrink ? 'bg-amber-500 text-amber-950 font-black' : 'bg-primary text-on-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Note / Customize pill bar */}
              <div className="flex items-center justify-between pt-1 bg-surface-container-low rounded-xl px-3 py-2 border border-outline-variant/20">
                <div className="flex items-center gap-1.5 text-on-surface-variant min-w-0">
                  <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">
                    {isDrink ? 'local_bar' : 'tune'}
                  </span>
                  <span className="text-xs truncate">
                    {isDrink 
                      ? 'Entrega en mesa por mozo • Inmediato' 
                      : `${dish.customization?.puntoSal ? 'Punto exacto' : 'Normal'} • ${dish.customization?.picante || 'Moderado'}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openCustomize(dish)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 font-bold text-xs active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {dish.sizes ? 'format_size' : 'tune'}
                  </span>
                  <span>{dish.sizes ? 'Opciones & Tamaños' : 'Opciones'}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Sticky Comanda Drawer (Above bottom navigation) - Clean & Spacious */}
      {totalItemsCount > 0 ? (
        <div className="fixed bottom-16 inset-x-0 z-30 bg-surface-container-lowest/98 backdrop-blur-md shadow-[0_-8px_30px_rgba(10,37,64,0.16)] rounded-t-2xl p-3.5 sm:p-4 flex flex-col gap-2.5 border-t border-outline-variant/30 max-w-xl mx-auto">
          {/* Main summary bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shrink-0"></span>
                <span className="font-extrabold text-sm text-on-surface">
                  {totalItemsCount} {totalItemsCount === 1 ? 'ítem en pedido' : 'ítems en pedido'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowCartBreakdown(!showCartBreakdown)}
                  className="text-xs text-secondary font-extrabold flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  <span>{showCartBreakdown ? 'Ocultar detalle' : 'Ver detalle'}</span>
                  <span className="material-symbols-outlined text-[14px]">
                    {showCartBreakdown ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant mt-0.5">
                <span>🍳 {foodItemsCount} a Cocina</span>
                <span>•</span>
                <span className="text-amber-800 font-semibold">🥤 {drinksItemsCount} mozo</span>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="text-[11px] text-on-surface-variant leading-none">Total pedido:</span>
              <span className="font-black text-xl sm:text-2xl text-primary leading-tight">
                S/ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Detailed Cart Breakdown Drawer */}
          {showCartBreakdown && (
            <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 max-h-48 overflow-y-auto space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
                <span className="text-xs font-bold text-on-surface">Detalle de platos y tamaños:</span>
                <span className="text-[10px] text-on-surface-variant">Precios calculados</span>
              </div>
              {(Object.values(cart) as CartItem[]).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/10 last:border-b-0"
                >
                  <div className="flex flex-col min-w-0 flex-1 pr-2">
                    <span className="font-bold text-on-surface truncate">
                      {item.dishName}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                      {item.selectedSize && (
                        <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold text-[10px]">
                          {item.selectedSize}
                        </span>
                      )}
                      <span>S/ {item.price.toFixed(2)} c/u</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-surface-container rounded-lg p-0.5 border border-outline-variant/30">
                      <button
                        onClick={() => onUpdateQty(item.dishId, -1, item.selectedSize, item.price)}
                        className="w-7 h-7 rounded bg-surface-container-lowest text-on-surface flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="w-7 text-center font-bold text-xs">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.dishId, 1, item.selectedSize, item.price)}
                        className="w-7 h-7 rounded bg-primary text-on-primary flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                    <span className="font-black text-xs text-primary w-16 text-right">
                      S/ {(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Observations Field */}
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
              notes
            </span>
            <input
              type="text"
              value={comandaNotes}
              onChange={(e) => setComandaNotes(e.target.value)}
              placeholder="Notas de cocina (ej. poco picante, cebolla aparte)..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container text-on-surface text-xs placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-colors border border-outline-variant/30"
            />
          </div>

          {/* Dispatch Action Button */}
          <button
            onClick={handleStartDispatch}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="text-base">🚀</span>
            <span>
              ENVIAR COMANDA • S/ {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      ) : (
        /* Sleek helper when cart is empty - doesn't block screen */
        <div className="fixed bottom-20 inset-x-0 z-20 pointer-events-none flex justify-center px-4">
          <div className="bg-primary/80 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-teal-300">touch_app</span>
            <span>Selecciona platos para Mesa {selectedTableNumber}</span>
          </div>
        </div>
      )}

      {/* Modal Prompt: Deliver Drinks Now? */}
      {showDrinkDispatchPrompt && (
        <div className="fixed inset-0 z-50 bg-primary/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-5 shadow-2xl border border-amber-300 flex flex-col gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">local_bar</span>
            </div>
            
            <div className="text-center">
              <h4 className="font-extrabold text-base text-on-surface">
                {drinksItemsCount} {drinksItemsCount === 1 ? 'Bebida en el Pedido' : 'Bebidas en el Pedido'}
              </h4>
              <p className="text-xs text-on-surface-variant mt-1">
                Recuerda que las bebidas no van a la cocina. ¿Deseas marcarlas como servidas en mesa ahora mismo?
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => executeDispatch(true)}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">done_all</span>
                <span>Sí, ya las estoy sirviendo en mesa</span>
              </button>

              <button
                onClick={() => executeDispatch(false)}
                className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span>Dejar pendiente en mi Bandeja de Bebidas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Flash Toast */}
      {showToast && (
        <div className="fixed top-20 inset-x-4 z-50 max-w-md mx-auto transition-all duration-300">
          <div className="bg-primary text-on-primary rounded-xl p-4 shadow-2xl flex items-center gap-3 border border-emerald-400/40">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-on-primary flex items-center justify-center flex-shrink-0 animate-bounce">
              <span className="material-symbols-outlined text-[24px]">check</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-on-primary">
                ¡Pedido registrado para Mesa {selectedTableNumber}!
              </span>
              <span className="text-xs text-primary-fixed truncate">
                {foodItemsCount > 0 ? `${foodItemsCount} platos a cocina` : ''} 
                {drinksItemsCount > 0 ? ` • ${drinksItemsCount} bebidas a cargo de mozo` : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Customization Options / Presentation Sizes */}
      {customizingDish && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-4 flex flex-col gap-3 shadow-2xl border border-outline-variant/40">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">tune</span>
                <h4 className="font-bold text-base text-on-surface">
                  {customizingDish.name}
                </h4>
              </div>
              <button
                onClick={() => setCustomizingDish(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* If dish has sizes/presentations (e.g. Refrescos, Gaseosas, Tríos) */}
            {customizingDish.sizes && customizingDish.sizes.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-on-surface uppercase tracking-wide">
                    Seleccionar Presentación / Tamaño
                  </label>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Mínimo por defecto: S/ {customizingDish.sizes[0].price.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {customizingDish.sizes.map((sz, idx) => {
                    const isMin = idx === 0;
                    const isSelected = selectedSizeIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSizeIndex(idx)}
                        className={`p-2.5 rounded-lg text-xs font-bold text-left flex flex-col justify-between transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-secondary text-on-secondary shadow-sm ring-2 ring-secondary/50 border-secondary'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-outline-variant/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{sz.name}</span>
                          {isMin && (
                            <span className={`text-[9px] px-1 rounded font-black ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                              Mínimo
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-black mt-1">S/ {sz.price.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Option 1: Nivel de Picante (For ceviches/calientes) */}
            {customizingDish.category !== 'bebidas' && (
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-on-surface uppercase tracking-wide">
                  Nivel de Picante / Ají Limo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Sin ají', 'Moderado', 'Bien Bravo'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCustomPicante(lvl)}
                      className={`px-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        customPicante === lvl
                          ? 'bg-secondary text-on-secondary shadow-sm'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {lvl} {lvl === 'Bien Bravo' && '🔥'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Option 2: Preferencias de Cocina */}
            {customizingDish.category !== 'bebidas' && (
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-on-surface uppercase tracking-wide">
                  Preferencias de Preparación
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface cursor-pointer text-xs font-medium border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={prefSal}
                      onChange={(e) => setPrefSal(e.target.checked)}
                      className="w-4 h-4 rounded text-secondary"
                    />
                    <span>Punto exacto de sal</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface cursor-pointer text-xs font-medium border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={prefSinCulantro}
                      onChange={(e) => setPrefSinCulantro(e.target.checked)}
                      className="w-4 h-4 rounded text-secondary"
                    />
                    <span>Sin culantro</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface cursor-pointer text-xs font-medium border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={prefAjiAparte}
                      onChange={(e) => setPrefAjiAparte(e.target.checked)}
                      className="w-4 h-4 rounded text-secondary"
                    />
                    <span>Ají servido aparte</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface cursor-pointer text-xs font-medium border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={prefCebollaLavada}
                      onChange={(e) => setPrefCebollaLavada(e.target.checked)}
                      className="w-4 h-4 rounded text-secondary"
                    />
                    <span>Cebolla bien lavada</span>
                  </label>
                </div>
              </div>
            )}

            {/* Quantity Stepper inside Modal */}
            <div className="flex items-center justify-between pt-1 px-1">
              <span className="font-bold text-xs text-on-surface">Cantidad a añadir:</span>
              <div className="flex items-center bg-surface-container-high rounded-lg p-0.5 border border-outline-variant/30">
                <button
                  type="button"
                  disabled={modalQty <= 1}
                  onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                  className="w-8 h-8 rounded-md bg-surface-container-lowest text-on-surface flex items-center justify-center disabled:opacity-40 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="w-8 text-center font-black text-sm text-on-surface">
                  {modalQty}
                </span>
                <button
                  type="button"
                  onClick={() => setModalQty(modalQty + 1)}
                  className="w-8 h-8 rounded-md bg-secondary text-on-secondary flex items-center justify-center cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setCustomizingDish(null)}
                className="flex-1 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  const chosenSize = customizingDish.sizes?.[selectedSizeIndex];
                  const chosenPrice = chosenSize?.price ?? customizingDish.price;
                  const chosenSizeName = chosenSize?.name;

                  onUpdateQty(
                    customizingDish.id,
                    modalQty,
                    chosenSizeName,
                    chosenPrice,
                    {
                      picante: customPicante,
                      puntoSal: prefSal,
                      sinCulantro: prefSinCulantro,
                      ajiAparte: prefAjiAparte,
                      cebollaLavada: prefCebollaLavada,
                    }
                  );

                  if (chosenSizeName) {
                    setSelectedCardSizes((prev) => ({
                      ...prev,
                      [customizingDish.id]: chosenSizeName,
                    }));
                  }
                  setCustomizingDish(null);
                }}
                className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Agregar al Pedido</span>
                <span className="font-extrabold text-teal-200">
                  (S/ {(((customizingDish.sizes?.[selectedSizeIndex]?.price ?? customizingDish.price)) * modalQty).toFixed(2)})
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
