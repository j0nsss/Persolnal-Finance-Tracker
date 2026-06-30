import { memo } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { Transaction } from "../../../types/transaction";
import { formatCurrency, formatDate } from "../../../lib/utils";
import { CATEGORY_LIST } from "../../../lib/constants";

interface TransactionRowProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const categoryMap = new Map(CATEGORY_LIST.map((c) => [c.id, c]));

export const TransactionRow = memo(function TransactionRow({
  transaction,
  onDelete,
}: TransactionRowProps) {
  const category = categoryMap.get(transaction.categoryId);
  const isIncome = transaction.type === "income";

  {
    /* Desktop row */
  }
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      className="hidden sm:table-row border-b-3 border-base-ink/10 last:border-b-0 group"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-brutal shrink-0"
            style={{ backgroundColor: category?.color ?? "#6B7280" }}
            aria-hidden="true"
          />
          <div>
            <p className="font-display font-bold text-sm">
              {category?.label ?? "Lainnya"}
            </p>
            {transaction.description && (
              <p className="font-body text-xs text-base-ink/50 mt-0.5">
                {transaction.description}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="font-body text-sm">{formatDate(transaction.date)}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <span
          className={`font-mono tabular-nums text-sm font-bold ${
            isIncome ? "text-feedback-success" : "text-feedback-danger"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>
      </td>
      <td className="py-3 px-2 text-right">
        <button
          onClick={() => onDelete(transaction.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity rounded-brutal border-2 border-base-ink p-1.5 hover:bg-feedback-danger hover:text-white hover:border-feedback-danger"
          aria-label={`Hapus transaksi ${category?.label ?? ""} ${formatCurrency(transaction.amount)}`}
        >
          <Trash2 size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </td>
    </motion.tr>
  );
});

export function TransactionRowMobile({ transaction, onDelete }: TransactionRowProps) {
  const category = categoryMap.get(transaction.categoryId);
  const isIncome = transaction.type === "income";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      className="sm:hidden rounded-brutal border-3 border-base-ink bg-base-surface p-4 flex items-center gap-3"
    >
      <span
        className="w-3 h-3 rounded-brutal shrink-0"
        style={{ backgroundColor: category?.color ?? "#6B7280" }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-sm truncate">
          {category?.label ?? "Lainnya"}
        </p>
        {transaction.description && (
          <p className="font-body text-xs text-base-ink/50 mt-0.5 truncate">
            {transaction.description}
          </p>
        )}
        <p className="font-body text-xs text-base-ink/40 mt-0.5">
          {formatDate(transaction.date)}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p
          className={`font-mono tabular-nums text-sm font-bold ${
            isIncome ? "text-feedback-success" : "text-feedback-danger"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
      <button
        onClick={() => onDelete(transaction.id)}
        className="rounded-brutal border-2 border-base-ink p-1.5 hover:bg-feedback-danger hover:text-white hover:border-feedback-danger transition-colors"
        aria-label={`Hapus transaksi ${category?.label ?? ""} ${formatCurrency(transaction.amount)}`}
      >
        <Trash2 size={14} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </motion.div>
  );
}
