//import React from "react";
import type { Transaction } from "../data";

interface SummaryCardsProps {
  transactions: Transaction[];
}

function calculateSummary(transactions: Transaction[]) {

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  return { income, expense, balance };
}

export default function SummaryCards({ transactions }: SummaryCardsProps) {
  const { income, expense, balance } = calculateSummary(transactions);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="rounded-xl bg-slate-800/80 px-4 py-3">
        <p className="text-xs text-slate-400">Баланс</p>
        <p className="mt-2 text-2xl font-semibold">
          {balance.toLocaleString("ru-RU")} ₼
        </p>
      </div>

      <div className="rounded-xl bg-slate-800/80 px-4 py-3">
        <p className="text-xs text-slate-400">Доходы</p>
        <p className="mt-2 text-2xl font-semibold text-emerald-400">
          +{income.toLocaleString("ru-RU")} ₼
        </p>
      </div>

      <div className="rounded-xl bg-slate-800/80 px-4 py-3">
        <p className="text-xs text-slate-400">Расходы</p>
        <p className="mt-2 text-2xl font-semibold text-rose-400">
          -{expense.toLocaleString("ru-RU")} ₼
        </p>
      </div>
    </section>
  );
}
