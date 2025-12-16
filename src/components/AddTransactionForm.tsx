import React from "react";
import type { Transaction } from "../data";

interface AddTransactionFormProps {
  onSubmit: (t: Transaction) => { ok: boolean; error?: string };
  currentBalance: number;
}

const TODAY = new Date().toISOString().split("T")[0];

type FieldErrors = {
  amount?: string;
  date?: string;
  category?: string;
  common?: string;
};

export default function AddTransactionForm({
  onSubmit,
  currentBalance,
}: AddTransactionFormProps) {
  const [type, setType] = React.useState<"income" | "expense">("income");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState(TODAY);

  const [errors, setErrors] = React.useState<FieldErrors>({});

  const numericAmount = Number(amount);

  const isValid =
    category.trim().length > 0 &&
    !!date &&
    !Number.isNaN(numericAmount) &&
    numericAmount > 0 &&
    date <= TODAY &&
    (type !== "expense" || numericAmount <= currentBalance);

  function validate(): FieldErrors {
    const next: FieldErrors = {};

    if (!category.trim()) next.category = "Введите категорию";

    if (!date) next.date = "Выберите дату";
    else if (date > TODAY) next.date = "Дата не может быть позже сегодняшней";

    if (amount.trim().length === 0) next.amount = "Введите сумму";
    else if (Number.isNaN(numericAmount)) next.amount = "Сумма должна быть числом";
    else if (numericAmount <= 0) next.amount = "Сумма должна быть больше 0";
    else if (type === "expense" && numericAmount > currentBalance)
      next.amount = `Недостаточно средств. Доступно: ${currentBalance.toLocaleString("ru-RU")} ₼`;

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      amount: numericAmount,
      category: category.trim(),
      description: description.trim(),
      date,
    };

    const result = onSubmit(newTransaction);

    if (!result.ok) {
      setErrors({ common: result.error || "Ошибка" });
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
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <h2 className="text-xl font-semibold">Новая транзакция</h2>

      <div className="text-sm text-slate-300">
        Доступно:{" "}
        <span className="font-semibold">{currentBalance.toLocaleString("ru-RU")} ₼</span>
      </div>

      {errors.common && (
        <div className="rounded-lg bg-rose-500/15 border border-rose-500/40 px-3 py-2 text-rose-200 text-sm">
          {errors.common}
        </div>
      )}

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={type === "income"}
            onChange={() => {
              setType("income");
              setErrors({});
            }}
          />
          Доход
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={type === "expense"}
            onChange={() => {
              setType("expense");
              setErrors({});
            }}
          />
          Расход
        </label>
      </div>

      <div className="space-y-1">
        <input
          type="number"
          step="0.01"
          placeholder="Сумма"
          value={amount}
          onInvalid={(e) => e.preventDefault()}
          onChange={(e) => {
            setAmount(e.target.value);
            setErrors((p) => ({ ...p, amount: undefined, common: undefined }));
          }}
          className={inputClass(!!errors.amount)}
        />
        {errors.amount && <p className="text-xs text-rose-300">{errors.amount}</p>}
      </div>

      <div className="space-y-1">
        <input
          type="date"
          value={date}
          max={TODAY}
          onInvalid={(e) => e.preventDefault()}
          onChange={(e) => {
            setDate(e.target.value);
            setErrors((p) => ({ ...p, date: undefined, common: undefined }));
          }}
          className={inputClass(!!errors.date)}
        />
        {errors.date && <p className="text-xs text-rose-300">{errors.date}</p>}
      </div>

      <div className="space-y-1">
        <input
          type="text"
          placeholder="Категория"
          value={category}
          onInvalid={(e) => e.preventDefault()}
          onChange={(e) => {
            setCategory(e.target.value);
            setErrors((p) => ({ ...p, category: undefined, common: undefined }));
          }}
          className={inputClass(!!errors.category)}
        />
        {errors.category && <p className="text-xs text-rose-300">{errors.category}</p>}
      </div>

      <textarea
        placeholder="Описание (необязательно)"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setErrors((p) => ({ ...p, common: undefined }));
        }}
        className="w-full p-2 rounded bg-slate-700 text-white outline-none transition border border-transparent focus:border-slate-500/60"
      />

      <button
        type="submit"
        aria-disabled={!isValid}
        className={`w-full py-2 rounded-lg font-medium transition ${
          isValid
            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
            : "bg-slate-600 text-slate-300 cursor-not-allowed"
        }`}
      >
        Добавить
      </button>
    </form>
  );
}
