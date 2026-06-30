import { useEffect, useState } from "react";
import { useTransactionActions } from "../hooks/useTransactionActions";
import { TransactionSearchBar } from "./TransactionSearchBar";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionTable } from "./TransactionTable";
import { TransactionFormModal } from "../forms/TransactionFormModal";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

interface TransactionLedgerProps {
  onAddTransaction?: () => void;
}

export function TransactionLedger(_props: TransactionLedgerProps) {
  const {
    transactions,
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <TransactionSearchBar value={localSearch} onChange={setLocalSearch} />
        </div>
      </div>

      <TransactionFilters
        activeFilters={activeFilters}
        onToggleFilter={handleToggleFilter}
      />

      {isLoading ? (
        <div className="rounded-brutal border-3 border-base-ink bg-base-surface p-8 flex items-center justify-center">
          <p className="font-display font-bold text-base-ink/40">Memuat data...</p>
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
