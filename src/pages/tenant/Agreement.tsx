import { ArrowLeft, FileText, Download, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const Agreement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: assignment, isLoading } = useQuery({
    queryKey: ["tenant-assignment", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenant_assignments")
        .select("*, properties(*)")
        .eq("tenant_id", user?.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const property = assignment?.properties;

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
        {isLoading ? (
          <div className="glass-card rounded-2xl p-6 shadow-medium">
            <p className="text-center text-muted-foreground">Loading agreement details...</p>
          </div>
        ) : !assignment || !property ? (
          <div className="glass-card rounded-2xl p-6 shadow-medium text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-2">No Active Agreement</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You don't have any active rental agreement yet.
            </p>
            <Button onClick={() => navigate("/tenant/browse")} className="rounded-xl">
              <Home className="mr-2 h-4 w-4" />
              Browse Properties
            </Button>
          </div>
        ) : (
          <>
            <div className="glass-card rounded-2xl p-6 shadow-medium mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="glass-card p-3 rounded-xl">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Rental Agreement</h3>
                  <p className="text-xs text-muted-foreground">
                    Move-in: {assignment.move_in_date 
                      ? format(new Date(assignment.move_in_date), "MMM d, yyyy")
                      : "Not specified"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground">Property</p>
                  <p className="font-medium">{property.name}</p>
                  {property.address && (
                    <p className="text-sm text-muted-foreground">
                      {property.address}, {property.city}
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground">Monthly Rent</p>
                  <p className="font-medium text-primary">
                    ₹{property.rent_amount?.toLocaleString("en-IN") || "N/A"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground">Property Type</p>
                  <p className="font-medium capitalize">{property.property_type || "N/A"}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground">Rent Status</p>
                  <p className={`font-medium capitalize ${
                    assignment.rent_status === "paid" ? "text-green-600" : "text-orange-600"
                  }`}>
                    {assignment.rent_status || "Pending"}
                  </p>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Agreement;