import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealTimeOrders = (onOrderUpdate?: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          onOrderUpdate?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items'
        },
        () => {
          onOrderUpdate?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onOrderUpdate]);
};