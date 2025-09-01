-- Clean up duplicate canteens and assign existing users as staff
-- First, remove the duplicate GCR canteen (the one without staff assigned)
DELETE FROM canteens WHERE name = 'GCR' AND staff_user_id IS NULL;

-- Update user roles to canteen_staff and link them to canteens
-- Update smart to be DMS canteen staff
UPDATE profiles SET role = 'canteen_staff' WHERE user_id = '69c160ed-4d13-4dae-933b-df63653c9542';
UPDATE canteens SET staff_user_id = '69c160ed-4d13-4dae-933b-df63653c9542' WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- Update admingg to be SFC canteen staff  
UPDATE profiles SET role = 'canteen_staff' WHERE user_id = '34e5b138-1f89-42d7-b012-6cb8559f7095';
UPDATE canteens SET staff_user_id = '34e5b138-1f89-42d7-b012-6cb8559f7095' WHERE id = '550e8400-e29b-41d4-a716-446655440003';

-- Link jawwad to the correct GCR canteen
UPDATE canteens SET staff_user_id = 'abf4dbf6-5acf-4d8e-8f86-9ec86381ac93' WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- Make sure all canteens are approved
UPDATE canteens SET is_approved = true;