import { TableItem, MenuItem, KDSTicket, ChainBrand, AdminUser, StaffMember, MasterCarta } from '../types';

export const INITIAL_TABLES: TableItem[] = [
  {
    id: 'mesa-04',
    number: '04',
    status: 'ready',
    statusLabel: '¡Listo para recoger!',
    zone: 'Terraza Marina',
    waiter: 'Carlos Mendoza',
    diners: 3,
    timeInSalon: 'Listo hace 2m',
    total: 59.0,
    dishes: [
      {
        id: 'dish-04-1',
        name: '1x Ceviche Mixto',
        qty: 1,
        price: 26.0,
        station: 'Barra Fría',
        description: 'Pescado y mariscos del día, canchita y choclo',
        status: 'ready'
      },
      {
        id: 'dish-04-2',
        name: '1x Arroz con Mariscos + Ceviche',
        qty: 1,
        price: 20.0,
        station: 'Salteados',
        description: 'Dúo marino recién flameado',
        status: 'ready'
      }
    ],
    drinks: [
      {
        id: 'drk-04-1',
        name: 'Refresco Natural',
        size: '1 Litro',
        qty: 1,
        price: 8.0,
        served: true,
        servedAt: '13:28'
      },
      {
        id: 'drk-04-2',
        name: 'Gaseosa Inca Kola',
        size: '1/2 lt',
        qty: 1,
        price: 5.0,
        served: true,
        servedAt: '13:29'
      }
    ]
  },
  {
    id: 'mesa-01',
    number: '01',
    status: 'bill_requested',
    statusLabel: 'Cuenta Pedida',
    zone: 'Salón Principal',
    waiter: 'Carlos Mendoza',
    diners: 5,
    timeInSalon: '54 min',
    total: 122.0,
    notes: 'Comensal solicita boleta. Pago Yape / Tarjeta',
    dishes: [
      {
        name: '1x Combinado Súper Nélida',
        qty: 1,
        station: 'Cocina',
        description: 'Ceviche, arroz mariscos, chicharrón, causa, arroz con pollo',
        status: 'served'
      },
      {
        name: '1x Parihuela Mixta',
        qty: 1,
        station: 'Calientes',
        description: 'Concentrado de mariscos y pescado fresco',
        status: 'served'
      },
      {
        name: '1x Jalea Mixta',
        qty: 1,
        station: 'Fritura',
        description: 'Crocante con yuca y sarza criolla',
        status: 'served'
      }
    ],
    drinks: [
      {
        id: 'drk-01-1',
        name: 'Cerveza Cusqueña Trigo',
        size: 'Botella 620ml',
        qty: 2,
        price: 12.0,
        served: true,
        servedAt: '13:05'
      },
      {
        id: 'drk-01-2',
        name: 'Refresco Natural',
        size: '1 Litro',
        qty: 1,
        price: 8.0,
        served: true,
        servedAt: '13:08'
      }
    ]
  },
  {
    id: 'mesa-02',
    number: '02',
    status: 'bill_requested',
    statusLabel: 'Cuenta Pedida',
    zone: 'Salón Principal',
    waiter: 'Rosa Paredes',
    diners: 4,
    timeInSalon: '32 min en salón',
    total: 77.0,
    notes: 'Comensal solicita factura. Pago Tarjeta POS',
    dishes: [
      {
        name: '1x Trío Marino (Grande)',
        qty: 1,
        station: 'Salón',
        description: 'Arroz con mariscos, ceviche y chicharrón',
        status: 'served'
      },
      {
        name: '1x Leche de Pantera Mixta',
        qty: 1,
        station: 'Fríos',
        description: 'Conchas negras, mariscos y ají limo',
        status: 'served'
      }
    ],
    drinks: [
      {
        id: 'drk-02-1',
        name: 'Cerveza Pilsen',
        size: 'Botella 630ml',
        qty: 2,
        price: 10.0,
        served: true,
        servedAt: '13:20'
      },
      {
        id: 'drk-02-2',
        name: 'Gaseosa',
        size: '1 litro y medio',
        qty: 1,
        price: 10.0,
        served: true,
        servedAt: '13:21'
      }
    ]
  },
  {
    id: 'mesa-07',
    number: '07',
    status: 'cooking',
    statusLabel: 'En Preparación',
    zone: 'Terraza Marina',
    waiter: 'Jorge Benítez',
    diners: 2,
    timeInSalon: 'Comanda #108 • 7m',
    estRemaining: '~6 min restantes',
    progress: 70,
    total: 82.0,
    dishes: [
      {
        name: '1x Sudado de Cabrilla',
        qty: 1,
        station: 'Calientes',
        description: 'Pescado entero en caldo con chicha de jora y yuca',
        status: 'cooking'
      },
      {
        name: '1x Ceviche de Conchas Negras',
        qty: 1,
        station: 'Barra Fría',
        description: 'Conchas de Tumbes recién abiertas',
        status: 'cooking'
      }
    ],
    // IMPORTANT: Pending drinks for the waiter to serve!
    drinks: [
      {
        id: 'drk-07-1',
        name: 'Refresco Natural',
        size: '1 Litro',
        qty: 1,
        price: 8.0,
        served: false
      },
      {
        id: 'drk-07-2',
        name: 'Cerveza Pilsen',
        size: 'Botella',
        qty: 1,
        price: 10.0,
        served: false
      }
    ]
  },
  {
    id: 'mesa-03',
    number: '03',
    status: 'free',
    statusLabel: 'Libre',
    zone: 'Zona Barra',
    waiter: 'Sin asignar',
    diners: 2,
    notes: 'Mesa desinfectada y lista'
  },
  {
    id: 'mesa-05',
    number: '05',
    status: 'cooking',
    statusLabel: 'En Preparación',
    zone: 'Zona Ventanal',
    waiter: 'Carlos Mendoza',
    diners: 3,
    timeInSalon: 'Comanda #109 • 3m',
    estRemaining: '~10 min restantes',
    progress: 30,
    total: 68.0,
    dishes: [
      {
        id: 'dish-05-1',
        name: '1x Ceviche de Pescado',
        qty: 1,
        price: 22.0,
        station: 'Barra Fría',
        description: 'Pesca fresca del día, limón de Chulucanas y ají limo',
        status: 'cooking'
      },
      {
        id: 'dish-05-2',
        name: '1x Combinado Naomi',
        qty: 1,
        price: 22.0,
        station: 'Cocina',
        description: 'Tallarín, chicharrón, ceviche, arroz con mariscos y pollo',
        status: 'ready' // ¡Listo para recoger!
      }
    ],
    drinks: [
      {
        id: 'drk-05-1',
        name: 'Gaseosa Inca Kola',
        size: '1 litro',
        qty: 1,
        price: 8.0,
        served: false
      },
      {
        id: 'drk-05-2',
        name: 'Chilcano de Pisco',
        size: 'Vaso',
        qty: 2,
        price: 8.0,
        served: false
      }
    ]
  },
  {
    id: 'mesa-06',
    number: '06',
    status: 'bill_requested',
    statusLabel: 'Cuenta Pedida',
    zone: 'Salón Principal',
    waiter: 'Rosa Paredes',
    diners: 3,
    timeInSalon: '45 min',
    total: 94.0,
    notes: 'Cliente solicitó cuenta dividida en 2',
    dishes: [
      {
        name: '1x Ceviche Clásico de Corvina',
        qty: 1,
        station: 'Barra Fría',
        description: 'Corvina fresca, camote glaseado y choclo desgranado',
        status: 'served'
      },
      {
        name: '1x Jalea Especial de Mariscos',
        qty: 1,
        station: 'Fritura',
        description: 'Mixtura crocante con tártara artesanal',
        status: 'served'
      }
    ],
    drinks: [
      {
        id: 'drk-06-1',
        name: 'Chicha Morada de la Casa',
        size: 'Jarra 1 Litro',
        qty: 1,
        price: 12.0,
        served: true,
        servedAt: '13:15'
      }
    ]
  },
  {
    id: 'mesa-08',
    number: '08',
    status: 'bill_requested',
    statusLabel: 'Cuenta Pedida',
    zone: 'Terraza Marina',
    waiter: 'Jorge Benítez',
    diners: 6,
    timeInSalon: '1h 10m',
    total: 145.0,
    notes: 'Pago en efectivo S/ 150. Vuelto S/ 5',
    dishes: [
      {
        name: '2x Ronda Fría Especial (Ceviche + Tiradito + Causa)',
        qty: 2,
        station: 'Barra Fría',
        description: 'Platón marino familiar para compartir',
        status: 'served'
      },
      {
        name: '1x Arroz con Mariscos a la Limeña',
        qty: 1,
        station: 'Salteados',
        description: 'Arroz cremoso con mixtura de mariscos y parmesano',
        status: 'served'
      }
    ],
    drinks: [
      {
        id: 'drk-08-1',
        name: 'Cerveza Cusqueña Trigo',
        size: 'Botella 620ml',
        qty: 3,
        price: 12.0,
        served: true,
        servedAt: '12:55'
      }
    ]
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // --- 1. CALIENTES ---
  {
    id: 101,
    name: 'Sudados (Cabrilla, Tramboyo o Pintadilla)',
    category: 'calientes',
    price: 30.0,
    description: 'Sudado de cabrilla • Sudado de tramboyo • Sudado de pintadilla.',
    tag: 'Especial Marino',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 18,
    sizes: [
      { name: 'Porción Completa', price: 30.0 }
    ],
    customization: {
      picante: 'Moderado',
      puntoSal: true,
      sinCulantro: false,
      ajiAparte: false,
      cebollaLavada: false
    }
  },
  {
    id: 102,
    name: 'Parihuela mixta',
    category: 'calientes',
    price: 30.0,
    description: 'Concentrado sustancioso de mariscos surtidos, cangrejo y pescado fresco en punto aromático.',
    tag: 'Levanta Muertos',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 22,
    sizes: [
      { name: 'Porción Completa', price: 30.0 }
    ]
  },
  {
    id: 103,
    name: 'Chilcano',
    category: 'calientes',
    price: 8.0,
    description: 'Chilcano especial caliente servido con cancha serrana, limón y cebollita china.',
    tag: 'Especial',
    image: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 35,
    sizes: [
      { name: 'Especial', price: 8.0 }
    ]
  },

  // --- 2. BEBIDAS ---
  {
    id: 201,
    name: 'Refresco (Natural)',
    category: 'bebidas',
    price: 2.0,
    description: 'Chicha morada o maracuyá fresca natural. Servida al instante por el mesero.',
    tag: 'Entrega por Mozo',
    isDrink: true,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 45,
    sizes: [
      { name: 'Vaso', price: 2.0 },
      { name: 'Medio litro', price: 4.0 },
      { name: 'Litro', price: 8.0 }
    ]
  },
  {
    id: 202,
    name: 'Gaseosas',
    category: 'bebidas',
    price: 3.0,
    description: 'Inca Kola o Coca Cola helada o al tiempo. Servida directamente por el mesero.',
    tag: 'Entrega por Mozo',
    isDrink: true,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 60,
    sizes: [
      { name: 'Personal', price: 3.0 },
      { name: '1/2 lt', price: 5.0 },
      { name: '1 litro', price: 8.0 },
      { name: '1 litro y medio', price: 10.0 }
    ]
  },
  {
    id: 203,
    name: 'Cervezas Cusqueña (trigo o negra)',
    category: 'bebidas',
    price: 12.0,
    description: 'Cerveza Cusqueña helada servida de inmediato por el mesero.',
    tag: 'Entrega por Mozo',
    isDrink: true,
    image: 'https://images.unsplash.com/photo-1608270195230-058f964dc0b0?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 30,
    sizes: [
      { name: 'Botella', price: 12.0 }
    ]
  },
  {
    id: 204,
    name: 'Cerveza Pilsen',
    category: 'bebidas',
    price: 10.0,
    description: 'Pilsen helada servida al instante en mesa por el mozo.',
    tag: 'Entrega por Mozo',
    isDrink: true,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 40,
    sizes: [
      { name: 'Botella', price: 10.0 }
    ]
  },

  // --- 3. COMBINADOS ---
  {
    id: 301,
    name: 'Combinado Clásico',
    category: 'combinados',
    price: 12.0,
    description: 'Pescado, mariscos, chicharrón, lechuga, choclo y canchita.',
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 35,
    sizes: [
      { name: 'Porción Completa', price: 12.0 }
    ]
  },
  {
    id: 302,
    name: 'Combinado Naomi',
    category: 'combinados',
    price: 15.0,
    description: 'Tallarín, chicharrón, ceviche, arroz con mariscos y pollo.',
    tag: 'Criollo Marino',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 28,
    sizes: [
      { name: 'Porción Completa', price: 15.0 }
    ]
  },
  {
    id: 303,
    name: 'Combinado Súper Nélida',
    category: 'combinados',
    price: 30.0,
    description: 'Ceviche, arroz con mariscos, chicharrón, huancaína, arroz con pollo, causa, chicharrón mixto y pescado.',
    tag: 'Plato Bandera',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 20,
    sizes: [
      { name: 'Gran Fuente', price: 30.0 }
    ]
  },
  {
    id: 304,
    name: 'Tallarín Rojo',
    category: 'combinados',
    price: 12.0,
    description: 'Tallarín a la huancaína tradicional.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 25,
    sizes: [
      { name: 'Porción', price: 12.0 }
    ]
  },
  {
    id: 305,
    name: 'Arroz con Pollo',
    category: 'combinados',
    price: 15.0,
    description: 'Arroz con pollo y huancaína aromático con culantro criollo.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 24,
    sizes: [
      { name: 'Porción', price: 15.0 }
    ]
  },
  {
    id: 306,
    name: 'Causa sola',
    category: 'combinados',
    price: 7.0,
    description: 'Masa de papa amarilla sazonada con ají amarillo y limón.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 30,
    sizes: [
      { name: 'Personal', price: 7.0 },
      { name: 'Familiar', price: 15.0 }
    ]
  },
  {
    id: 307,
    name: 'Tallarín solo',
    category: 'combinados',
    price: 15.0,
    description: 'Porción de tallarines criollos en salsa especial.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 20,
    sizes: [
      { name: 'Personal', price: 15.0 },
      { name: 'Fuente', price: 20.0 }
    ]
  },

  // --- 4. CEVICHES ---
  {
    id: 401,
    name: 'Ceviche de Pescado',
    category: 'ceviches',
    price: 20.0,
    description: 'Pesca fresca del día con limón norteño, choclo, camote y canchita.',
    tag: 'Clásico La Barra',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 40,
    sizes: [
      { name: 'Porción', price: 20.0 }
    ],
    customization: {
      picante: 'Moderado',
      puntoSal: true,
      sinCulantro: false,
      ajiAparte: false,
      cebollaLavada: true
    }
  },
  {
    id: 402,
    name: 'Ceviche Mixto',
    category: 'ceviches',
    price: 25.0,
    description: 'Pesca del día y mariscos seleccionados bañados en leche de tigre.',
    tag: 'Favorito',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 35,
    sizes: [
      { name: 'Porción', price: 25.0 }
    ]
  },
  {
    id: 403,
    name: 'Ceviche Pota',
    category: 'ceviches',
    price: 20.0,
    description: 'Pota fresca marinada en zumo de limón y ají limo recién cortado.',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 30,
    sizes: [
      { name: 'Porción', price: 20.0 }
    ]
  },
  {
    id: 404,
    name: 'Ceviche Pulpo',
    category: 'ceviches',
    price: 25.0,
    description: 'Tiras tiernas de pulpo marinadas al momento con camote y choclo.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 20,
    sizes: [
      { name: 'Porción', price: 25.0 }
    ]
  },
  {
    id: 405,
    name: 'Ceviche Mixtura',
    category: 'ceviches',
    price: 30.0,
    description: 'Gran mixtura de mariscos frescos seleccionados.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 25,
    sizes: [
      { name: 'Porción', price: 30.0 }
    ]
  },
  {
    id: 406,
    name: 'Ceviche Conchas Negras',
    category: 'ceviches',
    price: 30.0,
    description: 'Conchas negras de Tumbes abiertas al instante.',
    tag: 'Afrodisíaco',
    image: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 15,
    sizes: [
      { name: 'Porción', price: 30.0 }
    ]
  },
  {
    id: 407,
    name: 'Ceviche conchas negras mixtas',
    category: 'ceviches',
    price: 35.0,
    description: 'Conchas negras combinadas con pescado fresco y mariscos surtidos.',
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 12,
    sizes: [
      { name: 'Porción', price: 35.0 }
    ]
  },
  {
    id: 408,
    name: 'Ceviche de Almejas',
    category: 'ceviches',
    price: 25.0,
    description: 'Almejas marinas frescas seleccionadas en zumo de limón y ají limo.',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 18,
    sizes: [
      { name: 'Porción', price: 25.0 }
    ]
  },
  {
    id: 409,
    name: 'Ceviche de Langostino',
    category: 'ceviches',
    price: 30.0,
    description: 'Colas de langostinos en su punto exacto con leche de tigre clásica.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 22,
    sizes: [
      { name: 'Porción', price: 30.0 }
    ]
  },
  {
    id: 410,
    name: 'Ceviche de Conchas de Abanico',
    category: 'ceviches',
    price: 30.0,
    description: 'Conchas de abanico con su coral en jugo acevichado y canchita.',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 16,
    sizes: [
      { name: 'Porción', price: 30.0 }
    ]
  },
  {
    id: 411,
    name: 'Ceviche en tinta de Huancaína',
    category: 'ceviches',
    price: 25.0,
    description: 'Pescado fresco bañado en fusión de crema huancaína y leche de tigre.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 20,
    sizes: [
      { name: 'Porción', price: 25.0 }
    ]
  },

  // --- 5. LECHES DE TIGRE ---
  {
    id: 501,
    name: 'Leche de Pescado',
    category: 'leches',
    price: 10.0,
    description: 'Copa concentrada con pescado fresco, chicharrón, canchita y choclo.',
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 30,
    sizes: [
      { name: 'Copa', price: 10.0 }
    ]
  },
  {
    id: 502,
    name: 'Leche Mixta',
    category: 'leches',
    price: 15.0,
    description: 'Pescado y mixtura de mariscos en copa helada con chicharrón crocante.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 25,
    sizes: [
      { name: 'Copa', price: 15.0 }
    ]
  },
  {
    id: 503,
    name: 'Leche de Pota',
    category: 'leches',
    price: 20.0,
    description: 'Pota marinada con zumo cítrico, ají limo y camote glaseado.',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 20,
    sizes: [
      { name: 'Copa', price: 20.0 }
    ]
  },
  {
    id: 504,
    name: 'Leche de Pantera',
    category: 'leches',
    price: 25.0,
    description: 'Elaborada a base de conchas negras norteñas, vigorosa y potente.',
    tag: 'Fuerza Marina',
    image: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 15,
    sizes: [
      { name: 'Copa', price: 25.0 }
    ]
  },
  {
    id: 505,
    name: 'Leche de Pantera Mixta',
    category: 'leches',
    price: 30.0,
    description: 'Conchas negras de Tumbes con pescado, langostinos y calamar crocante.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 14,
    sizes: [
      { name: 'Copa', price: 30.0 }
    ]
  },

  // --- 6. ARROCES ---
  {
    id: 601,
    name: 'Arroz con Mariscos',
    category: 'arroces',
    price: 20.0,
    description: 'Arroz meloso con mariscos flameados al vino y sarza criolla.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 35,
    sizes: [
      { name: 'Porción', price: 20.0 }
    ]
  },
  {
    id: 602,
    name: 'Arroz con Mariscos + Ceviche',
    category: 'arroces',
    price: 25.0,
    description: 'El clásico dúo marino: arroz caliente con mariscos y ceviche fresco.',
    tag: 'Dúo Preferido',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 30,
    sizes: [
      { name: 'Dúo', price: 25.0 }
    ]
  },
  {
    id: 603,
    name: 'Arroz Chaufa de Mariscos',
    category: 'arroces',
    price: 15.0,
    description: 'Salteado al wok al estilo chifa con mariscos, cebollita china y sillao.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 32,
    sizes: [
      { name: 'Porción', price: 15.0 }
    ]
  },
  {
    id: 604,
    name: 'Arroz Chaufa de Mariscos + Ceviche',
    category: 'arroces',
    price: 20.0,
    description: 'Chaufa marino al wok acompañado de ceviche de pescado fresco.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 28,
    sizes: [
      { name: 'Dúo', price: 20.0 }
    ]
  },

  // --- 7. TRÍOS ---
  {
    id: 701,
    name: 'Trío Marino',
    category: 'trios',
    price: 15.0,
    description: 'Arroz con mariscos, ceviche o leche, y chicharrón crocante.',
    tag: 'El Más Pedido',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 40,
    sizes: [
      { name: 'Personal', price: 15.0 },
      { name: 'Mediano', price: 20.0 },
      { name: 'Familiar', price: 25.0 }
    ]
  },
  {
    id: 702,
    name: 'Trío Oriental',
    category: 'trios',
    price: 15.0,
    description: 'Arroz chaufa, tallarín, chicharrón o leche.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 30,
    sizes: [
      { name: 'Personal', price: 15.0 },
      { name: 'Mediano', price: 20.0 },
      { name: 'Familiar', price: 25.0 }
    ]
  },
  {
    id: 703,
    name: 'Trío Criollo',
    category: 'trios',
    price: 15.0,
    description: 'Arroz con pollo, ceviche o leche de tigre, y papa a la huancaína.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 25,
    sizes: [
      { name: 'Personal', price: 15.0 },
      { name: 'Mediano', price: 20.0 },
      { name: 'Familiar', price: 25.0 }
    ]
  },

  // --- 8. JALEAS ---
  {
    id: 801,
    name: 'Jalea de Pescado',
    category: 'jaleas',
    price: 25.0,
    description: 'Filetes de pescado crocantes y dorados con yucas fritas y sarza criolla.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 22,
    sizes: [
      { name: 'Porción Completa', price: 25.0 }
    ]
  },
  {
    id: 802,
    name: 'Jalea Mixta',
    category: 'jaleas',
    price: 30.0,
    description: 'Pescado, calamar, langostinos y conchas crocantes con sarza criolla y tártara.',
    tag: 'Mega Crocante',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80',
    available: true,
    portionCount: 25,
    sizes: [
      { name: 'Porción Completa', price: 30.0 }
    ]
  }
];

export const INITIAL_KDS_TICKETS: KDSTicket[] = [
  {
    id: '1042',
    table: 'Mesa 04',
    station: 'frios',
    status: 'ready',
    waiter: 'Carlos Mendoza',
    elapsed: 'Listo hace 2m',
    time: '13:30',
    createdAt: Date.now() - 25 * 60 * 1000, // Llegó a las 13:30 (Primero en llegar)
    arrivalOrder: 1,
    drinksNote: 'Bebidas ya servidas por mozo',
    items: [
      {
        id: '1042-1',
        dishId: 402,
        name: 'Ceviche Mixto',
        qty: 1,
        price: 18.0,
        substation: 'FRÍOS',
        notes: 'Ají limo medio, camote glaseado',
        isReady: true,
        isServed: false
      },
      {
        id: '1042-2',
        dishId: 604,
        name: 'Arroz con Mariscos + Ceviche',
        qty: 1,
        price: 18.0,
        substation: 'SALTEADOS',
        notes: 'Punto criollo',
        isReady: true,
        isServed: false
      }
    ]
  },
  {
    id: '1045',
    table: 'Mesa 05',
    station: 'calientes',
    status: 'cooking',
    waiter: 'Carlos Mendoza',
    elapsed: '06:24 min',
    time: '13:34',
    createdAt: Date.now() - 15 * 60 * 1000, // Llegó a las 13:34 (Segundo en llegar)
    arrivalOrder: 2,
    drinksNote: '2x Bebidas pendientes en salón',
    items: [
      {
        id: '1045-1',
        dishId: 301,
        name: 'Combinado Naomi',
        qty: 1,
        price: 15.0,
        substation: 'CALIENTES',
        notes: 'Tallarín y arroz con mariscos bien caliente',
        isReady: true, // ¡Este plato ya fue preparado por el cocinero y está listo para recoger!
        isServed: false
      },
      {
        id: '1045-2',
        dishId: 401,
        name: 'Ceviche de Pescado',
        qty: 1,
        price: 16.0,
        substation: 'FRÍOS',
        notes: 'Sin ají',
        isReady: false, // Aún en preparación
        isServed: false
      }
    ]
  },
  {
    id: '1046',
    table: 'Mesa 07',
    station: 'calientes',
    status: 'pending',
    waiter: 'Jorge Benítez',
    elapsed: 'Hace 45s',
    time: '13:38',
    createdAt: Date.now() - 3 * 60 * 1000, // Llegó a las 13:38 (Tercero en llegar)
    arrivalOrder: 3,
    drinksNote: '1x Refresco 1L pendiente por mozo',
    items: [
      {
        id: '1046-1',
        dishId: 101,
        name: 'Sudado de Cabrilla',
        qty: 1,
        price: 22.0,
        substation: 'CALIENTES',
        notes: 'Con yuca extra',
        isReady: false,
        isServed: false
      },
      {
        id: '1046-2',
        dishId: 404,
        name: 'Ceviche de Conchas Negras',
        qty: 1,
        price: 25.0,
        substation: 'FRÍOS',
        notes: 'Conchas recién abiertas',
        isReady: false,
        isServed: false
      }
    ]
  }
];

export const INITIAL_MASTER_CARTAS: MasterCarta[] = [
  {
    id: 'carta-la-barra',
    name: 'Carta Oficial Cevichería La Barra Sabrisimo',
    description: 'Carta matriz oficial con 38 especialidades: Calientes, Ceviches, Leches de Tigre, Arroces, Combinados, Tríos, Jaleas y Bebidas.',
    dishes: INITIAL_MENU_ITEMS,
    createdAt: '13/09/2026',
    assignedChainIds: ['la-barra']
  },
  {
    id: 'carta-puerto-azul',
    name: 'Carta Tradición Marina Puerto Azul',
    description: 'Carta clásica norteña y criolla marina para locales y sedes con barra tradicional.',
    dishes: INITIAL_MENU_ITEMS.filter((_, idx) => idx % 2 === 0),
    createdAt: '10/09/2026',
    assignedChainIds: ['puerto-azul']
  },
  {
    id: 'carta-express',
    name: 'Carta Marina Express & Al Paso',
    description: 'Carta ágil con los combinados, tríos, leches de tigre y bebidas de más alta rotación.',
    dishes: INITIAL_MENU_ITEMS.filter((d) => ['combinados', 'trios', 'leches', 'bebidas'].includes(d.category)),
    createdAt: '12/09/2026',
    assignedChainIds: []
  }
];

export const INITIAL_CHAINS: ChainBrand[] = [
  {
    id: 'la-barra',
    name: 'Cevichería La Barra Sabrisimo',
    legalName: 'La Barra Sabrisimo E.I.R.L.',
    ruc: '20608945231',
    plan: 'Enterprise',
    status: 'Activa',
    assignedCartaId: 'carta-la-barra',
    adminName: 'Roberto Morales',
    adminEmail: 'roberto@labarrasabrisimo.pe',
    adminPhone: '+51 987 654 321',
    locationsCount: 3,
    locations: [
      {
        id: 'loc-miraflores',
        name: 'Sede Principal La Mar',
        address: 'Av. Mariscal La Mar 1290',
        district: 'Miraflores',
        city: 'Lima',
        phone: '+51 1 445-8921',
        tables: 16,
        todaySales: 6420,
        active: true,
        managerName: 'Lucía Ramos',
        managerEmail: 'lucia.ramos@labarrasabrisimo.pe',
        managerPhone: '+51 976 112 345'
      },
      {
        id: 'loc-chorrillos',
        name: 'Sede Chorrillos Malecón',
        address: 'Malecón Grau 340',
        district: 'Chorrillos',
        city: 'Lima',
        phone: '+51 1 251-7730',
        tables: 12,
        todaySales: 4180,
        active: true,
        managerName: 'Manuel Huamán',
        managerEmail: 'manuel.h@labarrasabrisimo.pe',
        managerPhone: '+51 984 223 901'
      },
      {
        id: 'loc-san-miguel',
        name: 'Sede San Miguel Costanera',
        address: 'Av. Costanera 850',
        district: 'San Miguel',
        city: 'Lima',
        phone: '+51 1 562-4419',
        tables: 14,
        todaySales: 3850,
        active: true,
        managerName: 'Patricia Solís',
        managerEmail: 'patricia.s@labarrasabrisimo.pe',
        managerPhone: '+51 991 667 820'
      }
    ]
  },
  {
    id: 'puerto-azul',
    name: 'Cevichería Puerto Azul Tradición',
    legalName: 'Inversiones Puerto Azul S.A.C.',
    ruc: '20554912044',
    plan: 'Pro',
    status: 'Activa',
    assignedCartaId: 'carta-puerto-azul',
    adminName: 'Giancarlo Rossi',
    adminEmail: 'giancarlo@puertoazul.pe',
    adminPhone: '+51 998 334 112',
    locationsCount: 2,
    locations: [
      {
        id: 'loc-barranco',
        name: 'Sede Barranco Tradicional',
        address: 'Av. Pedro de Osma 214',
        district: 'Barranco',
        city: 'Lima',
        phone: '+51 1 247-6632',
        tables: 18,
        todaySales: 5200,
        active: true,
        managerName: 'Ricardo Vega',
        managerEmail: 'ricardo.v@puertoazul.pe',
        managerPhone: '+51 988 776 543'
      },
      {
        id: 'loc-callao',
        name: 'Sede Callao Monumental',
        address: 'Jr. Constitución 250',
        district: 'Callao',
        city: 'Callao',
        phone: '+51 1 429-1811',
        tables: 10,
        todaySales: 2950,
        active: true,
        managerName: 'Fiorella Díaz',
        managerEmail: 'fiorella.d@puertoazul.pe',
        managerPhone: '+51 975 432 109'
      }
    ]
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'adm-global',
    name: 'Ing. Alejandro Vega',
    email: 'alejandro@gastronomiaperu.cloud',
    phone: '+51 999 000 111',
    role: 'Administrador Global',
    roleKey: 'admin_global',
    brand: 'Plataforma SaaS Central',
    initials: 'AV',
    active: true
  },
  {
    id: 'adm-gen-1',
    name: 'Roberto Morales',
    email: 'roberto@labarrasabrisimo.pe',
    phone: '+51 987 654 321',
    role: 'Administrador General',
    roleKey: 'admin_general',
    brand: 'Cevichería La Barra Sabrisimo',
    brandId: 'la-barra',
    initials: 'RM',
    active: true
  },
  {
    id: 'adm-gen-2',
    name: 'Giancarlo Rossi',
    email: 'giancarlo@puertoazul.pe',
    phone: '+51 998 334 112',
    role: 'Administrador General',
    roleKey: 'admin_general',
    brand: 'Cevichería Puerto Azul Tradición',
    brandId: 'puerto-azul',
    initials: 'GR',
    active: true
  },
  {
    id: 'adm-sede-1',
    name: 'Lucía Ramos',
    email: 'lucia.ramos@labarrasabrisimo.pe',
    phone: '+51 976 112 345',
    role: 'Administrador de Sede',
    roleKey: 'admin_sede',
    brand: 'Cevichería La Barra Sabrisimo',
    brandId: 'la-barra',
    branchName: 'Sede Principal La Mar y Sede Chorrillos',
    branchId: 'loc-miraflores',
    assignedBranchIds: ['loc-miraflores', 'loc-chorrillos'], // Administradora Multi-Sede (Miraflores + Chorrillos)
    initials: 'LR',
    active: true
  },
  {
    id: 'adm-sede-2',
    name: 'Manuel Huamán',
    email: 'manuel.h@labarrasabrisimo.pe',
    phone: '+51 984 223 901',
    role: 'Administrador de Sede',
    roleKey: 'admin_sede',
    brand: 'Cevichería La Barra Sabrisimo',
    brandId: 'la-barra',
    branchName: 'Sede Chorrillos Malecón',
    branchId: 'loc-chorrillos',
    assignedBranchIds: ['loc-chorrillos'],
    initials: 'MH',
    active: true
  },
  {
    id: 'adm-sede-3',
    name: 'Patricia Solís',
    email: 'patricia.s@labarrasabrisimo.pe',
    phone: '+51 991 667 820',
    role: 'Administrador de Sede',
    roleKey: 'admin_sede',
    brand: 'Cevichería La Barra Sabrisimo',
    brandId: 'la-barra',
    branchName: 'Sede San Miguel Costanera',
    branchId: 'loc-san-miguel',
    assignedBranchIds: ['loc-san-miguel'],
    initials: 'PS',
    active: true
  },
  {
    id: 'adm-sede-4',
    name: 'Ricardo Vega',
    email: 'ricardo.v@puertoazul.pe',
    phone: '+51 988 776 543',
    role: 'Administrador de Sede',
    roleKey: 'admin_sede',
    brand: 'Cevichería Puerto Azul Tradición',
    brandId: 'puerto-azul',
    branchName: 'Sede Barranco Tradicional',
    branchId: 'loc-barranco',
    assignedBranchIds: ['loc-barranco'],
    initials: 'RV',
    active: true
  },
  {
    id: 'adm-mozo-1',
    name: 'Carlos Mendoza',
    email: 'carlos.m@labarrasabrisimo.pe',
    phone: '+51 965 443 221',
    role: 'Mesero',
    roleKey: 'mesero',
    brand: 'Cevichería La Barra Sabrisimo',
    brandId: 'la-barra',
    branchName: 'Sede Principal La Mar',
    branchId: 'loc-miraflores',
    assignedBranchIds: ['loc-miraflores', 'loc-chorrillos'],
    initials: 'CM',
    active: true
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-1',
    name: 'Carlos Mendoza',
    role: 'Mozo Principal',
    pin: '1234',
    phone: '+51 965 443 221',
    assignedBranchIds: ['loc-miraflores', 'loc-chorrillos'], // Asignado a más de una sede
    brandId: 'la-barra',
    tablesZone: 'Mesas 1 a 6',
    shift: 'Turno Mañana',
    active: true,
    avatarColor: 'bg-teal-600'
  },
  {
    id: 'stf-2',
    name: 'Rosa Paredes',
    role: 'Moza Salón',
    pin: '2345',
    phone: '+51 988 112 990',
    assignedBranchIds: ['loc-miraflores'],
    brandId: 'la-barra',
    tablesZone: 'Mesas 7 a 12',
    shift: 'Turno Tarde',
    active: true,
    avatarColor: 'bg-purple-600'
  },
  {
    id: 'stf-3',
    name: 'Jorge Benítez',
    role: 'Mozo Terraza',
    pin: '3456',
    phone: '+51 977 443 881',
    assignedBranchIds: ['loc-miraflores', 'loc-chorrillos'], // Asignado a ambas sedes por Lucía Ramos
    brandId: 'la-barra',
    tablesZone: 'Mesas 13 a 16 & Barra',
    shift: 'Turno Completo',
    active: true,
    avatarColor: 'bg-amber-600'
  },
  {
    id: 'stf-4',
    name: 'Walter Quispe',
    role: 'Barman / Bebidas',
    pin: '4567',
    phone: '+51 955 889 001',
    assignedBranchIds: ['loc-miraflores'],
    brandId: 'la-barra',
    tablesZone: 'Estación Barra Fría & Coctelería',
    shift: 'Turno Tarde',
    active: true,
    avatarColor: 'bg-blue-600'
  },
  {
    id: 'stf-5',
    name: 'Marilú Chávez',
    role: 'Cajera POS',
    pin: '5678',
    phone: '+51 944 332 119',
    assignedBranchIds: ['loc-miraflores', 'loc-chorrillos', 'loc-san-miguel'], // Multi-sede en 3 locales
    brandId: 'la-barra',
    tablesZone: 'Caja Principal y Despacho',
    shift: 'Turno Completo',
    active: true,
    avatarColor: 'bg-emerald-600'
  },
  {
    id: 'stf-6',
    name: 'Julio Cárdenas',
    role: 'Mozo Salón',
    pin: '6789',
    phone: '+51 933 221 004',
    assignedBranchIds: ['loc-chorrillos'],
    brandId: 'la-barra',
    tablesZone: 'Mesas 1 a 8',
    shift: 'Turno Mañana',
    active: true,
    avatarColor: 'bg-rose-600'
  },
  {
    id: 'stf-7',
    name: 'Mario Quispe',
    role: 'Jefe de Cocina KDS',
    pin: '5555',
    phone: '+51 988 123 456',
    assignedBranchIds: ['loc-miraflores'],
    brandId: 'la-barra',
    tablesZone: 'Fogones, Calientes & Fríos KDS',
    shift: 'Turno Completo',
    active: true,
    avatarColor: 'bg-red-600'
  }
];

