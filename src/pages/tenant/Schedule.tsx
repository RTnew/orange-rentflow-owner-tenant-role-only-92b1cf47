import { ArrowLeft, Calendar, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const navigate = useNavigate();

  const schedule = [
    { month: "January 2025", dueDate: "Jan 1, 2025", amount: "$1,200", status: "Upcoming" },
    { month: "December 2024", dueDate: "Dec 1, 2024", amount: "$1,200", status: "Paid" },
    { month: "November 2024", dueDate: "Nov 1, 2024", amount: "$1,200", status: "Paid" },
    { month: "October 2024", dueDate: "Oct 1, 2024", amount: "$1,200", status: "Paid" },
  ];

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
        <div className="glass-card rounded-2xl p-4 shadow-medium mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Next Payment</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">$1,200</p>
              <p className="text-xs text-muted-foreground">Due January 1, 2025</p>
            </div>
            <div className="glass-card px-3 py-2 rounded-full bg-orange-50">
              <p className="text-xs font-medium text-primary">5 days left</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {schedule.map((item, index) => (
            <div key={index} className="glass-card rounded-2xl p-4 shadow-medium">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`glass-card p-2 rounded-full ${
                      item.status === "Paid" ? "bg-green-100" : "bg-orange-100"
                    }`}
                  >
                    {item.status === "Paid" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-orange-600" />
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
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
