
import React, { useState, useEffect } from 'react';
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
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Plus, Building2, Trash, Pencil, Search, Loader2, X, Filter } from 'lucide-react';

// Client interface
interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  products?: string[]; // IDs of associated products
  createdAt: Date;
}

// Mock data for clients
const mockClients: Client[] = [
  { 
    id: '1', 
    name: 'Empresa A', 
    contact: 'Juan Pérez', 
    email: 'juan@empresaa.com',
    phone: '123-456-7890',
    address: 'Calle Principal 123',
    products: ['1', '3'],
    createdAt: new Date('2023-01-15')
  },
  { 
    id: '2', 
    name: 'Empresa B', 
    contact: 'María López', 
    email: 'maria@empresab.com',
    phone: '987-654-3210',
    products: ['2'],
    createdAt: new Date('2023-03-22')
  },
  { 
    id: '3', 
    name: 'Corporación XYZ', 
    contact: 'Carlos Rodríguez', 
    email: 'carlos@xyz.com',
    address: 'Avenida Central 456',
    products: [],
    createdAt: new Date('2023-05-10')
  },
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newClient, setNewClient] = useState<Omit<Client, 'id' | 'createdAt' | 'products'>>({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If search is empty, reset to show all clients
      setClients(mockClients);
      return;
    }

    const filtered = mockClients.filter(client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.phone && client.phone.includes(searchQuery))
    );
    
    setClients(filtered);
  };

  // Handle search on enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setClients(mockClients);
  };

  // Handle client form input changes
  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditingClient && selectedClient) {
      setSelectedClient({ ...selectedClient, [name]: value });
    } else {
      setNewClient({ ...newClient, [name]: value });
    }
  };

  // Add new client
  const handleAddClient = () => {
    if (newClient.name.trim() === '') {
      toast.error('El nombre de la empresa es requerido');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const client: Client = {
        id: Date.now().toString(),
        name: newClient.name,
        contact: newClient.contact,
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address,
        notes: newClient.notes,
        products: [],
        createdAt: new Date()
      };
      
      setClients([...clients, client]);
      setNewClient({ name: '', contact: '', email: '', phone: '', address: '', notes: '' });
      setIsAddingClient(false);
      setLoading(false);
      toast.success('Cliente agregado exitosamente');
    }, 500); // Simulate API delay
  };

  // Edit client
  const handleEditClient = () => {
    if (!selectedClient || selectedClient.name.trim() === '') {
      toast.error('El nombre de la empresa es requerido');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const updatedClients = clients.map(client => 
        client.id === selectedClient.id ? selectedClient : client
      );
      
      setClients(updatedClients);
      setSelectedClient(null);
      setIsEditingClient(false);
      setLoading(false);
      toast.success('Cliente actualizado exitosamente');
    }, 500); // Simulate API delay
  };

  // Delete client
  const handleDeleteClient = () => {
    if (!selectedClient) return;
    
    setLoading(true);
    setTimeout(() => {
      const filteredClients = clients.filter(client => client.id !== selectedClient.id);
      setClients(filteredClients);
      setSelectedClient(null);
      setShowDeleteAlert(false);
      setLoading(false);
      toast.success('Cliente eliminado exitosamente');
    }, 500); // Simulate API delay
  };

  // Open edit dialog
  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setIsEditingClient(true);
  };

  // Open delete confirmation
  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setShowDeleteAlert(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empresas Cliente</h1>
          <p className="text-gray-500">Gestiona tus clientes y sus productos asociados</p>
        </div>
        <Button 
          className="bg-inventory-600 hover:bg-inventory-700"
          onClick={() => setIsAddingClient(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Agregar Cliente
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex w-full">
              <Input
                placeholder="Buscar por nombre, contacto o email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button 
                onClick={handleSearch} 
                className="rounded-l-none bg-inventory-600 hover:bg-inventory-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="md:w-auto" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" /> Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              {/* Filter options can be added here */}
              <div className="flex items-end gap-2 col-span-1 md:col-span-2">
                <Button onClick={handleSearch} className="bg-inventory-600 hover:bg-inventory-700">
                  Aplicar Filtros
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  <X className="h-4 w-4 mr-2" /> Limpiar
                </Button>
              </div>
            </div>
          )}

          {clients.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Productos Asociados</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-inventory-600" />
                          {client.name}
                        </div>
                      </TableCell>
                      <TableCell>{client.contact}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {client.products?.length || 0} productos
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog(client)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDeleteDialog(client)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron clientes</h3>
              <p className="mt-1 text-gray-500">
                Intenta con otros filtros o agrega nuevos clientes.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={resetFilters} 
                  variant="outline" 
                  className="mx-auto"
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Client Dialog */}
      <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Completa la información del nuevo cliente. Los campos con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Nombre de la Empresa *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nombre de la empresa"
                value={newClient.name}
                onChange={handleClientInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contact">Persona de Contacto *</Label>
                <Input
                  id="contact"
                  name="contact"
                  placeholder="Nombre del contacto"
                  value={newClient.contact}
                  onChange={handleClientInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Número telefónico"
                  value={newClient.phone}
                  onChange={handleClientInputChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email de Contacto *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@ejemplo.com"
                value={newClient.email}
                onChange={handleClientInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                name="address"
                placeholder="Dirección de la empresa"
                value={newClient.address}
                onChange={handleClientInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Información adicional sobre el cliente"
                value={newClient.notes}
                onChange={handleClientInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingClient(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddClient}
              disabled={loading || !newClient.name.trim() || !newClient.contact.trim() || !newClient.email.trim()}
              className="bg-inventory-600 hover:bg-inventory-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando
                </>
              ) : (
                <>Agregar Cliente</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditingClient} onOpenChange={setIsEditingClient}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Modifica la información del cliente. Los campos con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-name">Nombre de la Empresa *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Nombre de la empresa"
                  value={selectedClient.name}
                  onChange={handleClientInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-contact">Persona de Contacto *</Label>
                  <Input
                    id="edit-contact"
                    name="contact"
                    placeholder="Nombre del contacto"
                    value={selectedClient.contact}
                    onChange={handleClientInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    placeholder="Número telefónico"
                    value={selectedClient.phone || ''}
                    onChange={handleClientInputChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email de Contacto *</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={selectedClient.email}
                  onChange={handleClientInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Dirección</Label>
                <Input
                  id="edit-address"
                  name="address"
                  placeholder="Dirección de la empresa"
                  value={selectedClient.address || ''}
                  onChange={handleClientInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notas Adicionales</Label>
                <Input
                  id="edit-notes"
                  name="notes"
                  placeholder="Información adicional sobre el cliente"
                  value={selectedClient.notes || ''}
                  onChange={handleClientInputChange}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingClient(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEditClient}
              disabled={loading || !selectedClient?.name.trim() || !selectedClient?.contact.trim() || !selectedClient?.email.trim()}
              className="bg-inventory-600 hover:bg-inventory-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando
                </>
              ) : (
                <>Guardar Cambios</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al cliente "{selectedClient?.name}" y su asociación con productos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando
                </>
              ) : (
                <>Eliminar</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clients;
