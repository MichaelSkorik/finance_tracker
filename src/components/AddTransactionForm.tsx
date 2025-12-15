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

  // Общая ошибка (например, из App.tsx)
  const [error, setError] = React.useState<string>("");

  // Ошибки по конкретным полям
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  // Валидация для disable кнопки
  const numericAmount = Number(amount);

  const isValid =
    !!category &&
    !!date &&
    !Number.isNaN(numericAmount) &&
    numericAmount > 0 &&
    date <= TODAY &&
    (type !== "expense" || numericAmount <= currentBalance);

  function clearAllErrors() {
    setError("");
    setFieldErrors({});
  }

  // Удобный helper: добавляет красную рамку, если у поля есть ошибка
  function inputClass(hasError: boolean) {
    return (
      "w-full p-2 rounded text-white bg-slate-700 outline-none transition " +
      (hasError
        ? "border border-rose-500/70 ring-2 ring-rose-500/25"
        : "border border-transparent focus:border-slate-500/60")
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const nextErrors: FieldErrors = {};

    // Категория
    if (!category.trim()) {
      nextErrors.category = "Введите категорию.";
    }

    // Дата
    if (!date) {
      nextErrors.date = "Выберите дату.";
    } else if (date > TODAY) {
      nextErrors.date = "Дата не может быть позже сегодняшнего дня.";
    }

    // Сумма
    if (Number.isNaN(numericAmount)) {
      nextErrors.amount = "Введите число.";
    } else if (numericAmount <= 0) {
      nextErrors.amount = "Сумма должна быть больше нуля.";
    } else if (type === "expense" && numericAmount > currentBalance) {
      nextErrors.amount = `Недостаточно средств. Доступно: ${currentBalance.toLocaleString(
        "ru-RU"
      )} ₼`;
    }

    // Если есть хотя бы одна ошибка — показываем и не отправляем
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
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
      setError(result.error ?? "Не удалось добавить транзакцию.");
      return;
    }

    // Очистка формы
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(TODAY);
    setType("income");
    clearAllErrors();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Новая транзакция</h2>

      {/* Баланс */}
      <div className="text-sm text-slate-300">
        Доступно:{" "}
        <span className="font-semibold">
          {currentBalance.toLocaleString("ru-RU")} ₼
        </span>
      </div>

      {/* Общая ошибка */}
      {error && (
        <div className="rounded-lg bg-rose-500/15 border border-rose-500/40 px-3 py-2 text-rose-200 text-sm">
          {error}
        </div>
      )}

      {/* Тип */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={type === "income"}
            onChange={() => {
              setType("income");
              clearAllErrors();
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
              clearAllErrors();
            }}
          />
          Расход
        </label>
      </div>

      {/* Сумма */}
      <div className="space-y-1">
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError("");
            setFieldErrors((p) => ({ ...p, amount: undefined }));
          }}
          className={inputClass(!!fieldErrors.amount)}
        />
        {fieldErrors.amount && (
          <p className="text-xs text-rose-300">{fieldErrors.amount}</p>
        )}
      </div>

      {/* Дата */}
      <div className="space-y-1">
        <input
          type="date"
          value={date}
          max={TODAY}
          onChange={(e) => {
            setDate(e.target.value);
            setError("");
            setFieldErrors((p) => ({ ...p, date: undefined }));
          }}
          className={inputClass(!!fieldErrors.date)}
        />
        {fieldErrors.date && (
          <p className="text-xs text-rose-300">{fieldErrors.date}</p>
        )}
      </div>

      {/* Категория */}
      <div className="space-y-1">
        <input
          type="text"
          placeholder="Категория"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setError("");
            setFieldErrors((p) => ({ ...p, category: undefined }));
          }}
          className={inputClass(!!fieldErrors.category)}
        />
        {fieldErrors.category && (
          <p className="text-xs text-rose-300">{fieldErrors.category}</p>
        )}
      </div>

      {/* Описание */}
      <textarea
        placeholder="Описание (необязательно)"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setError("");
        }}
        className="w-full p-2 rounded bg-slate-700 text-white border border-transparent focus:border-slate-500/60 outline-none transition"
      />

      {/* Кнопка */}
      <button
        type="submit"
        disabled={!isValid}
        className={`
          w-full py-2 rounded-lg font-medium transition
          ${
            isValid
              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
              : "bg-slate-600 text-slate-300 cursor-not-allowed"
          }
        `}
      >
        Добавить
      </button>
    </form>
  );
}
