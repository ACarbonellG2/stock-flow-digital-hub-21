export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  location: string;
  sku: string;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  notes: string;
}

// Mock products data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Camisa Corporativa Manga Larga",
    category: "Camisas",
    quantity: 120,
    price: 45000,
    location: "Bodega A",
    sku: "CAM-ML-001",
    lastUpdated: "2025-05-08T14:30:00Z"
  },
  {
    id: "2",
    name: "Camisa Corporativa Manga Corta",
    category: "Camisas",
    quantity: 85,
    price: 38000,
    location: "Bodega A",
    sku: "CAM-MC-002",
    lastUpdated: "2025-05-07T10:15:00Z"
  },
  {
    id: "3",
    name: "Gorra Bordada Logo Empresarial",
    category: "Gorras",
    quantity: 200,
    price: 22000,
    location: "Bodega B",
    sku: "GOR-BOR-003",
    lastUpdated: "2025-05-08T09:45:00Z"
  },
  {
    id: "4",
    name: "Overol Industrial Denim",
    category: "Overoles",
    quantity: 45,
    price: 85000,
    location: "Bodega C",
    sku: "OVE-DEN-004",
    lastUpdated: "2025-05-06T16:20:00Z"
  },
  {
    id: "5",
    name: "Delantal Cocina Profesional",
    category: "Delantales",
    quantity: 60,
    price: 28000,
    location: "Bodega B",
    sku: "DEL-COC-005",
    lastUpdated: "2025-05-08T11:10:00Z"
  },
  {
    id: "6",
    name: "Chaleco Reflectivo Seguridad",
    category: "Chalecos",
    quantity: 75,
    price: 32000,
    location: "Bodega C",
    sku: "CHA-REF-006",
    lastUpdated: "2025-05-07T14:50:00Z"
  },
  {
    id: "7",
    name: "Maleta Mochila Corporativa",
    category: "Maletas",
    quantity: 50,
    price: 55000,
    location: "Bodega D",
    sku: "MAL-COR-007",
    lastUpdated: "2025-05-05T10:30:00Z"
  },
  {
    id: "8",
    name: "Uniforme Completo Administrativo",
    category: "Uniformes",
    quantity: 30,
    price: 120000,
    location: "Bodega A",
    sku: "UNI-ADM-008",
    lastUpdated: "2025-05-04T09:15:00Z"
  },
  {
    id: "9",
    name: "Camiseta Polo Bordada",
    category: "Camisetas",
    quantity: 150,
    price: 35000,
    location: "Bodega B",
    sku: "POL-BOR-009",
    lastUpdated: "2025-05-07T15:40:00Z"
  },
  {
    id: "10",
    name: "Chaqueta Corporativa Impermeable",
    category: "Chaquetas",
    quantity: 25,
    price: 98000,
    location: "Bodega D",
    sku: "CHA-IMP-010",
    lastUpdated: "2025-05-03T13:20:00Z"
  }
];

// Mock stock movements data
export const mockStockMovements: StockMovement[] = [
  {
    id: "1",
    productId: "1",
    type: "in",
    quantity: 30,
    date: "2025-05-08T14:30:00Z",
    notes: "Entrega de proveedor Textiles del Norte"
  },
  {
    id: "2",
    productId: "2",
    type: "out",
    quantity: 15,
    date: "2025-05-07T15:45:00Z",
    notes: "Pedido Hotel Empresarial #HE-452"
  },
  {
    id: "3",
    productId: "3",
    type: "in",
    quantity: 50,
    date: "2025-05-06T09:20:00Z",
    notes: "Nuevo lote de producción"
  },
  {
    id: "4",
    productId: "1",
    type: "out",
    quantity: 10,
    date: "2025-05-05T16:10:00Z",
    notes: "Pedido Constructora ABC #CA-789"
  },
  {
    id: "5",
    productId: "5",
    type: "in",
    quantity: 25,
    date: "2025-05-04T11:05:00Z",
    notes: "Reposición de inventario"
  }
];

export const categories = Array.from(new Set(mockProducts.map(p => p.category)));
export const locations = Array.from(new Set(mockProducts.map(p => p.location)));

// Simulated API functions
let products = [...mockProducts];
let stockMovements = [...mockStockMovements];

export const getProducts = () => {
  return Promise.resolve([...products]);
};

export const getProductById = (id: string) => {
  const product = products.find(p => p.id === id);
  return Promise.resolve(product || null);
};

export const addProduct = (product: Omit<Product, 'id' | 'lastUpdated'>) => {
  const newProduct = {
    ...product,
    id: (products.length + 1).toString(),
    lastUpdated: new Date().toISOString()
  };
  products = [...products, newProduct];
  return Promise.resolve(newProduct);
};

export const updateProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'lastUpdated'>>) => {
  let updatedProduct: Product | null = null;
  products = products.map(p => {
    if (p.id === id) {
      updatedProduct = {
        ...p,
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      return updatedProduct;
    }
    return p;
  });
  return Promise.resolve(updatedProduct);
};

export const deleteProduct = (id: string) => {
  const productExists = products.some(p => p.id === id);
  if (productExists) {
    products = products.filter(p => p.id !== id);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

export const addStockMovement = (movement: Omit<StockMovement, 'id'>) => {
  const newMovement = {
    ...movement,
    id: (stockMovements.length + 1).toString(),
  };
  stockMovements = [...stockMovements, newMovement];
  
  // Update product quantity
  const product = products.find(p => p.id === movement.productId);
  if (product) {
    const quantityChange = movement.type === 'in' ? movement.quantity : -movement.quantity;
    updateProduct(movement.productId, { quantity: product.quantity + quantityChange });
  }
  
  return Promise.resolve(newMovement);
};

export const getStockMovements = (productId?: string) => {
  if (productId) {
    return Promise.resolve(stockMovements.filter(m => m.productId === productId));
  }
  return Promise.resolve([...stockMovements]);
};

export const searchProducts = (query: string) => {
  if (!query) return Promise.resolve([...products]);
  
  const lowercaseQuery = query.toLowerCase();
  const results = products.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.sku.toLowerCase().includes(lowercaseQuery) ||
    p.category.toLowerCase().includes(lowercaseQuery)
  );
  
  return Promise.resolve(results);
};

export const filterProducts = ({ 
  category, 
  location, 
  minStock = 0,
  maxStock = Number.MAX_SAFE_INTEGER
}: {
  category?: string;
  location?: string;
  minStock?: number;
  maxStock?: number;
}) => {
  let filtered = [...products];
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  if (location) {
    filtered = filtered.filter(p => p.location === location);
  }
  
  filtered = filtered.filter(p => p.quantity >= minStock && p.quantity <= maxStock);
  
  return Promise.resolve(filtered);
};
