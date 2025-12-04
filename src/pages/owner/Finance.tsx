import { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Receipt, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

const Finance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    property_id: "",
    expense_date: format(new Date(), "yyyy-MM-dd"),
  });

  // Fetch properties for the dropdown
  const { data: properties } = useQuery({
    queryKey: ["owner-properties", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("id, name")
        .eq("owner_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch expenses
  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["owner-expenses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*, properties(name)")
        .eq("owner_id", user?.id)
        .order("expense_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Calculate total income from properties (rent amounts)
  const { data: totalIncome } = useQuery({
    queryKey: ["owner-income", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("rent_amount")
        .eq("owner_id", user?.id)
        .eq("status", "occupied");
      if (error) throw error;
      return data?.reduce((sum, p) => sum + (p.rent_amount || 0), 0) || 0;
    },
    enabled: !!user?.id,
  });

  // Calculate total expenses
  const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const netProfit = (totalIncome || 0) - totalExpenses;

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("expenses").insert({
        owner_id: user?.id,
        property_id: newExpense.property_id || null,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        expense_date: newExpense.expense_date,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-expenses"] });
      setShowAddExpense(false);
      setNewExpense({ description: "", amount: "", property_id: "", expense_date: format(new Date(), "yyyy-MM-dd") });
      toast.success("Expense added successfully!");
    },
    onError: (error) => {
      toast.error("Failed to add expense");
      console.error(error);
    },
  });

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    addExpenseMutation.mutate();
  };

  // Combine income and expenses for transactions list
  const transactions = expenses?.map((e) => ({
    id: e.id,
    type: "expense" as const,
    description: e.description,
    amount: Number(e.amount),
    date: e.expense_date,
    property: e.properties?.name,
  })) || [];

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
            <p className="text-xs text-muted-foreground mb-1">Monthly Income</p>
            <p className="text-lg font-bold text-green-600">₹{(totalIncome || 0).toLocaleString()}</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-soft">
            <TrendingDown className="h-5 w-5 text-red-500 mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Expenses</p>
            <p className="text-lg font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-soft">
            <DollarSign className="h-5 w-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Profit</p>
            <p className={`text-lg font-bold ${netProfit >= 0 ? "text-primary" : "text-red-600"}`}>
              ₹{netProfit.toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Expenses</h2>
            <Button onClick={() => setShowAddExpense(true)} size="sm" className="rounded-full shadow-medium">
              <Plus className="h-4 w-4 mr-1" />
              Add Expense
            </Button>
          </div>
          <div className="space-y-3">
            {expensesLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card rounded-2xl p-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </>
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="glass-card rounded-2xl p-4 shadow-medium">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="glass-card p-2 rounded-full bg-red-100">
                        <Receipt className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.property && `${transaction.property} • `}
                          {format(new Date(transaction.date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-red-600">-₹{transaction.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Receipt className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">No expenses recorded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="e.g., Maintenance, Repairs"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property">Property (Optional)</Label>
              <Select
                value={newExpense.property_id}
                onValueChange={(value) => setNewExpense({ ...newExpense, property_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties?.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.expense_date}
                onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
              />
            </div>
            <Button
              onClick={handleAddExpense}
              className="w-full"
              disabled={addExpenseMutation.isPending}
            >
              {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Finance;