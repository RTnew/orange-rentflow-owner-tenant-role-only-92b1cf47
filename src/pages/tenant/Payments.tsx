import { ArrowLeft, CreditCard, Smartphone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Payments = () => {
  const navigate = useNavigate();

  const handlePayment = (method: string) => {
    toast.success(`Processing payment via ${method}...`);
    setTimeout(() => {
      toast.success("Payment successful!");
      navigate("/tenant/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-6">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/tenant/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Pay Rent</h1>
        <p className="text-white/80 text-sm mt-1">Choose payment method</p>
      </div>

      <div className="px-6 mt-6">
        <div className="glass-card rounded-3xl p-6 shadow-glow mb-6">
          <p className="text-sm text-muted-foreground mb-2">Amount Due</p>
          <p className="text-4xl font-bold text-primary mb-4">$1,200</p>
          <div className="glass-card rounded-xl p-3 bg-orange-50 border border-primary/20">
            <p className="text-xs font-medium text-primary">Due in 5 days - January 1, 2025</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handlePayment("UPI")}
            className="w-full glass-card rounded-2xl p-6 shadow-medium hover:shadow-glow transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="glass-card p-3 rounded-full bg-primary/10">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">UPI Payment</h3>
                <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handlePayment("Card")}
            className="w-full glass-card rounded-2xl p-6 shadow-medium hover:shadow-glow transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="glass-card p-3 rounded-full bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Credit / Debit Card</h3>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handlePayment("Net Banking")}
            className="w-full glass-card rounded-2xl p-6 shadow-medium hover:shadow-glow transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="glass-card p-3 rounded-full bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Net Banking</h3>
                <p className="text-xs text-muted-foreground">All major banks</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payments;
