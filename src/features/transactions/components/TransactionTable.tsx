import { AnimatePresence, motion } from "framer-motion";
import type { Transaction } from "../../../types/transaction";
import { TransactionRow, TransactionRowMobile } from "./TransactionRow";
import { EmptyState } from "./EmptyState";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

export function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block rounded-brutal border-3 border-black bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-black bg-black/5">
                <th className="py-3 px-4 text-left font-display font-bold text-xs uppercase tracking-wider text-black/60">
                  Transaksi
                </th>
                <th className="py-3 px-4 text-right font-display font-bold text-xs uppercase tracking-wider text-black/60">
                  Jumlah
                </th>
                <th className="py-3 px-2 w-10">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
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
      <motion.div
        className="sm:hidden space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence mode="popLayout">
          {transactions.map((t) => (
            <TransactionRowMobile key={t.id} transaction={t} onDelete={onDelete} />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
