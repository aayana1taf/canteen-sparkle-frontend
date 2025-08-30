import { Star, Clock, Plus, Minus } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: string;
  available: boolean;
  rating: number;
  reviews: number;
  isPopular?: boolean;
  preparationTime: string;
  canteen: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  quantity?: number;
  onAddToCart?: (item: MenuItem) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  showQuantityControls?: boolean;
}

export const MenuItemCard = ({ 
  item, 
  quantity = 0, 
  onAddToCart, 
  onUpdateQuantity,
  showQuantityControls = false 
}: MenuItemCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-all duration-300 group">
      <CardContent className="p-0">
        {/* Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
          {item.image ? (
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-50">🍽️</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          <div className="absolute top-4 left-4 flex gap-2">
            {item.isPopular && (
              <Badge variant="destructive" className="text-xs">
                Popular
              </Badge>
            )}
            {!item.available && (
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <span className="text-lg font-bold text-primary">
              ₨{item.price}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {item.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{item.rating}</span>
              <span>({item.reviews})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{item.preparationTime}</span>
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <Badge variant="outline" className="text-xs">
              {item.category}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            {showQuantityControls && quantity > 0 ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity?.(item.id, Math.max(0, quantity - 1))}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[20px] text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity?.(item.id, quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onAddToCart?.(item)}
                disabled={!item.available}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};