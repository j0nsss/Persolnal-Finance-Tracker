import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { useCountUp } from "../../../hooks/useCountUp";

interface SavingsRateCardProps {
  savingsRate: number;
  totalIncome: number;
  totalExpense: number;
}

export function SavingsRateCard({ savingsRate, totalIncome, totalExpense }: SavingsRateCardProps) {
  const animatedRate = useCountUp(savingsRate, 1);

  const rateColor =
    savingsRate >= 30
      ? "bg-feedback-success"
      : savingsRate >= 15
        ? "bg-accent-orange"
        : savingsRate >= 0
          ? "bg-feedback-danger"
          : "bg-base-ink";

  return (
    <div className="rounded-brutal border-3 border-base-ink bg-base-surface p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-brutal border-3 border-base-ink bg-accent-lime p-2">
          <PiggyBank size={20} strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-display font-bold text-sm">Rasio Tabungan</p>
          <p className="font-body text-[11px] text-base-ink/50">{(totalIncome - totalExpense) >= 0 ? "Positif" : "Defisit"}</p>
        </div>
      </div>

      <p className="font-mono tabular-nums text-3xl font-bold mb-3">
        {animatedRate}<span className="text-base-ink/40">%</span>
      </p>

      <div className="w-full h-4 rounded-brutal border-2 border-base-ink bg-base-bg overflow-hidden">
        <motion.div
          className={`h-full ${rateColor}`}
          initial={{ width: "0%" }}
          animate={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <p className="font-body text-[11px] text-base-ink/40 mt-2">
        {savingsRate >= 30
          ? "Kebiasaan menabung yang luar biasa!"
          : savingsRate >= 15
            ? "Cukup baik, bisa ditingkatkan lagi."
            : savingsRate >= 0
              ? "Mulai sisihkan lebih banyak untuk tabungan."
              : "Pengeluaran melebihi pemasukan. Evaluasi kembali!"}
      </p>
    </div>
  );
}
