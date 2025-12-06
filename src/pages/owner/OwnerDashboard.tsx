import { Building2, DollarSign, AlertCircle, TrendingUp, Plus, Home, Users, FileText, UserPlus, BarChart3, User, Wallet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BannerPreviewDialog from "@/components/BannerPreviewDialog";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bannerApi, setBannerApi] = useState<CarouselApi>();
  const [serviceApi, setServiceApi] = useState<CarouselApi>();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentService, setCurrentService] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);

  useEffect(() => {
    if (!bannerApi) return;
    setCurrentBanner(bannerApi.selectedScrollSnap());
    bannerApi.on("select", () => {
      setCurrentBanner(bannerApi.selectedScrollSnap());
    });
  }, [bannerApi]);

  useEffect(() => {
    if (!serviceApi) return;
    setCurrentService(serviceApi.selectedScrollSnap());
    serviceApi.on("select", () => {
      setCurrentService(serviceApi.selectedScrollSnap());
    });
  }, [serviceApi]);

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ["owner-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch owner's properties
  const { data: properties } = useQuery({
    queryKey: ["owner-properties", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch banners for owner role
  const { data: banners } = useQuery({
    queryKey: ["owner-banners"],
    queryFn: async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .contains("roles", ["owner"])
        .order("order_index", { ascending: true });
      return data || [];
    },
  });

  // Fetch services for owner role
  const { data: services } = useQuery({
    queryKey: ["owner-services"],
    queryFn: async () => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .contains("roles", ["owner"])
        .order("order_index", { ascending: true });
      return data || [];
    },
  });

  const totalRent = properties?.reduce((sum, p) => sum + (p.rent_amount || 0), 0) || 0;
  const listedCount = properties?.filter(p => p.status === "listed").length || 0;
  const vacantCount = properties?.filter(p => p.status === "vacant").length || 0;

  const stats = [
    {
      title: "Total Properties",
      value: properties?.length?.toString() || "0",
      icon: Building2,
      change: `${listedCount} listed`,
      color: "text-primary",
    },
    {
      title: "Total Monthly Rent",
      value: `₹${totalRent.toLocaleString("en-IN")}`,
      icon: DollarSign,
      change: "all properties",
      color: "text-green-500",
    },
    {
      title: "Vacant Properties",
      value: vacantCount.toString(),
      icon: AlertCircle,
      change: "available",
      color: "text-orange-500",
    },
    {
      title: "Listed Properties",
      value: listedCount.toString(),
      icon: TrendingUp,
      change: "on marketplace",
      color: "text-primary",
    },
  ];

  const recentProperties = properties?.slice(0, 3) || [];

  // Group services into pages of 2
  const servicePages = [];
  const servicesList = services || [];
  for (let i = 0; i < servicesList.length; i += 2) {
    servicePages.push({
      id: i,
      cards: servicesList.slice(i, i + 2),
    });
  }

  const bannerColors = [
    "from-orange-400 to-orange-500",
    "from-blue-400 to-blue-500",
    "from-purple-400 to-purple-500",
    "from-green-400 to-green-500",
  ];

  const handleBannerClick = (banner: any) => {
    setSelectedBanner(banner);
    setBannerDialogOpen(true);
  };

  const scrollToBanner = (index: number) => {
    bannerApi?.scrollTo(index);
  };

  const scrollToService = (index: number) => {
    serviceApi?.scrollTo(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted pb-20">
      {/* Header */}
      <div className="gradient-primary p-6 text-white pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || "Owner"}</h1>
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
        {banners && banners.length > 0 ? (
          <>
            <Carousel className="mb-2" setApi={setBannerApi}>
              <CarouselContent>
                {banners.map((banner, index) => (
                  <CarouselItem key={banner.id}>
                    <div 
                      className={`bg-gradient-to-br ${bannerColors[index % bannerColors.length]} rounded-3xl p-6 shadow-glow cursor-pointer transition-transform hover:scale-[0.98] active:scale-95`}
                      onClick={() => handleBannerClick(banner)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-black mb-1">{banner.title}</h2>
                          <h3 className="text-xl font-bold text-black">{banner.subtitle}</h3>
                          {banner.location && (
                            <p className="text-lg font-semibold text-black/80 mt-1">📍 {banner.location}</p>
                          )}
                        </div>
                        {banner.image_url ? (
                          <img src={banner.image_url} alt={banner.title} className="w-16 h-16 rounded-xl object-cover" />
                        ) : (
                          <div className="text-6xl">🏢</div>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            
            {/* Banner Pagination Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToBanner(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentBanner === index ? "w-8 bg-white" : "w-2 bg-white/40"
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white/10 rounded-3xl p-6 text-center mb-6">
            <p className="text-white/80">No banners available</p>
          </div>
        )}

        {/* Service Cards Carousel */}
        {servicePages.length > 0 ? (
          <>
            <Carousel className="mb-2" setApi={setServiceApi}>
              <CarouselContent>
                {servicePages.map((page) => (
                  <CarouselItem key={page.id}>
                    <div className="grid grid-cols-2 gap-4">
                      {page.cards.map((card: any) => (
                        <div 
                          key={card.id}
                          className="bg-emerald-700 rounded-3xl p-6 shadow-medium flex flex-col items-center justify-center text-center cursor-pointer transition-transform hover:scale-[0.98] active:scale-95 h-32"
                          onClick={() => toast.info(`Opening ${card.title}`)}
                        >
                          {card.icon_url ? (
                            <img src={card.icon_url} alt={card.title} className="w-10 h-10 mb-2" />
                          ) : (
                            <div className="text-4xl mb-2">🔧</div>
                          )}
                          <p className="text-white font-semibold text-sm">{card.title}</p>
                        </div>
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Service Pagination Dots */}
            <div className="flex justify-center gap-2">
              {servicePages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToService(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentService === index ? "w-8 bg-white" : "w-2 bg-white/40"
                  }`}
                  aria-label={`Go to service page ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white/10 rounded-3xl p-6 text-center">
            <p className="text-white/80">No services available</p>
          </div>
        )}
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
            {recentProperties.length > 0 ? (
              recentProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-card rounded-2xl p-4 hover:shadow-medium transition-all shadow-soft border border-border"
                  onClick={() => navigate(`/owner/property/${property.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">{property.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {property.city}{property.state ? `, ${property.state}` : ""}
                      </p>
                      <p className="text-sm font-medium text-primary mt-1">
                        ₹{(property.rent_amount || 0).toLocaleString("en-IN")}/month
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                        property.status === "listed"
                          ? "bg-green-400 text-green-900"
                          : property.status === "occupied"
                          ? "bg-blue-400 text-blue-900"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {property.status || "vacant"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card rounded-2xl p-6 text-center border border-border">
                <p className="text-muted-foreground">No properties yet</p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate("/owner/add-property")}
                >
                  Add Your First Property
                </Button>
              </div>
            )}
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

      {/* Banner Preview Dialog */}
      <BannerPreviewDialog
        banner={selectedBanner}
        open={bannerDialogOpen}
        onOpenChange={setBannerDialogOpen}
      />
    </div>
  );
};

export default OwnerDashboard;