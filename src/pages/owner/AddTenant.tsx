import { ArrowLeft, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AddTenant = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tenantEmail, setTenantEmail] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [foundTenant, setFoundTenant] = useState<{ id: string; full_name: string; email: string } | null>(null);
  const [searching, setSearching] = useState(false);

  // Fetch owner's properties
  const { data: properties } = useQuery({
    queryKey: ["owner-properties", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("id, name")
        .eq("owner_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Search for tenant by email
  const handleSearchTenant = async () => {
    if (!tenantEmail) {
      toast.error("Please enter an email address");
      return;
    }

    setSearching(true);
    setFoundTenant(null);

    try {
      // Search in profiles table
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("email", tenantEmail.toLowerCase())
        .maybeSingle();

      if (error) throw error;

      if (profile) {
        // Verify this user has tenant role
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", profile.id)
          .eq("role", "tenant")
          .maybeSingle();

        if (roleData) {
          setFoundTenant(profile);
          toast.success("Tenant found!");
        } else {
          toast.error("This user is not registered as a tenant");
        }
      } else {
        toast.error("No tenant found with this email. Make sure they have registered as a tenant.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error searching for tenant");
    } finally {
      setSearching(false);
    }
  };

  // Add tenant assignment
  const addTenantMutation = useMutation({
    mutationFn: async () => {
      if (!foundTenant || !selectedProperty) {
        throw new Error("Missing tenant or property");
      }

      // Check if assignment already exists
      const { data: existing } = await supabase
        .from("tenant_assignments")
        .select("id")
        .eq("property_id", selectedProperty)
        .eq("tenant_id", foundTenant.id)
        .maybeSingle();

      if (existing) {
        throw new Error("This tenant is already assigned to this property");
      }

      const { error } = await supabase.from("tenant_assignments").insert({
        property_id: selectedProperty,
        tenant_id: foundTenant.id,
        rent_status: "pending",
        move_in_date: new Date().toISOString().split("T")[0],
      });

      if (error) throw error;

      // Update property status to occupied
      await supabase
        .from("properties")
        .update({ status: "occupied" })
        .eq("id", selectedProperty);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-tenants"] });
      queryClient.invalidateQueries({ queryKey: ["owner-properties"] });
      toast.success("Tenant assigned successfully!");
      navigate("/owner/tenants");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign tenant");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundTenant) {
      toast.error("Please search and find a tenant first");
      return;
    }
    if (!selectedProperty) {
      toast.error("Please select a property");
      return;
    }
    addTenantMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-6">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/tenants")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Add New Tenant</h1>
        <p className="text-white/80 text-sm mt-1">Assign a tenant to your property</p>
      </div>

      <div className="px-6 mt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-card rounded-2xl p-6 shadow-medium space-y-4">
            <div>
              <Label htmlFor="email">Search Tenant by Email</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="email"
                  type="email"
                  value={tenantEmail}
                  onChange={(e) => setTenantEmail(e.target.value)}
                  placeholder="tenant@email.com"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSearchTenant}
                  disabled={searching}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                The tenant must have already registered with this email
              </p>
            </div>

            {foundTenant && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="font-medium text-green-800">{foundTenant.full_name || "Tenant"}</p>
                <p className="text-sm text-green-600">{foundTenant.email}</p>
              </div>
            )}

            <div>
              <Label htmlFor="property">Assign to Property</Label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties?.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-6 rounded-xl shadow-medium"
            disabled={!foundTenant || !selectedProperty || addTenantMutation.isPending}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            {addTenantMutation.isPending ? "Assigning..." : "Assign Tenant"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddTenant;