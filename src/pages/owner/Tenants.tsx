import { User, Plus, ArrowLeft, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Tenants = () => {
  const navigate = useNavigate();

  const tenants = [
    { id: 1, name: "John Smith", property: "Apartment 101", phone: "+1234567890", email: "john@email.com", status: "Paid" },
    { id: 2, name: "Sarah Johnson", property: "Apartment 205", phone: "+1234567891", email: "sarah@email.com", status: "Pending" },
    { id: 3, name: "Mike Wilson", property: "Apartment 205", phone: "+1234567892", email: "mike@email.com", status: "Paid" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Tenants</h1>
            <p className="text-white/80 text-sm mt-1">{tenants.length} active tenants</p>
          </div>
          <Button
            onClick={() => navigate("/owner/add-tenant")}
            className="bg-white text-primary hover:bg-white/90 rounded-full"
            size="icon"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="glass-card rounded-2xl p-4 shadow-medium hover:shadow-glow transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="glass-card p-3 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{tenant.name}</h3>
                  <div
                    className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${
                      tenant.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {tenant.status}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{tenant.property}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {tenant.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {tenant.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tenants;
