import { ArrowLeft, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, addMonths, differenceInDays, startOfMonth } from "date-fns";

const Schedule = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: assignment, isLoading: assignmentLoading } = useQuery({
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

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["tenant-payments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("tenant_id", user?.id)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const property = assignment?.properties;
  const rentAmount = property?.rent_amount || 0;

  // Generate schedule based on move-in date
  const generateSchedule = () => {
    if (!assignment?.move_in_date) return [];

    const schedule = [];
    const moveInDate = new Date(assignment.move_in_date);
    const today = new Date();

    // Generate 6 months of schedule (past and future)
    for (let i = -3; i <= 2; i++) {
      const dueDate = startOfMonth(addMonths(today, i));
      dueDate.setDate(moveInDate.getDate() || 1);

      const monthYear = format(dueDate, "MMMM yyyy");
      const isPaid = payments.some(p => p.month_year === monthYear && p.status === "completed");

      schedule.push({
        month: monthYear,
        dueDate: format(dueDate, "MMM d, yyyy"),
        amount: `₹${rentAmount.toLocaleString("en-IN")}`,
        status: isPaid ? "Paid" : dueDate > today ? "Upcoming" : "Pending",
        dueDateObj: dueDate,
      });
    }

    return schedule.sort((a, b) => b.dueDateObj.getTime() - a.dueDateObj.getTime());
  };

  const schedule = generateSchedule();
  const nextPayment = schedule.find(s => s.status === "Upcoming" || s.status === "Pending");
  const daysUntilDue = nextPayment 
    ? differenceInDays(nextPayment.dueDateObj, new Date())
    : 0;

  const isLoading = assignmentLoading || paymentsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/tenant/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Payment Schedule</h1>
        <p className="text-white/80 text-sm mt-1">Your rent payment timeline</p>
      </div>

      <div className="px-6 mt-6">
        {isLoading ? (
          <div className="glass-card rounded-2xl p-6 shadow-medium">
            <p className="text-center text-muted-foreground">Loading schedule...</p>
          </div>
        ) : !assignment || !property ? (
          <div className="glass-card rounded-2xl p-6 shadow-medium text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-2">No Active Rental</h3>
            <p className="text-sm text-muted-foreground">
              You don't have an active rental property yet.
            </p>
          </div>
        ) : (
          <>
            {nextPayment && (
              <div className="glass-card rounded-2xl p-4 shadow-medium mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Next Payment</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">{nextPayment.amount}</p>
                    <p className="text-xs text-muted-foreground">Due {nextPayment.dueDate}</p>
                  </div>
                  <div className={`glass-card px-3 py-2 rounded-full ${
                    daysUntilDue < 0 ? "bg-red-50" : "bg-orange-50"
                  }`}>
                    <p className={`text-xs font-medium ${
                      daysUntilDue < 0 ? "text-red-600" : "text-primary"
                    }`}>
                      {daysUntilDue < 0 
                        ? `${Math.abs(daysUntilDue)} days overdue`
                        : daysUntilDue === 0 
                          ? "Due today"
                          : `${daysUntilDue} days left`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {schedule.length === 0 ? (
                <div className="glass-card rounded-2xl p-6 shadow-medium text-center">
                  <p className="text-muted-foreground">No payment schedule available</p>
                </div>
              ) : (
                schedule.map((item, index) => (
                  <div key={index} className="glass-card rounded-2xl p-4 shadow-medium">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`glass-card p-2 rounded-full ${
                            item.status === "Paid" 
                              ? "bg-green-100" 
                              : item.status === "Pending"
                                ? "bg-red-100"
                                : "bg-orange-100"
                          }`}
                        >
                          {item.status === "Paid" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className={`h-4 w-4 ${
                              item.status === "Pending" ? "text-red-600" : "text-orange-600"
                            }`} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">{item.month}</p>
                          <p className="text-xs text-muted-foreground">{item.dueDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{item.amount}</p>
                        <div
                          className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${
                            item.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Pending"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {item.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Schedule;