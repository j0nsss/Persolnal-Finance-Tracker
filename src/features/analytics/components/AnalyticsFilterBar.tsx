import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";
import { formatCurrency } from "../../../lib/utils";
import type { AnalyticsPeriod, PeriodComparison } from "../hooks/useAnalyticsData";

interface AnalyticsFilterBarProps {
  period: AnalyticsPeriod;
  onPeriodChange: (p: AnalyticsPeriod) => void;
  totalIncome: number;
  totalExpense: number;
  periodLabel: string;
  previousPeriodComparison: PeriodComparison | null;
  expenseRatio: number;
}

const periodOptions: { value: AnalyticsPeriod; label: string }[] = [
  { value: "3M", label: "3 Bulan" },
  { value: "6M", label: "6 Bulan" },
  { value: "1Y", label: "1 Tahun" },
];

function TrendBadge({ change, label }: { change: number; label: "income" | "expense" }) {
  const isUp = change > 0;
  const isPositive = label === "income" ? isUp : !isUp;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-display font-bold text-[10px] px-1.5 py-0.5 rounded-brutal border",
        isPositive
          ? "text-feedback-success border-feedback-success/30 bg-feedback-success/10"
          : "text-feedback-danger border-feedback-danger/30 bg-feedback-danger/10",
      )}
    >
      <motion.span
        key={change}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isUp ? "↑" : "↓"} {Math.abs(change)}%
      </motion.span>
    </span>
  );
}

export function AnalyticsFilterBar({
  period,
  onPeriodChange,
  totalIncome,
  totalExpense,
  periodLabel,
  previousPeriodComparison,
  expenseRatio,
}: AnalyticsFilterBarProps) {
  const balance = totalIncome - totalExpense;
  const incomeTrend = previousPeriodComparison?.incomeChange ?? null;
  const expenseTrend = previousPeriodComparison?.expenseChange ?? null;

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex rounded-brutal border-3 border-base-ink overflow-hidden shrink-0" role="group" aria-label="Periode analitik">
          {periodOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPeriodChange(opt.value)}
              className={cn(
                "px-4 py-2 font-display font-bold text-xs transition-all",
                period === opt.value
                  ? "bg-base-ink text-base-surface"
                  : "bg-base-surface text-base-ink/60 hover:bg-base-ink/5",
              )}
              aria-pressed={period === opt.value}
              aria-label={opt.label}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="font-body text-[10px] text-base-ink/30 uppercase tracking-wider hidden sm:inline">{periodLabel}</span>
      </div>

      <div className="flex items-center gap-5 flex-wrap">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`income-${totalIncome}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="text-right"
          >
            <p className="font-body text-[10px] text-base-ink/40 uppercase tracking-wider">Pemasukan</p>
            <div className="flex items-center gap-1.5">
              <p className="font-mono tabular-nums text-sm font-bold text-feedback-success">{formatCurrency(totalIncome)}</p>
              {incomeTrend != null && <TrendBadge change={incomeTrend} label="income" />}
            </div>
          </motion.div>

          <motion.div
            key={`expense-${totalExpense}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="text-right"
          >
            <p className="font-body text-[10px] text-base-ink/40 uppercase tracking-wider">Pengeluaran</p>
            <div className="flex items-center gap-1.5">
              <p className="font-mono tabular-nums text-sm font-bold text-feedback-danger">{formatCurrency(totalExpense)}</p>
              {expenseTrend != null && <TrendBadge change={expenseTrend} label="expense" />}
            </div>
          </motion.div>

          <motion.div
            key={`balance-${balance}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="text-right"
          >
            <p className="font-body text-[10px] text-base-ink/40 uppercase tracking-wider">Saldo</p>
            <p className={`font-mono tabular-nums text-sm font-bold ${balance >= 0 ? "text-feedback-success" : "text-feedback-danger"}`}>
              {formatCurrency(balance)}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="hidden sm:flex items-center gap-2">
          <div className="w-24 h-2.5 rounded-brutal border-2 border-base-ink bg-base-bg overflow-hidden">
            <motion.div
              className="h-full bg-accent-orange"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, expenseRatio)}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="font-mono tabular-nums text-[10px] text-base-ink/40">{expenseRatio}%</span>
        </div>
      </div>
    </div>
  );
}
