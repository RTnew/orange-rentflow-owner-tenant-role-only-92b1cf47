import { Building2, DollarSign, AlertCircle, TrendingUp, Plus, Home, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      value: "$45,230",
      icon: DollarSign,
      change: "+12% from last month",
      color: "text-green-500",
    },
    {
      title: "Pending Payments",
      value: "$8,400",
      icon: AlertCircle,
      change: "5 tenants",
      color: "text-orange-500",
    },
    {
      title: "This Month",
      value: "$12,840",
      icon: TrendingUp,
      change: "+8% growth",
      color: "text-primary",
    },
  ];

  const recentProperties = [
    { name: "Sunset Apartments 304", rent: "$1,200", status: "Paid", tenant: "John Smith" },
    { name: "Downtown Loft 12B", rent: "$2,400", status: "Pending", tenant: "Sarah Johnson" },
    { name: "Garden View Villa", rent: "$3,200", status: "Paid", tenant: "Mike Brown" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      {/* Header */}
      <div className="gradient-primary p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Owner</h1>
            <p className="text-white/80 text-sm mt-1">Here's your property overview</p>
          </div>
          <Button
            size="icon"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl"
            onClick={() => toast.info("Add property feature coming soon!")}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-4 hover:scale-105 transition-transform"
            >
              <div className="flex items-start justify-between mb-3">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-white/70">{stat.title}</p>
              <p className="text-xs text-white/60 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-6">
        <div className="glass-card rounded-2xl p-4 shadow-medium mb-6">
          <h3 className="font-semibold mb-3 text-sm">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => toast.info("Add property feature coming soon!")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Home className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Add Property</span>
            </button>
            <button 
              onClick={() => toast.info("Add tenant feature coming soon!")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Add Tenant</span>
            </button>
            <button 
              onClick={() => toast.info("Reports feature coming soon!")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Reports</span>
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
              className="text-primary"
              onClick={() => toast.info("Property list view coming soon!")}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentProperties.map((property, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-4 hover:shadow-medium transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{property.name}</h3>
                    <p className="text-xs text-muted-foreground">{property.tenant}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      property.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {property.status}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{property.rent}</span>
                  <span className="text-xs text-muted-foreground">Monthly</span>
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
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => toast.info("Properties page coming soon!")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Building2 className="h-5 w-5" />
            <span className="text-xs">Properties</span>
          </button>
          <button 
            onClick={() => toast.info("Finance page coming soon!")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <DollarSign className="h-5 w-5" />
            <span className="text-xs">Finance</span>
          </button>
          <button 
            onClick={() => toast.info("Profile page coming soon!")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Users className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
