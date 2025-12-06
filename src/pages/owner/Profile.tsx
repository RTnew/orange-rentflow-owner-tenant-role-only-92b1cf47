import { ArrowLeft, User, Mail, Phone, Building2, LogOut, Settings, MessageSquare, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const smsSchema = z.object({
  phoneNumber: z.string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9+\-\s()]*$/, "Invalid phone number format"),
  message: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(500, "Message must be less than 500 characters")
});

const Profile = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [selectedTenant, setSelectedTenant] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsMessage, setSmsMessage] = useState("Dear Tenant, your rent is due soon. Please make the payment by the due date. Thank you!");

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch properties count
  const { data: propertiesCount } = useQuery({
    queryKey: ["properties-count", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { count, error } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", user.id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Fetch assigned tenants with their properties
  const { data: assignedTenants, isLoading: tenantsLoading } = useQuery({
    queryKey: ["assigned-tenants", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // First get properties owned by this user
      const { data: properties, error: propError } = await supabase
        .from("properties")
        .select("id, name")
        .eq("owner_id", user.id);

      if (propError) throw propError;
      if (!properties || properties.length === 0) return [];

      const propertyIds = properties.map(p => p.id);

      // Get tenant assignments for these properties
      const { data: assignments, error: assignError } = await supabase
        .from("tenant_assignments")
        .select("tenant_id, property_id")
        .in("property_id", propertyIds);

      if (assignError) throw assignError;
      if (!assignments || assignments.length === 0) return [];

      // Get tenant profiles
      const tenantIds = assignments.map(a => a.tenant_id);
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .in("id", tenantIds);

      if (profileError) throw profileError;

      // Combine the data
      return assignments.map(assignment => {
        const profile = profiles?.find(p => p.id === assignment.tenant_id);
        const property = properties?.find(p => p.id === assignment.property_id);
        return {
          id: assignment.tenant_id,
          name: profile?.full_name || "Unknown",
          phone: profile?.phone || "",
          property: property?.name || "Unknown Property"
        };
      });
    },
    enabled: !!user?.id,
  });

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenant(tenantId);
    const tenant = assignedTenants?.find(t => t.id === tenantId);
    if (tenant) {
      setPhoneNumber(tenant.phone);
      toast.success(`Selected ${tenant.name}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  const handleSendSms = () => {
    try {
      // Validate inputs
      const validated = smsSchema.parse({
        phoneNumber: phoneNumber,
        message: smsMessage
      });

      // Clean phone number (remove spaces, dashes, parentheses)
      const cleanNumber = validated.phoneNumber.replace(/[\s\-()]/g, '');
      
      // Encode message for URL
      const encodedMessage = encodeURIComponent(validated.message);
      
      // Open SMS app with pre-filled data
      window.location.href = `sms:${cleanNumber}?body=${encodedMessage}`;
      
      toast.success("Opening SMS app...");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to send SMS");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-4">
          <div className="glass-card p-4 rounded-full">
            <User className="h-12 w-12" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Owner Profile</h1>
            <p className="text-white/80 text-sm mt-1">Manage your account</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        <div className="glass-card rounded-2xl p-6 shadow-medium space-y-4">
          <h3 className="font-semibold mb-3">Personal Information</h3>
          
          {profileLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="font-medium">{profile?.full_name || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email || user?.email || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{profile?.phone || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Properties</p>
                  <p className="font-medium">{propertiesCount} {propertiesCount === 1 ? "Property" : "Properties"}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-medium space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Send Rent Reminder</h3>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="tenant-select" className="text-sm font-medium mb-2 block">
                <Users className="h-4 w-4 inline mr-1" />
                Select Tenant
              </Label>
              <Select value={selectedTenant} onValueChange={handleTenantSelect}>
                <SelectTrigger id="tenant-select" className="glass-card bg-background/95 backdrop-blur z-50">
                  <SelectValue placeholder="Choose a tenant..." />
                </SelectTrigger>
                <SelectContent className="bg-background/98 backdrop-blur-xl border-border z-50">
                  {tenantsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    </div>
                  ) : assignedTenants && assignedTenants.length > 0 ? (
                    assignedTenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id} className="cursor-pointer">
                        <div className="flex flex-col">
                          <span className="font-medium">{tenant.name}</span>
                          <span className="text-xs text-muted-foreground">{tenant.property} • {tenant.phone}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-4 px-2 text-sm text-muted-foreground text-center">
                      No tenants assigned yet
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phone-number" className="text-sm font-medium mb-2 block">
                Phone Number
              </Label>
              <Input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 234 567 8900"
                className="glass-card"
                maxLength={15}
              />
            </div>

            <div>
              <Label htmlFor="sms-message" className="text-sm font-medium mb-2 block">
                Message
              </Label>
              <Textarea
                id="sms-message"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Type your reminder message..."
                className="glass-card min-h-[120px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {smsMessage.length}/500 characters
              </p>
            </div>
          </div>

          <Button
            onClick={handleSendSms}
            className="w-full py-5 rounded-xl shadow-medium"
          >
            <Send className="mr-2 h-5 w-5" />
            Send SMS
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-4 shadow-medium">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <Settings className="h-5 w-5 text-primary" />
            <span className="font-medium">Account Settings</span>
          </button>
        </div>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full py-6 rounded-xl shadow-medium"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
