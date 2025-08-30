import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Star } from 'lucide-react';
import { Header } from '@/components/ui/header';
import { CanteenCard } from '@/components/ui/canteen-card';
import { MenuItemCard } from '@/components/ui/menu-item-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-image.jpg';

interface Canteen {
  id: string;
  name: string;
  description?: string;
  location?: string;
  opening_hours?: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  rating: number;
  image_url?: string;
  preparation_time: number;
  canteen: { name: string };
}

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch approved canteens
        const { data: canteenData, error: canteenError } = await supabase
          .from('canteens')
          .select('*')
          .eq('is_approved', true);

        if (canteenError) throw canteenError;
        setCanteens(canteenData || []);

        // Fetch popular menu items (highest rated)
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select(`
            *,
            canteen:canteens(name)
          `)
          .eq('is_available', true)
          .order('rating', { ascending: false })
          .limit(6);

        if (menuError) throw menuError;
        setPopularItems(menuData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select(`
            *,
            canteen:canteens(name)
          `)
          .eq('is_available', true)
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

        if (error) throw error;
        setSearchResults(data || []);
        setIsSearching(true);
      } catch (error) {
        console.error('Error searching:', error);
        setSearchResults([]);
        setIsSearching(true);
      }
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section 
        className="relative h-[500px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up">
            NED University <span className="text-primary">Canteens</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-slide-up">
            Discover delicious food from campus canteens. Order online and enjoy fresh meals on campus.
          </p>
          
          {/* Hero Search */}
          <div className="max-w-md mx-auto animate-bounce-in">
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get('search') as string;
              handleSearch(query);
            }}>
              <div className="flex gap-2">
                <Input
                  name="search"
                  placeholder="Search for your favorite food..."
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70"
                />
                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search Results */}
        {isSearching && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Search Results</h2>
              <Button variant="outline" onClick={() => {
                setIsSearching(false);
                setSearchResults([]);
              }}>
                Clear Search
              </Button>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((item) => (
                  <MenuItemCard key={item.id} item={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    description: item.description || '',
                    category: 'Search Result',
                    image: item.image_url,
                    available: true,
                    rating: item.rating,
                    reviews: 0,
                    preparationTime: `${item.preparation_time} mins`,
                    canteen: item.canteen.name
                  }} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
                <p className="text-muted-foreground">Try searching for something else</p>
              </div>
            )}
          </section>
        )}

        {/* Popular Items */}
        {!isSearching && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Popular Items</h2>
            </div>
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading popular items...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularItems.map((item) => (
                  <MenuItemCard key={item.id} item={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    description: item.description || '',
                    category: 'Popular',
                    image: item.image_url,
                    available: true,
                    rating: item.rating,
                    reviews: 0,
                    preparationTime: `${item.preparation_time} mins`,
                    canteen: item.canteen.name
                  }} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Canteens */}
        {!isSearching && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Our Canteens</h2>
            </div>
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading canteens...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {canteens.map((canteen) => (
                  <CanteenCard key={canteen.id} canteen={{
                    id: canteen.id,
                    name: canteen.name,
                    fullName: canteen.name,
                    description: canteen.description || '',
                    image: '/placeholder.svg',
                    color: 'primary',
                    hours: canteen.opening_hours || 'Check locally',
                    location: canteen.location || 'Campus',
                    specialties: []
                  }} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Footer CTA */}
        {!isSearching && !loading && (
          <section className="mt-16 text-center">
            <div className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground">
              <h3 className="text-2xl font-bold mb-4">Ready to Order?</h3>
              <p className="text-lg mb-6 opacity-90">
                Browse our canteen menus and order your favorite meals
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {canteens.map((canteen) => (
                  <Link key={canteen.id} to={`/canteen/${canteen.id}`}>
                    <Button variant="secondary" size="lg">
                      Order from {canteen.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}