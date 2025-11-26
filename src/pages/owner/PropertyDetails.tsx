import { ArrowLeft, Home, MapPin, Users, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock property data - in real app, fetch based on id
  const property = {
    id: id,
    name: "Apartment 101",
    address: "123 Main St, Downtown",
    rent: 1200,
    tenants: 1,
    status: "Occupied",
    tenant: "John Smith",
    leaseStart: "Jan 2024",
    leaseEnd: "Dec 2024",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/properties")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-start gap-4">
          <div className="glass-card p-4 rounded-2xl">
            <Home className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{property.name}</h1>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <MapPin className="h-4 w-4" />
              {property.address}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {/* Rent Information */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-4">Rent Details</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly Rent</span>
              <span className="text-2xl font-bold text-primary">₹{property.rent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <div
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  property.status === "Occupied"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {property.status}
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Information */}
        {property.status === "Occupied" && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-4">Current Tenant</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <span>{property.tenant}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{property.leaseStart} - {property.leaseEnd}</span>
              </div>
            </div>
          </div>
        )}

        {/* Expense Tracking - Coming Soon */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-4">Expense Tracking</h2>
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Track property expenses and maintenance costs</p>
            <Button
              onClick={() => toast.info("Expense tracking feature coming soon!")}
              className="bg-primary text-white"
            >
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
