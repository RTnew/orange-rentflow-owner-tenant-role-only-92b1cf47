import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AddProperty from "./pages/owner/AddProperty";
import Properties from "./pages/owner/Properties";
import PropertyDetails from "./pages/owner/PropertyDetails";
import ListProperty from "./pages/owner/ListProperty";
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
import BrowseProperties from "./pages/tenant/BrowseProperties";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import BannersList from "./pages/admin/banners/BannersList";
import BannerForm from "./pages/admin/banners/BannerForm";
import ServicesList from "./pages/admin/services/ServicesList";
import ServiceForm from "./pages/admin/services/ServiceForm";
import PropertiesOverview from "./pages/admin/PropertiesOverview";
import UsersOverview from "./pages/admin/UsersOverview";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => {
  // Enable dark mode permanently
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Owner Routes - Protected */}
          <Route path="/owner/dashboard" element={<RoleProtectedRoute allowedRoles={["owner"]}><OwnerDashboard /></RoleProtectedRoute>} />
          <Route path="/owner/add-property" element={<RoleProtectedRoute allowedRoles={["owner"]}><AddProperty /></RoleProtectedRoute>} />
          <Route path="/owner/properties" element={<RoleProtectedRoute allowedRoles={["owner"]}><Properties /></RoleProtectedRoute>} />
          <Route path="/owner/property/:id" element={<RoleProtectedRoute allowedRoles={["owner"]}><PropertyDetails /></RoleProtectedRoute>} />
          <Route path="/owner/list-property" element={<RoleProtectedRoute allowedRoles={["owner"]}><ListProperty /></RoleProtectedRoute>} />
          <Route path="/owner/add-tenant" element={<RoleProtectedRoute allowedRoles={["owner"]}><AddTenant /></RoleProtectedRoute>} />
          <Route path="/owner/tenants" element={<RoleProtectedRoute allowedRoles={["owner"]}><Tenants /></RoleProtectedRoute>} />
          <Route path="/owner/finance" element={<RoleProtectedRoute allowedRoles={["owner"]}><Finance /></RoleProtectedRoute>} />
          <Route path="/owner/reports" element={<RoleProtectedRoute allowedRoles={["owner"]}><Reports /></RoleProtectedRoute>} />
          <Route path="/owner/profile" element={<RoleProtectedRoute allowedRoles={["owner"]}><OwnerProfile /></RoleProtectedRoute>} />
          
          {/* Tenant Routes - Protected */}
          <Route path="/tenant/dashboard" element={<RoleProtectedRoute allowedRoles={["tenant"]}><TenantDashboard /></RoleProtectedRoute>} />
          <Route path="/tenant/browse-properties" element={<RoleProtectedRoute allowedRoles={["tenant"]}><BrowseProperties /></RoleProtectedRoute>} />
          <Route path="/tenant/payments" element={<RoleProtectedRoute allowedRoles={["tenant"]}><Payments /></RoleProtectedRoute>} />
          <Route path="/tenant/agreement" element={<RoleProtectedRoute allowedRoles={["tenant"]}><Agreement /></RoleProtectedRoute>} />
          <Route path="/tenant/schedule" element={<RoleProtectedRoute allowedRoles={["tenant"]}><Schedule /></RoleProtectedRoute>} />
          <Route path="/tenant/receipts" element={<RoleProtectedRoute allowedRoles={["tenant"]}><Receipts /></RoleProtectedRoute>} />
          <Route path="/tenant/documents" element={<RoleProtectedRoute allowedRoles={["tenant"]}><Documents /></RoleProtectedRoute>} />
          <Route path="/tenant/profile" element={<RoleProtectedRoute allowedRoles={["tenant"]}><TenantProfile /></RoleProtectedRoute>} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<RoleProtectedRoute allowedRoles={["admin"]}><AdminLayout /></RoleProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="banners" element={<BannersList />} />
            <Route path="banners/add" element={<BannerForm />} />
            <Route path="banners/edit/:id" element={<BannerForm />} />
            <Route path="services" element={<ServicesList />} />
            <Route path="services/add" element={<ServiceForm />} />
            <Route path="services/edit/:id" element={<ServiceForm />} />
            <Route path="properties" element={<PropertiesOverview />} />
            <Route path="users" element={<UsersOverview />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
