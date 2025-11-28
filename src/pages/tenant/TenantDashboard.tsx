import { CreditCard, Clock, CheckCircle, FileText, Home, User, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect } from "react";

const TenantDashboard = () => {
  const navigate = useNavigate();
  const daysUntilDue = 5;
  const rentAmount = 1200;
  const paidThisYear = 12000;
  const [bannerApi, setBannerApi] = useState<CarouselApi>();
  const [serviceApi, setServiceApi] = useState<CarouselApi>();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentService, setCurrentService] = useState(0);

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

  const paymentHistory = [
    { month: "December 2024", amount: "₹1,200", status: "Paid", date: "Dec 1, 2024" },
    { month: "November 2024", amount: "₹1,200", status: "Paid", date: "Nov 1, 2024" },
    { month: "October 2024", amount: "₹1,200", status: "Paid", date: "Oct 1, 2024" },
  ];

  const propertyBanners = [
    { id: 1, title: "Sunset Apartments", rent: "₹1,200/month", location: "Downtown, Mumbai", type: "2BHK", bg: "from-orange-400 to-orange-500" },
    { id: 2, title: "Green Valley Villa", rent: "₹2,500/month", location: "Bandra West, Mumbai", type: "3BHK", bg: "from-blue-400 to-blue-500" },
    { id: 3, title: "Skyline Residency", rent: "₹1,800/month", location: "Andheri East, Mumbai", type: "2BHK", bg: "from-purple-400 to-purple-500" },
    { id: 4, title: "Ocean View Heights", rent: "₹3,000/month", location: "Juhu, Mumbai", type: "3BHK", bg: "from-green-400 to-green-500" },
  ];

  const servicePages = [
    {
      id: 1,
      cards: [
        { title: "Packers & Movers", icon: "🔧", bg: "bg-emerald-700" },
        { title: "Top-rated agent", icon: "👤", bg: "bg-slate-600" }
      ]
    },
    {
      id: 2,
      cards: [
        { title: "AC Service", icon: "❄️", bg: "bg-blue-700" },
        { title: "Plumber Service", icon: "💡", bg: "bg-purple-600" }
      ]
    },
    {
      id: 3,
      cards: [
        { title: "Electrician", icon: "⚡", bg: "bg-orange-600" },
        { title: "Cleaning Service", icon: "🧹", bg: "bg-teal-600" }
      ]
    }
  ];

  const handlePropertyClick = (property: typeof propertyBanners[0]) => {
    toast.info(`Viewing ${property.title}`);
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
            <h1 className="text-3xl font-bold">Welcome back, Tenant</h1>
            <p className="text-white/90 text-base mt-2">Here's your rent dashboard</p>
          </div>
        </div>

        {/* Property Carousel */}
        <Carousel className="mb-2" setApi={setBannerApi}>
          <CarouselContent>
            {propertyBanners.map((property) => (
              <CarouselItem key={property.id}>
                <div 
                  className={`bg-gradient-to-br ${property.bg} rounded-3xl p-6 shadow-glow cursor-pointer transition-transform hover:scale-[0.98] active:scale-95`}
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="inline-block px-3 py-1 bg-black/20 rounded-full text-sm font-semibold text-white mb-2">
                        {property.type}
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-1">{property.title}</h2>
                      <h3 className="text-3xl font-bold text-white">{property.rent}</h3>
                      <p className="text-lg font-semibold text-white/90 mt-1">📍 {property.location}</p>
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
          {propertyBanners.map((_, index) => (
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

        {/* Service Cards Carousel */}
        <Carousel className="mb-2" setApi={setServiceApi}>
          <CarouselContent>
            {servicePages.map((page) => (
              <CarouselItem key={page.id}>
                <div className="grid grid-cols-2 gap-4">
                  {page.cards.map((card, idx) => (
                    <div 
                      key={idx}
                      className={`${card.bg} rounded-3xl p-6 shadow-medium flex flex-col items-center justify-center text-center cursor-pointer transition-transform hover:scale-[0.98] active:scale-95 h-32`}
                      onClick={() => toast.info(`Opening ${card.title}`)}
                    >
                      <div className="text-4xl mb-2">{card.icon}</div>
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

        {/* Payment History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Payment History</h2>
          </div>
          <div className="space-y-3">
            {paymentHistory.map((payment, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 hover:shadow-medium transition-all shadow-soft border border-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-base mb-1">{payment.month}</h3>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg mb-1">{payment.amount}</p>
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-400 text-green-900 text-xs font-semibold">
                      <CheckCircle className="h-3 w-3" />
                      {payment.status}
                    </div>
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
    </div>
  );
};

export default TenantDashboard;
