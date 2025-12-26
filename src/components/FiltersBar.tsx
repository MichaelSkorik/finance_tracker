export type TxTypeFilter = "all" | "income" | "expense";
export type SortBy = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";

export interface FiltersState {
  type: TxTypeFilter;
  category: string;
  sort: SortBy;
  dateFrom: string;
  dateTo: string;
}

interface FiltersBarProps {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
}

export default function FiltersBar({ value, onChange }: FiltersBarProps) {
  function set<K extends keyof FiltersState>(key: K, v: FiltersState[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="rounded-xl bg-slate-800 p-4 space-y-3">
      <div className="flex gap-2">
        {["all", "income", "expense"].map((t) => (
          <button
            key={t}
            onClick={() => set("type", t as TxTypeFilter)}
            className={`px-3 py-2 rounded-lg ${
              value.type === t
                ? "bg-slate-700 text-white"
                : "bg-slate-900/40 text-slate-300"
            }`}
          >
            {t === "all" ? "Все" : t === "income" ? "Доход" : "Расход"}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="date"
          value={value.dateFrom}
          onChange={(e) => set("dateFrom", e.target.value)}
          className="px-3 py-2 rounded bg-slate-700 text-white"
        />
        <input
          type="date"
          value={value.dateTo}
          onChange={(e) => set("dateTo", e.target.value)}
          className="px-3 py-2 rounded bg-slate-700 text-white"
        />
        <input
          placeholder="Категория"
          value={value.category}
          onChange={(e) => set("category", e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-slate-700 text-white"
        />
        <select
          value={value.sort}
          onChange={(e) => set("sort", e.target.value as SortBy)}
          className="px-3 py-2 rounded bg-slate-700 text-white"
        >
          <option value="date_desc">Дата: новые</option>
          <option value="date_asc">Дата: старые</option>
          <option value="amount_desc">Сумма: больше</option>
          <option value="amount_asc">Сумма: меньше</option>
        </select>
      </div>
    </div>
  );
}
