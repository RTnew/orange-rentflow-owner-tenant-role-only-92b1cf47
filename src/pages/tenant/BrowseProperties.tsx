import { ArrowLeft, Home, MapPin, Phone, Calendar, X, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BrowseProperties = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: listedProperties = [], isLoading } = useQuery({
    queryKey: ["listed-properties"],
    queryFn: async () => {
      const { data: properties, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "listed");

      if (error) throw error;
      
      // Fetch owner profiles for each property
      const ownerIds = [...new Set((properties || []).map(p => p.owner_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .in("id", ownerIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return (properties || []).map(p => ({
        ...p,
        owner_profile: profileMap.get(p.owner_id) || null
      }));
    },
  });

  // Filter properties by location
  const filteredProperties = listedProperties.filter((property) =>
    (property.city?.toLowerCase() || "").includes(searchLocation.toLowerCase()) ||
    (property.address?.toLowerCase() || "").includes(searchLocation.toLowerCase()) ||
    (property.state?.toLowerCase() || "").includes(searchLocation.toLowerCase())
  );

  const handleContact = (property: any) => {
    const phone = property.owner_profile?.phone || "";
    if (!phone) {
      toast.error("Owner contact not available");
      return;
    }
    const message = `Hi, I'm interested in ${property.name} at ${property.address}. Is it still available?`;
    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = phone.replace(/[^0-9]/g, "");
    window.location.href = `sms:${cleanNumber}?body=${encodedMessage}`;
    toast.success("Opening SMS to contact owner");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/tenant/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Browse Properties</h1>
          <p className="text-white/80 text-sm mt-1">{filteredProperties.length} properties available</p>
        </div>
        
        {/* Location Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
          />
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {filteredProperties.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No properties found in this location</p>
          </div>
        ) : (
          filteredProperties.map((property) => (
          <div
            key={property.id}
            className="glass-card rounded-2xl p-4 shadow-medium space-y-4"
          >
            {/* Property Image */}
            <div 
              className="w-full h-48 bg-muted rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => property.images?.[0] && setSelectedImage(property.images[0])}
            >
              <img
                src={property.images?.[0] || "/placeholder.svg"}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Property Header */}
            <div className="flex items-start gap-4">
              <div className="glass-card p-3 rounded-xl">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{property.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  {property.address}, {property.city}
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <p className="text-sm text-muted-foreground">{property.description}</p>
            )}

            {/* Property Type */}
            {property.property_type && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Type</p>
                <p className="text-sm capitalize">{property.property_type}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-3 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Monthly Rent</p>
                <p className="text-xl font-bold text-primary">₹{property.rent_amount || 0}</p>
              </div>
              <div className="glass-card p-3 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Owner</p>
                <p className="text-sm font-medium">{property.owner_profile?.full_name || "N/A"}</p>
              </div>
            </div>

            {/* Contact Button */}
            <Button
              onClick={() => handleContact(property)}
              className="w-full py-6 rounded-xl shadow-medium"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact Owner
            </Button>
          </div>
        ))
        )}
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 glass-card p-3 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <img
            src={selectedImage}
            alt="Property full view"
            className="max-w-[90%] max-h-[90%] object-contain rounded-xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default BrowseProperties;
