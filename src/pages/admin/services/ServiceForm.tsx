import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export default function ServiceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (static for now)
    navigate("/admin/services");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/services")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? "Edit Service" : "Add Service"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Update service details" : "Create a new service"}
          </p>
        </div>
      </div>

      <Card className="glass-card max-w-2xl">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter service title"
                defaultValue={isEdit ? "Property Management" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter service description"
                defaultValue={isEdit ? "Manage all your properties in one place" : ""}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Upload Image/Icon</Label>
              <Input id="image" type="file" accept="image/*" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page">Page</Label>
              <Input
                id="page"
                placeholder="e.g., Dashboard, Payments"
                defaultValue={isEdit ? "Dashboard" : ""}
              />
            </div>

            <div className="space-y-3">
              <Label>Roles</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="role-owner" defaultChecked={isEdit} />
                  <label htmlFor="role-owner" className="text-sm font-medium cursor-pointer">
                    Owner
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="role-tenant" />
                  <label htmlFor="role-tenant" className="text-sm font-medium cursor-pointer">
                    Tenant
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                placeholder="Display order"
                defaultValue={isEdit ? "1" : ""}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="active" defaultChecked={isEdit} />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {isEdit ? "Update Service" : "Create Service"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/services")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
