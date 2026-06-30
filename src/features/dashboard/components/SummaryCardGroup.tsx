import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { SummaryCard } from "./SummaryCard";

interface SummaryData {
  income: number;
  expense: number;
  balance: number;
  incomeTrend?: number;
  expenseTrend?: number;
}

interface SummaryCardGroupProps {
  data: SummaryData;
  period: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function SummaryCardGroup({ data, period }: SummaryCardGroupProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="show"
      >
        <SummaryCard
          title="Pemasukan"
          amount={data.income}
          period={period}
          icon={<TrendingUp size={32} strokeWidth={1.5} />}
          accentClass="border-accent-lime"
          trend={
            data.incomeTrend !== undefined
              ? { value: data.incomeTrend, isPositive: data.incomeTrend >= 0 }
              : undefined
          }
        />
      </motion.div>

      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="show"
      >
        <SummaryCard
          title="Pengeluaran"
          amount={data.expense}
          period={period}
          icon={<TrendingDown size={32} strokeWidth={1.5} />}
          accentClass="border-accent-pink"
          trend={
            data.expenseTrend !== undefined
              ? { value: data.expenseTrend, isPositive: data.expenseTrend <= 0 }
              : undefined
          }
        />
      </motion.div>

      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="show"
      >
        <SummaryCard
          title="Saldo Bersih"
          amount={data.balance}
          period={period}
          icon={<Wallet size={32} strokeWidth={1.5} className="text-accent-blue/20" />}
          accentClass="border-accent-blue"
        />
      </motion.div>
    </div>
  );
}
