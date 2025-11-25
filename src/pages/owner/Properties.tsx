import { Home, Plus, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Properties = () => {
  const navigate = useNavigate();

  const properties = [
    { id: 1, name: "Apartment 101", address: "123 Main St", rent: 1200, tenants: 1, status: "Occupied" },
    { id: 2, name: "Apartment 205", address: "456 Oak Ave", rent: 1500, tenants: 2, status: "Occupied" },
    { id: 3, name: "Studio 3B", address: "789 Elm St", rent: 950, tenants: 0, status: "Vacant" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Properties</h1>
            <p className="text-white/80 text-sm mt-1">{properties.length} total properties</p>
          </div>
          <Button
            onClick={() => navigate("/owner/add-property")}
            className="bg-white text-primary hover:bg-white/90 rounded-full"
            size="icon"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="glass-card rounded-2xl p-4 shadow-medium hover:shadow-glow transition-all cursor-pointer"
            onClick={() => navigate(`/owner/property/${property.id}`)}
          >
            <div className="flex items-start gap-4">
              <div className="glass-card p-3 rounded-xl">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{property.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  {property.address}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">₹{property.rent}</p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{property.tenants} Tenant(s)</p>
                    <div
                      className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties;
