import type { Transaction } from "../data";

interface Props {
  transactions: Transaction[];
}

export default function AnalyticsChart({ transactions }: Props) {
  const grouped: Record<string, number> = {};

  transactions.forEach((t) => {
    const v = t.type === "income" ? t.amount : -t.amount;
    grouped[t.date] = (grouped[t.date] || 0) + v;
  });

  const points = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="rounded-xl bg-slate-800 p-4">
      <h3 className="font-semibold mb-3">Динамика</h3>
      <div className="flex gap-2 items-end h-40">
        {points.map(([d, v]) => (
          <div key={d} className="flex-1 flex flex-col items-center">
            <div
              className={`w-6 rounded ${
                v >= 0 ? "bg-emerald-500" : "bg-rose-500"
              }`}
              style={{ height: Math.min(Math.abs(v) / 10, 160) }}
            />
            <span className="text-[10px] mt-1 text-slate-400">{d.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
