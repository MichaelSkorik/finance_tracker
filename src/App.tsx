import React from "react";

import Layout from "./components/Layout";
import SummaryCards from "./components/SummaryCards";
import TransactionsTable from "./components/TransactionsTable";
import FiltersBar, { type FiltersState } from "./components/FiltersBar";
import Modal from "./components/Modal";
import AddTransactionForm from "./components/AddTransactionForm";
import ConfirmDialog from "./components/ConfirmDialog";

import { mockTransactions, type Transaction } from "./data";

const STORAGE_KEY = "finance-tracker-transactions";

function calcTotals(list: Transaction[]) {
  const income = list
    .filter((x) => x.type === "income")
    .reduce((sum, x) => sum + x.amount, 0);

  const expense = list
    .filter((x) => x.type === "expense")
    .reduce((sum, x) => sum + x.amount, 0);

  return { income, expense, balance: income - expense };
}

export default function App() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Transaction[]) : mockTransactions;
  });

  const [filters, setFilters] = React.useState<FiltersState>({
    type: "all",
    category: "",
    sort: "date_desc",
    dateFrom: "",
    dateTo: "",
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const currentBalance = React.useMemo(() => {
    return calcTotals(transactions).balance;
  }, [transactions]);

  function addTransaction(t: Transaction): { ok: boolean; error?: string } {
    if (t.type === "expense" && t.amount > currentBalance) {
      return {
        ok: false,
        error: `Недостаточно средств. Доступно: ${currentBalance.toLocaleString(
          "ru-RU"
        )} ₼`,
      };
    }

    setTransactions((prev) => [t, ...prev]);
    setIsModalOpen(false);
    return { ok: true };
  }

  function requestDelete(id: number) {
    setDeleteId(id);
  }

  function confirmDelete() {
    if (deleteId === null) return;
    setTransactions((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  }

  function cancelDelete() {
    setDeleteId(null);
  }

  const visibleTransactions = React.useMemo(() => {
    let list = transactions.filter((t) => {
      if (filters.type !== "all" && t.type !== filters.type) return false;

      if (
        filters.category &&
        !t.category.toLowerCase().includes(filters.category.toLowerCase())
      )
        return false;

      if (filters.dateFrom && t.date < filters.dateFrom) return false;
      if (filters.dateTo && t.date > filters.dateTo) return false;

      return true;
    });

    list = [...list];

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
        <SummaryCards transactions={visibleTransactions} />

        <FiltersBar value={filters} onChange={setFilters} />

        <TransactionsTable
          transactions={visibleTransactions}
          onDelete={requestDelete}
        />
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddTransactionForm
          onSubmit={addTransaction}
          currentBalance={currentBalance}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Удалить транзакцию?"
        message="Это действие нельзя отменить. Удалить выбранную транзакцию?"
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Layout>
  );
}
