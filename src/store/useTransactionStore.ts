import { create } from "zustand";
import type { Transaction, NewTransactionInput } from "../types/transaction";
import type { CategoryId } from "../types/category";
import { transactionApi } from "../lib/supabase/transactionApi";

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  searchQuery: string;
  activeFilters: CategoryId[];
  fetchAll: () => Promise<void>;
  addTransaction: (data: NewTransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setSearchQuery: (q: string) => void;
  setActiveFilters: (filters: CategoryId[]) => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  searchQuery: "",
  activeFilters: [],

  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const data = await transactionApi.getAll();
      set({ transactions: data });
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (data) => {
    const prev = get().transactions;
    const tempId = `temp_${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const optimistic: Transaction = {
      ...data,
      id: tempId,
      createdAt: now,
      updatedAt: now,
    };
    set({ transactions: [optimistic, ...prev] });
    try {
      const created = await transactionApi.create(data);
      set({
        transactions: get().transactions.map((t) =>
          t.id === tempId ? created : t,
        ),
      });
    } catch {
      set({ transactions: prev });
    }
  },

  deleteTransaction: async (id) => {
    const prev = get().transactions;
    set({ transactions: prev.filter((t) => t.id !== id) });
    try {
      await transactionApi.remove(id);
    } catch {
      set({ transactions: prev });
    }
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveFilters: (filters) => set({ activeFilters: filters }),
}));
