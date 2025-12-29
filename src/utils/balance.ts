import type { Transaction } from "../data";

export function calcBalance(transactions: Transaction[]) {
  return transactions.reduce(
    (sum, t) => sum + (t.type === "income" ? t.amount : -t.amount),
    0
  );
}

export function calculateBalanceTimeline(transactions: Transaction[]) {
  let balance = 0;
  return [...transactions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => {
      balance += t.type === "income" ? t.amount : -t.amount;
      return { date: t.date, balance };
    });
}
