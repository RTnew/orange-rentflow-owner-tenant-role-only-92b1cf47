import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Agreement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-6">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/tenant/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Rent Agreement</h1>
        <p className="text-white/80 text-sm mt-1">View your rental contract</p>
      </div>

      <div className="px-6 mt-6">
        <div className="glass-card rounded-2xl p-6 shadow-medium mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="glass-card p-3 rounded-xl">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Rental Agreement</h3>
              <p className="text-xs text-muted-foreground">Signed on Jan 1, 2024</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground">Property</p>
              <p className="font-medium">Apartment 101, 123 Main St</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground">Monthly Rent</p>
              <p className="font-medium text-primary">$1,200</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground">Security Deposit</p>
              <p className="font-medium">$2,400</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground">Lease Period</p>
              <p className="font-medium">Jan 1, 2024 - Dec 31, 2024</p>
            </div>
          </div>

          <Button
            onClick={() => toast.success("Downloading agreement...")}
            className="w-full rounded-xl py-6"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Agreement PDF
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-4 shadow-soft bg-blue-50/50 border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Keep a copy of your signed agreement for your records. Contact your landlord for any clarifications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Agreement;
