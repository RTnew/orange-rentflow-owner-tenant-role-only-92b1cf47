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

const dummyUsers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    role: "Owner",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    role: "Owner",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit.patel@example.com",
    role: "Tenant",
    createdAt: "2024-02-10",
  },
  {
    id: 4,
    name: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    role: "Tenant",
    createdAt: "2024-02-15",
  },
  {
    id: 5,
    name: "Vijay Singh",
    email: "vijay.singh@example.com",
    role: "Owner",
    createdAt: "2024-03-01",
  },
];

export default function UsersOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Overview</h1>
        <p className="text-muted-foreground">View all users on the platform</p>
      </div>

      <Card className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "Owner" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
