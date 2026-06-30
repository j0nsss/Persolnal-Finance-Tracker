import { cn } from "../../../lib/utils";
import { formatCurrency } from "../../../lib/utils";
import type { AnalyticsPeriod } from "../hooks/useAnalyticsData";

interface AnalyticsFilterBarProps {
  period: AnalyticsPeriod;
  onPeriodChange: (p: AnalyticsPeriod) => void;
  totalIncome: number;
  totalExpense: number;
  periodLabel: string;
}

const periodOptions: { value: AnalyticsPeriod; label: string }[] = [
  { value: "3M", label: "3 Bulan" },
  { value: "6M", label: "6 Bulan" },
  { value: "1Y", label: "1 Tahun" },
];

export function AnalyticsFilterBar({
  period,
  onPeriodChange,
  totalIncome,
  totalExpense,
  periodLabel,
}: AnalyticsFilterBarProps) {
  const balance = totalIncome - totalExpense;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex rounded-brutal border-3 border-base-ink overflow-hidden" role="group" aria-label="Periode analitik">
        {periodOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPeriodChange(opt.value)}
            className={cn(
              "px-4 py-2 font-display font-bold text-xs transition-colors",
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

      <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
        <div className="text-right">
          <p className="font-body text-[10px] text-base-ink/40 uppercase tracking-wider">Pemasukan</p>
          <p className="font-mono tabular-nums text-sm font-bold text-feedback-success">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="text-right">
          <p className="font-body text-[10px] text-base-ink/40 uppercase tracking-wider">Pengeluaran</p>
          <p className="font-mono tabular-nums text-sm font-bold text-feedback-danger">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="text-right">
          <p className="font-body text-[10px] text-base-ink/40 uppercase tracking-wider">Saldo</p>
          <p className={`font-mono tabular-nums text-sm font-bold ${balance >= 0 ? "text-feedback-success" : "text-feedback-danger"}`}>
            {formatCurrency(balance)}
          </p>
        </div>
        <span className="font-body text-[10px] text-base-ink/30 uppercase tracking-wider hidden sm:inline">{periodLabel}</span>
      </div>
    </div>
  );
}
