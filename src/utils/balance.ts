export type Transaction = {
  id: string;
  user_id: string;
  type: "income" | "expense";
  category: string;
  description?: string;
  amount: number;
  created_at: string;
};

export function calcIncome(tx: Transaction[]) {
  return tx.filter(t => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
}

export function calcExpense(tx: Transaction[]) {
  return tx.filter(t => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
}

export function calcBalance(tx: Transaction[]) {
  return calcIncome(tx) - calcExpense(tx);
}
