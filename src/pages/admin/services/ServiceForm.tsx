import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ServiceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    iconUrl: "",
    roles: [] as string[],
    page: "",
    order: 0,
    active: true,
  });

  const { data: service } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description || "",
        iconUrl: service.icon_url || "",
        roles: service.roles || [],
        page: service.page || "",
        order: service.order_index,
        active: service.is_active,
      });
    }
  }, [service]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: formData.title,
        description: formData.description,
        icon_url: formData.iconUrl,
        roles: formData.roles,
        page: formData.page,
        order_index: formData.order,
        is_active: formData.active,
      };

      if (isEdit && id) {
        const { error } = await supabase
          .from("services")
          .update(payload)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("services")
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast({ title: `Service ${isEdit ? "updated" : "created"} successfully` });
      navigate("/admin/services");
    },
    onError: () => {
      toast({ title: "Error saving service", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const toggleRole = (role: string) => {
    setFormData({
      ...formData,
      roles: formData.roles.includes(role)
        ? formData.roles.filter((r) => r !== role)
        : [...formData.roles, role],
    });
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter service description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iconUrl">Icon URL</Label>
              <Input
                id="iconUrl"
                type="url"
                placeholder="https://example.com/icon.png"
                value={formData.iconUrl}
                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page">Page</Label>
              <Input
                id="page"
                placeholder="e.g., Dashboard, Payments"
                value={formData.page}
                onChange={(e) => setFormData({ ...formData, page: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label>Roles</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="role-owner"
                    checked={formData.roles.includes("owner")}
                    onCheckedChange={() => toggleRole("owner")}
                  />
                  <label htmlFor="role-owner" className="text-sm font-medium cursor-pointer">
                    Owner
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="role-tenant"
                    checked={formData.roles.includes("tenant")}
                    onCheckedChange={() => toggleRole("tenant")}
                  />
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
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : isEdit ? "Update Service" : "Create Service"}
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
