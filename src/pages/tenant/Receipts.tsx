import { ArrowLeft, Receipt, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Receipts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: receipts = [], isLoading } = useQuery({
    queryKey: ["tenant-receipts", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("tenant_id", user.id)
        .eq("status", "completed")
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/tenant/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Payment Receipts</h1>
        <p className="text-white/80 text-sm mt-1">Download your payment history</p>
      </div>

      <div className="px-6 mt-6 space-y-3">
        {receipts.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No payment receipts yet</p>
          </div>
        ) : (
          receipts.map((receipt) => (
            <div key={receipt.id} className="glass-card rounded-2xl p-4 shadow-medium">
              <div className="flex items-start gap-4">
                <div className="glass-card p-3 rounded-xl bg-green-50">
                  <Receipt className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{receipt.month_year || "Payment"}</h3>
                      <p className="text-xs text-muted-foreground">Receipt #{receipt.receipt_id || receipt.id.slice(0, 8)}</p>
                    </div>
                    <p className="text-lg font-bold text-primary">₹{receipt.amount}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(receipt.payment_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">via {receipt.payment_method || "N/A"}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success(`Downloading receipt ${receipt.receipt_id || receipt.id.slice(0, 8)}...`)}
                      className="rounded-lg"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Receipts;
