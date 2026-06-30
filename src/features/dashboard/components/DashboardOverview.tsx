import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../../components/ui/Card/Card";
import { Skeleton } from "../../../components/ui/Skeleton/Skeleton";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { SummaryCardGroup } from "./SummaryCardGroup";
import { ChartFilterBar, type PeriodFilter, type ChartTypeFilter } from "./ChartFilterBar";
import { MonthlyBarChart } from "./MonthlyBarChart";
import { CategoryDonutChart } from "./CategoryDonutChart";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

function GreetingHeader() {
  const now = new Date();
  const hour = now.getHours();
  let greeting = "Selamat Malam";
  if (hour < 12) greeting = "Selamat Pagi";
  else if (hour < 15) greeting = "Selamat Siang";
  else if (hour < 18) greeting = "Selamat Sore";

  return (
    <div className="relative">
      <div className="absolute -left-0 top-0 bottom-0 w-1 bg-accent-lime rounded-r-full" />
      <div className="pl-4">
        <p className="font-display font-bold text-sm text-base-ink/40 uppercase tracking-widest">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mt-1 tracking-tight">
          {greeting}
        </h1>
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const isLoading = useTransactionStore((s) => s.isLoading);
  const transactions = useTransactionStore((s) => s.transactions);
  const fetchAll = useTransactionStore((s) => s.fetchAll);

  const [period, setPeriod] = useState<PeriodFilter>("6M");
  const [chartType, setChartType] = useState<ChartTypeFilter>("expense");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const summary = useDashboardSummary();

  if (isLoading) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <Skeleton className="h-32 w-full" />
            </motion.div>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -12 },
          show: { opacity: 1, y: 0 },
        }}
      >
        <GreetingHeader />
      </motion.div>

      <SummaryCardGroup data={summary} period={summary.period} />

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
      >
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-accent-pink rounded-r-full" />
              <p className="font-display font-bold text-lg">Pengeluaran Bulanan</p>
            </div>
          </div>
          <ChartFilterBar
            period={period}
            onPeriodChange={setPeriod}
            chartType={chartType}
            onChartTypeChange={setChartType}
          />
          <MonthlyBarChart
            transactions={transactions}
            period={period}
            chartType={chartType}
          />
        </Card>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
      >
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
