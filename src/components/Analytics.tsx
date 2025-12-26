import type { Transaction } from "../data";
import { signedAmount } from "../data";

interface Props {
  transactions: Transaction[];
}

export default function Analytics({ transactions }: Props) {
  let income = 0;
  let expense = 0;

  const byCategory: Record<string, number> = {};

  for (const t of transactions) {
    const v = signedAmount(t);
    if (v > 0) income += v;
    else {
      expense += Math.abs(v);
      byCategory[t.category] =
        (byCategory[t.category] || 0) + Math.abs(v);
    }
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="text-slate-400 text-sm">Доход</p>
          <p className="text-xl text-emerald-400">
            +{income.toLocaleString("ru-RU")} ₼
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <p className="text-slate-400 text-sm">Расход</p>
          <p className="text-xl text-rose-400">
            -{expense.toLocaleString("ru-RU")} ₼
          </p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="mb-3 font-semibold">По категориям</h3>
        <ul className="space-y-2 text-sm">
          {Object.entries(byCategory).map(([cat, sum]) => (
            <li key={cat} className="flex justify-between">
              <span>{cat}</span>
              <span>{sum.toLocaleString("ru-RU")} ₼</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
