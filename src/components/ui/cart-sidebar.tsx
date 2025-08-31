import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartSidebarProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onPlaceOrder: () => void;
  canteenName?: string;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  items,
  onUpdateQuantity,
  onPlaceOrder,
  canteenName
}) => {
  const { items: cartItems, totalItems, totalAmount } = useCart();
  const displayItems = cartItems.length > 0 ? cartItems : items;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          {canteenName && (
            <SheetDescription>Items from {canteenName}</SheetDescription>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {displayItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {displayItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price} each
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            {item.quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>

                <Button 
                  onClick={onPlaceOrder} 
                  className="w-full" 
                  size="lg"
                  disabled={displayItems.length === 0}
                >
                  {displayItems.length > 0 ? `Place Order (${totalItems} items)` : 'Go to Cart'}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};