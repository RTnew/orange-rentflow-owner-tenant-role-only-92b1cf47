import { ArrowLeft, CreditCard, Smartphone, Building2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Payments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: assignment, isLoading } = useQuery({
    queryKey: ["tenant-assignment", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("tenant_assignments")
        .select(`
          *,
          properties (name, rent_amount, address)
        `)
        .eq("tenant_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const paymentMutation = useMutation({
    mutationFn: async (method: string) => {
      if (!user?.id || !assignment) throw new Error("No assignment found");

      const { error } = await supabase.from("payments").insert({
        tenant_id: user.id,
        property_id: assignment.property_id,
        amount: assignment.properties?.rent_amount || 0,
        payment_method: method,
        status: "completed",
        receipt_id: `REC${Date.now().toString().slice(-6)}`,
        month_year: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-receipts"] });
      toast.success("Payment successful!");
      setTimeout(() => navigate("/tenant/dashboard"), 1500);
    },
    onError: () => {
      toast.error("Payment failed. Please try again.");
    },
  });

  const handlePayment = (method: string) => {
    toast.success(`Processing payment via ${method}...`);
    paymentMutation.mutate(method);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const rentAmount = assignment?.properties?.rent_amount || 0;

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
        {!assignment ? (
          <div className="glass-card rounded-3xl p-6 text-center">
            <p className="text-muted-foreground">No property assigned yet</p>
          </div>
        ) : (
          <>
            <div className="glass-card rounded-3xl p-6 shadow-glow mb-6">
              <p className="text-sm text-muted-foreground mb-1">
                {assignment.properties?.name}
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                {assignment.properties?.address}
              </p>
              <p className="text-sm text-muted-foreground mb-2">Amount Due</p>
              <p className="text-4xl font-bold text-primary mb-4">₹{rentAmount}</p>
              <div className="glass-card rounded-xl p-3 bg-orange-50 border border-primary/20">
                <p className="text-xs font-medium text-primary">
                  Status: {assignment.rent_status || "pending"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handlePayment("UPI")}
                disabled={paymentMutation.isPending}
                className="w-full glass-card rounded-2xl p-6 shadow-medium hover:shadow-glow transition-all text-left disabled:opacity-50"
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
                disabled={paymentMutation.isPending}
                className="w-full glass-card rounded-2xl p-6 shadow-medium hover:shadow-glow transition-all text-left disabled:opacity-50"
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
                disabled={paymentMutation.isPending}
                className="w-full glass-card rounded-2xl p-6 shadow-medium hover:shadow-glow transition-all text-left disabled:opacity-50"
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
          </>
        )}
      </div>
    </div>
  );
};

export default Payments;
