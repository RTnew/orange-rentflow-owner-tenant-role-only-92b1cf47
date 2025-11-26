import { ArrowLeft, Home, MapPin, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BrowseProperties = () => {
  const navigate = useNavigate();

  // Mock listed properties
  const listedProperties = [
    {
      id: 1,
      name: "Apartment 101",
      address: "123 Main St, Downtown",
      rent: 1200,
      deposit: 2400,
      description: "Spacious 2BHK apartment with modern amenities. Close to metro station and shopping centers.",
      amenities: "WiFi, Parking, Gym, AC, Power Backup",
      availableFrom: "2025-01-15",
      contactNumber: "+91 98765 43210",
      owner: "John Doe",
      images: ["/placeholder.svg"],
    },
    {
      id: 2,
      name: "Studio 3B",
      address: "789 Elm St, Suburb Area",
      rent: 950,
      deposit: 1900,
      description: "Cozy studio apartment perfect for single professionals. Quiet neighborhood with good connectivity.",
      amenities: "WiFi, Parking, AC, Security",
      availableFrom: "2025-01-01",
      contactNumber: "+91 87654 32109",
      owner: "Jane Smith",
      images: ["/placeholder.svg"],
    },
  ];

  const handleContact = (property: typeof listedProperties[0]) => {
    const message = `Hi, I'm interested in ${property.name} at ${property.address}. Is it still available?`;
    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = property.contactNumber.replace(/[^0-9]/g, "");
    window.location.href = `sms:${cleanNumber}?body=${encodedMessage}`;
    toast.success("Opening SMS to contact owner");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/tenant/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Browse Properties</h1>
          <p className="text-white/80 text-sm mt-1">{listedProperties.length} properties available</p>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {listedProperties.map((property) => (
          <div
            key={property.id}
            className="glass-card rounded-2xl p-4 shadow-medium space-y-4"
          >
            {/* Property Image */}
            <div className="w-full h-48 bg-muted rounded-xl overflow-hidden">
              <img
                src={property.images[0]}
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
                  {property.address}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground">{property.description}</p>

            {/* Amenities */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Amenities</p>
              <p className="text-sm">{property.amenities}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-3 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Monthly Rent</p>
                <p className="text-xl font-bold text-primary">₹{property.rent}</p>
              </div>
              <div className="glass-card p-3 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Deposit</p>
                <p className="text-xl font-bold text-primary">₹{property.deposit}</p>
              </div>
            </div>

            {/* Available From */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Available from:</span>
              <span className="font-medium">
                {new Date(property.availableFrom).toLocaleDateString()}
              </span>
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
        ))}
      </div>
    </div>
  );
};

export default BrowseProperties;
