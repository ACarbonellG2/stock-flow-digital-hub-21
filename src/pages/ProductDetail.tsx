import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getProductById,
  getStockMovements,
  deleteProduct,
  addStockMovement,
  getSuppliers,
  getClients,
  Supplier,
  Client,
  Product,
  StockMovement
} from '@/lib/mockData';
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockMovementForm, setStockMovementForm] = useState({
    type: 'entrada',
    quantity: 0,
    supplierId: '',
    clientId: '',
    notes: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (id) {
        try {
          const [productData, movementsData, suppliersData, clientsData] = await Promise.all([
            getProductById(id),
            getStockMovements(id),
            getSuppliers(),
            getClients()
          ]);
          
          if (productData) {
            setProduct(productData);
          }
          
          setStockMovements(movementsData);
          setSuppliers(suppliersData);
          setClients(clientsData);
        } catch (error) {
          console.error('Error loading data:', error);
          toast.error('Error al cargar los datos');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
  }, [id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStockMovementForm({ ...stockMovementForm, [name]: value });
  };
  
  const handleTypeChange = (type: string) => {
    setStockMovementForm({ 
      ...stockMovementForm, 
      type,
      supplierId: type === 'entrada' ? stockMovementForm.supplierId : '',
      clientId: type === 'salida' ? stockMovementForm.clientId : ''
    });
  };
  
  const handleStockMovement = async () => {
    setLoading(true);
    try {
      if (id) {
        const moveType = stockMovementForm.type === 'entrada' ? 'in' : 'out';
        const supplierOrClient = stockMovementForm.type === 'entrada'
          ? suppliers.find(s => s.id === stockMovementForm.supplierId)?.name || ''
          : clients.find(c => c.id === stockMovementForm.clientId)?.name || '';

        const result = await addStockMovement({
          productId: id,
          productSku: product.sku,
          type: moveType,
          quantity: Number(stockMovementForm.quantity),
          supplierOrClient,
          notes: stockMovementForm.notes,
          supplierId: stockMovementForm.type === 'entrada' ? stockMovementForm.supplierId : undefined,
          clientId: stockMovementForm.type === 'salida' ? stockMovementForm.clientId : undefined
        });
        
        toast.success(
          stockMovementForm.type === 'entrada' 
            ? `Se agregaron ${stockMovementForm.quantity} unidades al inventario`
            : `Se retiraron ${stockMovementForm.quantity} unidades del inventario`
        );
        
        // Reload product and stock movements
        const [updatedProduct, updatedMovements] = await Promise.all([
          getProductById(id),
          getStockMovements(id)
        ]);
        setProduct(updatedProduct);
        setStockMovements(updatedMovements);
      }
    } catch (error) {
      console.error('Error registering stock movement:', error);
      toast.error('Error al registrar el movimiento de inventario');
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
      // Reset form
      setStockMovementForm({
        type: 'entrada',
        quantity: 0,
        supplierId: '',
        clientId: '',
        notes: ''
      });
    }
  };
  
  const handleDeleteProduct = async () => {
    setLoading(true);
    try {
      if (id) {
        const result = await deleteProduct(id);
        if (result) {
          toast.success('Producto eliminado correctamente');
          navigate('/products');
        } else {
          toast.error('No se pudo eliminar el producto');
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
    } finally {
      setLoading(false);
      setShowDeleteAlert(false);
    }
  };
  
  const stockStatus = () => {
    if (!product) return null;
    
    if (product.quantity <= 0) {
      return <Badge variant="destructive">Sin Stock</Badge>;
    } else if (product.quantity <= 30) { // Using 30 as default minimum stock
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Stock Bajo</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">En Stock</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-inventory-600" />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Producto no encontrado</h3>
        <p className="mt-1 text-gray-500">
          El producto que estás buscando no existe o ha sido eliminado.
        </p>
        <div className="mt-6">
          <Button 
            onClick={() => navigate('/products')}
            variant="outline" 
            className="mx-auto"
          >
            Volver a Productos
          </Button>
        </div>
      </div>
    );
  }
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Image and Info */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative w-full h-64 mb-4 bg-gray-100 rounded-md flex justify-center items-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-24 w-24 text-gray-400" />
                )}
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
                <h3 className="text-sm font-medium text-gray-500">Tipo de Producto</h3>
                <p className="mt-1">{product.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Existencias</h3>
                <p className="mt-1">{product.quantity} unidades</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Última Actualización</h3>
                <p className="mt-1">{new Date(product.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-inventory-600 hover:bg-inventory-700">
                  Registrar Movimiento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
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
                    <Label htmlFor={stockMovementForm.type === 'entrada' ? 'supplierId' : 'clientId'}>
                      {stockMovementForm.type === 'entrada' ? 'Proveedor' : 'Cliente'} <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id={stockMovementForm.type === 'entrada' ? 'supplierId' : 'clientId'}
                      name={stockMovementForm.type === 'entrada' ? 'supplierId' : 'clientId'}
                      value={stockMovementForm.type === 'entrada' ? stockMovementForm.supplierId : stockMovementForm.clientId}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Seleccione {stockMovementForm.type === 'entrada' ? 'un proveedor' : 'un cliente'}</option>
                      {stockMovementForm.type === 'entrada' 
                        ? suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </option>
                          ))
                        : clients.map(client => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))
                      }
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Cantidad <span className="text-red-500">*</span></Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={stockMovementForm.quantity}
                      onChange={handleInputChange}
                      required
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
                  
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Información del movimiento:</span><br/>
                      El sistema generará automáticamente el número de referencia y la fecha del movimiento.
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleStockMovement}
                    disabled={loading || 
                      stockMovementForm.quantity <= 0 || 
                      (stockMovementForm.type === 'entrada' && !stockMovementForm.supplierId) ||
                      (stockMovementForm.type === 'salida' && !stockMovementForm.clientId)
                    }
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
            {stockMovements.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>{`Proveedor/Cliente`}</TableHead>
                    <TableHead>Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-medium">
                        {movement.reference}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(movement.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={movement.type === 'in' ? 'outline' : 'secondary'} className={
                          movement.type === 'in' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                        }>
                          {movement.type === 'in' ? (
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
                      <TableCell>{movement.supplierOrClient}</TableCell>
                      <TableCell>{movement.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No hay movimientos registrados</h3>
                <p className="mt-1 text-gray-500">
                  Este producto aún no tiene movimientos de inventario.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el producto "{product.name}" y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
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
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductDetail;
