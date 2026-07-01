import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "../../../components/ui/Card/Card";
import { Skeleton } from "../../../components/ui/Skeleton/Skeleton";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { SummaryCardGroup } from "./SummaryCardGroup";
import { ChartFilterBar, type PeriodFilter } from "./ChartFilterBar";
import { MonthlyAreaChart } from "./MonthlyAreaChart";
import { CategoryDonutChart } from "./CategoryDonutChart";
import { formatCurrency } from "../../../lib/utils";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function GreetingHeader({ insight }: { insight: string }) {
  const now = new Date();
  const hour = now.getHours();
  let greeting = "Selamat Malam";
  if (hour < 12) greeting = "Selamat Pagi";
  else if (hour < 15) greeting = "Selamat Siang";
  else if (hour < 18) greeting = "Selamat Sore";

  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="font-display font-bold text-[11px] text-base-ink/40 uppercase tracking-widest">
        {dateStr}
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
          {greeting}
        </h1>
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-1.5 rounded-brutal border-2 border-base-ink bg-[#FFD600] px-3 py-1.5 font-display font-bold text-[11px] text-black"
        >
          {insight}
        </motion.span>
      </div>
    </div>
  );
}

function computeSparklineHistories(transactions: import("../../../types/transaction").Transaction[]) {
  const months = 6;
  const now = new Date();
  const incomeHistory: number[] = [];
  const expenseHistory: number[] = [];
  const balanceHistory: number[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const start = startOfMonth(date).getTime();
    const end = endOfMonth(date).getTime();

    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      const tTime = new Date(t.date).getTime();
      if (tTime >= start && tTime <= end) {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
      }
    }
    incomeHistory.push(income);
    expenseHistory.push(expense);
    balanceHistory.push(income - expense);
  }

  return { incomeHistory, expenseHistory, balanceHistory };
}

function computeInsight(
  summary: { income: number; expense: number; balance: number; expenseTrend?: number },
): string {
  const diff = summary.income - summary.expense;

  if (summary.expenseTrend !== undefined && summary.expenseTrend < 0) {
    return `\uD83D\uDD25 Pengeluaranmu ${Math.abs(summary.expenseTrend)}% lebih hemat dari bulan lalu!`;
  }
  if (summary.expenseTrend !== undefined && summary.expenseTrend > 15) {
    return `\u26A0\uFE0F Pengeluaran naik ${summary.expenseTrend}% — yuk evaluasi lagi!`;
  }
  if (diff > 0) {
    const saveAmount = Math.round(diff * 0.3);
    return `\uD83D\uDCA1 Kamu bisa menabung Rp ${saveAmount.toLocaleString("id-ID")} lagi bulan ini`;
  }
  return "\uD83D\uDCC8 Pantau terus pemasukan & pengeluaranmu ya!";
}

export function DashboardOverview() {
  const isLoading = useTransactionStore((s) => s.isLoading);
  const transactions = useTransactionStore((s) => s.transactions);
  const fetchAll = useTransactionStore((s) => s.fetchAll);

  const [period, setPeriod] = useState<PeriodFilter>("6M");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const summary = useDashboardSummary();
  const histories = useMemo(() => computeSparklineHistories(transactions), [transactions]);
  const insight = useMemo(() => computeInsight(summary), [summary]);

  if (isLoading) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Skeleton className="h-32 w-full" />
            </motion.div>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </motion.div>
    );
  }

  const extendedSummary = { ...summary, ...histories };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants}>
        <GreetingHeader insight={insight} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SummaryCardGroup data={extendedSummary} period={summary.period} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="p-5">
          <ChartFilterBar period={period} onPeriodChange={setPeriod} />
          <MonthlyAreaChart transactions={transactions} period={period} />
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-accent-orange rounded-r-full" />
            <p className="font-display font-bold text-lg">Breakdown Kategori</p>
          </div>
          <CategoryDonutChart transactions={transactions} />
        </Card>
      </motion.div>
    </motion.div>
  );
}
