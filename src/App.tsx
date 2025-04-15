
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import StoreList from "./pages/stores/StoreList";
import StoreDetails from "./pages/stores/StoreDetails";
import ProductList from "./pages/products/ProductList";
import ProductDetails from "./pages/products/ProductDetails";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/cart/Checkout";
import OrderSuccess from "./pages/cart/OrderSuccess";
import VendorOnboarding from "./pages/vendor/VendorOnboarding";
import StoreCreation from "./pages/vendor/StoreCreation";
import ProductCreate from "./pages/vendor/ProductCreate";
import ProductEdit from "./pages/vendor/ProductEdit";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerCodeGenerator from "./pages/owner/OwnerCodeGenerator";
import VendorApprovals from "./pages/owner/VendorApprovals";
import CommissionReports from "./pages/owner/CommissionReports";
import UserProfile from "./pages/user/UserProfile";
import OrderHistory from "./pages/user/OrderHistory";
import OrderDetails from "./pages/user/OrderDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/stores" element={<StoreList />} />
              <Route path="/stores/:id" element={<StoreDetails />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* Authenticated user routes */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Vendor routes */}
              <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
              <Route path="/vendor/store/create" element={<StoreCreation />} />
              <Route path="/vendor/products/create" element={<ProductCreate />} />
              <Route path="/vendor/products/edit/:id" element={<ProductEdit />} />
              
              {/* Owner routes */}
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/code-generator" element={<OwnerCodeGenerator />} />
              <Route path="/owner/approvals" element={<VendorApprovals />} />
              <Route path="/owner/commissions" element={<CommissionReports />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
