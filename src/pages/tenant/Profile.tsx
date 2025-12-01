import { ArrowLeft, User, Mail, Phone, Home, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

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

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/tenant/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-4">
          <div className="glass-card p-4 rounded-full">
            <User className="h-12 w-12" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tenant Profile</h1>
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
                <Home className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Property</p>
                  <p className="font-medium">Not assigned</p>
                </div>
              </div>
            </>
          )}
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
