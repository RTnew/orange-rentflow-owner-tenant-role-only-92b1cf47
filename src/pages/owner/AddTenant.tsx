import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const AddTenant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Tenant added successfully!");
    navigate("/owner/tenants");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-6">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Add New Tenant</h1>
        <p className="text-white/80 text-sm mt-1">Enter tenant information</p>
      </div>

      <div className="px-6 mt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass-card rounded-2xl p-6 shadow-medium space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Smith"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
                required
              />
            </div>

            <div>
              <Label htmlFor="property">Assign Property</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, property: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apt101">Apartment 101</SelectItem>
                  <SelectItem value="apt205">Apartment 205</SelectItem>
                  <SelectItem value="studio3b">Studio 3B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full py-6 rounded-xl shadow-medium">
            <UserPlus className="mr-2 h-5 w-5" />
            Add Tenant
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddTenant;
