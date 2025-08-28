import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, SortAsc, Star, Clock, MapPin } from 'lucide-react';
import { Header } from '@/components/ui/header';
import { MenuItemCard } from '@/components/ui/menu-item-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { canteens, getMenuByCanteen, MenuItem } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function CanteenPage() {
  const { canteenId } = useParams<{ canteenId: string }>();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<string>('name');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [cart, setCart] = useState<Record<string, number>>({});

  const canteen = canteens.find(c => c.id === canteenId);
  const menuItems = useMemo(() => getMenuByCanteen(canteenId || ''), [canteenId]);
  
  const categories = useMemo(() => {
    const cats = new Set(menuItems.map(item => item.category));
    return Array.from(cats);
  }, [menuItems]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = menuItems;
    
    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }
    
    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return filtered;
  }, [menuItems, sortBy, filterCategory]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(prev => {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      });
    } else {
      setCart(prev => ({
        ...prev,
        [itemId]: quantity
      }));
    }
  };

  const cartItemsCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  if (!canteen) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Canteen Not Found</h1>
          <p className="text-muted-foreground">The canteen you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const canteenColor = canteen.color as 'gcr' | 'dms' | 'sfc';

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemsCount={cartItemsCount} />
      
      {/* Canteen Header */}
      <section className={`bg-gradient-to-r from-${canteenColor} to-${canteenColor}/80 text-${canteenColor}-foreground py-12`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              {canteen.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {canteen.fullName}
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90">
              {canteen.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{canteen.hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{canteen.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="popular">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1" />

          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedItems.length} items
          </div>
        </div>

        {/* Menu Items */}
        {filteredAndSortedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                quantity={cart[item.id] || 0}
                onAddToCart={addToCart}
                onUpdateQuantity={updateQuantity}
                showQuantityControls={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">
              {filterCategory !== 'all' 
                ? `No items in the "${filterCategory}" category.`
                : 'This canteen has no menu items available.'
              }
            </p>
            {filterCategory !== 'all' && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFilterCategory('all')}
              >
                Show All Items
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}