import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Store, Plus } from 'lucide-react';

interface CanteenRegistrationProps {
  onCanteenCreated?: () => void;
}

export const CanteenRegistration: React.FC<CanteenRegistrationProps> = ({ onCanteenCreated }) => {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    opening_hours: '',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('canteens')
      .insert({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        opening_hours: formData.opening_hours,
        image_url: formData.image_url,
        staff_user_id: user?.id,
        is_approved: false
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to register canteen",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Canteen registered successfully! Waiting for admin approval.",
      });
      setFormData({
        name: '',
        description: '',
        location: '',
        opening_hours: '',
        image_url: ''
      });
      setIsOpen(false);
      onCanteenCreated?.();
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={profile?.role !== 'admin'}>
          <Plus className="h-4 w-4 mr-2" />
          {profile?.role === 'admin' ? 'Register New Canteen' : 'Only Admin Can Register Canteens'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Register New Canteen
          </DialogTitle>
          <DialogDescription>
            Register your canteen to start serving students. Your canteen will need admin approval before going live.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Canteen Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., GCR Canteen"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Ground Floor, GCR Building"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your canteen and specialties..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hours">Opening Hours</Label>
            <Input
              id="hours"
              value={formData.opening_hours}
              onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
              placeholder="e.g., Mon-Fri: 8:00 AM - 6:00 PM"
            />
          </div>

          <div>
            <Label htmlFor="image">Canteen Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/canteen-image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Canteen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};