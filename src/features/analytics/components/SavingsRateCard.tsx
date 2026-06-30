import { motion } from "framer-motion";
import { PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import { useCountUp } from "../../../hooks/useCountUp";
import { cn } from "../../../lib/utils";

interface SavingsRateCardProps {
  savingsRate: number;
  totalIncome: number;
  totalExpense: number;
}

export function SavingsRateCard({ savingsRate, totalIncome, totalExpense }: SavingsRateCardProps) {
  const animatedRate = useCountUp(Math.max(0, savingsRate), 1.2);
  const netCashflow = totalIncome - totalExpense;

  return (
    <div className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-brutal border-2 border-base-ink bg-base-ink/5 p-2">
            <PiggyBank size={18} strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display font-bold text-sm leading-none">Rasio Tabungan</p>
            <p className="font-body text-[11px] text-base-ink/40 mt-0.5">
              {netCashflow >= 0 ? "Positif" : "Defisit"}
            </p>
          </div>
        </div>
      </div>

      <p className="font-mono tracking-tight tabular-nums text-3xl font-bold">
        {animatedRate}<span className="text-base-ink/30">%</span>
      </p>

      <div className="w-full h-3 rounded-sm border-2 border-base-ink bg-black overflow-hidden">
        <motion.div
          className="h-full rounded-sm bg-[#D4FF3F]"
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="flex items-center gap-1.5 text-[11px]">
        {netCashflow >= 0 ? (
          <TrendingUp size={12} strokeWidth={2.5} className="text-feedback-success shrink-0" />
        ) : (
          <TrendingDown size={12} strokeWidth={2.5} className="text-feedback-danger shrink-0" />
        )}
        <span className="font-body text-base-ink/50">
          {savingsRate >= 25
            ? "Kebiasaan menabung yang luar biasa!"
            : savingsRate >= 10
              ? "Cukup baik, tingkatkan lagi."
              : savingsRate >= 0
                ? "Mulai sisihkan lebih banyak."
                : "Pengeluaran melebihi pemasukan."}
        </span>
      </div>
    </div>
  );
}
