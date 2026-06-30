import type { CategoryId } from "./category";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: CategoryId;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type NewTransactionInput = Omit<Transaction, "id" | "createdAt" | "updatedAt">;
