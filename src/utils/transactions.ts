import { supabase } from "./supabase";

export type Transaction = {
  id: number;
  user_id: string;
  type: "income" | "expense";
  category: string;
  description?: string;
  amount: number;
  date: string;
};

export async function getTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

export async function addTransaction(t: Omit<Transaction, "id" | "user_id">) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("transactions").insert({
    ...t,
    user_id: user.id
  });

  if (error) throw error;
}

export async function deleteTransaction(id: number) {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
