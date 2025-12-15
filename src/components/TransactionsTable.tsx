import type { Transaction } from "../data";

interface TransactionsTableProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

export default function TransactionsTable({
  transactions,
  onDelete,
}: TransactionsTableProps) {
  return (
    <div className="rounded-xl bg-slate-800 overflow-hidden">
      <table className="w-full text-sm table-fixed">
        <thead className="border-b border-slate-700 text-slate-300">
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
            <tr
              key={t.id}
              className="border-b border-slate-700 last:border-none hover:bg-slate-700/40 transition"
            >
              <td className="px-4 py-3 whitespace-nowrap text-center">
                {formatDate(t.date)}
              </td>

              <td className="px-4 py-3 text-center">
                {t.type === "income" ? "Доход" : "Расход"}
              </td>

              <td className="px-4 py-3 text-center">{t.category}</td>

              <td className="px-4 py-3 text-slate-400 text-center">
                {t.description || "—"}
              </td>

              <td className="px-4 py-3 text-center font-medium">
                <span
                  className={
                    t.type === "expense"
                      ? "text-red-500"
                      : "text-emerald-400"
                  }
                >
                  {t.type === "expense" ? "-" : "+"}
                  {t.amount.toFixed(2)}
                </span>
              </td>

              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-red-500 hover:text-red-400 text-lg font-bold transition"
                  title="Удалить"
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}

          {transactions.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-6 text-center text-slate-400"
              >
                Транзакций пока нет
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
