//import React from "react";

export type TxTypeFilter = "all" | "income" | "expense";
export type SortBy = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";

export interface FiltersState {
  type: TxTypeFilter;
  from: string;   
  to: string;     
  query: string;  
  sort: SortBy;
}

interface FiltersBarProps {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
}

const TODAY = new Date().toISOString().split("T")[0];

export default function FiltersBar({ value, onChange }: FiltersBarProps) {
  function set<K extends keyof FiltersState>(key: K, v: FiltersState[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="rounded-xl bg-slate-800 p-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
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

      <div className="flex gap-2">
        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-1">От</label>
          <input
            type="date"
            value={value.from}
            max={TODAY}
            onChange={(e) => set("from", e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-700 text-white"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-1">До</label>
          <input
            type="date"
            value={value.to}
            max={TODAY}
            onChange={(e) => set("to", e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-700 text-white"
          />
        </div>
      </div>

      <div className="flex gap-2 md:min-w-[420px]">
        <input
          type="text"
          placeholder="Поиск: категория или описание..."
          value={value.query}
          onChange={(e) => set("query", e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-slate-700 text-white"
        />

        <select
          value={value.sort}
          onChange={(e) => set("sort", e.target.value as FiltersState["sort"])}
          className="px-3 py-2 rounded-lg bg-slate-700 text-white"
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
