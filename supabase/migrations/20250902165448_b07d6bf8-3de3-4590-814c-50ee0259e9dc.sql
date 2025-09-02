-- Clean up duplicate GCR canteens and fix user roles
-- Delete the duplicate GCR canteen (keeping the one with better description)
DELETE FROM canteens WHERE id = '46a45085-3590-4408-9f9b-cb6ea8898fec';

-- Update user roles that weren't properly set
UPDATE profiles SET role = 'canteen_staff' WHERE full_name = 'admingg';

-- Add settings table for logo and other admin configurations
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_settings
CREATE POLICY "Admins can manage settings" ON admin_settings
  FOR ALL USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Everyone can view settings" ON admin_settings
  FOR SELECT USING (true);

-- Insert default logo setting
INSERT INTO admin_settings (setting_key, setting_value) 
VALUES ('site_logo_url', NULL) 
ON CONFLICT (setting_key) DO NOTHING;

-- Add trigger for updated_at on admin_settings
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for tables that need live updates (only if not already added)
ALTER TABLE admin_settings REPLICA IDENTITY FULL;

-- Add only admin_settings to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE admin_settings;