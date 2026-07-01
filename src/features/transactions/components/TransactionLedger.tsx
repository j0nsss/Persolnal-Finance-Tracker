import { useEffect, useState } from "react";
import { useTransactionActions } from "../hooks/useTransactionActions";
import { TransactionSearchBar } from "./TransactionSearchBar";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";
import { TransactionFormModal } from "../forms/TransactionFormModal";
import { WeeklySpendChart } from "./WeeklySpendChart";
import { TopCategoryCard } from "./TopCategoryCard";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

interface TransactionLedgerProps {
  onAddTransaction?: () => void;
}

export function TransactionLedger(_props: TransactionLedgerProps) {
  const {
    transactions,
    allTransactions,
    isLoading,
    activeFilters,
    fetchAll,
    handleAdd,
    handleDelete,
    setSearchQuery,
    handleToggleFilter,
  } = useTransactionActions();

  const [localSearch, setLocalSearch] = useState("");
  const debouncedSearch = useDebouncedValue(localSearch, 300);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:w-auto">
          <TransactionSearchBar value={localSearch} onChange={setLocalSearch} />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-brutal border-3 border-black bg-black shadow-brutal px-5 py-2.5 font-display font-bold text-sm text-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all duration-200 shrink-0"
        >
          + Transaksi Baru
        </button>
      </div>

      <TransactionFilters
        activeFilters={activeFilters}
        onToggleFilter={handleToggleFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklySpendChart transactions={allTransactions} />
        </div>
        <div className="lg:col-span-1">
          <TopCategoryCard transactions={allTransactions} />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-brutal border-3 border-black bg-white p-8 flex items-center justify-center">
          <p className="font-display font-bold text-black/40">Memuat data...</p>
        </div>
      ) : (
        <TransactionTable transactions={transactions} onDelete={handleDelete} />
      )}

      <TransactionFormModal
        open={showModal}
        onOpenChange={setShowModal}
        onSubmit={handleAdd}
      />
    </div>
  );
}
