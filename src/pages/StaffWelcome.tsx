import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { CanteenRegistration } from '@/components/ui/canteen-registration';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Store, Clock, Users, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StaffWelcome = () => {
  const { user } = useAuth();
  const [canteen, setCanteen] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCanteen();
  }, [user]);

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
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!canteen) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Welcome to NED Canteen Management</h1>
              <p className="text-muted-foreground text-lg">
                Get started by registering your canteen to serve our students
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Register Your Canteen
                  </CardTitle>
                  <CardDescription>
                    Set up your canteen profile and start taking orders from students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">✓ Create your canteen profile</p>
                    <p className="text-sm text-muted-foreground">✓ Add menu items and pricing</p>
                    <p className="text-sm text-muted-foreground">✓ Manage orders in real-time</p>
                    <p className="text-sm text-muted-foreground">✓ Track revenue and analytics</p>
                  </div>
                  <div className="pt-4">
                    <CanteenRegistration onCanteenCreated={fetchCanteen} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    How It Works
                  </CardTitle>
                  <CardDescription>
                    Simple steps to get your canteen up and running
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <p className="font-medium">Register your canteen</p>
                        <p className="text-sm text-muted-foreground">Provide basic information about your canteen</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <p className="font-medium">Wait for approval</p>
                        <p className="text-sm text-muted-foreground">Admin will review and approve your canteen</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <p className="font-medium">Set up your menu</p>
                        <p className="text-sm text-muted-foreground">Add food items, prices, and descriptions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <p className="font-medium">Start receiving orders</p>
                        <p className="text-sm text-muted-foreground">Students can now order from your canteen</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Features You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Menu Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Easily add, edit, and manage your menu items with photos and descriptions
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Real-time Orders</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive and manage orders instantly with real-time notifications
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Track your sales, popular items, and revenue with detailed analytics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Canteen Registration Submitted</h1>
            <p className="text-muted-foreground">
              Your canteen "{canteen.name}" has been registered and is waiting for admin approval.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <AlertCircle className="h-5 w-5" />
                Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">{canteen.name}</p>
                <p className="text-sm text-muted-foreground">{canteen.location}</p>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  Waiting for Admin Approval
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Your canteen information has been submitted to the administrators</p>
                <p>• You will be notified once your canteen is approved</p>
                <p>• After approval, you can start adding menu items and receiving orders</p>
                <p>• This process typically takes 1-2 business days</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StaffWelcome;