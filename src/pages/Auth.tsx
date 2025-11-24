import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"owner" | "tenant" | null>(null);

  const handleLogin = () => {
    if (!selectedRole) {
      toast.error("Please select your role first");
      return;
    }
    toast.success(`Welcome back!`);
    navigate(selectedRole === "owner" ? "/owner/dashboard" : "/tenant/dashboard");
  };

  const handleSignup = () => {
    if (!selectedRole) {
      toast.error("Please select your role first");
      return;
    }
    toast.success("Account created successfully!");
    navigate(selectedRole === "owner" ? "/owner/dashboard" : "/tenant/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center glass-card p-4 rounded-2xl shadow-glow mb-4">
            <Building2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">
            Rent<span className="text-primary">Track</span>
          </h1>
        </div>

        {/* Role Selection */}
        {!selectedRole && (
          <div className="glass-card rounded-2xl p-6 shadow-medium mb-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-center">Choose Your Role</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole("owner")}
                className="glass-card p-6 rounded-xl hover:shadow-glow transition-all hover:scale-105 border-2 border-transparent hover:border-primary"
              >
                <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Owner</p>
                <p className="text-xs text-muted-foreground mt-1">Manage properties</p>
              </button>
              <button
                onClick={() => setSelectedRole("tenant")}
                className="glass-card p-6 rounded-xl hover:shadow-glow transition-all hover:scale-105 border-2 border-transparent hover:border-primary"
              >
                <User className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Tenant</p>
                <p className="text-xs text-muted-foreground mt-1">Pay rent easily</p>
              </button>
            </div>
          </div>
        )}

        {/* Auth Forms */}
        {selectedRole && (
          <div className="glass-card rounded-2xl p-6 shadow-medium animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedRole === "owner" ? (
                  <Building2 className="w-5 h-5 text-primary" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
                <span className="text-sm font-medium capitalize">{selectedRole}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRole(null)}
                className="text-xs"
              >
                Change
              </Button>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleLogin}
                  className="w-full gradient-primary text-white font-semibold py-6 rounded-xl shadow-glow hover:shadow-medium transition-all hover:scale-105 group"
                >
                  Login
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSignup}
                  className="w-full gradient-primary text-white font-semibold py-6 rounded-xl shadow-glow hover:shadow-medium transition-all hover:scale-105 group"
                >
                  Create Account
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
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
