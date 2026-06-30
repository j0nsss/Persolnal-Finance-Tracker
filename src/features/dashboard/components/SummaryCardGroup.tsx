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

export function SummaryCardGroup({ data, period }: SummaryCardGroupProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <SummaryCard
        title="Saldo Bersih"
        amount={data.balance}
        period={period}
        icon={<Wallet size={32} strokeWidth={1.5} />}
        accentClass="border-base-ink bg-base-ink text-white [&_.countup]:text-white"
      />
    </div>
  );
}
