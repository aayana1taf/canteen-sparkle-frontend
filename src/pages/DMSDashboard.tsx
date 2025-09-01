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
import { ChefHat, Clock, DollarSign, Package, TrendingUp, Users, Settings, Store, Utensils } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DMSDashboard = () => {
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
      case 'pending': return 'bg-amber-600';
      case 'preparing': return 'bg-blue-600';
      case 'ready_for_pickup': return 'bg-green-600';
      case 'completed': return 'bg-slate-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-slate-600';
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* DMS Branded Header */}
        <div className="mb-8 p-6 bg-gradient-to-r from-rose-600 to-red-600 rounded-2xl text-white shadow-elevated">
          <div className="flex items-center gap-3 mb-4">
            <Utensils className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">DMS Canteen Dashboard</h1>
              <p className="text-rose-100">
                Dining & Meeting Space - Community Focused Dining
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
                <Package className="h-6 w-6 text-rose-200" />
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium">Today's Orders</p>
                  <p className="text-2xl font-bold">{todayOrders.length}</p>
                </div>
                <Clock className="h-6 w-6 text-rose-200" />
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium">Revenue</p>
                  <p className="text-2xl font-bold">Rs. {totalRevenue.toFixed(0)}</p>
                </div>
                <DollarSign className="h-6 w-6 text-rose-200" />
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{pendingOrders.length}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-rose-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-white shadow-card border border-rose-100">
            <TabsTrigger value="orders" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">Orders</TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">Menu</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="shadow-elevated border-rose-200">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-red-50">
                <CardTitle className="flex items-center gap-2 text-rose-700">
                  <ChefHat className="h-5 w-5" />
                  DMS Order Management
                </CardTitle>
                <CardDescription>
                  Manage incoming orders for Dining & Meeting Space
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-rose-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6 border-2 border-rose-200 rounded-2xl bg-gradient-to-r from-white to-rose-50 shadow-card hover:shadow-elevated transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <h3 className="font-bold text-xl text-rose-700">Order #{order.order_number}</h3>
                            <Badge className={`text-white font-semibold ${getStatusColor(order.status)}`}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-xl font-bold text-rose-600">
                              Rs. {order.total_amount}
                            </span>
                          </div>
                          <Select
                            value={order.status}
                            onValueChange={(value: OrderStatus) => handleStatusUpdate(order.id, value)}
                            disabled={getStatusOptions(order.status).length === 0}
                          >
                            <SelectTrigger className="w-48 border-rose-300 focus:border-rose-500">
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
                        
                        <div className="space-y-4">
                          <div className="bg-white rounded-xl p-5 border-2 border-rose-100 shadow-sm">
                            <h4 className="font-bold text-rose-700 mb-3 flex items-center gap-2">
                              <Utensils className="h-4 w-4" />
                              Order Items:
                            </h4>
                            <div className="space-y-2">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-2 bg-rose-50 rounded-lg">
                                  <span className="font-semibold text-gray-800">{item.quantity}x {item.menu_item.name}</span>
                                  <span className="font-bold text-rose-600">Rs. {(item.quantity * item.unit_price).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {order.notes && (
                            <div className="bg-amber-100 rounded-xl p-4 border-2 border-amber-200">
                              <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Special Instructions:
                              </h4>
                              <p className="text-amber-800 font-medium">{order.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex justify-between text-sm text-gray-600 pt-3 border-t-2 border-rose-100">
                            <span className="font-medium">Ordered: {new Date(order.created_at).toLocaleString()}</span>
                            {order.estimated_pickup_time && (
                              <span className="font-medium">Pickup: {new Date(order.estimated_pickup_time).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Package className="mx-auto h-20 w-20 text-rose-300 mb-6" />
                    <h3 className="text-2xl font-bold mb-3 text-rose-700">No orders yet</h3>
                    <p className="text-gray-600 text-lg">Orders will appear here when customers place them.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <div className="bg-gradient-to-r from-rose-50 to-red-50 p-2 rounded-2xl border-2 border-rose-200">
              <MenuManagement canteenId={canteen?.id} />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="shadow-elevated border-rose-200">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-red-50">
                <CardTitle className="flex items-center gap-2 text-rose-700">
                  <Store className="h-5 w-5" />
                  DMS Canteen Settings
                </CardTitle>
                <CardDescription>
                  Manage Dining & Meeting Space canteen preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-rose-50 p-6 rounded-2xl border-2 border-rose-100 shadow-sm">
                    <h3 className="font-bold text-xl text-rose-700 mb-4">Canteen Information</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="font-bold text-rose-600">Name:</span>
                        <p className="text-gray-700 font-medium">{canteen?.name || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="font-bold text-rose-600">Location:</span>
                        <p className="text-gray-700 font-medium">{canteen?.location || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="font-bold text-rose-600">Hours:</span>
                        <p className="text-gray-700 font-medium">{canteen?.opening_hours || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl border-2 border-green-200 shadow-sm">
                    <h3 className="font-bold text-xl text-green-700 mb-4">Operational Status</h3>
                    <Badge 
                      className={`text-lg px-4 py-2 ${canteen?.is_approved ? "bg-green-600 text-white" : "bg-amber-600 text-white"}`}
                    >
                      {canteen?.is_approved ? '✓ Approved & Active' : '⏳ Pending Approval'}
                    </Badge>
                    {!canteen?.is_approved && (
                      <p className="text-gray-600 mt-4 font-medium">
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

export default DMSDashboard;