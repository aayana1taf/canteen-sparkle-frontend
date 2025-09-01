import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/ui/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders, OrderStatus } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { MenuManagement } from '@/components/ui/menu-management';
import { ChefHat, Clock, DollarSign, Package, TrendingUp, Users, Settings, Store, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const GCRDashboard = () => {
  const { user, profile } = useAuth();
  const { orders, loading, updateOrderStatus } = useOrders();
  const [canteen, setCanteen] = useState<any>(null);

  useEffect(() => {
    const fetchCanteen = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('canteens')
        .select('*')
        .eq('staff_user_id', user.id)
        .single();
      
      if (data) {
        setCanteen(data);
      }
    };
    
    fetchCanteen();
  }, [user]);

  const totalOrders = orders.length;
  const todayOrders = orders.filter(order => 
    new Date(order.created_at).toDateString() === new Date().toDateString()
  );
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total_amount, 0);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await updateOrderStatus(orderId, newStatus);
    if (!error) {
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus.replace('_', ' ')}`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready_for_pickup': return 'bg-green-500';
      case 'completed': return 'bg-slate-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const statusFlow: Record<string, string[]> = {
      'pending': ['preparing', 'cancelled'],
      'preparing': ['ready_for_pickup', 'cancelled'],
      'ready_for_pickup': ['completed'],
      'completed': [],
      'cancelled': []
    };
    return statusFlow[currentStatus] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* GCR Branded Header */}
        <div className="mb-8 p-6 bg-gradient-to-r from-primary to-accent rounded-2xl text-white shadow-red">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">GCR Canteen Dashboard</h1>
              <p className="text-red-100">
                Graduate Commons Room - Premium Dining Experience
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
                <Package className="h-6 w-6 text-red-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Today's Orders</p>
                  <p className="text-2xl font-bold">{todayOrders.length}</p>
                </div>
                <Clock className="h-6 w-6 text-red-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Revenue</p>
                  <p className="text-2xl font-bold">Rs. {totalRevenue.toFixed(0)}</p>
                </div>
                <DollarSign className="h-6 w-6 text-red-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Pending</p>
                  <p className="text-2xl font-bold">{pendingOrders.length}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-red-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-white shadow-card">
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-white">Orders</TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:bg-primary data-[state=active]:text-white">Menu</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="shadow-red border-red-100">
              <CardHeader className="bg-gradient-to-r from-red-50 to-white">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <ChefHat className="h-5 w-5" />
                  GCR Order Management
                </CardTitle>
                <CardDescription>
                  Manage incoming orders for Graduate Commons Room
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-red-50 rounded animate-pulse" />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6 border border-red-100 rounded-xl bg-gradient-to-r from-white to-red-50 shadow-card">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg text-primary">Order #{order.order_number}</h3>
                            <Badge className={`text-white ${getStatusColor(order.status)}`}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-lg font-semibold text-primary">
                              Rs. {order.total_amount}
                            </span>
                          </div>
                          <Select
                            value={order.status}
                            onValueChange={(value: OrderStatus) => handleStatusUpdate(order.id, value)}
                            disabled={getStatusOptions(order.status).length === 0}
                          >
                            <SelectTrigger className="w-48 border-red-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={order.status}>{order.status.replace('_', ' ')}</SelectItem>
                              {getStatusOptions(order.status).map(status => (
                                <SelectItem key={status} value={status}>
                                  {status.replace('_', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-4 border border-red-100">
                            <h4 className="font-semibold text-primary mb-2">Order Items:</h4>
                            <div className="space-y-2">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                  <span className="font-medium">{item.quantity}x {item.menu_item.name}</span>
                                  <span className="font-semibold text-primary">Rs. {(item.quantity * item.unit_price).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {order.notes && (
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                              <h4 className="font-semibold text-amber-800 mb-1">Special Notes:</h4>
                              <p className="text-amber-700">{order.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex justify-between text-sm text-muted-foreground pt-3 border-t border-red-100">
                            <span>Ordered: {new Date(order.created_at).toLocaleString()}</span>
                            {order.estimated_pickup_time && (
                              <span>Pickup: {new Date(order.estimated_pickup_time).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-16 w-16 text-red-300 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-primary">No orders yet</h3>
                    <p className="text-muted-foreground">Orders will appear here when customers place them.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <div className="bg-gradient-to-r from-red-50 to-white p-1 rounded-xl">
              <MenuManagement canteenId={canteen?.id} />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="shadow-red border-red-100">
              <CardHeader className="bg-gradient-to-r from-red-50 to-white">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Store className="h-5 w-5" />
                  GCR Canteen Settings
                </CardTitle>
                <CardDescription>
                  Manage Graduate Commons Room canteen preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-red-50 p-6 rounded-xl border border-red-100">
                    <h3 className="font-bold text-lg text-primary mb-4">Canteen Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-primary">Name:</span>
                        <p className="text-muted-foreground">{canteen?.name || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-primary">Location:</span>
                        <p className="text-muted-foreground">{canteen?.location || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-primary">Hours:</span>
                        <p className="text-muted-foreground">{canteen?.opening_hours || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl border border-green-100">
                    <h3 className="font-bold text-lg text-green-700 mb-4">Operational Status</h3>
                    <Badge 
                      className={canteen?.is_approved ? "bg-green-500 text-white" : "bg-amber-500 text-white"}
                    >
                      {canteen?.is_approved ? '✓ Approved & Active' : '⏳ Pending Approval'}
                    </Badge>
                    {!canteen?.is_approved && (
                      <p className="text-sm text-muted-foreground mt-3">
                        Your canteen is waiting for admin approval before it becomes visible to customers.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default GCRDashboard;