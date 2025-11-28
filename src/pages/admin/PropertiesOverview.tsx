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

const dummyProperties = [
  {
    id: 1,
    name: "Sunset Apartments",
    owner: "Rajesh Kumar",
    tenantCount: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "Ocean View Villa",
    owner: "Priya Sharma",
    tenantCount: 1,
    status: "Active",
  },
  {
    id: 3,
    name: "Green Valley Homes",
    owner: "Amit Patel",
    tenantCount: 24,
    status: "Active",
  },
  {
    id: 4,
    name: "Royal Residency",
    owner: "Sneha Gupta",
    tenantCount: 0,
    status: "Vacant",
  },
  {
    id: 5,
    name: "City Center Plaza",
    owner: "Vijay Singh",
    tenantCount: 8,
    status: "Active",
  },
];

export default function PropertiesOverview() {
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
              <TableHead>Tenant Count</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.name}</TableCell>
                <TableCell>{property.owner}</TableCell>
                <TableCell>{property.tenantCount}</TableCell>
                <TableCell>
                  <Badge
                    variant={property.status === "Active" ? "default" : "secondary"}
                  >
                    {property.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
