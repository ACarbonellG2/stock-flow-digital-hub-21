
import React, { useEffect, useState } from 'react';
import { getProducts, getStockMovements, Product, StockMovement } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ArrowDown, ArrowUp, AlertTriangle, BarChart3 } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Separator } from '@/components/ui/separator';

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, movementsData] = await Promise.all([
          getProducts(),
          getStockMovements(),
        ]);
        setProducts(productsData);
        setMovements(movementsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalProducts = products.length;
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockItems = products.filter((product) => product.quantity < 10).length;
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find((item) => item.name === product.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Recent movements data
  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Mock chart data
  const stockTrendData = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 150 },
    { name: 'Mar', value: 180 },
    { name: 'Apr', value: 170 },
    { name: 'May', value: totalItems },
  ];

  const movementTrendData = [
    { name: 'Jan', in: 25, out: 20 },
    { name: 'Feb', in: 30, out: 22 },
    { name: 'Mar', in: 35, out: 28 },
    { name: 'Apr', in: 40, out: 35 },
    { name: 'May', in: 45, out: 30 },
  ];

  // Colors for charts
  const COLORS = ['#4C51BF', '#667EEA', '#A3BFFA', '#C3DAFE', '#EBF4FF'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-inventory-600">Cargando datos del dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Vista general del inventario</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Productos</p>
              <h3 className="text-2xl font-bold mt-1">{totalProducts}</h3>
            </div>
            <div className="h-12 w-12 bg-inventory-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-inventory-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Items</p>
              <h3 className="text-2xl font-bold mt-1">{totalItems}</h3>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Entradas Recientes</p>
              <h3 className="text-2xl font-bold mt-1">{movements.filter(m => m.type === 'in').length}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ArrowDown className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Stock Bajo</p>
              <h3 className="text-2xl font-bold mt-1">{lowStockItems}</h3>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock Trend Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tendencia de Stock</CardTitle>
            <CardDescription>Evolución del stock total en los últimos 5 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667EEA" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#667EEA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#667EEA"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Movement Trend Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Entradas vs Salidas</CardTitle>
            <CardDescription>Comparación de movimientos en los últimos 5 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movementTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="in" stackId="a" fill="#4C51BF" name="Entradas" />
                  <Bar dataKey="out" stackId="a" fill="#C3DAFE" name="Salidas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribución por Categoría</CardTitle>
            <CardDescription>Cantidad de productos por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Movements */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Movimientos Recientes</CardTitle>
            <CardDescription>Últimas entradas y salidas de inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement) => {
                const product = products.find((p) => p.id === movement.productId);
                return (
                  <div key={movement.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {movement.type === 'in' ? (
                          <ArrowDown className={`h-5 w-5 text-green-600`} />
                        ) : (
                          <ArrowUp className={`h-5 w-5 text-red-600`} />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium">{product?.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(movement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          movement.type === 'in'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {movement.type === 'in' ? '+' : '-'}
                        {movement.quantity}
                      </span>
                    </div>
                  </div>
                );
              })}

              {recentMovements.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No hay movimientos recientes
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
