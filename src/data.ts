export type TxType = "income" | "expense";

export type Transaction = {
  id: number;
  type: TxType;
  amount: number; 
  category: string;
  description?: string;
  date: string; 
};

export function normalizeTransaction(t: Transaction): Transaction {
  return { ...t, amount: Math.abs(Number(t.amount) || 0) };
}

export function signedAmount(t: Transaction): number {
  const a = Math.abs(Number(t.amount) || 0);
  return t.type === "income" ? a : -a;
}

export function calcBalance(transactions: Transaction[]): number {
  let b = 0;
  for (const raw of transactions) {
    const t = normalizeTransaction(raw);
    b += signedAmount(t);
  }
  return b;
}
