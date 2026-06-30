import { AnimatePresence, motion } from "framer-motion";
import type { Transaction } from "../../../types/transaction";
import { TransactionRow, TransactionRowMobile } from "./TransactionRow";
import { EmptyState } from "./EmptyState";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block rounded-brutal border-3 border-base-ink bg-base-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-base-ink bg-base-ink/5">
                <th className="py-3 px-4 text-left font-display font-bold text-xs uppercase tracking-wider">
                  Kategori
                </th>
                <th className="py-3 px-4 text-left font-display font-bold text-xs uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="py-3 px-4 text-right font-display font-bold text-xs uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="py-3 px-2 w-10 sr-only">Aksi</th>
              </tr>
            </thead>
            <motion.tbody>
              <AnimatePresence mode="popLayout">
                {transactions.map((t) => (
                  <TransactionRow key={t.id} transaction={t} onDelete={onDelete} />
                ))}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        <AnimatePresence mode="popLayout">
          {transactions.map((t) => (
            <TransactionRowMobile key={t.id} transaction={t} onDelete={onDelete} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
