import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  canteenId: string;
  canteenName: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  placeOrder: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const { placeOrder: submitOrder } = useOrders();
  const navigate = useNavigate();

  // Clear cart when user logs out
  useEffect(() => {
    if (!user) {
      setItems([]);
    }
  }, [user]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
    toast.success(`${newItem.name} added to cart`);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const placeOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      return;
    }

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      // Group items by canteen
      const itemsByCanteen = items.reduce((acc, item) => {
        if (!acc[item.canteenId]) {
          acc[item.canteenId] = [];
        }
        acc[item.canteenId].push(item);
        return acc;
      }, {} as Record<string, CartItem[]>);

      // Place order for each canteen
      for (const [canteenId, canteenItems] of Object.entries(itemsByCanteen)) {
        const orderItems = canteenItems.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        }));

        await submitOrder(canteenId, orderItems, 'Cash on pickup');
      }

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      placeOrder,
      totalItems,
      totalAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};