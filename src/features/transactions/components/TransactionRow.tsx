import { memo } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  Briefcase,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Film,
  HeartPulse,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Transaction } from "../../../types/transaction";
import type { CategoryId } from "../../../types/category";
import { formatCurrency, formatDate } from "../../../lib/utils";

interface TransactionRowProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const CATEGORY_STYLE: Record<
  CategoryId,
  { Icon: LucideIcon; bg: string; iconColor: string }
> = {
  salary: { Icon: Briefcase, bg: "bg-[#E3FFEB]", iconColor: "text-green-700" },
  shopping: { Icon: ShoppingBag, bg: "bg-[#FFE3E3]", iconColor: "text-[#DC2626]" },
  food: { Icon: Utensils, bg: "bg-[#FFFEE3]", iconColor: "text-[#EA580C]" },
  transport: { Icon: Car, bg: "bg-[#E3F2FF]", iconColor: "text-[#2563EB]" },
  housing: { Icon: Home, bg: "bg-[#F5E3FF]", iconColor: "text-[#7C3AED]" },
  entertainment: { Icon: Film, bg: "bg-[#FFE3FA]", iconColor: "text-[#DB2777]" },
  health: { Icon: HeartPulse, bg: "bg-[#E3FFFF]", iconColor: "text-[#0D9488]" },
  investment: { Icon: TrendingUp, bg: "bg-[#D4FF3F]", iconColor: "text-[#65A30D]" },
  other: { Icon: HelpCircle, bg: "bg-[#E2E8F0]", iconColor: "text-[#6B7280]" },
};

const DEFAULT_STYLE = { Icon: HelpCircle, bg: "bg-[#E2E8F0]", iconColor: "text-[#6B7280]" };

const CATEGORY_LABEL: Record<CategoryId, string> = {
  salary: "Gaji",
  shopping: "Belanja",
  food: "Makanan",
  transport: "Transportasi",
  housing: "Hunian",
  entertainment: "Hiburan",
  health: "Kesehatan",
  investment: "Investasi",
  other: "Lainnya",
};

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const TransactionRow = memo(function TransactionRow({
  transaction,
  onDelete,
}: TransactionRowProps) {
  const isIncome = transaction.type === "income";
  const style = CATEGORY_STYLE[transaction.categoryId] ?? DEFAULT_STYLE;
  const label = CATEGORY_LABEL[transaction.categoryId] ?? "Lainnya";

  return (
    <motion.tr
      layout
      variants={rowVariants}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      className="hidden sm:table-row border-b-3 border-black/10 last:border-b-0 group cursor-default transition-colors duration-200 hover:bg-[#F8F8F6]"
    >
      <td className="py-3 px-4">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`w-11 h-11 border-2 border-black rounded-xl flex items-center justify-center shrink-0 ${style.bg}`}
          >
            <style.Icon size={18} strokeWidth={2.5} className={style.iconColor} />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-black">{label}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {transaction.description && (
                <p className="font-body text-xs text-black/40 truncate max-w-[160px]">
                  {transaction.description}
                </p>
              )}
              <p className="font-body text-[11px] text-black/30 shrink-0">
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>
        </motion.div>
      </td>
      <td className="py-3 px-4 text-right">
        <motion.span
          className={`font-mono font-black text-lg tracking-tight tabular-nums ${
            isIncome ? "text-[#00C853]" : "text-[#FF3B30]"
          }`}
          whileHover={{ x: -4 }}
          transition={{ duration: 0.2 }}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </motion.span>
      </td>
      <td className="py-3 px-2 text-right">
        <button
          onClick={() => onDelete(transaction.id)}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-brutal border-2 border-black p-1.5 hover:bg-[#FF3B30] hover:text-white hover:border-[#FF3B30]"
          aria-label={`Hapus transaksi ${label} ${formatCurrency(transaction.amount)}`}
        >
          <Trash2 size={14} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </td>
    </motion.tr>
  );
});

export function TransactionRowMobile({
  transaction,
  onDelete,
}: TransactionRowProps) {
  const isIncome = transaction.type === "income";
  const style = CATEGORY_STYLE[transaction.categoryId] ?? DEFAULT_STYLE;
  const label = CATEGORY_LABEL[transaction.categoryId] ?? "Lainnya";

  return (
    <motion.div
      layout
      variants={rowVariants}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      className="sm:hidden rounded-brutal border-3 border-black bg-white p-4 flex items-center gap-3 transition-colors duration-200 hover:bg-[#F8F8F6]"
    >
      <div
        className={`w-11 h-11 border-2 border-black rounded-xl flex items-center justify-center shrink-0 ${style.bg}`}
      >
        <style.Icon size={18} strokeWidth={2.5} className={style.iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-sm text-black truncate">
          {label}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {transaction.description && (
            <p className="font-body text-xs text-black/40 truncate max-w-[140px]">
              {transaction.description}
            </p>
          )}
          <p className="font-body text-[11px] text-black/30 shrink-0">
            {formatDate(transaction.date)}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p
          className={`font-mono font-black text-base tracking-tight tabular-nums ${
            isIncome ? "text-[#00C853]" : "text-[#FF3B30]"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
      <button
        onClick={() => onDelete(transaction.id)}
        className="rounded-brutal border-2 border-black p-1.5 hover:bg-[#FF3B30] hover:text-white hover:border-[#FF3B30] transition-all duration-200"
        aria-label={`Hapus transaksi ${label} ${formatCurrency(transaction.amount)}`}
      >
        <Trash2 size={14} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </motion.div>
  );
}
