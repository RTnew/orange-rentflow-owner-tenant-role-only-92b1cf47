import { CreditCard, FileText, Home, User, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BannerPreviewDialog from "@/components/BannerPreviewDialog";
import ServicePreviewDialog from "@/components/ServicePreviewDialog";

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bannerApi, setBannerApi] = useState<CarouselApi>();
  const [serviceApi, setServiceApi] = useState<CarouselApi>();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentService, setCurrentService] = useState(0);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);

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
    queryKey: ["tenant-profile", user?.id],
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

  // Fetch listed properties for browsing
  const { data: listedProperties } = useQuery({
    queryKey: ["listed-properties"],
    queryFn: async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "listed")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  // Fetch banners for tenant role
  const { data: banners } = useQuery({
    queryKey: ["tenant-banners"],
    queryFn: async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .contains("roles", ["tenant"])
        .order("order_index", { ascending: true });
      return data || [];
    },
  });

  // Fetch services for tenant role
  const { data: services } = useQuery({
    queryKey: ["tenant-services"],
    queryFn: async () => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .contains("roles", ["tenant"])
        .order("order_index", { ascending: true });
      return data || [];
    },
  });

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

  const handlePropertyClick = (property: any) => {
    toast.info(`Viewing ${property.name}`);
    navigate("/tenant/browse-properties");
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
            <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || "Tenant"}</h1>
            <p className="text-white/90 text-base mt-2">Here's your rent dashboard</p>
          </div>
        </div>

        {/* Banners Carousel */}
        {banners && banners.length > 0 ? (
          <>
            <Carousel className="mb-2" setApi={setBannerApi}>
              <CarouselContent>
                {banners.map((banner, index) => (
                  <CarouselItem key={banner.id}>
                    <div 
                      className={`bg-gradient-to-br ${bannerColors[index % bannerColors.length]} rounded-3xl p-6 shadow-glow cursor-pointer transition-transform hover:scale-[0.98] active:scale-95`}
                      onClick={() => {
                        setSelectedBanner(banner);
                        setBannerDialogOpen(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-white mb-1">{banner.title}</h2>
                          <h3 className="text-xl font-bold text-white">{banner.subtitle}</h3>
                          {banner.location && (
                            <p className="text-lg font-semibold text-white/90 mt-1">📍 {banner.location}</p>
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
        ) : listedProperties && listedProperties.length > 0 ? (
          <>
            <Carousel className="mb-2" setApi={setBannerApi}>
              <CarouselContent>
                {listedProperties.map((property, index) => (
                  <CarouselItem key={property.id}>
                    <div 
                      className={`bg-gradient-to-br ${bannerColors[index % bannerColors.length]} rounded-3xl p-6 shadow-glow cursor-pointer transition-transform hover:scale-[0.98] active:scale-95`}
                      onClick={() => handlePropertyClick(property)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="inline-block px-3 py-1 bg-black/20 rounded-full text-sm font-semibold text-white mb-2">
                            {property.property_type || "Property"}
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-1">{property.name}</h2>
                          <h3 className="text-3xl font-bold text-white">
                            ₹{(property.rent_amount || 0).toLocaleString("en-IN")}/month
                          </h3>
                          <p className="text-lg font-semibold text-white/90 mt-1">
                            📍 {property.city}{property.state ? `, ${property.state}` : ""}
                          </p>
                        </div>
                        <div className="text-6xl">🏢</div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Property Pagination Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {listedProperties.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToBanner(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentBanner === index ? "w-8 bg-white" : "w-2 bg-white/40"
                  }`}
                  aria-label={`Go to property ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white/10 rounded-3xl p-6 text-center mb-6">
            <p className="text-white/80">No properties available</p>
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
                          onClick={() => {
                            setSelectedService(card);
                            setServiceDialogOpen(true);
                          }}
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
              onClick={() => navigate("/tenant/browse-properties")}
              className="flex flex-col items-center gap-2 p-4 rounded-full bg-card hover:bg-accent/10 transition-all shadow-medium"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">Browse</span>
            </button>
            <button 
              onClick={() => navigate("/tenant/agreement")}
              className="flex flex-col items-center gap-2 p-4 rounded-full bg-card hover:bg-accent/10 transition-all shadow-medium"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">Agreement</span>
            </button>
            <button 
              onClick={() => navigate("/tenant/schedule")}
              className="flex flex-col items-center gap-2 p-4 rounded-full bg-card hover:bg-accent/10 transition-all shadow-medium"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">Schedule</span>
            </button>
            <button 
              onClick={() => navigate("/tenant/receipts")}
              className="flex flex-col items-center gap-2 p-4 rounded-full bg-card hover:bg-accent/10 transition-all shadow-medium"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">Receipts</span>
            </button>
          </div>
        </div>

        {/* Available Properties */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Available Properties</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80"
              onClick={() => navigate("/tenant/browse-properties")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {listedProperties && listedProperties.length > 0 ? (
              listedProperties.slice(0, 3).map((property) => (
                <div
                  key={property.id}
                  className="bg-card rounded-2xl p-4 hover:shadow-medium transition-all shadow-soft border border-border cursor-pointer"
                  onClick={() => navigate("/tenant/browse-properties")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-base mb-1">{property.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {property.city}{property.state ? `, ${property.state}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg mb-1">
                        ₹{(property.rent_amount || 0).toLocaleString("en-IN")}
                      </p>
                      <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-400 text-green-900 text-xs font-semibold">
                        Available
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card rounded-2xl p-6 text-center border border-border">
                <p className="text-muted-foreground">No properties available right now</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-border p-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button 
            onClick={() => navigate("/tenant/dashboard")}
            className="flex flex-col items-center gap-1 text-primary"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-bold">Home</span>
          </button>
          <button 
            onClick={() => navigate("/tenant/payments")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <CreditCard className="h-6 w-6" />
            <span className="text-xs">Payments</span>
          </button>
          <button 
            onClick={() => navigate("/tenant/documents")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <FileText className="h-6 w-6" />
            <span className="text-xs">Documents</span>
          </button>
          <button 
            onClick={() => navigate("/tenant/profile")}
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

      {/* Service Preview Dialog */}
      <ServicePreviewDialog
        service={selectedService}
        open={serviceDialogOpen}
        onOpenChange={setServiceDialogOpen}
      />
    </div>
  );
};

export default TenantDashboard;