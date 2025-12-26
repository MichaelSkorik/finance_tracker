import React from "react";
import FiltersBar, { type FiltersState } from "../components/FiltersBar";
import Analytics from "../components/Analytics";
import AnalyticsPie from "../components/AnalyticsPie";
import AnalyticsBalanceChart from "../components/AnalyticsBalanceChart";
import type { Transaction } from "../data";

export default function AnalyticsPage({ transactions }: { transactions: Transaction[] }) {
  const [filters, setFilters] = React.useState<FiltersState>({
    type: "all",
    category: "",
    sort: "date_desc",
    dateFrom: "",
    dateTo: "",
  });

  const visible = React.useMemo(() => {
    let list = [...transactions];

    if (filters.type !== "all") list = list.filter((t) => t.type === filters.type);
    if (filters.category) list = list.filter((t) => t.category.toLowerCase().includes(filters.category.toLowerCase()));
    if (filters.dateFrom) list = list.filter((t) => t.date >= filters.dateFrom);
    if (filters.dateTo) list = list.filter((t) => t.date <= filters.dateTo);

    return list;
  }, [transactions, filters]);

  return (
    <div className="space-y-6">
      <FiltersBar value={filters} onChange={setFilters} />

      <Analytics transactions={visible} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalyticsPie transactions={visible} />
        <AnalyticsBalanceChart transactions={visible} />
      </div>
    </div>
  );
}
  