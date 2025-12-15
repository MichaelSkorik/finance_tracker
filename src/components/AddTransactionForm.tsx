import React from "react";
import type { Transaction } from "../data";

interface AddTransactionFormProps {
  onSubmit: (t: Transaction) => void;
}

const TODAY = new Date().toISOString().split("T")[0];

export default function AddTransactionForm({ onSubmit }: AddTransactionFormProps) {
  const [type, setType] = React.useState<"income" | "expense">("income");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState(TODAY);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (!date || !category) return;

    if (Number.isNaN(numericAmount)) return;

    if (numericAmount <= 0) return;

    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      amount: numericAmount,
      category,
      description,
      date,
    };
    if (date > TODAY) {
      alert("Дата не может быть позже сегодняшнего дня");
      return;
    }

    onSubmit(newTransaction);

    setAmount("");
    setCategory("");
    setDescription("");
    setDate(TODAY);
    setType("income");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Новая транзакция</h2>

      {/* Тип */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={type === "income"}
            onChange={() => setType("income")}
          />
          Доход
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={type === "expense"}
            onChange={() => setType("expense")}
          />
          Расход
        </label>
      </div>

      {/* Сумма */}
      <input
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Сумма"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white"
      />

      {/* Дата */}
      <input
        type="date"
        value={date}
        max={TODAY}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white"
      />

      {/* Категория */}
      <input
        type="text"
        placeholder="Категория"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white"
      />

      {/* Описание */}
      <textarea
        placeholder="Описание (необязательно)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white"
      />

      <button
        type="submit"
        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium"
      >
        Добавить
      </button>
    </form>
  );
}
