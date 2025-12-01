import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Music, Video, Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';
import { authService } from '@/services/api';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = authService.isAuthenticated();

  const navItems = [
    { path: '/', label: 'Blog', icon: FileText },
    { path: '/audio', label: 'Audio', icon: Music },
    { path: '/video', label: 'Video', icon: Video },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/blog');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Card className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">RO</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Raphael Owoloye</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={isActive(path) ? "default" : "ghost"}
                className={`flex items-center space-x-2 ${
                  isActive(path) 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                asChild
              >
                <Link to={path}>
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
            
            {/* Admin Link - Only show when authenticated */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-200"
                asChild
              >
                <Link to="/admin/dashboard">
                  <Settings size={16} />
                  <span>Admin</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Button
                  key={path}
                  variant={isActive(path) ? "default" : "ghost"}
                  className={`flex items-center justify-start space-x-2 w-full ${
                    isActive(path) 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to={path}>
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                </Button>
              ))}
              
              {/* Admin Link for Mobile - Only show when authenticated */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  className="flex items-center justify-start space-x-2 w-full text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-200"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/admin/dashboard">
                    <Settings size={16} />
                    <span>Admin</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </Card>
  );
};

export default Navbar;