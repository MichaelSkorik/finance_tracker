import React from "react";
import SummaryCards from "../components/SummaryCards";
import TransactionsTable from "../components/TransactionsTable";
import Modal from "../components/Modal";
import AddTransactionForm from "../components/AddTransactionForm";
import EditTransactionForm from "../components/EditTransactionForm";
import type { Transaction } from "../data";
import { calcBalance } from "../utils/balance";

interface HomePageProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export default function HomePage({ transactions, setTransactions }: HomePageProps) {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Transaction | null>(null);

  function addTransaction(t: Transaction) {
    setTransactions((prev) => [t, ...prev]);
    return { ok: true };
  }

  function deleteTransaction(id: number) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const balance = calcBalance(transactions);

  return (
    <>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Finance Tracker</h1>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
        >
          + Добавить транзакцию
        </button>
      </header>

      <SummaryCards transactions={transactions} />

      <TransactionsTable
        transactions={transactions}
        onDelete={deleteTransaction}
        onEdit={(t) => setEditing(t)}
      />

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <AddTransactionForm onSubmit={addTransaction} currentBalance={balance} />
      </Modal>

      {editing && (
        <Modal isOpen={true} onClose={() => setEditing(null)}>
          <EditTransactionForm
            value={editing}
            onCancel={() => setEditing(null)}
            onSave={(updated) => {
              setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
              setEditing(null);
            }}
          />
        </Modal>
      )}
    </>
  );
}
