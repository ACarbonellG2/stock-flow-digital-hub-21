
import React, { useState } from 'react';
import { Plus, Building2, X } from 'lucide-react';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock data structure for companies
interface Company {
  id: string;
  name: string;
  contact: string;
  email: string;
}

const ClientCompaniesPanel = () => {
  const [companies, setCompanies] = useState<Company[]>([
    { id: '1', name: 'Empresa A', contact: 'Juan Pérez', email: 'juan@empresaa.com' },
    { id: '2', name: 'Empresa B', contact: 'María López', email: 'maria@empresab.com' },
  ]);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', contact: '', email: '' });

  const handleAddCompany = () => {
    if (newCompany.name.trim() === '') return;
    
    const company: Company = {
      id: Date.now().toString(),
      name: newCompany.name,
      contact: newCompany.contact,
      email: newCompany.email
    };
    
    setCompanies([...companies, company]);
    setNewCompany({ name: '', contact: '', email: '' });
    setIsAddingCompany(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Building2 className="h-5 w-5 text-inventory-700 mr-2" />
          <h2 className="text-lg font-semibold">Empresas Cliente</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsAddingCompany(true)}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Agregar Empresa</span>
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto px-3 py-2">
        {companies.map(company => (
          <div 
            key={company.id} 
            className="mb-3 p-3 bg-white rounded-md shadow-sm border border-gray-200 hover:border-inventory-300 cursor-pointer"
          >
            <div className="font-medium">{company.name}</div>
            <div className="text-sm text-gray-500">{company.contact}</div>
            <div className="text-xs text-gray-400">{company.email}</div>
          </div>
        ))}

        {companies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="mx-auto h-8 w-8 opacity-40 mb-2" />
            <p>No hay empresas registradas</p>
            <p className="text-sm">Haga clic en el botón + para agregar una empresa</p>
          </div>
        )}
      </div>

      {/* Mobile drawer for adding new company */}
      <Drawer open={isAddingCompany} onOpenChange={setIsAddingCompany}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Agregar Nueva Empresa</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nombre de la Empresa</Label>
              <Input
                id="company-name"
                placeholder="Nombre de la empresa"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-contact">Persona de Contacto</Label>
              <Input
                id="company-contact"
                placeholder="Nombre del contacto"
                value={newCompany.contact}
                onChange={(e) => setNewCompany({ ...newCompany, contact: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email de Contacto</Label>
              <Input
                id="company-email"
                type="email"
                placeholder="email@ejemplo.com"
                value={newCompany.email}
                onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
              />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleAddCompany}>Agregar Empresa</Button>
            <Button variant="outline" onClick={() => setIsAddingCompany(false)}>
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ClientCompaniesPanel;
