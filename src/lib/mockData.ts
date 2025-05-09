
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
    name: "Laptop Dell XPS 13",
    category: "Electronics",
    quantity: 15,
    price: 1299.99,
    location: "Warehouse A",
    sku: "DELL-XPS13-001",
    lastUpdated: "2025-05-08T14:30:00Z"
  },
  {
    id: "2",
    name: "Office Chair Ergonomic",
    category: "Furniture",
    quantity: 25,
    price: 249.99,
    location: "Warehouse B",
    sku: "FURN-CHAIR-002",
    lastUpdated: "2025-05-07T10:15:00Z"
  },
  {
    id: "3",
    name: "Wireless Headphones",
    category: "Electronics",
    quantity: 50,
    price: 89.99,
    location: "Warehouse A",
    sku: "ELEC-HEAD-003",
    lastUpdated: "2025-05-08T09:45:00Z"
  },
  {
    id: "4",
    name: "Desk Lamp LED",
    category: "Home",
    quantity: 30,
    price: 34.99,
    location: "Warehouse C",
    sku: "HOME-LAMP-004",
    lastUpdated: "2025-05-06T16:20:00Z"
  },
  {
    id: "5",
    name: "Smartphone Case",
    category: "Accessories",
    quantity: 100,
    price: 19.99,
    location: "Warehouse A",
    sku: "ACC-CASE-005",
    lastUpdated: "2025-05-08T11:10:00Z"
  },
  {
    id: "6",
    name: "Wireless Mouse",
    category: "Electronics",
    quantity: 45,
    price: 29.99,
    location: "Warehouse B",
    sku: "ELEC-MOUSE-006",
    lastUpdated: "2025-05-07T14:50:00Z"
  },
  {
    id: "7",
    name: "Notebook 200 Pages",
    category: "Stationery",
    quantity: 200,
    price: 5.99,
    location: "Warehouse C",
    sku: "STAT-NOTE-007",
    lastUpdated: "2025-05-05T10:30:00Z"
  },
  {
    id: "8",
    name: "Water Bottle 1L",
    category: "Home",
    quantity: 75,
    price: 12.99,
    location: "Warehouse A",
    sku: "HOME-BOTTLE-008",
    lastUpdated: "2025-05-04T09:15:00Z"
  },
  {
    id: "9",
    name: "External Hard Drive 1TB",
    category: "Electronics",
    quantity: 20,
    price: 79.99,
    location: "Warehouse B",
    sku: "ELEC-HDD-009",
    lastUpdated: "2025-05-07T15:40:00Z"
  },
  {
    id: "10",
    name: "Office Desk",
    category: "Furniture",
    quantity: 10,
    price: 299.99,
    location: "Warehouse C",
    sku: "FURN-DESK-010",
    lastUpdated: "2025-05-03T13:20:00Z"
  }
];

// Mock stock movements data
export const mockStockMovements: StockMovement[] = [
  {
    id: "1",
    productId: "1",
    type: "in",
    quantity: 5,
    date: "2025-05-08T14:30:00Z",
    notes: "Regular resupply"
  },
  {
    id: "2",
    productId: "2",
    type: "out",
    quantity: 2,
    date: "2025-05-07T15:45:00Z",
    notes: "Customer order #12345"
  },
  {
    id: "3",
    productId: "3",
    type: "in",
    quantity: 20,
    date: "2025-05-06T09:20:00Z",
    notes: "New shipment arrived"
  },
  {
    id: "4",
    productId: "1",
    type: "out",
    quantity: 1,
    date: "2025-05-05T16:10:00Z",
    notes: "Internal use - IT department"
  },
  {
    id: "5",
    productId: "5",
    type: "in",
    quantity: 50,
    date: "2025-05-04T11:05:00Z",
    notes: "New stock"
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
