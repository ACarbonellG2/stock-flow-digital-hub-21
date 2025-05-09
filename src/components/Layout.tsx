
import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface LayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
}

const NavItem = ({ href, icon, title }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  
  return (
    <Link to={href} className="w-full">
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start gap-2 font-normal",
          isActive ? "bg-inventory-100 text-inventory-700" : "hover:bg-inventory-50"
        )}
      >
        {icon}
        {title}
      </Button>
    </Link>
  );
};

const Layout = ({ children }: LayoutProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r overflow-y-auto">
          <div className="flex items-center justify-center px-4 mb-6">
            <div className="flex items-center">
              <ShoppingBag className="h-6 w-6 text-inventory-700 mr-2" />
              <div>
                <h1 className="text-lg font-bold text-inventory-700">Rep. Ulloa López</h1>
                <p className="text-xs text-gray-500">Dotaciones Corporativas</p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col space-y-1 px-3 py-4">
            <NavItem href="/" icon={<LayoutDashboard size={18} />} title="Dashboard" />
            <NavItem href="/products" icon={<Package size={18} />} title="Productos" />
            <NavItem href="/add-product" icon={<PlusCircle size={18} />} title="Agregar Producto" />
            <NavItem href="/reports" icon={<BarChart3 size={18} />} title="Reportes" />
            <NavItem href="/settings" icon={<Settings size={18} />} title="Configuración" />
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden bg-white w-full h-16 flex items-center px-4 border-b fixed top-0 left-0 right-0 z-10">
        <Button variant="ghost" onClick={toggleMobileMenu} className="p-0 h-9 w-9">
          {showMobileMenu ? <X /> : <Menu />}
        </Button>
        <div className="flex items-center ml-4">
          <ShoppingBag className="h-5 w-5 text-inventory-700 mr-2" />
          <div>
            <h1 className="text-md font-bold text-inventory-700">Rep. Ulloa López</h1>
            <p className="text-xs text-gray-500">Dotaciones Corporativas</p>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="bg-white h-screen w-64 flex flex-col pt-5 z-30">
            <div className="flex items-center justify-between px-4 mb-6">
              <div className="flex items-center">
                <ShoppingBag className="h-6 w-6 text-inventory-700 mr-2" />
                <div>
                  <h1 className="text-lg font-bold text-inventory-700">Rep. Ulloa López</h1>
                  <p className="text-xs text-gray-500">Dotaciones Corporativas</p>
                </div>
              </div>
              <Button variant="ghost" onClick={toggleMobileMenu} className="p-0 h-9 w-9">
                <X size={18} />
              </Button>
            </div>
            <Separator />
            <div className="flex flex-col space-y-1 px-3 py-4">
              <NavItem href="/" icon={<LayoutDashboard size={18} />} title="Dashboard" />
              <NavItem href="/products" icon={<Package size={18} />} title="Productos" />
              <NavItem href="/add-product" icon={<PlusCircle size={18} />} title="Agregar Producto" />
              <NavItem href="/reports" icon={<BarChart3 size={18} />} title="Reportes" />
              <NavItem href="/settings" icon={<Settings size={18} />} title="Configuración" />
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1 w-full">
        <main className="flex-1 mt-16 md:mt-0">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
