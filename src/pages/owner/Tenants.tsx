import { User, Plus, ArrowLeft, Phone, Mail, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const Tenants = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: tenantAssignments, isLoading } = useQuery({
    queryKey: ["owner-tenants", user?.id],
    queryFn: async () => {
      // First get owner's properties
      const { data: properties, error: propError } = await supabase
        .from("properties")
        .select("id, name")
        .eq("owner_id", user?.id);

      if (propError) throw propError;
      if (!properties || properties.length === 0) return [];

      const propertyIds = properties.map((p) => p.id);

      // Get tenant assignments for those properties
      const { data: assignments, error: assignError } = await supabase
        .from("tenant_assignments")
        .select("*")
        .in("property_id", propertyIds);

      if (assignError) throw assignError;
      if (!assignments || assignments.length === 0) return [];

      // Get tenant profiles
      const tenantIds = assignments.map((a) => a.tenant_id);
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone")
        .in("id", tenantIds);

      if (profileError) throw profileError;

      // Combine data
      return assignments.map((assignment) => {
        const property = properties.find((p) => p.id === assignment.property_id);
        const profile = profiles?.find((p) => p.id === assignment.tenant_id);
        return {
          ...assignment,
          property_name: property?.name || "Unknown Property",
          tenant_name: profile?.full_name || "Unknown Tenant",
          tenant_email: profile?.email,
          tenant_phone: profile?.phone,
        };
      });
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Tenants</h1>
            <p className="text-white/80 text-sm mt-1">
              {tenantAssignments?.length || 0} active tenants
            </p>
          </div>
          <Button
            onClick={() => navigate("/owner/add-tenant")}
            className="bg-white text-primary hover:bg-white/90 rounded-full"
            size="icon"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : tenantAssignments && tenantAssignments.length > 0 ? (
          tenantAssignments.map((tenant) => (
            <div
              key={tenant.id}
              className="glass-card rounded-2xl p-4 shadow-medium hover:shadow-glow transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="glass-card p-3 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{tenant.tenant_name}</h3>
                    <div
                      className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${
                        tenant.rent_status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {tenant.rent_status === "paid" ? "Paid" : "Pending"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Home className="h-3 w-3" />
                    {tenant.property_name}
                  </div>
                  <div className="space-y-1">
                    {tenant.tenant_phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {tenant.tenant_phone}
                      </div>
                    )}
                    {tenant.tenant_email && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {tenant.tenant_email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tenants Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add tenants to your properties to manage them here
            </p>
            <Button onClick={() => navigate("/owner/add-tenant")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tenants;