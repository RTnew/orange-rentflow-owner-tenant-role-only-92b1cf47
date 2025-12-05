import { ArrowLeft, UserPlus, Search, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  
  // Invite states
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteProperty, setInviteProperty] = useState("");

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
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("email", tenantEmail.toLowerCase())
        .maybeSingle();

      if (error) throw error;

      if (profile) {
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

  // Handle SMS invite
  const handleSendInvite = () => {
    if (!invitePhone) {
      toast.error("Please enter a phone number");
      return;
    }
    if (!inviteProperty) {
      toast.error("Please select a property to invite for");
      return;
    }

    const selectedProp = properties?.find(p => p.id === inviteProperty);
    const propertyName = selectedProp?.name || "a property";
    
    // Get the app URL for registration
    const appUrl = window.location.origin;
    const signupUrl = `${appUrl}/auth`;
    
    const message = `Hi! You've been invited to rent "${propertyName}". Please register as a tenant on RentTrack to proceed: ${signupUrl}`;
    
    // Format phone number (remove spaces, ensure it starts with country code if needed)
    const cleanPhone = invitePhone.replace(/\s/g, "");
    
    // Create SMS link (works on mobile devices)
    const smsLink = `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
    
    // Open native SMS app
    window.location.href = smsLink;
    
    toast.success("Opening SMS app...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-6">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/tenants")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Add New Tenant</h1>
        <p className="text-white/80 text-sm mt-1">Assign or invite a tenant to your property</p>
      </div>

      <div className="px-6 mt-6">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find Existing
            </TabsTrigger>
            <TabsTrigger value="invite" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Invite New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
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
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <p className="font-medium text-green-800 dark:text-green-300">{foundTenant.full_name || "Tenant"}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{foundTenant.email}</p>
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
          </TabsContent>

          <TabsContent value="invite">
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-6 shadow-medium space-y-4">
                <div className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Invite via SMS</h3>
                  <p className="text-sm text-muted-foreground">
                    Send an invitation to someone who hasn't registered yet
                  </p>
                </div>

                <div>
                  <Label htmlFor="invitePhone">Phone Number</Label>
                  <Input
                    id="invitePhone"
                    type="tel"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include country code for best results
                  </p>
                </div>

                <div>
                  <Label htmlFor="inviteProperty">Property to Invite For</Label>
                  <Select value={inviteProperty} onValueChange={setInviteProperty}>
                    <SelectTrigger className="mt-1">
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
                onClick={handleSendInvite}
                className="w-full py-6 rounded-xl shadow-medium"
                disabled={!invitePhone || !inviteProperty}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Send SMS Invitation
              </Button>

              <p className="text-xs text-center text-muted-foreground px-4">
                This will open your phone's SMS app with a pre-filled invitation message containing a registration link.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AddTenant;