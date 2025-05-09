
import React, { useState } from 'react';
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
import { Download, FileBar, FileBarChart, FilePieChart, Loader2 } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for charts
const stockData = [
  { name: 'Camisas', value: 120 },
  { name: 'Pantalones', value: 85 },
  { name: 'Gorras', value: 230 },
  { name: 'Chalecos', value: 60 },
  { name: 'Overoles', value: 45 },
];

const movementData = [
  { name: 'Ene', entradas: 65, salidas: 42 },
  { name: 'Feb', entradas: 78, salidas: 53 },
  { name: 'Mar', entradas: 52, salidas: 41 },
  { name: 'Abr', entradas: 91, salidas: 78 },
  { name: 'May', entradas: 45, salidas: 39 },
  { name: 'Jun', entradas: 72, salidas: 60 },
];

const topProducts = [
  { id: '1', name: 'Camisa Corporativa Azul', stock: 120, movements: 45 },
  { id: '2', name: 'Pantalón de Trabajo Negro', stock: 85, movements: 38 },
  { id: '3', name: 'Gorra Bordada', stock: 230, movements: 32 },
  { id: '4', name: 'Chaleco Reflectivo', stock: 60, movements: 29 },
  { id: '5', name: 'Overol Industrial', stock: 45, movements: 21 },
];

const lowStockProducts = [
  { id: '5', name: 'Overol Industrial', stock: 45, min: 50 },
  { id: '4', name: 'Chaleco Reflectivo', stock: 60, min: 70 },
  { id: '6', name: 'Chaqueta Impermeable', stock: 25, min: 40 },
  { id: '7', name: 'Uniforme Completo', stock: 18, min: 30 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('stock');
  
  const downloadReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // In a real application, this would generate and download a file
      alert('Reporte descargado');
    }, 1500);
  };
  
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
          <div className="grid gap-6 md:grid-cols-2">
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
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rango de Fechas</Label>
              <DateRangePicker />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileBarChart className="h-4 w-4 mr-2" />
              Vista Previa
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
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Stock Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Inventario</CardTitle>
            <CardDescription>
              Distribución por categoría de productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stockData.map((entry, index) => (
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
        
        {/* Stock Movements Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Movimientos Mensuales</CardTitle>
            <CardDescription>
              Entradas y salidas de inventario por mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movementData}>
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
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Productos Más Movidos</CardTitle>
              <CardDescription>
                Productos con mayor actividad en inventario
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
              {topProducts.map((product) => (
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
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Productos con Stock Bajo</CardTitle>
              <CardDescription>
                Productos por debajo del nivel mínimo recomendado
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <FileBar className="h-4 w-4 mr-2" />
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
              {lowStockProducts.map((product) => (
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
    </div>
  );
};

export default Reports;
