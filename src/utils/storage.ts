import type { Transaction } from "../data";

function keyFor(userId: string) {
  return `ft:${userId}:transactions`;
}

export function loadTransactions(userId: string): Transaction[] {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Transaction[];
  } catch {
    return [];
  }
}

export function saveTransactions(userId: string, txs: Transaction[]) {
  localStorage.setItem(keyFor(userId), JSON.stringify(txs));
}

export function clearTransactions(userId: string) {
  localStorage.removeItem(keyFor(userId));
}
