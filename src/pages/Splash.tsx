import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Logo */}
        <div className="glass-card p-8 rounded-2xl shadow-glow mb-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary blur-xl opacity-50" />
            <Building2 className="w-20 h-20 text-primary relative z-10" />
          </div>
        </div>

        {/* App name */}
        <h1 className="text-5xl font-bold text-foreground mb-3 text-center animate-fade-in">
          Rent<span className="text-primary">Track</span>
        </h1>
        <p className="text-muted-foreground text-center mb-12 text-lg animate-fade-in delay-200">
          Smart rent management made simple
        </p>

        {/* Features */}
        <div className="space-y-4 mb-12 w-full animate-fade-in delay-300">
          {[
            "Track rent payments effortlessly",
            "Manage multiple properties",
            "Real-time notifications",
          ].map((feature, index) => (
            <div
              key={index}
              className="glass-card p-4 rounded-xl flex items-center gap-3 transform hover:scale-105 transition-transform"
            >
              <div className="w-2 h-2 rounded-full bg-primary shadow-glow" />
              <span className="text-foreground/90">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          className="w-full gradient-primary text-white font-semibold text-lg py-6 rounded-xl shadow-glow hover:shadow-medium transition-all hover:scale-105 group animate-fade-in delay-500"
          onClick={() => navigate("/auth")}
        >
          Get Started
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-muted-foreground text-sm animate-fade-in delay-700">
        v1.0 • Secure & Reliable
      </div>
    </div>
  );
};

export default Splash;
