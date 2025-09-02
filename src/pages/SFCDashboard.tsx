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
import { useRealTimeOrders } from '@/hooks/useRealTimeOrders';
import { MenuManagement } from '@/components/ui/menu-management';
import { ChefHat, Clock, DollarSign, Package, TrendingUp, Users, Settings, Store, Coffee } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SFCDashboard = () => {
  const { user, profile } = useAuth();
  const { orders, loading, updateOrderStatus, refetch } = useOrders();
  const [canteen, setCanteen] = useState<any>(null);

  // Add real-time updates
  useRealTimeOrders(() => {
    refetch();
  });

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
      case 'pending': return 'bg-orange-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready_for_pickup': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
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
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* SFC Branded Header */}
        <div className="mb-8 p-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl text-white shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <Coffee className="h-10 w-10" />
            <div>
              <h1 className="text-4xl font-bold">SFC Canteen Dashboard</h1>
              <p className="text-red-100 text-lg">
                Student Food Court - Vibrant Campus Dining Hub
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-semibold">Total Orders</p>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-red-200" />
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-semibold">Today's Orders</p>
                  <p className="text-3xl font-bold">{todayOrders.length}</p>
                </div>
                <Clock className="h-8 w-8 text-red-200" />
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-semibold">Revenue</p>
                  <p className="text-3xl font-bold">PKR {totalRevenue.toFixed(0)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-200" />
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-semibold">Pending</p>
                  <p className="text-3xl font-bold">{pendingOrders.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="orders" className="space-y-8">
          <TabsList className="bg-white shadow-elevated border-2 border-red-200 rounded-2xl p-2">
            <TabsTrigger value="orders" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold">Orders</TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold">Menu</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="shadow-2xl border-red-300 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-100 to-pink-100 p-8">
                <CardTitle className="flex items-center gap-3 text-red-700 text-2xl">
                  <ChefHat className="h-7 w-7" />
                  SFC Order Management
                </CardTitle>
                <CardDescription className="text-lg">
                  Manage incoming orders for Student Food Court
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-red-100 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="p-8 border-3 border-red-200 rounded-3xl bg-gradient-to-r from-white via-red-50 to-pink-50 shadow-elevated hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-5">
                            <h3 className="font-bold text-2xl text-red-700">Order #{order.order_number}</h3>
                            <Badge className={`text-white font-bold text-lg px-4 py-2 ${getStatusColor(order.status)}`}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-2xl font-bold text-red-600">
                              Rs. {order.total_amount}
                            </span>
                          </div>
                          <Select
                            value={order.status}
                            onValueChange={(value: OrderStatus) => handleStatusUpdate(order.id, value)}
                            disabled={getStatusOptions(order.status).length === 0}
                          >
                            <SelectTrigger className="w-52 border-red-300 focus:border-red-500 text-lg font-semibold rounded-xl">
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
                        
                        <div className="space-y-5">
                          <div className="bg-white rounded-2xl p-6 border-3 border-red-100 shadow-lg">
                            <h4 className="font-bold text-xl text-red-700 mb-4 flex items-center gap-3">
                              <Coffee className="h-5 w-5" />
                              Order Items:
                            </h4>
                            <div className="space-y-3">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-200">
                                  <span className="font-bold text-lg text-gray-800">{item.quantity}x {item.menu_item.name}</span>
                                  <span className="font-bold text-xl text-red-600">PKR {(item.quantity * item.unit_price).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {order.notes && (
                            <div className="bg-amber-100 rounded-2xl p-6 border-3 border-amber-300 shadow-lg">
                              <h4 className="font-bold text-xl text-amber-800 mb-3 flex items-center gap-3">
                                <Settings className="h-5 w-5" />
                                Special Instructions:
                              </h4>
                              <p className="text-amber-800 font-semibold text-lg">{order.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex justify-between text-lg text-gray-600 pt-4 border-t-3 border-red-200">
                            <span className="font-bold">Ordered: {new Date(order.created_at).toLocaleString()}</span>
                            {order.estimated_pickup_time && (
                              <span className="font-bold">Pickup: {new Date(order.estimated_pickup_time).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Package className="mx-auto h-24 w-24 text-red-300 mb-8" />
                    <h3 className="text-3xl font-bold mb-4 text-red-700">No orders yet</h3>
                    <p className="text-gray-600 text-xl">Orders will appear here when customers place them.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <div className="bg-gradient-to-r from-red-100 to-pink-100 p-3 rounded-3xl border-3 border-red-200 shadow-xl">
              <MenuManagement canteenId={canteen?.id} />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="shadow-2xl border-red-300 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-100 to-pink-100 p-8">
                <CardTitle className="flex items-center gap-3 text-red-700 text-2xl">
                  <Store className="h-7 w-7" />
                  SFC Canteen Settings
                </CardTitle>
                <CardDescription className="text-lg">
                  Manage Student Food Court canteen preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-white to-red-50 p-8 rounded-3xl border-3 border-red-200 shadow-lg">
                    <h3 className="font-bold text-2xl text-red-700 mb-6">Canteen Information</h3>
                    <div className="space-y-5">
                      <div>
                        <span className="font-bold text-xl text-red-600">Name:</span>
                        <p className="text-gray-700 font-semibold text-lg">{canteen?.name || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="font-bold text-xl text-red-600">Location:</span>
                        <p className="text-gray-700 font-semibold text-lg">{canteen?.location || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="font-bold text-xl text-red-600">Hours:</span>
                        <p className="text-gray-700 font-semibold text-lg">{canteen?.opening_hours || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl border-3 border-green-300 shadow-lg">
                    <h3 className="font-bold text-2xl text-green-700 mb-6">Operational Status</h3>
                    <Badge 
                      className={`text-xl px-6 py-3 font-bold ${canteen?.is_approved ? "bg-green-600 text-white" : "bg-amber-600 text-white"}`}
                    >
                      {canteen?.is_approved ? '✓ Approved & Active' : '⏳ Pending Approval'}
                    </Badge>
                    {!canteen?.is_approved && (
                      <p className="text-gray-600 mt-6 font-semibold text-lg">
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

export default SFCDashboard;