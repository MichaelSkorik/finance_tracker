import { type Transaction } from "../utils/transactions";

export default function TransactionsTable({
  items,
  onDelete
}: {
  items: Transaction[];
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="p-3 text-left">Дата</th>
            <th>Тип</th>
            <th>Категория</th>
            <th>Описание</th>
            <th className="text-right">Сумма</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(t => (
            <tr key={t.id} className="border-t border-slate-700">
              <td className="p-3">{t.date}</td>
              <td>{t.type === "income" ? "Доход" : "Расход"}</td>
              <td>{t.category}</td>
              <td>{t.description || "—"}</td>
              <td
                className={`text-right ${
                  t.type === "income" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {t.type === "income" ? "+" : "-"}
                {t.amount}
              </td>
              <td className="text-center">
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-rose-400 hover:text-rose-500"
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
