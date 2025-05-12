
export interface Product {
  id: string;
  name: string;
  category: string;
  type: 'Insumos' | 'Producto Terminado';  // New field for product type
  quantity: number;
  price: number;
  description: string;
  sku: string;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  reference: string;
  productId: string;
  productSku: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  supplierOrClient: string;
  notes: string;
}

// Mock products data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Camisa Corporativa Manga Larga",
    category: "Camisas",
    type: "Producto Terminado",
    quantity: 120,
    price: 45000,
    description: "Camisa corporativa de manga larga con logo bordado",
    sku: "CAM-ML-001",
    lastUpdated: "2025-05-08T14:30:00Z"
  },
  {
    id: "2",
    name: "Camisa Corporativa Manga Corta",
    category: "Camisas",
    type: "Producto Terminado",
    quantity: 85,
    price: 38000,
    description: "Camisa corporativa de manga corta con logo estampado",
    sku: "CAM-MC-002",
    lastUpdated: "2025-05-07T10:15:00Z"
  },
  {
    id: "3",
    name: "Gorra Bordada Logo Empresarial",
    category: "Gorras",
    type: "Producto Terminado",
    quantity: 200,
    price: 22000,
    description: "Gorra con logo empresarial bordado en alta calidad",
    sku: "GOR-BOR-003",
    lastUpdated: "2025-05-08T09:45:00Z"
  },
  {
    id: "4",
    name: "Overol Industrial Denim",
    category: "Overoles",
    type: "Producto Terminado",
    quantity: 45,
    price: 85000,
    description: "Overol industrial resistente de material denim",
    sku: "OVE-DEN-004",
    lastUpdated: "2025-05-06T16:20:00Z"
  },
  {
    id: "5",
    name: "Delantal Cocina Profesional",
    category: "Delantales",
    type: "Producto Terminado",
    quantity: 60,
    price: 28000,
    description: "Delantal de cocina profesional resistente a manchas",
    sku: "DEL-COC-005",
    lastUpdated: "2025-05-08T11:10:00Z"
  },
  {
    id: "6",
    name: "Chaleco Reflectivo Seguridad",
    category: "Chalecos",
    type: "Producto Terminado",
    quantity: 75,
    price: 32000,
    description: "Chaleco reflectivo con tiras de alta visibilidad",
    sku: "CHA-REF-006",
    lastUpdated: "2025-05-07T14:50:00Z"
  },
  {
    id: "7",
    name: "Maleta Mochila Corporativa",
    category: "Maletas",
    type: "Producto Terminado",
    quantity: 50,
    price: 55000,
    description: "Mochila corporativa con compartimiento para laptop",
    sku: "MAL-COR-007",
    lastUpdated: "2025-05-05T10:30:00Z"
  },
  {
    id: "8",
    name: "Uniforme Completo Administrativo",
    category: "Uniformes",
    type: "Producto Terminado",
    quantity: 30,
    price: 120000,
    description: "Conjunto completo de uniforme administrativo",
    sku: "UNI-ADM-008",
    lastUpdated: "2025-05-04T09:15:00Z"
  },
  {
    id: "9",
    name: "Camiseta Polo Bordada",
    category: "Camisetas",
    type: "Producto Terminado",
    quantity: 150,
    price: 35000,
    description: "Camiseta polo con logo empresarial bordado",
    sku: "POL-BOR-009",
    lastUpdated: "2025-05-07T15:40:00Z"
  },
  {
    id: "10",
    name: "Chaqueta Corporativa Impermeable",
    category: "Chaquetas",
    type: "Insumos",
    quantity: 25,
    price: 98000,
    description: "Chaqueta corporativa impermeable para uso exterior",
    sku: "CHA-IMP-010",
    lastUpdated: "2025-05-03T13:20:00Z"
  }
];

// Mock stock movements data
export const mockStockMovements: StockMovement[] = [
  {
    id: "1",
    reference: "MOV-ENT-001",
    productId: "1",
    productSku: "CAM-ML-001",
    type: "in",
    quantity: 30,
    date: "2025-05-08T14:30:00Z",
    supplierOrClient: "Textiles del Norte",
    notes: "Entrega programada mensual"
  },
  {
    id: "2",
    reference: "MOV-SAL-001",
    productId: "2",
    productSku: "CAM-MC-002",
    type: "out",
    quantity: 15,
    date: "2025-05-07T15:45:00Z",
    supplierOrClient: "Hotel Empresarial",
    notes: "Pedido Hotel Empresarial #HE-452"
  },
  {
    id: "3",
    reference: "MOV-ENT-002",
    productId: "3",
    productSku: "GOR-BOR-003",
    type: "in",
    quantity: 50,
    date: "2025-05-06T09:20:00Z",
    supplierOrClient: "Manufacturas Express",
    notes: "Nuevo lote de producción"
  },
  {
    id: "4",
    reference: "MOV-SAL-002",
    productId: "1",
    productSku: "CAM-ML-001",
    type: "out",
    quantity: 10,
    date: "2025-05-05T16:10:00Z",
    supplierOrClient: "Constructora ABC",
    notes: "Pedido Constructora ABC #CA-789"
  },
  {
    id: "5",
    reference: "MOV-ENT-003",
    productId: "5",
    productSku: "DEL-COC-005",
    type: "in",
    quantity: 25,
    date: "2025-05-04T11:05:00Z",
    supplierOrClient: "Importadora Textil",
    notes: "Reposición de inventario"
  }
];

export const categories = Array.from(new Set(mockProducts.map(p => p.category)));

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

export const addStockMovement = (movement: Omit<StockMovement, 'id' | 'reference' | 'date'>) => {
  // Generate timestamp
  const now = new Date();
  const formattedDate = now.toISOString();
  
  // Generate reference number based on type and current count
  const typePrefix = movement.type === 'in' ? 'ENT' : 'SAL';
  const movCount = stockMovements.filter(m => m.type === movement.type).length + 1;
  const paddedCount = movCount.toString().padStart(3, '0');
  const reference = `MOV-${typePrefix}-${paddedCount}`;
  
  const newMovement = {
    ...movement,
    id: (stockMovements.length + 1).toString(),
    reference,
    date: formattedDate,
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
    p.category.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery)
  );
  
  return Promise.resolve(results);
};

export const filterProducts = ({ 
  category, 
  minStock = 0,
  maxStock = Number.MAX_SAFE_INTEGER
}: {
  category?: string;
  minStock?: number;
  maxStock?: number;
}) => {
  let filtered = [...products];
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  filtered = filtered.filter(p => p.quantity >= minStock && p.quantity <= maxStock);
  
  return Promise.resolve(filtered);
};
