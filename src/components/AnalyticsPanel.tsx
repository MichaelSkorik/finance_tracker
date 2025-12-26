import type { Transaction } from "../data";

interface AnalyticsPanelProps {
  transactions: Transaction[];
}

export default function AnalyticsPanel({ transactions }: AnalyticsPanelProps) {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const byCategory = transactions
    .filter(t => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topCategories = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <section className="rounded-xl bg-slate-800 p-4 space-y-4">
      <h2 className="text-lg font-semibold">Аналитика</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg bg-slate-700 p-4">
          <p className="text-sm text-slate-400">Доходы</p>
          <p className="text-2xl font-semibold text-emerald-400">
            +{income.toLocaleString("ru-RU")} ₼
          </p>
        </div>

        <div className="rounded-lg bg-slate-700 p-4">
          <p className="text-sm text-slate-400">Расходы</p>
          <p className="text-2xl font-semibold text-rose-400">
            -{expense.toLocaleString("ru-RU")} ₼
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-300 mb-2">Топ категорий расходов</p>

        {topCategories.length === 0 && (
          <p className="text-sm text-slate-400">Нет данных</p>
        )}

        <ul className="space-y-2">
          {topCategories.map(([cat, sum]) => (
            <li
              key={cat}
              className="flex justify-between rounded bg-slate-700 px-3 py-2 text-sm"
            >
              <span>{cat}</span>
              <span className="text-rose-300">
                -{sum.toLocaleString("ru-RU")} ₼
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
