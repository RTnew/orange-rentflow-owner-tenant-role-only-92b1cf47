import { CreditCard, Clock, CheckCircle, FileText, Home, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TenantDashboard = () => {
  const navigate = useNavigate();
  const daysUntilDue = 5;
  const rentAmount = 1200;
  const paidThisYear = 12000;

  const paymentHistory = [
    { month: "December 2024", amount: "₹1,200", status: "Paid", date: "Dec 1, 2024" },
    { month: "November 2024", amount: "₹1,200", status: "Paid", date: "Nov 1, 2024" },
    { month: "October 2024", amount: "₹1,200", status: "Paid", date: "Oct 1, 2024" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      {/* Header */}
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Hi, Tenant 👋</h1>
          <p className="text-white/80 text-sm mt-1">Your rent dashboard</p>
        </div>

        {/* Main Rent Card */}
        <div className="glass-card rounded-3xl p-6 shadow-glow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm mb-1">Next Payment Due</p>
              <p className="text-3xl font-bold">₹{rentAmount}</p>
            </div>
            <div className="glass-card px-3 py-1.5 rounded-full">
              <p className="text-xs font-medium">Due in {daysUntilDue} days</p>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-white/70">Payment Progress</span>
              <span className="font-medium">{Math.floor(((30 - daysUntilDue) / 30) * 100)}%</span>
            </div>
            <Progress value={((30 - daysUntilDue) / 30) * 100} className="h-2" />
          </div>

          <Button
            onClick={() => navigate("/tenant/payments")}
            className="w-full bg-white text-primary hover:bg-white/90 font-semibold py-6 rounded-xl shadow-medium hover:shadow-glow transition-all hover:scale-105"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay Rent Now
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-card rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-xs text-muted-foreground">Paid This Year</span>
            </div>
            <p className="text-2xl font-bold text-green-600">₹{paidThisYear.toLocaleString()}</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-xs text-muted-foreground">On-Time Rate</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">100%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-4 shadow-medium mb-6">
          <h3 className="font-semibold mb-3 text-sm">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => navigate("/tenant/agreement")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Agreement</span>
            </button>
            <button 
              onClick={() => navigate("/tenant/schedule")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Schedule</span>
            </button>
            <button 
              onClick={() => navigate("/tenant/receipts")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Receipts</span>
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h2 className="text-lg font-bold mb-4">Payment History</h2>
          <div className="space-y-3">
            {paymentHistory.map((payment, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-4 hover:shadow-medium transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{payment.month}</h3>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg mb-1">{payment.amount}</p>
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-medium">
                      <CheckCircle className="h-3 w-3" />
                      {payment.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-border p-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button 
            onClick={() => navigate("/tenant/dashboard")}
            className="flex flex-col items-center gap-1 text-primary"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate("/tenant/payments")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Payments</span>
          </button>
          <button 
            onClick={() => navigate("/tenant/documents")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs">Documents</span>
          </button>
          <button 
            onClick={() => navigate("/tenant/profile")}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
