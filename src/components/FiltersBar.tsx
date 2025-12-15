import React from "react";

export type TxTypeFilter = "all" | "income" | "expense";
export type SortBy = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";

export interface FiltersState {
  type: TxTypeFilter;
  category: string;
  sort: SortBy;
  dateFrom: string; // "YYYY-MM-DD" или ""
  dateTo: string;   // "YYYY-MM-DD" или ""
}

interface FiltersBarProps {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
}

const DEFAULT_FILTERS: FiltersState = {
  type: "all",
  category: "",
  sort: "date_desc",
  dateFrom: "",
  dateTo: "",
};

export default function FiltersBar({ value, onChange }: FiltersBarProps) {
  // Универсальный setter для изменения одного поля в объекте фильтров
  function set<K extends keyof FiltersState>(key: K, v: FiltersState[K]) {
    onChange({ ...value, [key]: v });
  }

  // ✅ Сброс фильтров в значения по умолчанию
  function reset() {
    onChange(DEFAULT_FILTERS);
  }

  // ✅ Если пользователь выбрал dateFrom позже dateTo — автоматически подтягиваем dateTo к dateFrom
  function handleDateFromChange(nextFrom: string) {
    let next: FiltersState = { ...value, dateFrom: nextFrom };

    // Если обе даты заданы и from > to — исправляем to
    if (nextFrom && next.dateTo && nextFrom > next.dateTo) {
      next = { ...next, dateTo: nextFrom };
    }

    onChange(next);
  }

  // ✅ Если пользователь выбрал dateTo раньше dateFrom — автоматически подтягиваем dateFrom к dateTo
  function handleDateToChange(nextTo: string) {
    let next: FiltersState = { ...value, dateTo: nextTo };

    if (nextTo && next.dateFrom && next.dateFrom > nextTo) {
      next = { ...next, dateFrom: nextTo };
    }

    onChange(next);
  }

  return (
    <div className="rounded-xl bg-slate-800 p-4 flex flex-col gap-3">
      {/* 1-я строка: тип + кнопка сброса */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {[
            { label: "Все", v: "all" as const },
            { label: "Доход", v: "income" as const },
            { label: "Расход", v: "expense" as const },
          ].map((b) => (
            <button
              key={b.v}
              onClick={() => set("type", b.v)}
              className={
                "px-3 py-2 rounded-lg text-sm transition " +
                (value.type === b.v
                  ? "bg-slate-700 text-white"
                  : "bg-slate-900/40 text-slate-300 hover:bg-slate-700/60")
              }
            >
              {b.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={reset}
          className="px-3 py-2 rounded-lg text-sm bg-slate-700/60 hover:bg-slate-700 text-slate-100 transition w-full md:w-auto"
          title="Сбросить все фильтры"
        >
          Сбросить фильтры
        </button>
      </div>

      {/* 2-я строка: даты + поиск + сорт */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        {/* Дата от */}
        <input
          type="date"
          value={value.dateFrom}
          onChange={(e) => handleDateFromChange(e.target.value)}
          // ✅ не даём выбрать "от" позже "до"
          max={value.dateTo || undefined}
          className="w-full md:w-[180px] px-3 py-2 rounded-lg bg-slate-700 text-white"
        />

        {/* Дата до */}
        <input
          type="date"
          value={value.dateTo}
          onChange={(e) => handleDateToChange(e.target.value)}
          // ✅ не даём выбрать "до" раньше "от"
          min={value.dateFrom || undefined}
          className="w-full md:w-[180px] px-3 py-2 rounded-lg bg-slate-700 text-white"
        />

        {/* Категория */}
        <input
          type="text"
          placeholder="Категория (поиск)..."
          value={value.category}
          onChange={(e) => set("category", e.target.value)}
          className="w-full md:flex-1 px-3 py-2 rounded-lg bg-slate-700 text-white"
        />

        {/* Сортировка */}
        <div className="relative w-full md:w-auto">
          <select
            value={value.sort}
            onChange={(e) => set("sort", e.target.value as SortBy)}
            className="appearance-none w-full px-3 py-2 pr-8 rounded-lg bg-slate-700 text-white cursor-pointer"
          >
            <option value="date_desc">Дата: новые</option>
            <option value="date_asc">Дата: старые</option>
            <option value="amount_desc">Сумма: больше</option>
            <option value="amount_asc">Сумма: меньше</option>
          </select>

          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 text-xs">
            ▼
          </span>
        </div>
      </div>
    </div>
  );
}
