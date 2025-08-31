import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, SortAsc, Star, Clock, MapPin } from 'lucide-react';
import { Header } from '@/components/ui/header';
import { MenuItemCard } from '@/components/ui/menu-item-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CartSidebar } from '@/components/ui/cart-sidebar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category_id?: string;
  image_url?: string;
  is_available: boolean;
  rating: number;
  preparation_time: number;
  canteen_id: string;
  menu_categories?: { name: string };
}

interface Canteen {
  id: string;
  name: string;
  description?: string;
  location?: string;
  opening_hours?: string;
}

export default function CanteenPage() {
  const { canteenId } = useParams<{ canteenId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { addItem, items: cartItems, totalItems } = useCart();
  const [sortBy, setSortBy] = useState<string>('name');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [canteen, setCanteen] = useState<Canteen | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch canteen and menu data
  useEffect(() => {
    const fetchData = async () => {
      if (!canteenId) return;
      
      try {
        // Fetch canteen details
        const { data: canteenData, error: canteenError } = await supabase
          .from('canteens')
          .select('*')
          .eq('id', canteenId)
          .single();

        if (canteenError) throw canteenError;
        setCanteen(canteenData);

        // Fetch menu items
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select(`
            *,
            menu_categories(name)
          `)
          .eq('canteen_id', canteenId)
          .eq('is_available', true);

        if (menuError) throw menuError;
        setMenuItems(menuData || []);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('menu_categories')
          .select('*');

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load canteen data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canteenId, toast]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = menuItems;
    
    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category_id === filterCategory);
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
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return filtered;
  }, [menuItems, sortBy, filterCategory]);

  const addToCart = (item: MenuItem) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (profile?.role !== 'customer') {
      toast({
        title: "Access Denied", 
        description: "Only customers can add items to cart",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image_url,
      canteenId: canteen?.id || '',
      canteenName: canteen?.name || ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemsCount={totalItems} />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading canteen...</p>
        </div>
      </div>
    );
  }

  if (!canteen) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemsCount={totalItems} />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Canteen Not Found</h1>
          <p className="text-muted-foreground">The canteen you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Only allow customers to add to cart
  const canAddToCart = profile?.role === 'customer';

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemsCount={totalItems} />
      
      {/* Canteen Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              {canteen.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {canteen.name}
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90">
              {canteen.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{canteen.opening_hours || 'Check locally'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{canteen.location || 'Campus'}</span>
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
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
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
            {filteredAndSortedItems.map((item) => {
              const cartItem = cartItems.find(c => c.id === item.id);
              const quantity = cartItem?.quantity || 0;
              
              return (
                <MenuItemCard
                  key={item.id}
                  item={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    description: item.description || '',
                    category: item.menu_categories?.name || 'Other',
                    image: item.image_url,
                    available: item.is_available,
                    rating: item.rating,
                    reviews: 0,
                    preparationTime: `${item.preparation_time} mins`,
                    canteen: 'STUDENT'
                  }}
                  quantity={quantity}
                  onAddToCart={canAddToCart ? () => addToCart(item) : undefined}
                  onUpdateQuantity={canAddToCart ? (_, __) => {} : undefined}
                  showQuantityControls={canAddToCart}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">
              {filterCategory !== 'all' 
                ? `No items in the selected category.`
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
      
      {/* Cart Sidebar - Only for customers */}
      {canAddToCart && (
        <CartSidebar
          items={[]}
          onUpdateQuantity={() => {}}
          onPlaceOrder={() => navigate('/cart')}
          canteenName={canteen.name}
        />
      )}
    </div>
  );
}