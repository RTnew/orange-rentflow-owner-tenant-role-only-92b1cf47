import { ArrowLeft, Upload, Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const ListProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyId: "",
    location: "",
    description: "",
    amenities: "",
    availableFrom: "",
    contactNumber: "",
  });
  const [images, setImages] = useState<File[]>([]);

  // Mock properties owned by this user
  const ownedProperties = [
    { id: 1, name: "Apartment 101", address: "123 Main St" },
    { id: 2, name: "Studio 3B", address: "789 Elm St" },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages([...images, ...files].slice(0, 5));
    toast.success(`${files.length} image(s) added`);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Property listed successfully!");
    navigate("/owner/properties");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-6">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/properties")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">List Property for Rent</h1>
        <p className="text-white/80 text-sm mt-1">Make your property available to tenants</p>
      </div>

      <div className="px-6 mt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-card rounded-2xl p-6 shadow-medium space-y-4">
            <div>
              <Label htmlFor="propertyId">Select Property</Label>
              <select
                id="propertyId"
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground"
                required
              >
                <option value="">Choose a property to list</option>
                {ownedProperties.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.name} - {prop.address}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="location">Location/Area</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Downtown, Suburb Area"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Property Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your property, nearby facilities, etc."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="amenities">Amenities</Label>
              <Input
                id="amenities"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="e.g., WiFi, Parking, Gym, AC"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="availableFrom">Available From</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Property Images (Max 5)</Label>
              <div className="glass-card rounded-xl p-4 border-2 border-dashed border-border">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="images" className="flex flex-col items-center gap-2 text-center cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Upload Property Images</p>
                  <p className="text-xs text-muted-foreground">{images.length}/5 images selected</p>
                </label>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative glass-card rounded-lg p-2">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Property ${idx + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full py-6 rounded-xl shadow-medium">
            <Home className="mr-2 h-5 w-5" />
            List Property
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ListProperty;
