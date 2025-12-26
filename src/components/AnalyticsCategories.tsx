import type { Transaction } from "../data";

interface Props {
  transactions: Transaction[];
}

export default function AnalyticsCategories({ transactions }: Props) {
  const map: Record<string, number> = {};

  transactions.forEach((t) => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });

  return (
    <div className="rounded-xl bg-slate-800 p-4">
      <h3 className="font-semibold mb-3">По категориям</h3>
      <ul className="space-y-2">
        {Object.entries(map).map(([cat, sum]) => (
          <li key={cat} className="flex justify-between">
            <span>{cat}</span>
            <span className="font-medium">{sum.toLocaleString("ru-RU")} ₼</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
