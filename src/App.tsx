import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AddProperty from "./pages/owner/AddProperty";
import Properties from "./pages/owner/Properties";
import AddTenant from "./pages/owner/AddTenant";
import Tenants from "./pages/owner/Tenants";
import Finance from "./pages/owner/Finance";
import Reports from "./pages/owner/Reports";
import OwnerProfile from "./pages/owner/Profile";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import Payments from "./pages/tenant/Payments";
import Agreement from "./pages/tenant/Agreement";
import Schedule from "./pages/tenant/Schedule";
import Receipts from "./pages/tenant/Receipts";
import Documents from "./pages/tenant/Documents";
import TenantProfile from "./pages/tenant/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/add-property" element={<AddProperty />} />
          <Route path="/owner/properties" element={<Properties />} />
          <Route path="/owner/add-tenant" element={<AddTenant />} />
          <Route path="/owner/tenants" element={<Tenants />} />
          <Route path="/owner/finance" element={<Finance />} />
          <Route path="/owner/reports" element={<Reports />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          <Route path="/tenant/payments" element={<Payments />} />
          <Route path="/tenant/agreement" element={<Agreement />} />
          <Route path="/tenant/schedule" element={<Schedule />} />
          <Route path="/tenant/receipts" element={<Receipts />} />
          <Route path="/tenant/documents" element={<Documents />} />
          <Route path="/tenant/profile" element={<TenantProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
