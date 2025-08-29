-- Create the create_order RPC function
CREATE OR REPLACE FUNCTION public.create_order(
  p_customer_id uuid,
  p_canteen_id uuid,
  p_total_amount numeric,
  p_notes text DEFAULT NULL,
  p_estimated_pickup_time timestamp with time zone DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  order_number integer,
  customer_id uuid,
  canteen_id uuid,
  total_amount numeric,
  notes text,
  estimated_pickup_time timestamp with time zone,
  status order_status,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order_number INTEGER;
  new_order_id UUID;
BEGIN
  -- Generate order number
  SELECT COALESCE(MAX(orders.order_number), 0) + 1 
  INTO new_order_number 
  FROM public.orders 
  WHERE DATE(orders.created_at) = CURRENT_DATE;
  
  -- Insert order
  INSERT INTO public.orders (
    customer_id, 
    canteen_id, 
    total_amount, 
    notes, 
    estimated_pickup_time,
    order_number
  ) VALUES (
    p_customer_id,
    p_canteen_id,
    p_total_amount,
    p_notes,
    p_estimated_pickup_time,
    new_order_number
  ) RETURNING orders.id INTO new_order_id;
  
  -- Return the created order
  RETURN QUERY
  SELECT 
    orders.id,
    orders.order_number,
    orders.customer_id,
    orders.canteen_id,
    orders.total_amount,
    orders.notes,
    orders.estimated_pickup_time,
    orders.status,
    orders.created_at
  FROM public.orders
  WHERE orders.id = new_order_id;
END;
$$;