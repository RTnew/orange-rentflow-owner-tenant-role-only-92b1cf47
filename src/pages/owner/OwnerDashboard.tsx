import { Building2, DollarSign, AlertCircle, TrendingUp, Plus, Home, Users, FileText, UserPlus, BarChart3, User, Wallet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Properties",
      value: "12",
      icon: Building2,
      change: "+2 this month",
      color: "text-primary",
    },
    {
      title: "Rent Collected",
      value: "₹4,52,300",
      icon: DollarSign,
      change: "+12% from last month",
      color: "text-green-500",
    },
    {
      title: "Pending Payments",
      value: "₹84,000",
      icon: AlertCircle,
      change: "5 tenants",
      color: "text-orange-500",
    },
    {
      title: "This Month",
      value: "₹1,28,400",
      icon: TrendingUp,
      change: "+8% growth",
      color: "text-primary",
    },
  ];

  const recentProperties = [
    { name: "Sunset Apartments 304", rent: "₹12,000", status: "Paid", tenant: "John Smith" },
    { name: "Downtown Loft 12B", rent: "₹24,000", status: "Pending", tenant: "Sarah Johnson" },
    { name: "Garden View Villa", rent: "₹32,000", status: "Paid", tenant: "Mike Brown" },
  ];

  const bannerAds = [
    { id: 1, title: "FLAT FOR SALE", subtitle: "2 BHK", location: "in Koramangala", icon: "🏢", bg: "from-orange-400 to-orange-500" },
    { id: 2, title: "VILLA FOR RENT", subtitle: "3 BHK", location: "in Whitefield", icon: "🏡", bg: "from-blue-400 to-blue-500" },
    { id: 3, title: "OFFICE SPACE", subtitle: "1500 sqft", location: "in HSR Layout", icon: "🏢", bg: "from-purple-400 to-purple-500" },
    { id: 4, title: "PREMIUM FLAT", subtitle: "4 BHK", location: "in Indiranagar", icon: "🏠", bg: "from-green-400 to-green-500" },
  ];

  const handleBannerClick = (banner: typeof bannerAds[0]) => {
    toast.info(`Opening ${banner.title} details`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted pb-20">
      {/* Header */}
      <div className="gradient-primary p-6 text-white pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Owner</h1>
            <p className="text-white/90 text-base mt-2">Here's your property overview</p>
          </div>
          <Button
            size="icon"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full"
            onClick={() => navigate("/owner/add-property")}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Hero Carousel */}
        <Carousel className="mb-6">
          <CarouselContent>
            {bannerAds.map((banner) => (
              <CarouselItem key={banner.id}>
                <div 
                  className={`bg-gradient-to-br ${banner.bg} rounded-3xl p-6 shadow-glow cursor-pointer transition-transform hover:scale-[0.98] active:scale-95`}
                  onClick={() => handleBannerClick(banner)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-black mb-1">{banner.title}</h2>
                      <h3 className="text-3xl font-bold text-black">{banner.subtitle}</h3>
                      <p className="text-lg font-semibold text-black/80 mt-1">{banner.location}</p>
                    </div>
                    <div className="text-6xl">{banner.icon}</div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Service Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-700 rounded-2xl p-4 shadow-medium">
            <div className="space-y-3 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔧</span>
                <span className="font-semibold">Packers & Movers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">❄️</span>
                <span className="font-semibold">AC Service</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">💡</span>
                <span className="font-semibold">Plumber / Electrician</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-600 rounded-2xl p-4 shadow-medium flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-2">👤</div>
            <p className="text-white font-semibold text-sm">Top-rated agent near you</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-6">
        <div className="mb-6">
          <h3 className="font-bold mb-4 text-lg">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-4">
            <button 
              onClick={() => navigate("/owner/add-property")}
              className="flex flex-col items-center gap-2 p-4 rounded-full bg-card hover:bg-accent/10 transition-all shadow-medium"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">Add Property</span>
            </button>
            <button 
              onClick={() => navigate("/owner/list-property")}
              className="flex flex-col items-center gap-2 p-4 rounded-full bg-card hover:bg-accent/10 transition-all shadow-medium"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">List Property</span>
            </button>
            <button 
              onClick={() => navigate("/owner/add-tenant")}
              className="flex flex-col items-center gap-2 p-4 rounded-full bg-card hover:bg-accent/10 transition-all shadow-medium"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">Add Tenant</span>
            </button>
            <button 
              onClick={() => navigate("/owner/reports")}
              className="flex flex-col items-center gap-2 p-4 rounded-full bg-card hover:bg-accent/10 transition-all shadow-medium"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">Reports</span>
            </button>
          </div>
        </div>

        {/* Recent Properties */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Properties</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80"
              onClick={() => navigate("/owner/properties")}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentProperties.map((property, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 hover:shadow-medium transition-all shadow-soft border border-border"
                onClick={() => navigate(`/owner/property/${index + 1}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">{property.name}</h3>
                    <p className="text-sm text-muted-foreground">{property.tenant}</p>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      property.status === "Paid"
                        ? "bg-green-400 text-green-900"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {property.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-border p-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button 
            onClick={() => navigate("/owner/dashboard")}
            className="flex flex-col items-center gap-1 text-primary"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-bold">Home</span>
          </button>
          <button 
            onClick={() => navigate("/owner/properties")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Building2 className="h-6 w-6" />
            <span className="text-xs">Properties</span>
          </button>
          <button 
            onClick={() => navigate("/owner/tenants")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Users className="h-6 w-6" />
            <span className="text-xs">Tenants</span>
          </button>
          <button 
            onClick={() => navigate("/owner/finance")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Wallet className="h-6 w-6" />
            <span className="text-xs">Finance</span>
          </button>
          <button 
            onClick={() => navigate("/owner/profile")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
