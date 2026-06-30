import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FilePlus2, Wallet, TrendingUp, PiggyBank } from "lucide-react";
import { Card } from "../../../components/ui/Card/Card";
import { Button } from "../../../components/ui/Button/Button";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { useUIStore } from "../../../store/useUIStore";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import { PeriodToggle } from "./PeriodToggle";
import { MonthlyCashflowChart } from "./MonthlyCashflowChart";
import { CategoryChart } from "./CategoryChart";
import { SavingsRateCard } from "./SavingsRateCard";
import { TopCategoryAlert } from "./TopCategoryAlert";
import { ForecastCard } from "./ForecastCard";
import { formatCurrency } from "../../../lib/utils";
import { cn } from "../../../lib/utils";

interface MetricCardConfig {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  bg: string;
  value: string;
}

function buildMetricCards(
  balance: number,
  avg: number,
  rate: number,
  highest: { label: string; total: number } | null,
): MetricCardConfig[] {
  return [
    {
      icon: Wallet,
      label: "Saldo Saat Ini",
      bg: "bg-accent-blue",
      value: formatCurrency(balance),
    },
    {
      icon: TrendingUp,
      label: "Rata-rata Cashflow",
      bg: "bg-accent-orange",
      value: `${formatCurrency(avg)}/bln`,
    },
    {
      icon: PiggyBank,
      label: "Rasio Tabungan",
      bg: "bg-accent-lime",
      value: `${rate}%`,
    },
    {
      icon: TrendingUp,
      label: highest ? `Pengeluaran ${highest.label}` : "Pengeluaran",
      bg: "bg-accent-pink",
      value: formatCurrency(highest?.total ?? 0),
    },
  ];
}

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

  const currentBalance = useMemo(
    () => transactions.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0),
    [transactions],
  );

  if (isLoading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-brutal border-3 border-base-ink bg-base-surface p-6 animate-pulse"
          >
            <div className="h-4 w-1/3 bg-base-ink/10 rounded-sm" />
            <div className="h-8 w-1/2 bg-base-ink/10 rounded-sm mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-brutal border-3 border-base-ink bg-base-surface p-8 flex flex-col items-center justify-center gap-4 min-h-[400px]"
      >
        <div className="rounded-brutal border-3 border-base-ink bg-accent-lime p-4">
          <FilePlus2 size={36} strokeWidth={1.5} />
        </div>
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5"
    >
      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {buildMetricCards(
          currentBalance,
          insights.averageMonthlyCashflow,
          insights.savingsRate,
          insights.highestExpenseMonth,
        ).map((card, i) => (
          <MetricCard key={i} icon={card.icon} label={card.label} bg={card.bg} value={card.value} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-display font-bold text-lg leading-none">Arus Kas Bulanan</p>
                <p className="font-body text-[12px] text-base-ink/40 mt-1">
                  Perbandingan pemasukan & pengeluaran
                </p>
              </div>
              {insights.previousPeriodComparison && (
                <div className="flex items-center gap-1.5 rounded-brutal border-2 border-base-ink/15 bg-base-ink/5 px-2.5 py-1.5 shrink-0">
                  <span
                    className={cn(
                      "font-mono tracking-tight tabular-nums text-xs font-bold",
                      insights.previousPeriodComparison.netChange > 0
                        ? "text-feedback-success"
                        : "text-feedback-danger",
                    )}
                  >
                    {insights.previousPeriodComparison.netChange > 0 ? "+" : ""}
                    {insights.previousPeriodComparison.netChange}%
                  </span>
                  <span className="font-body text-[10px] text-base-ink/40">vs periode sebelumnya</span>
                </div>
              )}
            </div>

            <MonthlyCashflowChart data={monthlyCashflow} />

            <div className="mt-4 flex justify-center">
              <PeriodToggle period={period} onChange={setPeriod} />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-5">
            <p className="font-display font-bold text-lg leading-none mb-1">Distribusi Kategori</p>
            <p className="font-body text-[12px] text-base-ink/40 mb-4">
              Persebaran pengeluaran
            </p>
            <CategoryChart data={categoryBreakdown} />
          </Card>
        </div>
      </div>

      {/* Insight & Proyeksi */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-base-ink/10" />
          <span className="rounded-brutal bg-base-ink px-4 py-1.5 font-display font-bold text-[11px] text-accent-lime uppercase tracking-widest">
            Insight & Proyeksi
          </span>
          <div className="h-px flex-1 bg-base-ink/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
            dailyAvg={insights.dailyAvgExpense}
          />
          <ForecastCard
            forecastBalance={insights.forecastBalance}
            averageMonthlyCashflow={insights.averageMonthlyCashflow}
            currentBalance={currentBalance}
            dailyAvgExpense={insights.dailyAvgExpense}
          />
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  bg,
  value,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  bg: string;
  value: string;
}) {
  const isLight = bg === "bg-accent-lime";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0px #000000" }}
      whileTap={{ x: 1, y: 1, boxShadow: "1px 1px 0px #000000" }}
      className={cn("rounded-brutal border-3 border-base-ink shadow-brutal p-4", bg)}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} strokeWidth={2.5} className={isLight ? "text-black/60" : "text-white/70"} />
        <p className={cn("font-body text-[11px] uppercase tracking-wider truncate", isLight ? "text-black/70" : "text-white/80")}>
          {label}
        </p>
      </div>
      <p className={cn("font-mono tracking-tight tabular-nums text-base font-bold truncate", isLight ? "text-black" : "text-white")}>
        {value}
      </p>
    </motion.div>
  );
}
