import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/ui/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Users, 
  Building, 
  Package, 
  DollarSign, 
  TrendingUp,
  UserCheck,
  ChefHat,
  ShoppingCart
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalCanteens: number;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  pendingApprovals: number;
}

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const { orders, loading } = useOrders();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCanteens: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    pendingApprovals: 0
  });
  const [canteens, setCanteens] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminStats();
    fetchCanteens();
    fetchUsers();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch canteen count
      const { count: canteenCount } = await supabase
        .from('canteens')
        .select('*', { count: 'exact', head: true });

      // Fetch pending canteens
      const { count: pendingCanteens } = await supabase
        .from('canteens')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);

      // Calculate revenue
      const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total_amount, 0);

      // Today's orders
      const todayOrders = orders.filter(order => 
        new Date(order.created_at).toDateString() === new Date().toDateString()
      ).length;

      setStats({
        totalUsers: userCount || 0,
        totalCanteens: canteenCount || 0,
        totalOrders: orders.length,
        totalRevenue,
        todayOrders,
        pendingApprovals: pendingCanteens || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const fetchCanteens = async () => {
    const { data, error } = await supabase
      .from('canteens')
      .select(`
        *,
        profiles:staff_user_id(full_name)
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setCanteens(data);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setUsers(data);
    }
  };

  const approveCanteen = async (canteenId: string) => {
    const { error } = await supabase
      .from('canteens')
      .update({ is_approved: true })
      .eq('id', canteenId);

    if (!error) {
      fetchCanteens();
      fetchAdminStats();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'canteen_staff': return 'bg-blue-500';
      case 'customer': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            System overview and management controls.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canteens</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCanteens}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.pendingApprovals}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="canteens" className="space-y-6">
          <TabsList>
            <TabsTrigger value="canteens">Canteens</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="canteens">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Canteen Management
                </CardTitle>
                <CardDescription>
                  Manage canteen approvals and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {canteens.map((canteen) => (
                    <div key={canteen.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{canteen.name}</h3>
                        <p className="text-sm text-muted-foreground">{canteen.location}</p>
                        <p className="text-sm text-muted-foreground">
                          Staff: {canteen.profiles?.full_name || 'No staff assigned'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={canteen.is_approved ? "default" : "destructive"}
                          className={canteen.is_approved ? "bg-green-500" : "bg-orange-500"}
                        >
                          {canteen.is_approved ? 'Approved' : 'Pending'}
                        </Badge>
                        {!canteen.is_approved && (
                          <Button 
                            size="sm" 
                            onClick={() => approveCanteen(canteen.id)}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Recent user registrations and role overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{user.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{user.phone || 'No phone'}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-white ${getRoleColor(user.role)}`}
                      >
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription>
                  System-wide order overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : orders.slice(0, 10).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">Order #{order.order_number}</h3>
                      <p className="text-sm text-muted-foreground">{order.canteen.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Rs. {order.total_amount}</p>
                      <Badge variant="secondary" className="text-white bg-blue-500">
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;