
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getProductById, 
  updateProduct, 
  deleteProduct,
  getStockMovements, 
  addStockMovement,
  categories,
  locations,
  Product,
  StockMovement
} from '@/lib/mockData';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  Loader2, 
  Save, 
  Trash, 
  ArrowLeft, 
  Package, 
  Edit, 
  ArrowDown, 
  ArrowUp 
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    location: '',
    sku: '',
  });
  
  const [movementForm, setMovementForm] = useState({
    type: 'in' as 'in' | 'out',
    quantity: 1,
    notes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (id) {
      loadProductData(id);
    }
  }, [id]);
  
  const loadProductData = async (productId: string) => {
    setLoading(true);
    try {
      const [productData, movementsData] = await Promise.all([
        getProductById(productId),
        getStockMovements(productId)
      ]);
      
      if (!productData) {
        toast.error('Producto no encontrado');
        navigate('/products');
        return;
      }
      
      setProduct(productData);
      setEditForm({
        name: productData.name,
        category: productData.category,
        quantity: productData.quantity,
        price: productData.price,
        location: productData.location,
        sku: productData.sku,
      });
      setMovements(movementsData);
    } catch (error) {
      console.error('Error loading product data:', error);
      toast.error('Error al cargar los datos del producto');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setEditForm({ ...editForm, [name]: value });
    
    // Clear error when selecting
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value === '' ? 0 : Number(value) });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editForm.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio';
    }
    
    if (!editForm.category) {
      newErrors.category = 'La categoría es obligatoria';
    }
    
    if (editForm.quantity < 0) {
      newErrors.quantity = 'La cantidad no puede ser negativa';
    }
    
    if (editForm.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a cero';
    }
    
    if (!editForm.location) {
      newErrors.location = 'La ubicación es obligatoria';
    }
    
    if (!editForm.sku.trim()) {
      newErrors.sku = 'El SKU es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateForm() || !id || !product) return;
    
    setSaving(true);
    try {
      const updatedProduct = await updateProduct(id, editForm);
      setProduct(updatedProduct);
      setIsEditing(false);
      toast.success('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    setDeleting(true);
    try {
      await deleteProduct(id);
      toast.success('Producto eliminado exitosamente');
      navigate('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
      setDeleting(false);
    }
  };
  
  const handleMovementSubmit = async (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();
    if (!id) return;
    
    if (movementForm.quantity <= 0) {
      setErrors({ quantity: 'La cantidad debe ser mayor a cero' });
      return;
    }
    
    if (movementForm.type === 'out' && 
        product && 
        movementForm.quantity > product.quantity) {
      setErrors({ quantity: 'No hay suficiente stock disponible' });
      return;
    }
    
    setSaving(true);
    try {
      await addStockMovement({
        productId: id,
        ...movementForm,
        date: new Date().toISOString(),
      });
      
      // Reload product data
      await loadProductData(id);
      toast.success(`${movementForm.type === 'in' ? 'Entrada' : 'Salida'} registrada exitosamente`);
      
      // Reset form
      setMovementForm({
        type: 'in',
        quantity: 1,
        notes: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding stock movement:', error);
      toast.error('Error al registrar el movimiento de stock');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-inventory-600" />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Producto no encontrado</h3>
        <p className="mt-1 text-gray-500">
          El producto que estás buscando no existe o ha sido eliminado.
        </p>
        <div className="mt-6">
          <Link to="/products">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/products">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.name}
            </h1>
          </div>
          <p className="text-gray-500">SKU: {product.sku}</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                {product.quantity === 0 ? (
                  <>
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Agregar Stock
                  </>
                ) : (
                  <>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Registrar Movimiento
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              {(close) => (
                <>
                  <DialogHeader>
                    <DialogTitle>Registrar Movimiento de Stock</DialogTitle>
                    <DialogDescription>
                      Registra una entrada o salida de productos del inventario
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => handleMovementSubmit(e, close)}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="movementType">Tipo de Movimiento</Label>
                        <Select
                          value={movementForm.type}
                          onValueChange={(value: 'in' | 'out') => 
                            setMovementForm({ ...movementForm, type: value })
                          }
                        >
                          <SelectTrigger id="movementType">
                            <SelectValue placeholder="Selecciona el tipo de movimiento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in">Entrada</SelectItem>
                            <SelectItem value="out">Salida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label 
                          htmlFor="quantity"
                          className={errors.quantity ? 'text-red-500' : ''}
                        >
                          Cantidad
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={movementForm.quantity}
                          onChange={(e) => {
                            setMovementForm({ 
                              ...movementForm, 
                              quantity: Number(e.target.value) 
                            });
                            if (errors.quantity) {
                              setErrors({ ...errors, quantity: '' });
                            }
                          }}
                          className={errors.quantity ? 'border-red-500' : ''}
                        />
                        {errors.quantity && (
                          <p className="text-red-500 text-xs">{errors.quantity}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Textarea
                          id="notes"
                          placeholder="Describe el motivo del movimiento"
                          value={movementForm.notes}
                          onChange={(e) => 
                            setMovementForm({ ...movementForm, notes: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={close}
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-inventory-600 hover:bg-inventory-700"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando
                          </>
                        ) : (
                          'Registrar Movimiento'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </>
              )}
            </DialogContent>
          </Dialog>
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-inventory-600 hover:bg-inventory-700"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente
                      este producto y todos sus movimientos relacionados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Eliminando
                        </>
                      ) : (
                        'Sí, eliminar'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
              <CardDescription>
                Detalles y especificaciones del producto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className={errors.name ? 'text-red-500' : ''}>
                    Nombre del Producto *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={isEditing ? editForm.name : product.name}
                    onChange={handleInputChange}
                    placeholder="Nombre del producto"
                    className={errors.name ? 'border-red-500' : ''}
                    disabled={!isEditing}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sku" className={errors.sku ? 'text-red-500' : ''}>
                    SKU *
                  </Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={isEditing ? editForm.sku : product.sku}
                    onChange={handleInputChange}
                    placeholder="SKU del producto"
                    className={errors.sku ? 'border-red-500' : ''}
                    disabled={!isEditing}
                  />
                  {errors.sku && (
                    <p className="text-red-500 text-xs">{errors.sku}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className={errors.category ? 'text-red-500' : ''}>
                    Categoría *
                  </Label>
                  {isEditing ? (
                    <>
                      <Select
                        value={editForm.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger
                          id="category"
                          className={errors.category ? 'border-red-500' : ''}
                        >
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="Otros">Otros</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-red-500 text-xs">{errors.category}</p>
                      )}
                    </>
                  ) : (
                    <Input
                      value={product.category}
                      disabled
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className={errors.location ? 'text-red-500' : ''}>
                    Ubicación *
                  </Label>
                  {isEditing ? (
                    <>
                      <Select
                        value={editForm.location}
                        onValueChange={(value) => handleSelectChange('location', value)}
                      >
                        <SelectTrigger
                          id="location"
                          className={errors.location ? 'border-red-500' : ''}
                        >
                          <SelectValue placeholder="Selecciona una ubicación" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                          <SelectItem value="Otra Ubicación">Otra Ubicación</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.location && (
                        <p className="text-red-500 text-xs">{errors.location}</p>
                      )}
                    </>
                  ) : (
                    <Input
                      value={product.location}
                      disabled
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity" className={errors.quantity ? 'text-red-500' : ''}>
                    Cantidad *
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      value={isEditing ? editForm.quantity : product.quantity}
                      onChange={handleNumberChange}
                      placeholder="Cantidad en inventario"
                      className={errors.quantity ? 'border-red-500' : ''}
                      disabled={!isEditing}
                    />
                    <span 
                      className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.quantity < 10
                          ? 'bg-red-100 text-red-800'
                          : product.quantity < 30
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {product.quantity < 10 ? 'Bajo' : product.quantity < 30 ? 'Medio' : 'Alto'}
                    </span>
                  </div>
                  {errors.quantity && (
                    <p className="text-red-500 text-xs">{errors.quantity}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price" className={errors.price ? 'text-red-500' : ''}>
                    Precio *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={isEditing ? editForm.price : product.price}
                    onChange={handleNumberChange}
                    placeholder="Precio del producto"
                    className={errors.price ? 'border-red-500' : ''}
                    disabled={!isEditing}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs">{errors.price}</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">
                Última actualización: {new Date(product.lastUpdated).toLocaleString()}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="movements" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Movimientos</CardTitle>
              <CardDescription>
                Registro de entradas y salidas de este producto
              </CardDescription>
            </CardHeader>
            <CardContent>
              {movements.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead>Notas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movements
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((movement) => (
                          <TableRow key={movement.id}>
                            <TableCell>
                              {new Date(movement.date).toLocaleDateString()} {' '}
                              {new Date(movement.date).toLocaleTimeString()}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  movement.type === 'in'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {movement.type === 'in' ? 'Entrada' : 'Salida'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                            </TableCell>
                            <TableCell>{movement.notes}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Sin movimientos registrados
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Este producto no tiene movimientos de inventario registrados.
                  </p>
                  <div className="mt-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          Registrar Movimiento
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {(close) => (
                          <>
                            <DialogHeader>
                              <DialogTitle>Registrar Movimiento de Stock</DialogTitle>
                              <DialogDescription>
                                Registra una entrada o salida de productos del inventario
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={(e) => handleMovementSubmit(e, close)}>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="movementType">Tipo de Movimiento</Label>
                                  <Select
                                    value={movementForm.type}
                                    onValueChange={(value: 'in' | 'out') => 
                                      setMovementForm({ ...movementForm, type: value })
                                    }
                                  >
                                    <SelectTrigger id="movementType">
                                      <SelectValue placeholder="Selecciona el tipo de movimiento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="in">Entrada</SelectItem>
                                      <SelectItem value="out">Salida</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label 
                                    htmlFor="quantity"
                                    className={errors.quantity ? 'text-red-500' : ''}
                                  >
                                    Cantidad
                                  </Label>
                                  <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={movementForm.quantity}
                                    onChange={(e) => {
                                      setMovementForm({ 
                                        ...movementForm, 
                                        quantity: Number(e.target.value) 
                                      });
                                      if (errors.quantity) {
                                        setErrors({ ...errors, quantity: '' });
                                      }
                                    }}
                                    className={errors.quantity ? 'border-red-500' : ''}
                                  />
                                  {errors.quantity && (
                                    <p className="text-red-500 text-xs">{errors.quantity}</p>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="notes">Notas</Label>
                                  <Textarea
                                    id="notes"
                                    placeholder="Describe el motivo del movimiento"
                                    value={movementForm.notes}
                                    onChange={(e) => 
                                      setMovementForm({ ...movementForm, notes: e.target.value })
                                    }
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={close}
                                  disabled={saving}
                                >
                                  Cancelar
                                </Button>
                                <Button 
                                  type="submit"
                                  className="bg-inventory-600 hover:bg-inventory-700"
                                  disabled={saving}
                                >
                                  {saving ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Guardando
                                    </>
                                  ) : (
                                    'Registrar Movimiento'
                                  )}
                                </Button>
                              </DialogFooter>
                            </form>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;
