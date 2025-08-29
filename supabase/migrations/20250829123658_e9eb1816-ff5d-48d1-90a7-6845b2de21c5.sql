-- Fix the order_number column to be nullable so trigger can set it
ALTER TABLE public.orders ALTER COLUMN order_number DROP NOT NULL;
ALTER TABLE public.orders ALTER COLUMN order_number SET DEFAULT 0;