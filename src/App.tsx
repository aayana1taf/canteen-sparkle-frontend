import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider, useCart } from "./contexts/CartContext";
import Index from "./pages/Index";
import CanteenPage from "./pages/CanteenPage";
import AuthPage from "./pages/AuthPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import CustomerDashboard from "./pages/CustomerDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StaffWelcome from "./pages/StaffWelcome";
import AdminDashboard from "./pages/AdminDashboard";
import CartPage from "./pages/CartPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle role-based redirection
const RoleBasedRedirect = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect based on user role
  switch (profile?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'canteen_staff':
      return <Navigate to="/staff" replace />;
    case 'customer':
    default:
      return <CustomerDashboard />;
  }
};

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// App component with cart context
const AppContent = () => {
  const { items, updateQuantity, clearCart, placeOrder } = useCart();

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="/browse" element={<Index />} />
      <Route path="/canteen/:canteenId" element={
        <ProtectedRoute>
          <CanteenPage />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route 
        path="/cart" 
        element={
          <CartPage 
            items={items}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
            onPlaceOrder={placeOrder}
          />
        } 
      />
      <Route path="/dashboard/customer" element={
        <ProtectedRoute>
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/staff" element={
        <ProtectedRoute>
          <StaffWelcome />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/staff" element={
        <ProtectedRoute>
          <StaffDashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/admin" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;