import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const AdminSettings = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'site_logo_url')
        .single();
      
      setLogoUrl(data?.setting_value || '');
    };

    fetchSettings();
  }, []);

  const handleLogoUpdate = async () => {
    if (!logoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid logo URL",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: 'site_logo_url',
          setting_value: logoUrl
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Logo updated successfully"
      });
    } catch (error) {
      console.error('Error updating logo:', error);
      toast({
        title: "Error",
        description: "Failed to update logo",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveLogo = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: 'site_logo_url',
          setting_value: null
        });

      if (error) throw error;

      setLogoUrl('');
      toast({
        title: "Success",
        description: "Logo removed successfully"
      });
    } catch (error) {
      console.error('Error removing logo:', error);
      toast({
        title: "Error",
        description: "Failed to remove logo",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader className="bg-gradient-to-r from-background to-muted/20">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Settings className="h-5 w-5" />
          Site Settings
        </CardTitle>
        <CardDescription>
          Manage site logo and other configuration options
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="logo-url" className="text-sm font-semibold text-foreground">
              Site Logo URL
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              Enter a URL for your logo image. Leave empty to use the default NED Canteen branding.
            </p>
            <div className="flex gap-3">
              <Input
                id="logo-url"
                type="url"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleLogoUpdate} 
                disabled={isUpdating}
                className="px-6"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
              {logoUrl && (
                <Button 
                  variant="outline" 
                  onClick={handleRemoveLogo} 
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {logoUrl && (
            <div className="p-4 border border-border rounded-lg bg-muted/20">
              <p className="text-sm font-medium text-foreground mb-2">Logo Preview:</p>
              <img 
                src={logoUrl} 
                alt="Logo preview" 
                className="h-12 w-auto object-contain border border-border rounded"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const errorMsg = document.createElement('div');
                  errorMsg.textContent = 'Failed to load image';
                  errorMsg.className = 'text-sm text-destructive';
                  img.parentNode?.appendChild(errorMsg);
                }}
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-2">Instructions:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Upload your logo to a hosting service (like Imgur, Cloudinary, etc.)</li>
            <li>• Copy the direct image URL and paste it above</li>
            <li>• Recommended size: 200px width, 50px height for best results</li>
            <li>• Supported formats: PNG, JPG, SVG</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};