
import React, { useEffect, useState } from 'react';
import { getProducts, getStockMovements, Product, StockMovement } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const Reports = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, movementsData] = await Promise.all([
          getProducts(),
          getStockMovements()
        ]);
        setProducts(productsData);
        setMovements(movementsData);
      } catch (error) {
        console.error('Error fetching data for reports:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate data for charts
  const getCategoryData = () => {
    const categoryCounts: Record<string, number> = {};
    products.forEach(product => {
      if (categoryCounts[product.category]) {
        categoryCounts[product.category] += product.quantity;
      } else {
        categoryCounts[product.category] = product.quantity;
      }
    });
    
    return Object.keys(categoryCounts).map(category => ({
      name: category,
      value: categoryCounts[category]
    }));
  };
  
  const getLocationData = () => {
    const locationCounts: Record<string, number> = {};
    products.forEach(product => {
      if (locationCounts[product.location]) {
        locationCounts[product.location] += product.quantity;
      } else {
        locationCounts[product.location] = product.quantity;
      }
    });
    
    return Object.keys(locationCounts).map(location => ({
      location: location,
      quantity: locationCounts[location]
    }));
  };
  
  const getInventoryValueByCategory = () => {
    const categoryValues: Record<string, number> = {};
    products.forEach(product => {
      const value = product.quantity * product.price;
      if (categoryValues[product.category]) {
        categoryValues[product.category] += value;
      } else {
        categoryValues[product.category] = value;
      }
    });
    
    return Object.keys(categoryValues).map(category => ({
      category: category,
      value: categoryValues[category]
    }));
  };
  
  const getLowStockProducts = () => {
    return products
      .filter(product => product.quantity < 10)
      .sort((a, b) => a.quantity - b.quantity);
  };
  
  const COLORS = ['#4C51BF', '#667EEA', '#A3BFFA', '#C3DAFE', '#EBF4FF', '#5A67D8', '#434190'];
  
  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['SKU', 'Nombre', 'Categoría', 'Cantidad', 'Precio', 'Ubicación', 'Última Actualización'];
    const csvContent = [
      headers.join(','),
      ...products.map(product => [
        product.sku,
        `"${product.name.replace(/"/g, '""')}"`, // Escape quotes
        `"${product.category}"`,
        product.quantity,
        product.price,
        `"${product.location}"`,
        product.lastUpdated
      ].join(','))
    ].join('\n');
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-inventory-600" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-500">Analiza los datos de tu inventario</p>
        </div>
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" /> Exportar Inventario
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categoría</CardTitle>
            <CardDescription>
              Cantidad de productos por categoría
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCategoryData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} unidades`, 'Cantidad']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Stock by Location */}
        <Card>
          <CardHeader>
            <CardTitle>Stock por Ubicación</CardTitle>
            <CardDescription>
              Cantidad de productos por ubicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getLocationData()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} unidades`, 'Cantidad']} />
                  <Legend />
                  <Bar dataKey="quantity" name="Cantidad" fill="#667EEA" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Value by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Valor de Inventario por Categoría</CardTitle>
            <CardDescription>
              Valor monetario total por categoría
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getInventoryValueByCategory()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Valor']} />
                  <Legend />
                  <Bar dataKey="value" name="Valor" fill="#5A67D8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Alerta de Stock Bajo</CardTitle>
            <CardDescription>
              Productos con menos de 10 unidades en stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getLowStockProducts().length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getLowStockProducts().map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.location}</TableCell>
                        <TableCell className="text-right">
                          <span 
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              product.quantity === 0
                                ? 'bg-red-100 text-red-800'
                                : product.quantity < 5
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {product.quantity}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-green-600 font-medium">
                  No hay productos con stock bajo
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Inventario</CardTitle>
          <CardDescription>
            Estadísticas generales del inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total de Productos</h3>
              <p className="text-2xl font-bold mt-1">{products.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total de Unidades</h3>
              <p className="text-2xl font-bold mt-1">
                {products.reduce((sum, product) => sum + product.quantity, 0)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Valor del Inventario</h3>
              <p className="text-2xl font-bold mt-1">
                ${products
                  .reduce((sum, product) => sum + product.price * product.quantity, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
