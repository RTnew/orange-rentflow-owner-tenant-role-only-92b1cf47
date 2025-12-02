import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PLACEMENT_OPTIONS = [
  { value: "upper_banner", label: "Upper Banner (Hero Section)" },
  { value: "down_banner", label: "Down Banner (Below Services)" },
];
export default function BannerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    location: "",
    imageUrl: "",
    roles: [] as string[],
    page: "",
    order: 0,
    active: true,
  });

  const { data: banner } = useQuery({
    queryKey: ["banner", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || "",
        location: banner.location || "",
        imageUrl: banner.image_url || "",
        roles: banner.roles || [],
        page: banner.page || "",
        order: banner.order_index,
        active: banner.is_active,
      });
    }
  }, [banner]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        location: formData.location,
        image_url: formData.imageUrl,
        roles: formData.roles,
        page: formData.page,
        order_index: formData.order,
        is_active: formData.active,
      };

      if (isEdit && id) {
        const { error } = await supabase
          .from("banners")
          .update(payload)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("banners")
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast({ title: `Banner ${isEdit ? "updated" : "created"} successfully` });
      navigate("/admin/banners");
    },
    onError: () => {
      toast({ title: "Error saving banner", variant: "destructive" });
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/banners")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? "Edit Banner" : "Add Banner"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Update banner details" : "Create a new banner"}
          </p>
        </div>
      </div>

      <Card className="glass-card max-w-2xl">
        <CardHeader>
          <CardTitle>Banner Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter banner title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                placeholder="Enter banner subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Ad Placement</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select where to place the ad" />
                </SelectTrigger>
                <SelectContent>
                  {PLACEMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Upper Banner: Shows at the top of the dashboard. Down Banner: Shows below the services section.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page">Page</Label>
              <Input
                id="page"
                placeholder="e.g., Dashboard, Browse"
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
                {saveMutation.isPending ? "Saving..." : isEdit ? "Update Banner" : "Create Banner"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/banners")}
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
