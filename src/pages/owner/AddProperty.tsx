import { ArrowLeft, Upload, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    rent: "",
    deposit: "",
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Property added successfully!");
    navigate("/owner/properties");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-6">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Add New Property</h1>
        <p className="text-white/80 text-sm mt-1">Fill in property details</p>
      </div>

      <div className="px-6 mt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-card rounded-2xl p-6 shadow-medium space-y-4">
            <div>
              <Label htmlFor="name">Property Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Apartment 101"
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full property address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rent">Monthly Rent</Label>
                <Input
                  id="rent"
                  type="number"
                  value={formData.rent}
                  onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                  placeholder="1200"
                  required
                />
              </div>

              <div>
                <Label htmlFor="deposit">Deposit</Label>
                <Input
                  id="deposit"
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  placeholder="2400"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dueDate">Rent Due Date</Label>
              <Input
                id="dueDate"
                type="number"
                min="1"
                max="31"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                placeholder="1"
                required
              />
            </div>

            <div className="glass-card rounded-xl p-4 border-2 border-dashed border-border">
              <div className="flex flex-col items-center gap-2 text-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Upload Property Images</p>
                <p className="text-xs text-muted-foreground">Click to browse files</p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full py-6 rounded-xl shadow-medium">
            <Home className="mr-2 h-5 w-5" />
            Add Property
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
