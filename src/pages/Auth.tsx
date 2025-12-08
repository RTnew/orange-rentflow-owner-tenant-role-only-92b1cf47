import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import logo from "@/assets/logo.png";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, userRole, signIn } = useAuth();

  const [selectedRole, setSelectedRole] = useState<"owner" | "tenant" | null>(null);
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Redirect based on role
  useEffect(() => {
    if (user && userRole) {
      switch (userRole) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "owner":
          navigate("/owner/dashboard", { replace: true });
          break;
        case "tenant":
          navigate("/tenant/dashboard", { replace: true });
          break;
      }
    }
  }, [user, userRole, navigate]);

  // LOGIN
  const handleLogin = async () => {
    if (!selectedRole) {
      toast.error("Please select your role first");
      return;
    }

    try {
      setLoading(true);

      const validated = loginSchema.parse({
        email: loginEmail,
        password: loginPassword,
      });

      const { error } = await signIn(validated.email, validated.password);

      if (error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Welcome back!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP (100% FIXED VERSION)
  const handleSignup = async () => {
    if (!selectedRole) {
      toast.error("Please select your role first");
      return;
    }

    try {
      setLoading(true);

      const validated = signupSchema.parse({
        fullName: signupName,
        phone: signupPhone,
        email: signupEmail,
        password: signupPassword,
      });

      // 1️⃣ Create auth user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
      });

      if (signUpError) {
        toast.error(signUpError.message || "Failed to create account");
        return;
      }

      const userId = signUpData.user?.id;
      if (!userId) {
        toast.error("Signup failed (no user ID)");
        return;
      }

      // 2️⃣ Insert profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: validated.fullName,
        phone: validated.phone,
        email: validated.email,
      });

      if (profileError) {
        toast.error("Failed to save profile");
        return;
      }

      // 3️⃣ Insert role (THIS FIXES THE TENANT ISSUE)
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: selectedRole,
      });

      if (roleError) {
        toast.error("Failed to assign role");
        return;
      }

      toast.success("Account created successfully! Please log in.");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="w-24 h-24 mx-auto" />
          <h1 className="text-3xl font-bold">
            Rent<span className="text-primary">Track</span>
          </h1>
        </div>

        {!selectedRole && (
          <div className="glass-card rounded-2xl p-6 shadow-medium mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Choose Your Role</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole("owner")}
                className="glass-card p-6 rounded-xl hover:scale-105 transition-all"
              >
                <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Owner</p>
              </button>
              <button
                onClick={() => setSelectedRole("tenant")}
                className="glass-card p-6 rounded-xl hover:scale-105 transition-all"
              >
                <User className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Tenant</p>
              </button>
            </div>
          </div>
        )}

        {selectedRole && (
          <div className="glass-card rounded-2xl p-6 shadow-medium">
            <div className="mb-4 flex items-center justify-between">
              <span className="capitalize font-medium">{selectedRole}</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRole(null)}>
                Change
              </Button>
            </div>

            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* LOGIN */}
              <TabsContent value="login" className="space-y-4">
                <Label>Email</Label>
                <Input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />

                <Label>Password</Label>
                <Input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />

                <Button onClick={handleLogin} disabled={loading} className="w-full py-6">
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </TabsContent>

              {/* SIGNUP */}
              <TabsContent value="signup" className="space-y-4">
                <Label>Name</Label>
                <Input value={signupName} onChange={(e) => setSignupName(e.target.value)} />

                <Label>Phone</Label>
                <Input value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} />

                <Label>Email</Label>
                <Input value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />

                <Label>Password</Label>
                <Input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />

                <Button onClick={handleSignup} disabled={loading} className="w-full py-6">
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;