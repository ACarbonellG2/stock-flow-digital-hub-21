
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getProducts, 
  searchProducts, 
  filterProducts,
  categories,
  Product,
  types
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

// Mock client data
const mockClients = [
  { id: '1', name: 'Empresa A' },
  { id: '2', name: 'Empresa B' },
  { id: '3', name: 'Corporación XYZ' },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [productType, setProductType] = useState('');
  const [client, setClient] = useState('');
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchProducts(searchQuery);
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      // Only pass category to filterProducts as it doesn't accept productType directly
      const data = await filterProducts({ category });
      
      // Apply type filter client-side
      let filteredData = [...data];
      if (productType) {
        filteredData = filteredData.filter(product => product.type === productType);
      }
      
      // Apply client filter (this would be handled by the backend in a real app)
      if (client) {
        // This is a mock client filter since our backend doesn't support it yet
        // In a real app, this would be handled by the backend
        filteredData = filteredData.filter(product => {
          // Mock client association (random for demo purposes)
          const randomAssociation = Math.random() > 0.5;
          return randomAssociation;
        });
      }
      
      setProducts(filteredData);
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setCategory('');
    setProductType('');
    setClient('');
    setSearchQuery('');
    await loadProducts();
  };

  const sortProducts = (field: keyof Product) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    // Sort products
    const sorted = [...products].sort((a, b) => {
      if (a[field] < b[field]) return newDirection === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setProducts(sorted);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex w-full">
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
            <Button 
              variant="outline" 
              className="md:w-auto" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" /> Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Categoría
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las categorías</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Tipo de Producto
                </label>
                <Select value={productType} onValueChange={setProductType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los tipos</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Cliente
                </label>
                <Select value={client} onValueChange={setClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los clientes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los clientes</SelectItem>
                    {mockClients.map((cl) => (
                      <SelectItem key={cl.id} value={cl.id}>
                        {cl.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2 md:col-span-3">
                <Button onClick={handleFilter} className="bg-inventory-600 hover:bg-inventory-700">
                  Aplicar Filtros
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  <X className="h-4 w-4 mr-2" /> Limpiar
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-inventory-600" />
            </div>
          ) : (
            <>
              {products.length > 0 ? (
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
                        <TableHead 
                          className="text-right cursor-pointer"
                          onClick={() => sortProducts('price')}
                        >
                          <div className="flex items-center justify-end">
                            Precio
                            {sortField === 'price' && (
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
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
                            {/* Mock client assignment (would be from real data in a real app) */}
                            {Math.random() > 0.5 ? (
                              <div className="flex items-center">
                                <Building2 className="h-3 w-3 mr-1 text-inventory-600" />
                                <span className="text-sm">{mockClients[Math.floor(Math.random() * mockClients.length)].name}</span>
                              </div>
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
                            ${product.price.toLocaleString()}
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
                    Intenta con otros filtros o agrega nuevos productos al inventario.
                  </p>
                  <div className="mt-6">
                    <Button 
                      onClick={resetFilters} 
                      variant="outline" 
                      className="mx-auto"
                    >
                      Limpiar filtros
                    </Button>
                  </div>
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
