import React from "react";
export default function AddTransactionForm({ onAdd }: any) {
  const [type, setType] = React.useState("expense");
  const [category, setCategory] = React.useState("");
  const [amount, setAmount] = React.useState(0);

  return (
    <div className="bg-slate-800 p-4 rounded-xl flex gap-2">
      <select
        className="bg-slate-700 rounded px-2"
        value={type}
        onChange={e => setType(e.target.value)}
      >
        <option value="expense">Расход</option>
        <option value="income">Доход</option>
      </select>

      <input
        placeholder="Категория"
        className="bg-slate-700 rounded px-2"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />

      <input
        type="number"
        className="bg-slate-700 rounded px-2 w-32"
        value={amount}
        onChange={e => setAmount(+e.target.value)}
      />

      <button
        onClick={() =>
          onAdd({
            type,
            category,
            amount,
            date: new Date().toISOString().slice(0, 10)
          })
        }
        className="bg-emerald-500 text-black px-3 rounded"
      >
        Добавить
      </button>
    </div>
  );
}
