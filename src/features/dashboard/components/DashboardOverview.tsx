import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/Card/Card";
import { Skeleton } from "../../../components/ui/Skeleton/Skeleton";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { SummaryCardGroup } from "./SummaryCardGroup";
import { ChartFilterBar, type PeriodFilter, type ChartTypeFilter } from "./ChartFilterBar";
import { MonthlyBarChart } from "./MonthlyBarChart";
import { CategoryDonutChart } from "./CategoryDonutChart";

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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SummaryCardGroup data={summary} period={summary.period} />

      <Card className="p-5">
        <p className="font-display font-bold text-lg mb-4">Pengeluaran Bulanan</p>
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

      <Card className="p-5">
        <p className="font-display font-bold text-lg mb-4">Breakdown Kategori</p>
        <CategoryDonutChart transactions={transactions} />
      </Card>
    </div>
  );
}
