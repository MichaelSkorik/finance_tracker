import type { Transaction } from "../data";
import { signedAmount } from "../data";

export function calculateBalanceTimeline(
  transactions: Transaction[]
): { date: string; balance: number }[] {
  const sorted = [...transactions].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  let balance = 0;

  return sorted.map((t) => {
    balance += signedAmount(t);
    return { date: t.date, balance };
  });
}

export function calcBalance(transactions: Transaction[]) {
  let b = 0;
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  for (const t of sorted) b += signedAmount(t);
  return b;
}
