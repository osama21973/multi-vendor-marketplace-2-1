
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const ownerNavItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Store size={20} />, label: 'Vendors', path: '/dashboard/vendors' },
    { icon: <ShoppingBag size={20} />, label: 'Products', path: '/dashboard/products' },
    { icon: <Package size={20} />, label: 'Orders', path: '/dashboard/orders' },
    { icon: <Users size={20} />, label: 'Customers', path: '/dashboard/customers' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
  ];

  const vendorNavItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Store size={20} />, label: 'My Store', path: '/dashboard/store' },
    { icon: <ShoppingBag size={20} />, label: 'Products', path: '/dashboard/products' },
    { icon: <Package size={20} />, label: 'Orders', path: '/dashboard/orders' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
  ];

  const customerNavItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Package size={20} />, label: 'My Orders', path: '/dashboard/orders' },
    { icon: <Users size={20} />, label: 'My Profile', path: '/dashboard/profile' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
  ];

  // Determine which nav items to show based on user role
  const navItems = user?.role === 'owner' 
    ? ownerNavItems 
    : user?.role === 'vendor' 
      ? vendorNavItems
      : customerNavItems;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r shadow-sm h-screen sticky top-0">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="h-8 w-8 rounded-full bg-marketplace-primary flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="font-bold text-xl text-marketplace-dark">
              {t('app.name')}
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item, index) => (
              <Link 
                key={index}
                to={item.path}
                className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 rtl:space-x-reverse w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 start-0 flex max-w-xs w-full bg-white flex-col z-50">
            <div className="p-4 border-b flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="h-8 w-8 rounded-full bg-marketplace-primary flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="font-bold text-xl text-marketplace-dark">
                  {t('app.name')}
                </span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                {navItems.map((item, index) => (
                  <Link 
                    key={index}
                    to={item.path}
                    className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 rtl:space-x-reverse w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          <div 
            className="fixed inset-0 z-30"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b py-4 px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </Button>
              <h1 className="text-xl font-bold text-marketplace-dark">{title}</h1>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-marketplace-primary text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
