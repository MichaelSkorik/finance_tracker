export default function SummaryCards({
  income,
  expense
}: {
  income: number;
  expense: number;
}) {
  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Баланс" value={balance} />
      <Card title="Доходы" value={income} green />
      <Card title="Расходы" value={-expense} red />
    </div>
  );
}

function Card({
  title,
  value,
  green,
  red
}: any) {
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p
        className={`text-2xl font-semibold mt-2 ${
          green ? "text-emerald-400" :
          red ? "text-rose-400" :
          "text-white"
        }`}
      >
        {value > 0 ? "+" : ""}
        {value.toLocaleString()} ₼
      </p>
    </div>
  );
}
