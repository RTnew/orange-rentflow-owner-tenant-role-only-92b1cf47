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

const dummyServices = [
  {
    id: 1,
    icon: "🏠",
    title: "Property Management",
    page: "Dashboard",
    roles: ["owner"],
    order: 1,
    active: true,
  },
  {
    id: 2,
    icon: "💳",
    title: "Rent Payment",
    page: "Payments",
    roles: ["tenant"],
    order: 2,
    active: true,
  },
  {
    id: 3,
    icon: "📄",
    title: "Document Management",
    page: "Documents",
    roles: ["owner", "tenant"],
    order: 3,
    active: true,
  },
];

export default function ServicesList() {
  const navigate = useNavigate();
  const [services, setServices] = useState(dummyServices);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleToggleActive = (id: number) => {
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleDelete = (id: number) => {
    setServices(services.filter(s => s.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
          <p className="text-muted-foreground">Manage platform services</p>
        </div>
        <Button onClick={() => navigate("/admin/services/add")} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>
                  <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-lg text-2xl">
                    {service.icon}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell>{service.page}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {service.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{service.order}</TableCell>
                <TableCell>
                  <Switch
                    checked={service.active}
                    onCheckedChange={() => handleToggleActive(service.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/services/edit/${service.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(service.id)}
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
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
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
