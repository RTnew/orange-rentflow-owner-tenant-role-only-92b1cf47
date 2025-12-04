import { Home, Plus, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const Properties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: properties, isLoading } = useQuery({
    queryKey: ["owner-properties", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "occupied":
        return "Occupied";
      case "listed":
        return "Listed";
      case "vacant":
      default:
        return "Vacant";
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "occupied":
        return "bg-green-100 text-green-700";
      case "listed":
        return "bg-blue-100 text-blue-700";
      case "vacant":
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Properties</h1>
            <p className="text-white/80 text-sm mt-1">
              {properties?.length || 0} total properties
            </p>
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
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-8 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : properties && properties.length > 0 ? (
          properties.map((property) => (
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
                    {property.address || `${property.city}, ${property.state}`}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        ₹{property.rent_amount?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">per month</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(
                          property.status
                        )}`}
                      >
                        {getStatusLabel(property.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add your first property to get started
            </p>
            <Button onClick={() => navigate("/owner/add-property")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;