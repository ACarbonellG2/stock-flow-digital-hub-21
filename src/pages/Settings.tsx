
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  
  const [settingsForm, setSettingsForm] = useState({
    companyName: 'Mi Empresa',
    email: 'contacto@miempresa.com',
    lowStockThreshold: 10,
    currency: 'MXN',
    notifications: true,
    exportFormat: 'csv'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettingsForm({ ...settingsForm, [name]: value });
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setSettingsForm({ ...settingsForm, notifications: checked });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setSettingsForm({ ...settingsForm, [name]: value });
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettingsForm({ ...settingsForm, [name]: value === '' ? 0 : Number(value) });
  };
  
  const saveSettings = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Configuración guardada exitosamente');
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">Administra las preferencias del sistema</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>
            Configura la información básica de tu empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre de la Empresa</Label>
              <Input
                id="companyName"
                name="companyName"
                value={settingsForm.companyName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={settingsForm.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Inventario</CardTitle>
          <CardDescription>
            Personaliza el comportamiento del sistema de inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Umbral de Stock Bajo</Label>
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                value={settingsForm.lowStockThreshold}
                onChange={handleNumberChange}
              />
              <p className="text-xs text-gray-500">
                Se mostrará una alerta cuando la cantidad de un producto sea menor a este valor.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select
                value={settingsForm.currency}
                onValueChange={(value) => handleSelectChange('currency', value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Selecciona una moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                  <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Notificaciones</Label>
                <p className="text-xs text-gray-500">
                  Recibe alertas cuando los productos estén por debajo del umbral de stock.
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settingsForm.notifications}
                onCheckedChange={handleSwitchChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exportFormat">Formato de Exportación</Label>
              <Select
                value={settingsForm.exportFormat}
                onValueChange={(value) => handleSelectChange('exportFormat', value)}
              >
                <SelectTrigger id="exportFormat">
                  <SelectValue placeholder="Selecciona un formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={saveSettings}
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
              Guardar Configuración
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
