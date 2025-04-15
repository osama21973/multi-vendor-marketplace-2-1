
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, Globe, ShoppingCart, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { t, language, setLanguage, direction } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="h-8 w-8 rounded-full bg-marketplace-primary flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="font-bold text-xl text-marketplace-dark">
              {t('app.name')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 rtl:space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-marketplace-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/stores" className="text-gray-700 hover:text-marketplace-primary transition-colors">
              {t('nav.stores')}
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-marketplace-primary transition-colors">
              {t('nav.categories')}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-700 hover:text-marketplace-primary transition-colors flex items-center gap-1">
                {t('nav.about')} <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align={direction === 'rtl' ? 'end' : 'start'}>
                <DropdownMenuItem>
                  <Link to="/about" className="w-full">About Us</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/contact" className="w-full">Contact</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLanguage}
              className="hover:bg-gray-100"
            >
              <Globe size={20} />
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <ShoppingCart size={20} />
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-marketplace-primary text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={direction === 'rtl' ? 'end' : 'start'}>
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="w-full">{t('nav.dashboard')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Link to="/login">
                  <Button variant="ghost" className="hover:bg-gray-100">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="default" className="bg-marketplace-primary hover:bg-marketplace-secondary">
                    {t('nav.signup')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-marketplace-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/stores" 
              className="text-gray-700 hover:text-marketplace-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.stores')}
            </Link>
            <Link 
              to="/categories" 
              className="text-gray-700 hover:text-marketplace-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.categories')}
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-marketplace-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.about')}
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-marketplace-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.contact')}
            </Link>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleLanguage}
                className="hover:bg-gray-100"
              >
                <Globe size={18} className="mr-2 rtl:ml-2 rtl:mr-0" />
                {language === 'en' ? 'العربية' : 'English'}
              </Button>

              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <ShoppingCart size={20} />
              </Button>
            </div>

            <div className="pt-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-marketplace-primary text-white">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full hover:bg-gray-100"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="default" className="w-full bg-marketplace-primary hover:bg-marketplace-secondary">
                      {t('nav.signup')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
