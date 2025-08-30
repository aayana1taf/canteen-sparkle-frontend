-- Insert sample menu categories
INSERT INTO public.menu_categories (id, name) VALUES
  (gen_random_uuid(), 'Main Course'),
  (gen_random_uuid(), 'Beverages'),
  (gen_random_uuid(), 'Fast Food'),
  (gen_random_uuid(), 'Snacks'),
  (gen_random_uuid(), 'BBQ'),
  (gen_random_uuid(), 'Sandwiches'),
  (gen_random_uuid(), 'Burgers'),
  (gen_random_uuid(), 'Pizza')
ON CONFLICT (name) DO NOTHING;

-- Insert sample canteens if they don't exist
INSERT INTO public.canteens (id, name, description, location, opening_hours, is_approved) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'GCR Canteen', 'Fresh and healthy meals with traditional Pakistani cuisine', 'Main Campus, Block A', '8:00 AM - 6:00 PM', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'DMS Canteen', 'Modern cuisine with quick service for busy students', 'DMS Building, 2nd Floor', '7:30 AM - 7:00 PM', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'SFC Canteen', 'Cozy atmosphere with comfort food and snacks', 'Student Center, Ground Floor', '9:00 AM - 5:00 PM', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample menu items with proper category references
DO $$
DECLARE
    main_course_id uuid;
    beverages_id uuid;
    fast_food_id uuid;
    snacks_id uuid;
    bbq_id uuid;
    sandwiches_id uuid;
    burgers_id uuid;
    gcr_id uuid := '550e8400-e29b-41d4-a716-446655440001';
    dms_id uuid := '550e8400-e29b-41d4-a716-446655440002';
    sfc_id uuid := '550e8400-e29b-41d4-a716-446655440003';
BEGIN
    -- Get category IDs
    SELECT id INTO main_course_id FROM public.menu_categories WHERE name = 'Main Course';
    SELECT id INTO beverages_id FROM public.menu_categories WHERE name = 'Beverages';
    SELECT id INTO fast_food_id FROM public.menu_categories WHERE name = 'Fast Food';
    SELECT id INTO snacks_id FROM public.menu_categories WHERE name = 'Snacks';
    SELECT id INTO bbq_id FROM public.menu_categories WHERE name = 'BBQ';
    SELECT id INTO sandwiches_id FROM public.menu_categories WHERE name = 'Sandwiches';
    SELECT id INTO burgers_id FROM public.menu_categories WHERE name = 'Burgers';

    -- Insert GCR menu items
    INSERT INTO public.menu_items (canteen_id, category_id, name, description, price, rating, preparation_time, is_available) VALUES
    (gcr_id, main_course_id, 'Chicken Biryani', 'Aromatic basmati rice with tender chicken pieces, served with raita and shorba', 280, 4.8, 20, true),
    (gcr_id, main_course_id, 'Beef Karahi', 'Spicy beef cooked with tomatoes, green chilies, and traditional spices', 320, 4.6, 25, true),
    (gcr_id, main_course_id, 'Daal Chawal', 'Traditional lentil curry served with steamed basmati rice', 150, 4.3, 15, true),
    (gcr_id, bbq_id, 'Chicken Tikka', 'Grilled chicken pieces marinated in yogurt and spices', 200, 4.7, 20, true),
    (gcr_id, beverages_id, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 80, 4.5, 3, true),
    (gcr_id, fast_food_id, 'Chapati Roll', 'Chicken or beef roll wrapped in fresh chapati with vegetables', 120, 4.4, 10, true);

    -- Insert DMS menu items
    INSERT INTO public.menu_items (canteen_id, category_id, name, description, price, rating, preparation_time, is_available) VALUES
    (dms_id, sandwiches_id, 'Club Sandwich', 'Triple-layer sandwich with chicken, cheese, lettuce, and tomatoes', 250, 4.6, 8, true),
    (dms_id, burgers_id, 'Chicken Burger', 'Grilled chicken patty with cheese, lettuce, and special sauce', 300, 4.5, 12, true),
    (dms_id, fast_food_id, 'Chicken Wrap', 'Grilled chicken strips with vegetables in a soft tortilla', 220, 4.4, 10, true),
    (dms_id, beverages_id, 'Cappuccino', 'Rich espresso with steamed milk and foam', 150, 4.7, 4, true),
    (dms_id, beverages_id, 'Iced Latte', 'Chilled espresso with cold milk and ice', 170, 4.6, 3, true);

    -- Insert SFC menu items
    INSERT INTO public.menu_items (canteen_id, category_id, name, description, price, rating, preparation_time, is_available) VALUES
    (sfc_id, snacks_id, 'Samosa Chaat', 'Crispy samosas topped with yogurt, chutney, and spices', 120, 4.5, 7, true),
    (sfc_id, fast_food_id, 'Chicken Shawarma', 'Tender chicken strips with vegetables and garlic sauce in pita bread', 200, 4.7, 10, true),
    (sfc_id, bbq_id, 'Seekh Kebab', 'Grilled minced meat skewers with traditional spices', 180, 4.4, 15, true),
    (sfc_id, snacks_id, 'Pani Puri', 'Crispy shells filled with spiced water and chutneys', 100, 4.6, 5, true),
    (sfc_id, main_course_id, 'Chicken Karahi', 'Traditional chicken curry cooked in a wok with fresh spices', 290, 4.8, 22, true),
    (sfc_id, beverages_id, 'Lassi', 'Traditional yogurt drink - sweet or salty', 90, 4.3, 3, true);

END $$;