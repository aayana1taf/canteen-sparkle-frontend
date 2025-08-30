-- Enable realtime for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Add orders table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Enable realtime for order_items table  
ALTER TABLE public.order_items REPLICA IDENTITY FULL;

-- Add order_items table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;