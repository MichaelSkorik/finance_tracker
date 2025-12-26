import React from "react";
import type { Transaction } from "../data";

interface AddTransactionFormProps {
  onSubmit: (t: Transaction) => { ok: boolean; error?: string };
  currentBalance: number; // только для UI
}

const TODAY = new Date().toISOString().split("T")[0];

type FieldErrors = {
  amount?: string;
  date?: string;
  category?: string;
  common?: string;
};

export default function AddTransactionForm({ onSubmit, currentBalance }: AddTransactionFormProps) {
  const [type, setType] = React.useState<"income" | "expense">("income");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState(TODAY);
  const [errors, setErrors] = React.useState<FieldErrors>({});

  const numericAmount = Number(amount);
  const normalizedAmount = Math.abs(numericAmount);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!category.trim()) next.category = "Введите категорию";

    if (!date) next.date = "Выберите дату";
    else if (date > TODAY) next.date = "Дата не может быть позже сегодняшней";

    if (!amount.trim()) next.amount = "Введите сумму";
    else if (Number.isNaN(numericAmount)) next.amount = "Сумма должна быть числом";
    else if (normalizedAmount <= 0) next.amount = "Значение должно быть больше 0";

    return next;
  }

  function inputClass(hasError: boolean) {
    return (
      "w-full p-2 rounded bg-slate-700 text-white outline-none transition border " +
      (hasError ? "border-rose-500/70 ring-2 ring-rose-500/25" : "border-transparent focus:border-slate-500/60")
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const tx: Transaction = {
      id: Date.now(),
      type,
      amount: normalizedAmount,
      category: category.trim(),
      description: description.trim(),
      date,
    };

    const result = onSubmit(tx);
    if (!result.ok) {
      setErrors({ common: result.error || "Ошибка добавления транзакции" });
      return;
    }

    setAmount("");
    setCategory("");
    setDescription("");
    setDate(TODAY);
    setType("income");
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Новая транзакция</h2>

      <div className="text-sm text-slate-300">
        Текущий баланс: <span className="font-semibold">{currentBalance.toLocaleString("ru-RU")} ₼</span>
      </div>

      {errors.common && (
        <div className="rounded-lg bg-rose-500/15 border border-rose-500/40 px-3 py-2 text-rose-200 text-sm">
          {errors.common}
        </div>
      )}

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="radio" checked={type === "income"} onChange={() => setType("income")} />
          Доход
        </label>

        <label className="flex items-center gap-2">
          <input type="radio" checked={type === "expense"} onChange={() => setType("expense")} />
          Расход
        </label>
      </div>

      <div className="space-y-1">
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass(!!errors.amount)}
        />
        {errors.amount && <p className="text-xs text-rose-300">{errors.amount}</p>}
      </div>

      <div className="space-y-1">
        <input type="date" value={date} max={TODAY} onChange={(e) => setDate(e.target.value)} className={inputClass(!!errors.date)} />
        {errors.date && <p className="text-xs text-rose-300">{errors.date}</p>}
      </div>

      <div className="space-y-1">
        <input type="text" placeholder="Категория" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass(!!errors.category)} />
        {errors.category && <p className="text-xs text-rose-300">{errors.category}</p>}
      </div>

      <textarea
        placeholder="Описание (необязательно)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white outline-none transition border border-transparent focus:border-slate-500/60"
      />

      <button type="submit" className="w-full py-2 rounded-lg font-medium transition bg-emerald-600 hover:bg-emerald-500 text-white">
        Добавить
      </button>
    </form>
  );
}
