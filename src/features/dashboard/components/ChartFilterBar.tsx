import { cn } from "../../../lib/utils";

export type PeriodFilter = "3M" | "6M" | "1Y";
export type ChartTypeFilter = "income" | "expense" | "both";

interface ChartFilterBarProps {
  period: PeriodFilter;
  onPeriodChange: (p: PeriodFilter) => void;
  chartType: ChartTypeFilter;
  onChartTypeChange: (t: ChartTypeFilter) => void;
}

const periodOptions: PeriodFilter[] = ["3M", "6M", "1Y"];

const chartTypeOptions: { value: ChartTypeFilter; label: string }[] = [
  { value: "expense", label: "Pengeluaran" },
  { value: "income", label: "Pemasukan" },
  { value: "both", label: "Semua" },
];

export function ChartFilterBar({
  period,
  onPeriodChange,
  chartType,
  onChartTypeChange,
}: ChartFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      <div className="flex rounded-brutal border-3 border-base-ink overflow-hidden">
        {periodOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onPeriodChange(opt)}
            className={cn(
              "px-4 py-1.5 font-display font-bold text-xs transition-colors",
              period === opt
                ? "bg-base-ink text-base-surface"
                : "bg-base-surface text-base-ink/60 hover:bg-base-ink/5",
            )}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex rounded-brutal border-3 border-base-ink overflow-hidden">
        {chartTypeOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChartTypeChange(opt.value)}
            className={cn(
              "px-4 py-1.5 font-display font-bold text-xs transition-colors",
              chartType === opt.value
                ? opt.value === "income"
                  ? "bg-accent-lime text-base-ink"
                  : opt.value === "expense"
                    ? "bg-accent-pink text-white"
                    : "bg-base-ink text-base-surface"
                : "bg-base-surface text-base-ink/60 hover:bg-base-ink/5",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
