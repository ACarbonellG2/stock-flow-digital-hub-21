import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  getProducts, 
  searchProducts, 
  filterProducts,
  categories,
  Product,
  types,
  getClients
} from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Package, 
  Loader2, 
  Plus, 
  Filter, 
  X, 
  ArrowUpDown,
  Building2 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const [clients, setClients] = useState<{id: string, name: string}[]>([]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Cargar clientes de forma segura
  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        // Si hay error, al menos establecer un array vacío para evitar errores
        setClients([]);
      } finally {
        setClientsLoaded(true);
      }
    };
    
    loadClients();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(searchQuery);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
      setError('Error al buscar productos. Por favor, intenta de nuevo.');
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (field: keyof Product) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sorted = [...filteredProducts].sort((a, b) => {
      if (a[field] < b[field]) return newDirection === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProducts(sorted);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filtrado simple por múltiples criterios
  const filtered = filteredProducts.filter(product => {
    // Filtro de categoría
    if (categoryFilter && product.category !== categoryFilter) return false;
    
    // Filtro de tipo
    if (typeFilter && product.type !== typeFilter) return false;
    
    // Filtro de stock
    if (stockFilter) {
      if (stockFilter === 'bajo' && product.quantity >= 10) return false;
      if (stockFilter === 'medio' && (product.quantity < 10 || product.quantity >= 30)) return false;
      if (stockFilter === 'alto' && product.quantity < 30) return false;
    }
    
    // Filtro de cliente
    if (clientFilter && product.clientId !== clientFilter) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500">Gestiona tu inventario de productos</p>
        </div>
        <Link to="/add-product">
          <Button className="bg-inventory-600 hover:bg-inventory-700">
            <Plus className="mr-2 h-4 w-4" /> Agregar Producto
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Filtros sencillos */}
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Categoría:</span>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">Todas</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Tipo:</span>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">Todos</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium">Stock:</span>
              <select
                value={stockFilter}
                onChange={e => setStockFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">Todos</option>
                <option value="bajo">Bajo (&lt;10)</option>
                <option value="medio">Medio (10-29)</option>
                <option value="alto">Alto (30+)</option>
              </select>
            </div>
            
            {clientsLoaded && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Cliente:</span>
                <select
                  value={clientFilter}
                  onChange={e => setClientFilter(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="">Todos</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Barra de búsqueda */}
          <div className="flex w-full mb-6">
            <Input
              placeholder="Buscar por nombre, SKU, categoría o descripción"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button 
              onClick={handleSearch} 
              className="rounded-l-none bg-inventory-600 hover:bg-inventory-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-inventory-600" />
            </div>
          ) : (
            <>
              {filtered.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="w-[100px] cursor-pointer"
                          onClick={() => sortProducts('sku')}
                        >
                          <div className="flex items-center">
                            SKU
                            {sortField === 'sku' && (
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => sortProducts('name')}
                        >
                          <div className="flex items-center">
                            Nombre
                            {sortField === 'name' && (
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            <Building2 className="mr-1 h-4 w-4" />
                            Cliente
                          </div>
                        </TableHead>
                        <TableHead 
                          className="text-right cursor-pointer"
                          onClick={() => sortProducts('quantity')}
                        >
                          <div className="flex items-center justify-end">
                            Cantidad
                            {sortField === 'quantity' && (
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.sku}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <Badge variant={product.type === 'Insumos' ? 'secondary' : 'outline'}>
                              {product.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product.clientId ? (
                              <span className="text-sm">
                                {clients.find(c => c.id === product.clientId)?.name || product.clientId}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">Sin asignar</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <span 
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                product.quantity < 10
                                  ? 'bg-red-100 text-red-800'
                                  : product.quantity < 30
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {product.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link to={`/products/${product.id}`}>
                              <Button variant="ghost" size="sm">
                                Detalles
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron productos</h3>
                  <p className="mt-1 text-gray-500">
                    Intenta con otro filtro o agrega nuevos productos al inventario.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
