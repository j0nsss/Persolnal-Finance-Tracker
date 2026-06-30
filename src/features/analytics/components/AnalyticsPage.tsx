import { useEffect } from "react";
import { motion } from "framer-motion";
import { FilePlus2 } from "lucide-react";
import { Card } from "../../../components/ui/Card/Card";
import { Button } from "../../../components/ui/Button/Button";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { useUIStore } from "../../../store/useUIStore";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import { AnalyticsFilterBar } from "./AnalyticsFilterBar";
import { MonthlyCashflowChart } from "./MonthlyCashflowChart";
import { CategoryChart } from "./CategoryChart";
import { SavingsRateCard } from "./SavingsRateCard";
import { TopCategoryAlert } from "./TopCategoryAlert";
import { ForecastCard } from "./ForecastCard";
const periodLabelMap: Record<string, string> = {
  "3M": "3 bulan terakhir",
  "6M": "6 bulan terakhir",
  "1Y": "1 tahun terakhir",
};

export function AnalyticsPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const isLoading = useTransactionStore((s) => s.isLoading);
  const fetchAll = useTransactionStore((s) => s.fetchAll);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  const {
    period,
    setPeriod,
    monthlyCashflow,
    categoryBreakdown,
    insights,
    totalIncome,
    totalExpense,
  } = useAnalyticsData();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const periodLabel = periodLabelMap[period] ?? "";

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-brutal border-3 border-base-ink bg-base-surface p-6 animate-pulse"
          >
            <div className="h-4 w-1/3 bg-base-ink/10 rounded-brutal" />
            <div className="h-8 w-1/2 bg-base-ink/10 rounded-brutal mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-brutal border-3 border-base-ink bg-base-surface p-8 flex flex-col items-center justify-center gap-4 min-h-[400px]"
      >
        <FilePlus2 size={56} strokeWidth={1.5} className="text-base-ink/20" />
        <p className="font-display font-bold text-lg">Belum ada data analitik</p>
        <p className="font-body text-sm text-base-ink/40 text-center max-w-sm">
          Tambahkan transaksi terlebih dahulu untuk melihat grafik dan insight finansial.
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={() => setActiveTab("transactions")}
        >
          Tambah Transaksi Pertama
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -24, rotate: -1 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <Card className="p-5">
        <AnalyticsFilterBar
          period={period}
          onPeriodChange={setPeriod}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          periodLabel={periodLabel}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <p className="font-display font-bold text-lg mb-4">Arus Kas Bulanan</p>
            <MonthlyCashflowChart data={monthlyCashflow} />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-5">
            <p className="font-display font-bold text-lg mb-4">Distribusi Kategori</p>
            <CategoryChart data={categoryBreakdown} />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SavingsRateCard
          savingsRate={insights.savingsRate}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />
        <TopCategoryAlert
          categoryId={insights.topCategory?.id ?? null}
          label={insights.topCategory?.label ?? null}
          color={insights.topCategory?.color ?? null}
          total={insights.topCategory?.total ?? null}
          percentage={insights.topCategory?.percentage ?? null}
          message={insights.topCategoryMessage}
        />
        <ForecastCard
          forecastBalance={insights.forecastBalance}
          averageMonthlyCashflow={insights.averageMonthlyCashflow}
          periodLabel={periodLabel}
        />
      </div>
    </motion.div>
  );
}
