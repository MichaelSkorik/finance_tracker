import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { type Transaction, calcBalance, calcExpense, calcIncome } from "../utils/balance";
import { formatMoney } from "../utils/format";

export default function HomePage() {
  const [tx, setTx] = useState<Transaction[]>([]);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);

  async function load() {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    setTx(data || []);
  }

  async function add() {
    await supabase.from("transactions").insert({
      type,
      category,
      amount: Number(amount),
    });
    setCategory("");
    setAmount(0);
    load();
  }

  async function remove(id: string) {
    await supabase.from("transactions").delete().eq("id", id);
    load();
  }

  useEffect(() => { load(); }, []);

  const income = calcIncome(tx);
  const expense = calcExpense(tx);
  const balance = calcBalance(tx);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Персональный финансовый трекер</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <div className="label">Баланс</div>
          <div className="value">{formatMoney(balance, "AZN")}</div>
        </div>
        <div className="card">
          <div className="label">Доходы</div>
          <div className="value text-green-400">
            {formatMoney(income, "AZN")}
          </div>
        </div>
        <div className="card">
          <div className="label">Расходы</div>
          <div className="value text-red-400">
            {formatMoney(expense, "AZN")}
          </div>
        </div>
      </div>

      {/* ADD */}
      <div className="panel flex gap-2">
        <select
          value={type}
          onChange={e => setType(e.target.value as any)}
          className="input"
        >
          <option value="expense">Расход</option>
          <option value="income">Доход</option>
        </select>

        <input
          className="input flex-1"
          placeholder="Категория"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />

        <input
          type="number"
          className="input w-32"
          value={amount}
          onChange={e => setAmount(+e.target.value)}
        />

        <button className="btn" onClick={add}>
          Добавить
        </button>
      </div>

      {/* TABLE */}
      <div className="panel">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400">
              <th>Дата</th>
              <th>Тип</th>
              <th>Категория</th>
              <th>Описание</th>
              <th>Сумма</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tx.map(t => (
              <tr key={t.id} className="border-t border-slate-700">
                <td>{new Date(t.created_at).toLocaleDateString()}</td>
                <td>{t.type === "income" ? "Доход" : "Расход"}</td>
                <td>{t.category}</td>
                <td>—</td>
                <td className={t.type === "income" ? "text-green-400" : "text-red-400"}>
                  {t.type === "income" ? "+" : "-"}
                  {t.amount}
                </td>
                <td>
                  <button
                    onClick={() => remove(t.id)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
