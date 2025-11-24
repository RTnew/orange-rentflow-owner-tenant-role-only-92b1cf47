import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Finance = () => {
  const navigate = useNavigate();

  const transactions = [
    { id: 1, type: "income", description: "Rent - Apartment 101", amount: 1200, date: "Jan 1, 2025" },
    { id: 2, type: "expense", description: "Maintenance - Apt 205", amount: 150, date: "Jan 3, 2025" },
    { id: 3, type: "income", description: "Rent - Apartment 205", amount: 1500, date: "Jan 5, 2025" },
    { id: 4, type: "expense", description: "Cleaning Service", amount: 80, date: "Jan 7, 2025" },
  ];

  const totalIncome = 2700;
  const totalExpenses = 230;
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted pb-20">
      <div className="gradient-primary p-6 text-white rounded-b-[3rem]">
        <button onClick={() => navigate("/owner/dashboard")} className="mb-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Finance Overview</h1>
        <p className="text-white/80 text-sm mt-1">Track your income & expenses</p>
      </div>

      <div className="px-6 mt-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card rounded-2xl p-4 shadow-soft">
            <TrendingUp className="h-5 w-5 text-green-500 mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Income</p>
            <p className="text-lg font-bold text-green-600">${totalIncome}</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-soft">
            <TrendingDown className="h-5 w-5 text-red-500 mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Expenses</p>
            <p className="text-lg font-bold text-red-600">${totalExpenses}</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-soft">
            <DollarSign className="h-5 w-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Profit</p>
            <p className="text-lg font-bold text-primary">${netProfit}</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="glass-card rounded-2xl p-4 shadow-medium"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`glass-card p-2 rounded-full ${
                        transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <Receipt
                        className={`h-4 w-4 ${
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <p
                    className={`font-bold ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
