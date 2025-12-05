import { ArrowLeft, Download, Calendar, TrendingUp, Home, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, startOfMonth, endOfMonth, startOfYear } from "date-fns";

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch owner's properties
  const { data: properties = [] } = useQuery({
    queryKey: ["owner-properties", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch tenant assignments for owner's properties
  const { data: assignments = [] } = useQuery({
    queryKey: ["owner-assignments", properties],
    queryFn: async () => {
      const propertyIds = properties.map(p => p.id);
      if (propertyIds.length === 0) return [];

      const { data, error } = await supabase
        .from("tenant_assignments")
        .select("*")
        .in("property_id", propertyIds);

      if (error) throw error;
      return data;
    },
    enabled: properties.length > 0,
  });

  // Fetch payments for owner's properties
  const { data: payments = [] } = useQuery({
    queryKey: ["owner-payments", properties],
    queryFn: async () => {
      const propertyIds = properties.map(p => p.id);
      if (propertyIds.length === 0) return [];

      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .in("property_id", propertyIds);

      if (error) throw error;
      return data;
    },
    enabled: properties.length > 0,
  });

  // Fetch expenses
  const { data: expenses = [] } = useQuery({
    queryKey: ["owner-expenses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("owner_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Calculate stats
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const yearStart = startOfYear(now);

  const monthlyIncome = payments
    .filter(p => {
      const paymentDate = new Date(p.payment_date);
      return paymentDate >= monthStart && paymentDate <= monthEnd && p.status === "completed";
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const monthlyExpenses = expenses
    .filter(e => {
      const expenseDate = new Date(e.expense_date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const ytdIncome = payments
    .filter(p => {
      const paymentDate = new Date(p.payment_date);
      return paymentDate >= yearStart && p.status === "completed";
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const paidTenants = assignments.filter(a => a.rent_status === "paid").length;
  const totalTenants = assignments.length;
  const occupiedProperties = properties.filter(p => p.status === "occupied").length;
  const occupancyRate = properties.length > 0 
    ? Math.round((occupiedProperties / properties.length) * 100) 
    : 0;

  const reports = [
    { 
      title: "Monthly Income Report", 
      period: format(now, "MMMM yyyy"), 
      amount: `₹${monthlyIncome.toLocaleString("en-IN")}`,
      icon: DollarSign,
    },
    { 
      title: "Expense Summary", 
      period: format(now, "MMMM yyyy"), 
      amount: `₹${monthlyExpenses.toLocaleString("en-IN")}`,
      icon: TrendingUp,
    },
    { 
      title: "Tenant Payment Status", 
      period: "Current", 
      amount: `${paidTenants}/${totalTenants} Paid`,
      icon: Users,
    },
    { 
      title: "Property Occupancy", 
      period: "Current", 
      amount: `${occupancyRate}%`,
      icon: Home,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-6">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-white/80 text-sm mt-1">View and download reports</p>
      </div>

      <div className="px-6 mt-6">
        <div className="glass-card rounded-2xl p-4 shadow-medium mb-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Quick Stats</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">This Month</p>
              <p className="text-xl font-bold text-green-600">
                ₹{(monthlyIncome - monthlyExpenses).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground">Net Profit</p>
            </div>
            <div className="glass-card rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">YTD Revenue</p>
              <p className="text-xl font-bold text-primary">
                ₹{ytdIncome.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground">Total Income</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {reports.map((report, index) => {
            const Icon = report.icon;
            return (
              <div key={index} className="glass-card rounded-2xl p-4 shadow-medium">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="glass-card p-2 rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{report.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {report.period}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary mb-2">{report.amount}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success(`Downloading ${report.title}...`)}
                      className="rounded-lg"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reports;