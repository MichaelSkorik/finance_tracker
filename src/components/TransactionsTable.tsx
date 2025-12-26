import type { Transaction } from "../data";

interface TransactionsTableProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onEdit: (t: Transaction) => void;
}

function formatDate(date: string) {
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}

export default function TransactionsTable({
  transactions,
  onDelete,
  onEdit,
}: TransactionsTableProps) {
  return (
    <div className="rounded-xl bg-slate-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-700">
          <tr>
            <th className="px-4 py-3 text-center">Дата</th>
            <th className="px-4 py-3 text-center">Тип</th>
            <th className="px-4 py-3 text-center">Категория</th>
            <th className="px-4 py-3 text-center">Описание</th>
            <th className="px-4 py-3 text-center">Сумма</th>
            <th className="px-4 py-3 text-center">Действия</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b border-slate-700">
              <td className="px-4 py-3 text-center">{formatDate(t.date)}</td>
              <td className="px-4 py-3 text-center">
                {t.type === "income" ? "Доход" : "Расход"}
              </td>
              <td className="px-4 py-3 text-center">{t.category}</td>
              <td className="px-4 py-3 text-center text-slate-400">
                {t.description || "—"}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={
                    t.type === "expense"
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }
                >
                  {t.type === "expense" ? "-" : "+"}
                  {t.amount.toFixed(2)}
                </span>
              </td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(t)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  ✎
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-rose-400 hover:text-rose-300"
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
