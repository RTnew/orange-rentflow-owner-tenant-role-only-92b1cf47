import { Building2, Users, UserCheck, DollarSign, Briefcase, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [propertiesRes, userRolesRes, servicesRes, bannersRes] = await Promise.all([
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("user_roles").select("*"),
        supabase.from("services").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("banners").select("*", { count: "exact", head: true }).eq("is_active", true),
      ]);

      const owners = userRolesRes.data?.filter(r => r.role === "owner").length || 0;
      const tenants = userRolesRes.data?.filter(r => r.role === "tenant").length || 0;

      return {
        properties: propertiesRes.count || 0,
        owners,
        tenants,
        services: servicesRes.count || 0,
        banners: bannersRes.count || 0,
      };
    },
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["admin-recent-activity"],
    queryFn: async () => {
      const [propertiesRes, servicesRes, bannersRes] = await Promise.all([
        supabase.from("properties").select("name, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("services").select("title, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("banners").select("title, created_at").order("created_at", { ascending: false }).limit(3),
      ]);

      const activities = [
        ...(propertiesRes.data?.map(p => ({ type: "property", name: p.name, created_at: p.created_at })) || []),
        ...(servicesRes.data?.map(s => ({ type: "service", name: s.title, created_at: s.created_at })) || []),
        ...(bannersRes.data?.map(b => ({ type: "banner", name: b.title, created_at: b.created_at })) || []),
      ];

      return activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
    },
  });

  const statsCards = [
    {
      title: "Total Properties",
      value: stats?.properties?.toString() || "0",
      icon: Building2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Tenants",
      value: stats?.tenants?.toString() || "0",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Owners",
      value: stats?.owners?.toString() || "0",
      icon: UserCheck,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Active Banners",
      value: stats?.banners?.toString() || "0",
      icon: Image,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Active Services",
      value: stats?.services?.toString() || "0",
      icon: Briefcase,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "property": return "bg-green-500";
      case "service": return "bg-blue-500";
      case "banner": return "bg-primary";
      default: return "bg-gray-500";
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "property": return "Property added";
      case "service": return "Service added";
      case "banner": return "Banner added";
      default: return "Activity";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{getActivityLabel(activity.type)}: {activity.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Users</span>
                <span className="text-sm font-bold">{(stats?.owners || 0) + (stats?.tenants || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Properties per Owner</span>
                <span className="text-sm font-bold">
                  {stats?.owners ? ((stats?.properties || 0) / stats.owners).toFixed(1) : "0"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Banners</span>
                <span className="text-sm font-bold">{stats?.banners || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}