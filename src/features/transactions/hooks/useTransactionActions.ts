import { useCallback } from "react";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { useToastStore } from "../../../store/useToastStore";
import type { CategoryId } from "../../../types/category";

export function useTransactionActions() {
  const {
    transactions,
    isLoading,
    searchQuery,
    activeFilters,
    fetchAll,
    addTransaction,
    deleteTransaction,
    setSearchQuery,
    setActiveFilters,
  } = useTransactionStore();

  const addToast = useToastStore((s) => s.addToast);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilters.length === 0 || activeFilters.includes(t.categoryId);

    return matchesSearch && matchesFilter;
  });

  const handleAdd = useCallback(
    async (data: Parameters<typeof addTransaction>[0]) => {
      await addTransaction(data);
      addToast({
        title: "Transaksi berhasil ditambahkan",
        variant: "success",
      });
    },
    [addTransaction, addToast],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteTransaction(id);
      addToast({
        title: "Transaksi berhasil dihapus",
        variant: "success",
      });
    },
    [deleteTransaction, addToast],
  );

  const handleToggleFilter = useCallback(
    (id: CategoryId) => {
      const next = activeFilters.includes(id)
        ? activeFilters.filter((f) => f !== id)
        : [...activeFilters, id];
      setActiveFilters(next);
    },
    [activeFilters, setActiveFilters],
  );

  const handleClearFilters = useCallback(() => {
    setActiveFilters([]);
  }, [setActiveFilters]);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    isLoading,
    searchQuery,
    activeFilters,
    fetchAll,
    handleAdd,
    handleDelete,
    setSearchQuery,
    handleToggleFilter,
    handleClearFilters,
  };
}
