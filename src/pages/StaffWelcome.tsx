import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { CanteenRegistration } from '@/components/ui/canteen-registration';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Store, Clock, Users, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Navigate } from 'react-router-dom';

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

  // Redirect approved staff to their specific canteen dashboard
  if (canteen && canteen.is_approved) {
    const canteenName = canteen.name.toLowerCase();
    if (canteenName.includes('gcr')) {
      return <Navigate to="/dashboard/gcr" replace />;
    } else if (canteenName.includes('dms')) {
      return <Navigate to="/dashboard/dms" replace />;
    } else if (canteenName.includes('sfc')) {
      return <Navigate to="/dashboard/sfc" replace />;
    }
    return <Navigate to="/dashboard/staff" replace />;
  }

  if (!canteen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to NED Canteen Management</h1>
              <p className="text-muted-foreground text-xl">Get started by registering your canteen</p>
            </div>
            <Card className="shadow-red border-red-100">
              <CardHeader className="bg-gradient-to-r from-red-50 to-white">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Store className="h-5 w-5" />
                  Register Your Canteen
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <CanteenRegistration onCanteenCreated={fetchCanteen} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-primary">Canteen Registration Submitted</h1>
            <p className="text-muted-foreground text-lg">
              Your canteen "{canteen.name}" is waiting for admin approval.
            </p>
          </div>
          <Card className="shadow-red border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-50 to-white">
              <CardTitle className="flex items-center gap-2 justify-center text-amber-700">
                <AlertCircle className="h-6 w-6" />
                Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-3">
                <p className="font-bold text-xl text-primary">{canteen.name}</p>
                <Badge className="bg-amber-500 text-white font-semibold px-4 py-2">
                  ⏳ Waiting for Admin Approval
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StaffWelcome;