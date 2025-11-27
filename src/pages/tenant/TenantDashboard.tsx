import { CreditCard, Clock, CheckCircle, FileText, Home, User, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const TenantDashboard = () => {
  const navigate = useNavigate();
  const daysUntilDue = 5;
  const rentAmount = 1200;
  const paidThisYear = 12000;

  const paymentHistory = [
    { month: "December 2024", amount: "₹1,200", status: "Paid", date: "Dec 1, 2024" },
    { month: "November 2024", amount: "₹1,200", status: "Paid", date: "Nov 1, 2024" },
    { month: "October 2024", amount: "₹1,200", status: "Paid", date: "Oct 1, 2024" },
  ];

  const bannerAds = [
    { id: 1, title: "NEXT PAYMENT DUE", subtitle: "₹1,200", location: "Due in 5 days", icon: "💰", bg: "from-orange-400 to-orange-500" },
    { id: 2, title: "MAINTENANCE", subtitle: "₹500", location: "Due: Feb 1, 2024", icon: "🔧", bg: "from-blue-400 to-blue-500" },
    { id: 3, title: "PROPERTY TAX", subtitle: "₹2,500", location: "Due: Mar 31, 2024", icon: "📄", bg: "from-purple-400 to-purple-500" },
    { id: 4, title: "UTILITIES", subtitle: "₹800", location: "Due: Feb 10, 2024", icon: "💡", bg: "from-green-400 to-green-500" },
  ];

  const handleBannerClick = (banner: typeof bannerAds[0]) => {
    if (banner.title === "NEXT PAYMENT DUE") {
      navigate("/tenant/payments");
    } else {
      toast.info(`${banner.title}: ${banner.subtitle}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted pb-20">
      {/* Header */}
      <div className="gradient-primary p-6 text-white pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Hi, Tenant 👋</h1>
            <p className="text-white/90 text-base mt-2">Your rent dashboard</p>
          </div>
        </div>

        {/* Payment Carousel */}
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
                <span className="font-semibold">Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <span className="font-semibold">Agreements</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">💳</span>
                <span className="font-semibold">Payments</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-600 rounded-2xl p-4 shadow-medium flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-2">🏠</div>
            <p className="text-white font-semibold text-sm">Browse available properties</p>
          </div>
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
