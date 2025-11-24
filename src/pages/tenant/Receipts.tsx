import { ArrowLeft, Receipt, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Receipts = () => {
  const navigate = useNavigate();

  const receipts = [
    { id: "REC001", month: "December 2024", amount: "$1,200", date: "Dec 1, 2024", method: "UPI" },
    { id: "REC002", month: "November 2024", amount: "$1,200", date: "Nov 1, 2024", method: "Card" },
    { id: "REC003", month: "October 2024", amount: "$1,200", date: "Oct 1, 2024", method: "UPI" },
  ];

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
        {receipts.map((receipt) => (
          <div key={receipt.id} className="glass-card rounded-2xl p-4 shadow-medium">
            <div className="flex items-start gap-4">
              <div className="glass-card p-3 rounded-xl bg-green-50">
                <Receipt className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{receipt.month}</h3>
                    <p className="text-xs text-muted-foreground">Receipt #{receipt.id}</p>
                  </div>
                  <p className="text-lg font-bold text-primary">{receipt.amount}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{receipt.date}</p>
                    <p className="text-xs text-muted-foreground">via {receipt.method}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Downloading receipt ${receipt.id}...`)}
                    className="rounded-lg"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Receipts;
