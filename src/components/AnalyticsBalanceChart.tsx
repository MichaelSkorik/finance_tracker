import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Transaction } from "../data";
import { calculateBalanceTimeline } from "../utils/balance";

export default function AnalyticsBalanceChart({ transactions }: { transactions: Transaction[] }) {
  const data = React.useMemo(() => calculateBalanceTimeline(transactions), [transactions]);

  return (
    <div className="bg-slate-800 rounded-xl p-4" style={{ height: 320 }}>
      <h3 className="mb-2 font-semibold">Баланс во времени</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="balance" stroke="#22c55e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
