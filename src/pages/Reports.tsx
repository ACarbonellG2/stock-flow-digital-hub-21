
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, FileBarChart, FilePieChart, Loader2, Filter, Clock } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { mockStockMovements, mockProducts, mockCompanies } from '@/lib/mockData';

// Mock data for charts - split by product type
const stockData = {
  all: [
    { name: 'Camisas', value: 120 },
    { name: 'Pantalones', value: 85 },
    { name: 'Gorras', value: 230 },
    { name: 'Chalecos', value: 60 },
    { name: 'Overoles', value: 45 },
  ],
  insumos: [
    { name: 'Telas', value: 85 },
    { name: 'Botones', value: 230 },
    { name: 'Cremalleras', value: 60 },
    { name: 'Caucho', value: 45 },
    { name: 'Lonas', value: 30 },
  ],
  productos: [
    { name: 'Camisas', value: 120 },
    { name: 'Pantalones', value: 85 },
    { name: 'Gorras', value: 200 },
    { name: 'Chalecos', value: 60 },
    { name: 'Overoles', value: 45 },
  ]
};

const movementData = {
  all: [
    { name: 'Ene', entradas: 65, salidas: 42 },
    { name: 'Feb', entradas: 78, salidas: 53 },
    { name: 'Mar', entradas: 52, salidas: 41 },
    { name: 'Abr', entradas: 91, salidas: 78 },
    { name: 'May', entradas: 45, salidas: 39 },
    { name: 'Jun', entradas: 72, salidas: 60 },
  ],
  insumos: [
    { name: 'Ene', entradas: 40, salidas: 25 },
    { name: 'Feb', entradas: 50, salidas: 30 },
    { name: 'Mar', entradas: 35, salidas: 20 },
    { name: 'Abr', entradas: 60, salidas: 45 },
    { name: 'May', entradas: 30, salidas: 20 },
    { name: 'Jun', entradas: 45, salidas: 35 },
  ],
  productos: [
    { name: 'Ene', entradas: 25, salidas: 17 },
    { name: 'Feb', entradas: 28, salidas: 23 },
    { name: 'Mar', entradas: 17, salidas: 21 },
    { name: 'Abr', entradas: 31, salidas: 33 },
    { name: 'May', entradas: 15, salidas: 19 },
    { name: 'Jun', entradas: 27, salidas: 25 },
  ]
};

const topProducts = {
  all: [
    { id: '1', name: 'Camisa Corporativa Azul', stock: 120, movements: 45 },
    { id: '2', name: 'Pantalón de Trabajo Negro', stock: 85, movements: 38 },
    { id: '3', name: 'Gorra Bordada', stock: 230, movements: 32 },
    { id: '4', name: 'Chaleco Reflectivo', stock: 60, movements: 29 },
    { id: '5', name: 'Overol Industrial', stock: 45, movements: 21 },
  ],
  insumos: [
    { id: '1', name: 'Tela Denim', stock: 85, movements: 38 },
    { id: '2', name: 'Botones Plásticos', stock: 230, movements: 32 },
    { id: '3', name: 'Cremalleras Metálicas', stock: 60, movements: 29 },
    { id: '4', name: 'Caucho Sintético', stock: 45, movements: 21 },
    { id: '5', name: 'Lonas Impermeables', stock: 30, movements: 18 },
  ],
  productos: [
    { id: '1', name: 'Camisa Corporativa Azul', stock: 120, movements: 45 },
    { id: '2', name: 'Pantalón de Trabajo Negro', stock: 85, movements: 38 },
    { id: '3', name: 'Gorra Bordada', stock: 230, movements: 32 },
    { id: '4', name: 'Chaleco Reflectivo', stock: 60, movements: 29 },
    { id: '5', name: 'Overol Industrial', stock: 45, movements: 21 },
  ]
};

