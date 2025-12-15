import React from "react";

import Layout from "./components/Layout";
import SummaryCards from "./components/SummaryCards";
import TransactionsTable from "./components/TransactionsTable";
import Modal from "./components/Modal";
import AddTransactionForm from "./components/AddTransactionForm";

import FiltersBar, { type FiltersState } from "./components/FiltersBar";


import { mockTransactions, type Transaction } from "./data";

const STORAGE_KEY = "finance-tracker-transactions";

export default function App() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        return JSON.parse(saved) as Transaction[];
      } catch (err) {
        console.warn("Ошибка чтения localStorage, использую mockTransactions", err);
      }
    }

    return mockTransactions;
  });

  const [filters, setFilters] = React.useState<FiltersState>({
    type: "all",
    from: "",
    to: "",
    query: "",
    sort: "date_desc",
  });


  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction(t: Transaction) {
    setTransactions((prev) => [t, ...prev]);
    setIsModalOpen(false);
  }

  function deleteTransaction(id: number) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const visibleTransactions = React.useMemo(() => {
    let list = [...transactions];

    if (filters.type !== "all") {
      list = list.filter((t) => t.type === filters.type);
    }

    if (filters.from) {
      list = list.filter((t) => t.date >= filters.from);
    }
    if (filters.to) {
      list = list.filter((t) => t.date <= filters.to);
    }

    const q = filters.query.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => {
        const cat = t.category.toLowerCase();
        const desc = (t.description || "").toLowerCase();
        return cat.includes(q) || desc.includes(q);
      });
    }

    switch (filters.sort) {
      case "date_desc":
        list.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "date_asc":
        list.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "amount_desc":
        list.sort((a, b) => b.amount - a.amount);
        break;
      case "amount_asc":
        list.sort((a, b) => a.amount - b.amount);
        break;
    }

    return list;
  }, [transactions, filters]);


  return (
    <Layout>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Персональный финансовый трекер
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 transition text-white rounded-lg"
        >
          + Добавить транзакцию
        </button>
      </header>

      <main className="space-y-6">
        <SummaryCards transactions={transactions} />
        <FiltersBar value={filters} onChange={setFilters} />
        <TransactionsTable transactions={transactions} onDelete={deleteTransaction} />

      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddTransactionForm onSubmit={addTransaction} />
      </Modal>
    </Layout>
  );
}
