//import React from "react";
import { calcBalance } from "../utils/balance";
import { formatMoney } from "../utils/format";
import { loadSettings } from "../utils/settings";
import { getCurrentUser } from "../utils/auth";
import type { Transaction } from "../data";

export default function SummaryCards({ transactions }: { transactions: Transaction[] }) {
  const user = getCurrentUser();
  if (!user) return null;

  const s = loadSettings(user.id);

  const income = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const balance = calcBalance(transactions);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card title="Баланс" value={formatMoney(balance, s.lang, s.currency)} />
      <Card title="Доходы" value={formatMoney(income, s.lang, s.currency)} color="text-emerald-400" />
      <Card title="Расходы" value={formatMoney(expense, s.lang, s.currency)} color="text-rose-400" />
    </section>
  );
}

function Card({ title, value, color = "" }: any) {
  return (
    <div className="rounded-xl bg-slate-800 p-4">
      <p className="text-xs text-slate-400">{title}</p>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}