const lowStockProducts = {
  all: [
    { id: '5', name: 'Overol Industrial', stock: 45, min: 50 },
    { id: '4', name: 'Chaleco Reflectivo', stock: 60, min: 70 },
    { id: '6', name: 'Chaqueta Impermeable', stock: 25, min: 40 },
    { id: '7', name: 'Uniforme Completo', stock: 18, min: 30 },
  ],
  insumos: [
    { id: '1', name: 'Caucho Sintético', stock: 45, min: 50 },
    { id: '2', name: 'Lonas Impermeables', stock: 30, min: 40 },
    { id: '3', name: 'Tela Denim', stock: 20, min: 30 },
    { id: '4', name: 'Botón Metálico', stock: 15, min: 25 },
  ],
  productos: [
    { id: '1', name: 'Overol Industrial', stock: 45, min: 50 },
    { id: '2', name: 'Chaleco Reflectivo', stock: 60, min: 70 },
    { id: '3', name: 'Chaqueta Impermeable', stock: 25, min: 40 },
    { id: '4', name: 'Uniforme Completo', stock: 18, min: 30 },
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// New data for recent movements
const getRecentMovements = (productType, clientId) => {
  // Filter the mockStockMovements based on product type and client
  const filteredMovements = mockStockMovements.filter(movement => {
    if (productType === 'all' && !clientId) return true;
    
    // Find the product for this movement
    const product = mockProducts.find(p => p.id === movement.productId);
    if (!product) return false;
    
    // Check if the product type and client match the filters
    const typeMatches = productType === 'all' || 
      (productType === 'insumos' ? product.type === 'Insumos' : product.type === 'Producto Terminado');
    
    const clientMatches = !clientId || product.clientId === clientId;
    
    return typeMatches && clientMatches;
  });
  
  // Sort by date (newest first)
  const sortedMovements = [...filteredMovements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get only the first 5 (most recent)
  return sortedMovements.slice(0, 5).map(movement => {
    const product = mockProducts.find(p => p.id === movement.productId) || { name: 'Producto Desconocido' };
    return {
      id: movement.id,
      reference: movement.reference,
      productName: product.name,
      type: movement.type,
      quantity: movement.quantity,
      date: new Date(movement.date).toLocaleDateString(),
      supplierOrClient: movement.supplierOrClient
    };
  });
};

// Function to filter data by client
const filterDataByClient = (data, clientId, type) => {
  if (!clientId) return data[type];
  
  // For chart data, we need to recalculate based on products that belong to this client
  if (type === 'all' || type === 'insumos' || type === 'productos') {
    const clientProducts = mockProducts.filter(p => p.clientId === clientId);
    
    if (data === stockData) {
      // Re-calculate stock distribution for this client
      const categories = [...new Set(clientProducts.map(p => p.category))];
      return categories.map(category => {
        const productsInCategory = clientProducts.filter(p => p.category === category);
        const totalQuantity = productsInCategory.reduce((sum, p) => sum + p.quantity, 0);
        return { name: category, value: totalQuantity };
      });
    } else if (data === topProducts) {
      // Return top products for this client
      return clientProducts
        .map(p => {
          const movements = mockStockMovements.filter(m => m.productId === p.id).length;
          return { id: p.id, name: p.name, stock: p.quantity, movements };
        })
        .sort((a, b) => b.movements - a.movements)
        .slice(0, 5);
    } else if (data === lowStockProducts) {
      // Return low stock products for this client
      // We're simulating minimum stock levels based on current quantity
      return clientProducts
        .filter(p => p.quantity < 50) // Just an example threshold
        .map(p => ({ 
          id: p.id, 
          name: p.name, 
          stock: p.quantity, 
          min: Math.round(p.quantity * 1.2) // Just a simple calculation for demonstration
        }))
        .slice(0, 4);
    }
  }
  
  // For movement data, we'll just return the original data as a simplification
  // In a real app, this would be filtered by client
  return data[type];
};

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('stock');
  const [productType, setProductType] = useState('all');
  const [clientId, setClientId] = useState('');
  
  const [currentStockData, setCurrentStockData] = useState(stockData.all);
  const [currentMovementData, setCurrentMovementData] = useState(movementData.all);
  const [currentTopProducts, setCurrentTopProducts] = useState(topProducts.all);
  const [currentLowStockProducts, setCurrentLowStockProducts] = useState(lowStockProducts.all);
  const [recentMovements, setRecentMovements] = useState(getRecentMovements('all', ''));
  
  // Update data when product type changes
  useEffect(() => {
    setCurrentStockData(filterDataByClient(stockData, clientId, productType));
    setCurrentMovementData(filterDataByClient(movementData, clientId, productType));
    setCurrentTopProducts(filterDataByClient(topProducts, clientId, productType));
    setCurrentLowStockProducts(filterDataByClient(lowStockProducts, clientId, productType));
    setRecentMovements(getRecentMovements(productType, clientId));
  }, [productType, clientId]);
  
  const downloadReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // In a real application, this would generate and download a file
      alert('Reporte descargado');
    }, 1500);
  };
  
  // Determine which report sections to show based on reportType
  const showStockCharts = reportType === 'stock';
  const showMovementCharts = reportType === 'movements';
  const showLowStockTables = reportType === 'lowStock';
  const showAllCharts = reportType === 'all';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-500">Analiza los datos de tu inventario</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Reporte</CardTitle>
          <CardDescription>
            Personaliza los parámetros para generar informes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="reportType">Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="reportType">
                  <SelectValue placeholder="Selecciona un tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Inventario Actual</SelectItem>
                  <SelectItem value="movements">Movimientos</SelectItem>
                  <SelectItem value="lowStock">Productos con Stock Bajo</SelectItem>
                  <SelectItem value="all">Todos los Reportes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Producto</Label>
              <RadioGroup 
                value={productType} 
                onValueChange={setProductType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">Todos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="insumos" id="insumos" />
                  <Label htmlFor="insumos">Insumos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="productos" id="productos" />
                  <Label htmlFor="productos">Productos Terminados</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Rango de Fechas</Label>
              <DateRangePicker />
            </div>
            
            {/* Nuevo selector de cliente */}
            <div className="space-y-2">
              <Label htmlFor="clientSelect">Cliente</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="clientSelect">
                  <SelectValue placeholder="Todos los Clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los Clientes</SelectItem>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileBarChart className="h-4 w-4 mr-2" />
              Vista Previa
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Más Filtros
            </Button>
          </div>
          <Button onClick={downloadReport} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Descargar Reporte
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Stock Distribution Chart - Only show when reportType is stock or all */}
      {(showStockCharts || showAllCharts) && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Inventario</CardTitle>
              <CardDescription>
                {clientId 
                  ? `Distribución por categoría para ${mockCompanies.find(c => c.id === clientId)?.name || 'cliente'}`
                  : `Distribución por categoría de ${productType === 'insumos' ? 'insumos' : productType === 'productos' ? 'productos terminados' : 'productos'}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentStockData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {currentStockData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Stock Movements Chart - Only show when reportType is movements or all */}
          {(showMovementCharts || showAllCharts) && (
            <Card>
              <CardHeader>
                <CardTitle>Movimientos Mensuales</CardTitle>
                <CardDescription>
                  {clientId 
                    ? `Entradas y salidas para ${mockCompanies.find(c => c.id === clientId)?.name || 'cliente'}`
                    : `Entradas y salidas de ${productType === 'insumos' ? 'insumos' : productType === 'productos' ? 'productos terminados' : 'inventario'} por mes`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentMovementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="entradas" fill="#0088FE" name="Entradas" />
                      <Bar dataKey="salidas" fill="#FF8042" name="Salidas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Recent Movements Table - Show in movements or all report types */}
      {(showMovementCharts || showAllCharts) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Últimos Movimientos</CardTitle>
                <CardDescription>
                  {clientId 
                    ? `Los 5 movimientos más recientes para ${mockCompanies.find(c => c.id === clientId)?.name || 'cliente'}`
                    : `Los 5 movimientos más recientes de ${productType === 'insumos' ? 'insumos' : productType === 'productos' ? 'productos terminados' : 'inventario'}`}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Ver Historial Completo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Proveedor/Cliente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="font-medium">{movement.reference}</TableCell>
                    <TableCell>{movement.productName}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full ${movement.type === 'in' ? 'bg-green-500' : 'bg-red-500'} mr-2`} />
                        {movement.type === 'in' ? 'Entrada' : 'Salida'}
                      </div>
                    </TableCell>
                    <TableCell>{movement.quantity} unidades</TableCell>
                    <TableCell>{movement.date}</TableCell>
                    <TableCell>{movement.supplierOrClient}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Productos Más Movidos - Show in stock, movements, or all report types */}
      {(showStockCharts || showMovementCharts || showAllCharts) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Productos Más Movidos</CardTitle>
                <CardDescription>
                  {clientId 
                    ? `Productos con mayor actividad para ${mockCompanies.find(c => c.id === clientId)?.name || 'cliente'}`
                    : `${productType === 'insumos' ? 'Insumos' : productType === 'productos' ? 'Productos terminados' : 'Productos'} con mayor actividad en inventario`}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FilePieChart className="h-4 w-4 mr-2" />
                Ver Completo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Movimientos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTopProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.stock} unidades</TableCell>
                    <TableCell>{product.movements} movimientos</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Productos con Stock Bajo - Only show when reportType is lowStock or all */}
      {(showLowStockTables || showAllCharts) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Productos con Stock Bajo</CardTitle>
                <CardDescription>
                  {clientId 
                    ? `Productos bajo mínimo para ${mockCompanies.find(c => c.id === clientId)?.name || 'cliente'}`
                    : `${productType === 'insumos' ? 'Insumos' : productType === 'productos' ? 'Productos terminados' : 'Productos'} por debajo del nivel mínimo recomendado`}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Ver Completo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.stock} unidades</TableCell>
                    <TableCell>{product.min} unidades</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                        Stock Bajo
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
