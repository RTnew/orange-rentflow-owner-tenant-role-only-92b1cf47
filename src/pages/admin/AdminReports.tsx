import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reportsData = [
  {
    title: "Total Paid Rents",
    value: "₹45,67,800",
    icon: DollarSign,
    trend: "+12.5%",
    trendUp: true,
  },
  {
    title: "Total Pending Rents",
    value: "₹2,45,000",
    icon: DollarSign,
    trend: "-5.2%",
    trendUp: false,
  },
  {
    title: "Monthly Revenue",
    value: "₹12,45,900",
    icon: TrendingUp,
    trend: "+8.1%",
    trendUp: true,
  },
];

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Financial reports and analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {reportsData.map((report) => {
          const Icon = report.icon;
          const TrendIcon = report.trendUp ? TrendingUp : TrendingDown;
          return (
            <Card key={report.title} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {report.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <TrendIcon
                    className={`h-3 w-3 ${
                      report.trendUp ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span className={report.trendUp ? "text-green-500" : "text-red-500"}>
                    {report.trend}
                  </span>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">Chart placeholder - Data visualization coming soon</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Top Properties by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sunset Apartments", revenue: "₹8,45,000" },
                { name: "Ocean View Villa", revenue: "₹6,20,000" },
                { name: "Green Valley Homes", revenue: "₹5,80,000" },
              ].map((property, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{property.name}</span>
                  <span className="text-sm text-muted-foreground">{property.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { method: "UPI", percentage: "45%" },
                { method: "Net Banking", percentage: "30%" },
                { method: "Card", percentage: "25%" },
              ].map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{method.method}</span>
                    <span className="text-muted-foreground">{method.percentage}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: method.percentage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
