export default function FiltersBar({
  type,
  setType,
  category,
  setCategory
}: any) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
      {["all", "income", "expense"].map(t => (
        <button
          key={t}
          onClick={() => setType(t)}
          className={`px-3 py-1 rounded-lg text-sm ${
            type === t ? "bg-slate-700 text-white" : "text-slate-400"
          }`}
        >
          {t === "all" ? "Все" : t === "income" ? "Доход" : "Расход"}
        </button>
      ))}

      <input
        placeholder="Категория (поиск...)"
        className="bg-slate-700 text-white rounded-lg px-3 py-1"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />
    </div>
  );
}
