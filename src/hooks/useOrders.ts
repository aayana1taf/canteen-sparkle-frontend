import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export type OrderStatus = 'pending' | 'preparing' | 'ready_for_pickup' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  menu_item: {
    name: string;
    description?: string;
  };
}

export interface Order {
  id: string;
  order_number: number;
  status: OrderStatus;
  total_amount: number;
  notes?: string;
  estimated_pickup_time?: string;
  created_at: string;
  canteen: {
    name: string;
    location: string;
  };
  order_items: OrderItem[];
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          canteen:canteens(name, location),
          order_items(
            *,
            menu_item:menu_items(name, description)
          )
        `)
        .order('created_at', { ascending: false });

      // Filter based on user role
      if (profile?.role === 'customer') {
        query = query.eq('customer_id', user.id);
      } else if (profile?.role === 'canteen_staff') {
        // Staff can see orders for their canteen
        const { data: canteens } = await supabase
          .from('canteens')
          .select('id')
          .eq('staff_user_id', user.id);
        
        if (canteens && canteens.length > 0) {
          query = query.in('canteen_id', canteens.map(c => c.id));
        }
      }
      // Admin can see all orders (no additional filter)

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load orders",
        });
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders",
      });
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (
    canteenId: string,
    items: Array<{ menu_item_id: string; quantity: number; unit_price: number }>,
    notes?: string
  ) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to place an order",
      });
      return { error: new Error('Not authenticated') };
    }

    try {
      const total_amount = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

      // Generate a simple order number for now
      const orderNumber = Math.floor(Math.random() * 10000) + 1;

      // Create the order directly
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          canteen_id: canteenId,
          total_amount,
          notes: notes || null,
          estimated_pickup_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          order_number: orderNumber,
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      toast({
        title: "Order placed successfully!",
        description: `Order #${order.order_number} has been placed`,
      });

      fetchOrders();
      return { error: null, order };
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        variant: "destructive",
        title: "Failed to place order",
        description: error.message,
      });
      return { error };
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      toast({
        title: "Order updated",
        description: `Order status changed to ${status.replace('_', ' ')}`,
      });

      fetchOrders();
      return { error: null };
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "Failed to update order",
        description: error.message,
      });
      return { error };
    }
  };

  const cancelOrder = async (orderId: string) => {
    return updateOrderStatus(orderId, 'cancelled');
  };

  useEffect(() => {
    if (user && profile) {
      fetchOrders();
    }
  }, [user, profile]);

  // Set up real-time subscriptions for order updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders(); // Refresh orders when any order changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    orders,
    loading,
    placeOrder,
    updateOrderStatus,
    cancelOrder,
    refetch: fetchOrders
  };
};