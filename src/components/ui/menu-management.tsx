import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Package, Upload } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  is_vegetarian: boolean;
  is_available: boolean;
  preparation_time: number;
  image_url?: string;
  menu_categories?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

interface MenuManagementProps {
  canteenId: string;
}

export const MenuManagement: React.FC<MenuManagementProps> = ({ canteenId }) => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_vegetarian: false,
    is_available: true,
    preparation_time: '15',
    image_url: ''
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, [canteenId]);

  const fetchMenuItems = async () => {
    if (!canteenId) return;
    
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories:category_id(name)
      `)
      .eq('canteen_id', canteenId)
      .order('name');

    if (data) {
      setMenuItems(data);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('name');

    if (data) {
      setCategories(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category_id: formData.category_id,
      is_vegetarian: formData.is_vegetarian,
      is_available: formData.is_available,
      preparation_time: parseInt(formData.preparation_time),
      image_url: formData.image_url,
      canteen_id: canteenId
    };

    if (editingItem) {
      const { error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingItem.id);

      if (!error) {
        toast({
          title: "Success",
          description: "Menu item updated successfully",
        });
        setEditingItem(null);
      }
    } else {
      const { error } = await supabase
        .from('menu_items')
        .insert(itemData);

      if (!error) {
        toast({
          title: "Success",
          description: "Menu item added successfully",
        });
        setIsAddDialogOpen(false);
      }
    }

    if (!editingItem && !isAddDialogOpen) {
      resetForm();
      fetchMenuItems();
    } else {
      fetchMenuItems();
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id || '',
      is_vegetarian: item.is_vegetarian,
      is_available: item.is_available,
      preparation_time: item.preparation_time.toString(),
      image_url: item.image_url || ''
    });
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', itemId);

    if (!error) {
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
      fetchMenuItems();
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', item.id);

    if (!error) {
      toast({
        title: "Success",
        description: `Item ${!item.is_available ? 'enabled' : 'disabled'}`,
      });
      fetchMenuItems();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      is_vegetarian: false,
      is_available: true,
      preparation_time: '15',
      image_url: ''
    });
    setEditingItem(null);
  };

  const MenuItemForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Chicken Biryani"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="price">Price (Rs.) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
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
          placeholder="Describe the item..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="prep-time">Preparation Time (minutes)</Label>
          <Input
            id="prep-time"
            type="number"
            value={formData.preparation_time}
            onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
            placeholder="15"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="vegetarian"
            checked={formData.is_vegetarian}
            onCheckedChange={(checked) => setFormData({ ...formData, is_vegetarian: checked })}
          />
          <Label htmlFor="vegetarian">Vegetarian</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="available"
            checked={formData.is_available}
            onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
          />
          <Label htmlFor="available">Available</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editingItem ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Menu Management
            </CardTitle>
            <CardDescription>
              Add, edit, and manage your canteen menu items
            </CardDescription>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>
                  Fill in the details for your new menu item
                </DialogDescription>
              </DialogHeader>
              <MenuItemForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : menuItems.length > 0 ? (
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {item.image_url && (
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.is_vegetarian && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Veg
                        </Badge>
                      )}
                      <Badge 
                        variant={item.is_available ? "default" : "destructive"}
                        className={item.is_available ? "bg-green-500" : "bg-red-500"}
                      >
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Rs. {item.price} • {item.preparation_time} mins • 
                      {item.menu_categories?.name || 'No category'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAvailability(item)}
                  >
                    {item.is_available ? 'Disable' : 'Enable'}
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Menu Item</DialogTitle>
                        <DialogDescription>
                          Update the details for this menu item
                        </DialogDescription>
                      </DialogHeader>
                      <MenuItemForm />
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No menu items yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your menu by adding your first item
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};