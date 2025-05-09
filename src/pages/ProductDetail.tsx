
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Printer, 
  Edit, 
  Trash, 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  Loader2, 
  ShoppingBag,
  Package,
  Factory,
  AlertTriangle
} from 'lucide-react';

// Mock data
const product = {
  id: '1',
  name: 'Camisa Corporativa Azul',
  sku: 'CC-AZ-001',
  description: 'Camisa manga larga de algodón para uniformes corporativos',
  price: 45000,
  cost: 28000,
  stock: 120,
  category: 'Camisas',
  supplier: 'Textiles del Norte',
  brand: 'UlloaCorel',
  minStock: 30,
  location: 'Bodega A - Estante 3',
  image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=256',
  createdAt: '2024-12-15',
  updatedAt: '2025-05-01'
};

const stockMovements = [
  {
    id: '1',
    date: '2025-05-01',
    type: 'entrada',
    quantity: 50,
    reference: 'Compra INV-2025-042',
    notes: 'Reabastecimiento regular'
  },
  {
    id: '2',
    date: '2025-04-15',
    type: 'salida',
    quantity: 25,
    reference: 'Orden #89721',
    notes: 'Venta a Empresa Constructora ABC'
  },
  {
    id: '3',
    date: '2025-04-10',
    type: 'entrada',
    quantity: 30,
    reference: 'Compra INV-2025-036',
    notes: 'Reabastecimiento urgente'
  },
  {
    id: '4',
    date: '2025-03-28',
    type: 'salida',
    quantity: 40,
    reference: 'Orden #89605',
    notes: 'Venta a Hotel Premium'
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockMovementForm, setStockMovementForm] = useState({
    type: 'entrada',
    quantity: 0,
    reference: '',
    notes: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStockMovementForm({ ...stockMovementForm, [name]: value });
  };
  
  const handleTypeChange = (type: string) => {
    setStockMovementForm({ ...stockMovementForm, type });
  };
  
  const handleStockMovement = (onClose: () => void) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(
        stockMovementForm.type === 'entrada' 
          ? `Se agregaron ${stockMovementForm.quantity} unidades al inventario`
          : `Se retiraron ${stockMovementForm.quantity} unidades del inventario`
      );
      setLoading(false);
      onClose();
      // Reset form
      setStockMovementForm({
        type: 'entrada',
        quantity: 0,
        reference: '',
        notes: ''
      });
    }, 1000);
  };
  
  const handleDeleteProduct = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowDeleteAlert(false);
      toast.success('Producto eliminado correctamente');
      navigate('/products');
    }, 1000);
  };
  
  const stockStatus = () => {
    if (product.stock <= 0) {
      return <Badge variant="destructive">Sin Stock</Badge>;
    } else if (product.stock <= product.minStock) {
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Stock Bajo</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">En Stock</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={() => navigate(`/products/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteAlert(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden bg-white w-full h-16 flex items-center px-4 border-b fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={() => navigate(`/products/${id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteAlert(true)}>
              <Trash className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Image and Info */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative w-full h-64 mb-4 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full mt-2 flex justify-center">
                {stockStatus()}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Product Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalles del Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                <p className="mt-1">{product.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Categoría</h3>
                <p className="mt-1">{product.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Marca</h3>
                <p className="mt-1">{product.brand}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Proveedor</h3>
                <p className="mt-1">{product.supplier}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Precio</h3>
                <p className="mt-1">$ {product.price.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Costo</h3>
                <p className="mt-1">$ {product.cost.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Existencias</h3>
                <p className="mt-1">{product.stock} unidades</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Stock Mínimo</h3>
                <p className="mt-1">{product.minStock} unidades</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ubicación</h3>
                <p className="mt-1">{product.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Actualizado</h3>
                <p className="mt-1">{product.updatedAt}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-inventory-600 hover:bg-inventory-700">
                  Registrar Movimiento
                </Button>
              </DialogTrigger>
              <DialogContent>
                {(props) => (
                  <>
                    <DialogHeader>
                      <DialogTitle>Registrar Movimiento de Inventario</DialogTitle>
                      <DialogDescription>
                        Registre entradas o salidas de este producto en el inventario.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={stockMovementForm.type === 'entrada' ? 'default' : 'outline'}
                          className={stockMovementForm.type === 'entrada' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => handleTypeChange('entrada')}
                        >
                          <ArrowUp className="h-4 w-4 mr-2" />
                          Entrada
                        </Button>
                        <Button
                          type="button"
                          variant={stockMovementForm.type === 'salida' ? 'default' : 'outline'}
                          className={stockMovementForm.type === 'salida' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                          onClick={() => handleTypeChange('salida')}
                        >
                          <ArrowDown className="h-4 w-4 mr-2" />
                          Salida
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Cantidad</Label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          min="1"
                          value={stockMovementForm.quantity}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reference">Referencia</Label>
                        <Input
                          id="reference"
                          name="reference"
                          placeholder="Ej: Orden #12345 o Compra INV-2025-001"
                          value={stockMovementForm.reference}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Input
                          id="notes"
                          name="notes"
                          placeholder="Detalles adicionales sobre este movimiento"
                          value={stockMovementForm.notes}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button 
                        onClick={() => handleStockMovement(props.close)}
                        disabled={loading || stockMovementForm.quantity <= 0}
                        className={
                          stockMovementForm.type === 'entrada' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Procesando
                          </>
                        ) : (
                          <>
                            {stockMovementForm.type === 'entrada' ? <ArrowUp className="h-4 w-4 mr-2" /> : <ArrowDown className="h-4 w-4 mr-2" />}
                            {stockMovementForm.type === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        
        {/* Stock Movements */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Movimientos de Inventario</CardTitle>
            <CardDescription>
              Historial de entradas y salidas de este producto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Referencia</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {movement.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={movement.type === 'entrada' ? 'outline' : 'secondary'} className={
                        movement.type === 'entrada' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                      }>
                        {movement.type === 'entrada' ? (
                          <div className="flex items-center">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            Entrada
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            Salida
                          </div>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{movement.quantity} unidades</TableCell>
                    <TableCell>{movement.reference}</TableCell>
                    <TableCell>{movement.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          {(props) => (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente el producto "{product.name}" y todos sus datos asociados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => props.close()}>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteProduct}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Eliminando
                    </>
                  ) : (
                    <>
                      <Trash className="h-4 w-4 mr-2" />
                      Eliminar
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductDetail;
