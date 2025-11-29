import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function PropertiesOverview() {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (propertiesError) throw propertiesError;

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name");
      
      if (profilesError) throw profilesError;

      const propertiesWithOwners = propertiesData.map(property => ({
        ...property,
        owner_name: profilesData.find(p => p.id === property.owner_id)?.full_name || "Unknown"
      }));
      
      return propertiesWithOwners;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties Overview</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Properties Overview</h1>
        <p className="text-muted-foreground">View all properties on the platform</p>
      </div>

      <Card className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property Name</TableHead>
              <TableHead>Owner Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>{property.owner_name}</TableCell>
                  <TableCell>{property.city || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={property.status === "listed" ? "default" : "secondary"}
                    >
                      {property.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
