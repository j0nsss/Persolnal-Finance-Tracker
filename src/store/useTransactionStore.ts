import { create } from "zustand";
import type { Transaction } from "../types/transaction";
import type { CategoryId } from "../types/category";

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  searchQuery: string;
  activeFilters: CategoryId[];
  fetchAll: () => Promise<void>;
  addTransaction: (data: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setSearchQuery: (q: string) => void;
  setActiveFilters: (filters: CategoryId[]) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  searchQuery: "",
  activeFilters: [],
  fetchAll: async () => {
    set({ isLoading: true });
    // will be connected to mockApi later
    set({ isLoading: false });
  },
  addTransaction: async () => {
    // will be implemented with mockApi
  },
  deleteTransaction: async () => {
    // will be implemented with mockApi
  },
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveFilters: (filters) => set({ activeFilters: filters }),
}));
