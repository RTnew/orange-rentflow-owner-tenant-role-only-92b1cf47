import { ArrowLeft, Download, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Reports = () => {
  const navigate = useNavigate();

  const reports = [
    { title: "Monthly Income Report", period: "January 2025", amount: "$2,700" },
    { title: "Expense Summary", period: "January 2025", amount: "$230" },
    { title: "Tenant Payment Status", period: "Current", amount: "3/3 Paid" },
    { title: "Property Occupancy", period: "Current", amount: "100%" },
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
              <p className="text-xl font-bold text-green-600">$2,470</p>
            </div>
            <div className="glass-card rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">YTD Revenue</p>
              <p className="text-xl font-bold text-primary">$2,470</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {reports.map((report, index) => (
            <div key={index} className="glass-card rounded-2xl p-4 shadow-medium">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">{report.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {report.period}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
