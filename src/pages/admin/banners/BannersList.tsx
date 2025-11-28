import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const dummyBanners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400",
    title: "Premium Properties",
    subtitle: "Discover luxury homes",
    page: "Dashboard",
    roles: ["owner", "tenant"],
    order: 1,
    active: true,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400",
    title: "New Listings",
    subtitle: "Fresh properties available",
    page: "Browse",
    roles: ["tenant"],
    order: 2,
    active: true,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    title: "Summer Offers",
    subtitle: "Special discount rates",
    page: "Dashboard",
    roles: ["owner"],
    order: 3,
    active: false,
  },
];

export default function BannersList() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState(dummyBanners);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleToggleActive = (id: number) => {
    setBanners(banners.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const handleDelete = (id: number) => {
    setBanners(banners.filter(b => b.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banners Management</h1>
          <p className="text-muted-foreground">Manage banner advertisements</p>
        </div>
        <Button onClick={() => navigate("/admin/banners/add")} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <Card className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </TableCell>
                <TableCell className="font-medium">{banner.title}</TableCell>
                <TableCell>{banner.subtitle}</TableCell>
                <TableCell>{banner.page}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {banner.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{banner.order}</TableCell>
                <TableCell>
                  <Switch
                    checked={banner.active}
                    onCheckedChange={() => handleToggleActive(banner.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/banners/edit/${banner.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(banner.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this banner? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
