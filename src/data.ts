export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
  category: string;
  description?: string;
}

export const mockTransactions: Transaction[] = [
  { id: 1, type: "income", amount: 2500, date: "2025-11-10", category: "Зарплата", description: "Основная работа" },
  { id: 2, type: "expense", amount: 100, date: "2025-11-11", category: "Еда", description: "Продукты" },
  { id: 3, type: "expense", amount: 50, date: "2025-11-12", category: "Транспорт", description: "Такси" },
  { id: 4, type: "income", amount: 300, date: "2025-11-13", category: "Подработка", description: "Уборка" },
];
