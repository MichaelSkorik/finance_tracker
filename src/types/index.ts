export type Transaction = {
  id: string;
  user_id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  note?: string;
  created_at: string;
};
