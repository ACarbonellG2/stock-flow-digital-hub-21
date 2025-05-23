import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  addProduct, 
  categories, 
  getCompanies, 
  getSuppliers,
  Company,
  Supplier 
} from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from 'sonner';
import { Loader2, Save, Upload, Image as ImageIcon, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const AddProduct = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    type: 'Producto Terminado' as 'Insumos' | 'Producto Terminado',
    quantity: '',
    description: '',
    sku: '',
    clientId: '',
    supplierId: '',
    image: null as File | null,
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<string[]>(categories);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  
  // Load companies and suppliers on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoadingCompanies(true);
      setLoadingSuppliers(true);
      try {
        const [fetchedCompanies, fetchedSuppliers] = await Promise.all([
          getCompanies(),
          getSuppliers()
        ]);
        setCompanies(fetchedCompanies);
        setSuppliers(fetchedSuppliers);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setLoadingCompanies(false);
        setLoadingSuppliers(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter categories based on type selection
  useEffect(() => {
    // Define which categories belong to which type
    const insumoCategories = ["Telas", "Botones", "Cremalleras", "Caucho", "Lonas"];
    const productoCategories = categories.filter(cat => !insumoCategories.includes(cat));
    
    if (formData.type === 'Insumos') {
      setFilteredCategories(insumoCategories);
      // Reset category if current selection doesn't belong to the new type
      if (!insumoCategories.includes(formData.category)) {
        setFormData(prev => ({ ...prev, category: '' }));
      }
    } else {
      setFilteredCategories(productoCategories);
      // Reset category if current selection doesn't belong to the new type
      if (insumoCategories.includes(formData.category)) {
        setFormData(prev => ({ ...prev, category: '' }));
      }
    }
  }, [formData.type]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    // Clear error when selecting
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value as 'Insumos' | 'Producto Terminado' });
    
    // Clear error when selecting
    if (errors.type) {
      setErrors({ ...errors, type: '' });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar el tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar el tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      // Crear URL para la vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreviewUrl(null);
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio';
    }
    
    if (!formData.category) {
      newErrors.category = 'La categoría es obligatoria';
    }
    
    const quantity = Number(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      newErrors.quantity = 'La cantidad debe ser un número positivo';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'El SKU es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Convert string values to numbers for submission
      const productData = {
        ...formData,
        quantity: Number(formData.quantity)
      };
      
      await addProduct(productData);
      toast.success('Producto agregado exitosamente');
      navigate('/products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error al agregar el producto');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agregar Producto</h1>
        <p className="text-gray-500">Añade un nuevo producto al inventario</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
          <CardDescription>
            Ingresa la información del nuevo producto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? 'text-red-500' : ''}>
                  Nombre del Producto *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ingresa el nombre del producto"
                  className={errors.name ? 'border-red-500' : ''}
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
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Ingresa el código SKU"
                  className={errors.sku ? 'border-red-500' : ''}
                />
                {errors.sku && (
                  <p className="text-red-500 text-xs">{errors.sku}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">
                  Tipo de Producto *
                </Label>
                <RadioGroup 
                  value={formData.type} 
                  onValueChange={handleTypeChange}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Insumos" id="insumos" />
                    <Label htmlFor="insumos">Insumos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Producto Terminado" id="terminado" />
                    <Label htmlFor="terminado">Producto Terminado</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className={errors.category ? 'text-red-500' : ''}>
                  Categoría *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger
                    id="category"
                    className={errors.category ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientId">
                  Empresa Cliente
                </Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => handleSelectChange('clientId', value)}
                >
                  <SelectTrigger id="clientId">
                    <SelectValue placeholder="Selecciona un cliente (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingCompanies ? (
                      <SelectItem value="loading" disabled>
                        Cargando clientes...
                      </SelectItem>
                    ) : (
                      <>
                        <SelectItem value="no-client">Sin asociar a cliente</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Asocia este producto a una empresa cliente (opcional)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierId">
                  Proveedor
                </Label>
                <Select
                  value={formData.supplierId}
                  onValueChange={(value) => handleSelectChange('supplierId', value)}
                >
                  <SelectTrigger id="supplierId">
                    <SelectValue placeholder="Selecciona un proveedor (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingSuppliers ? (
                      <SelectItem value="loading" disabled>
                        Cargando proveedores...
                      </SelectItem>
                    ) : (
                      <>
                        <SelectItem value="no-supplier">Sin asociar a proveedor</SelectItem>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Asocia este producto a un proveedor (opcional)
                </p>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ingresa una descripción del producto"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity" className={errors.quantity ? 'text-red-500' : ''}>
                  Cantidad *
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Ingresa la cantidad"
                  className={errors.quantity ? 'border-red-500' : ''}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs">{errors.quantity}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image">
                  Imagen del Producto
                </Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Vista previa"
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="image"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-inventory-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-inventory-600 focus-within:ring-offset-2 hover:text-inventory-500"
                          >
                            <span>Subir una imagen</span>
                            <input
                              id="image"
                              name="image"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">o arrastrar y soltar</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF hasta 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/products')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-inventory-600 hover:bg-inventory-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Producto
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
