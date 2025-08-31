-- Create staff user profiles for each canteen with proper UUIDs
-- We'll insert the profiles first since we can't directly insert into auth.users

-- Generate UUIDs for the staff users
-- Staff 1: GCR Canteen
INSERT INTO profiles (user_id, full_name, role, phone) VALUES (
  gen_random_uuid(),
  'GCR Staff Manager',
  'canteen_staff',
  '+1234567890'
);

-- Staff 2: DMS Canteen  
INSERT INTO profiles (user_id, full_name, role, phone) VALUES (
  gen_random_uuid(),
  'DMS Staff Manager',
  'canteen_staff',
  '+1234567891'
);

-- Staff 3: SFC Canteen
INSERT INTO profiles (user_id, full_name, role, phone) VALUES (
  gen_random_uuid(),
  'SFC Staff Manager', 
  'canteen_staff',
  '+1234567892'
);

-- Now link the newly created staff to their canteens
-- We need to get the user_ids from the profiles we just created
DO $$
DECLARE
    gcr_staff_id uuid;
    dms_staff_id uuid;
    sfc_staff_id uuid;
BEGIN
    -- Get the user IDs for each staff member
    SELECT user_id INTO gcr_staff_id FROM profiles WHERE full_name = 'GCR Staff Manager';
    SELECT user_id INTO dms_staff_id FROM profiles WHERE full_name = 'DMS Staff Manager';
    SELECT user_id INTO sfc_staff_id FROM profiles WHERE full_name = 'SFC Staff Manager';
    
    -- Link staff to their respective canteens
    UPDATE canteens SET staff_user_id = gcr_staff_id WHERE id = '550e8400-e29b-41d4-a716-446655440001';
    UPDATE canteens SET staff_user_id = dms_staff_id WHERE id = '550e8400-e29b-41d4-a716-446655440002';
    UPDATE canteens SET staff_user_id = sfc_staff_id WHERE id = '550e8400-e29b-41d4-a716-446655440003';
END $$;

-- Ensure all canteens are approved
UPDATE canteens SET is_approved = true;