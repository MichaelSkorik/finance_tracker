import React from "react";
import type { Transaction } from "../data";

interface Props {
  value: Transaction;
  onSave: (t: Transaction) => void;
  onCancel: () => void;
}

const TODAY = new Date().toISOString().split("T")[0];

type Errors = {
  amount?: string;
  date?: string;
  category?: string;
};

export default function EditTransactionForm({ value, onSave, onCancel }: Props) {
  const [type, setType] = React.useState<Transaction["type"]>(value.type);
  const [amount, setAmount] = React.useState(String(value.amount));
  const [category, setCategory] = React.useState(value.category);
  const [description, setDescription] = React.useState(value.description || "");
  const [date, setDate] = React.useState(value.date);
  const [errors, setErrors] = React.useState<Errors>({});

  const numericAmount = Number(amount);
  const normalizedAmount = Math.abs(numericAmount);

  function validate(): Errors {
    const next: Errors = {};
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
      (hasError
        ? "border-rose-500/70 ring-2 ring-rose-500/25"
        : "border-transparent focus:border-slate-500/60")
    );
  }

  function save() {
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    onSave({
      ...value,
      type,
      amount: normalizedAmount,
      category: category.trim(),
      description: description.trim(),
      date,
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Редактирование</h2>

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
        <input
          type="date"
          value={date}
          max={TODAY}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass(!!errors.date)}
        />
        {errors.date && <p className="text-xs text-rose-300">{errors.date}</p>}
      </div>

      <div className="space-y-1">
        <input
          type="text"
          placeholder="Категория"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass(!!errors.category)}
        />
        {errors.category && (
          <p className="text-xs text-rose-300">{errors.category}</p>
        )}
      </div>

      <textarea
        placeholder="Описание (необязательно)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white outline-none transition border border-transparent focus:border-slate-500/60"
      />

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-white"
        >
          Отмена
        </button>

        <button
          type="button"
          onClick={save}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-white font-medium"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
