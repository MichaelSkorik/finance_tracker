// src/components/AnalyticsPie.tsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Transaction } from "../data";
import { normalizeTransaction } from "../data";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#a855f7", "#22c55e", "#38bdf8"];

export default function AnalyticsPie({ transactions }: { transactions: Transaction[] }) {
  const data = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const raw of transactions) {
      const t = normalizeTransaction(raw);
      if (t.type !== "expense") continue; // ONLY expenses
      const prev = map.get(t.category) || 0;
      map.set(t.category, prev + t.amount);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="bg-slate-800 rounded-xl p-4" style={{ height: 320 }}>
      <h3 className="mb-2 font-semibold">Расходы по категориям</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={120} label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
