-- Create staff accounts for each canteen
-- Note: These will be inserted into auth.users via the authentication system

-- First, let's clean up the duplicate canteen and ensure we have exactly 3 canteens
DELETE FROM canteens WHERE id = '46a45085-3590-4408-9f9b-cb6ea8898fec';

-- Create staff user profiles for each canteen
-- Staff 1: GCR Canteen
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  'gcr-staff-user-id-001',
  '00000000-0000-0000-0000-000000000000',
  'gcr.staff@canteen.com',
  crypt('gcr123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "GCR Staff Manager", "role": "canteen_staff"}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (user_id, full_name, role, phone) VALUES (
  'gcr-staff-user-id-001',
  'GCR Staff Manager',
  'canteen_staff',
  '+1234567890'
);

-- Staff 2: DMS Canteen  
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  'dms-staff-user-id-002',
  '00000000-0000-0000-0000-000000000000',
  'dms.staff@canteen.com',
  crypt('dms123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "DMS Staff Manager", "role": "canteen_staff"}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (user_id, full_name, role, phone) VALUES (
  'dms-staff-user-id-002',
  'DMS Staff Manager',
  'canteen_staff',
  '+1234567891'
);

-- Staff 3: SFC Canteen
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  'sfc-staff-user-id-003',
  '00000000-0000-0000-0000-000000000000',
  'sfc.staff@canteen.com',
  crypt('sfc123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "SFC Staff Manager", "role": "canteen_staff"}',
  'authenticated',
  'authenticated'
);

INSERT INTO profiles (user_id, full_name, role, phone) VALUES (
  'sfc-staff-user-id-003',
  'SFC Staff Manager', 
  'canteen_staff',
  '+1234567892'
);

-- Link staff to their respective canteens
UPDATE canteens SET staff_user_id = 'gcr-staff-user-id-001' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE canteens SET staff_user_id = 'dms-staff-user-id-002' WHERE id = '550e8400-e29b-41d4-a716-446655440002';
UPDATE canteens SET staff_user_id = 'sfc-staff-user-id-003' WHERE id = '550e8400-e29b-41d4-a716-446655440003';

-- Ensure all canteens are approved
UPDATE canteens SET is_approved = true;