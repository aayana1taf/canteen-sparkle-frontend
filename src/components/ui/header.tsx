import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { ProfileDropdown } from './profile-dropdown';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  cartItemsCount?: number;
  onSearch?: (query: string) => void;
}

export const Header = ({ cartItemsCount = 0, onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { profile } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-card shadow-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <span className="text-primary-foreground font-bold text-xl">NED</span>
            </div>
            <span className="text-xl font-bold text-foreground">Canteen</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Only show canteen browsing for customers */}
            {profile?.role === 'customer' && (
              <>
                <Link 
                  to="/browse" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/browse') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Browse Canteens
                </Link>
                <Link 
                  to="/orders" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/orders') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  My Orders
                </Link>
              </>
            )}
          </nav>

          {/* Cart, Profile and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Only show cart for customers */}
            {profile?.role === 'customer' && (
              <Link to="/cart">
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {cartItemsCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
            
            <ProfileDropdown />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-slide-up">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for food items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" size="sm">
                Search
              </Button>
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              {/* Only show customer navigation for customers */}
              {profile?.role === 'customer' && (
                <>
                  <Link 
                    to="/browse" 
                    className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                      isActive('/browse') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Browse Canteens
                  </Link>
                  <Link 
                    to="/orders" 
                    className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                      isActive('/orders') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};