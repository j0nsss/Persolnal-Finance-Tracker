import { motion } from "framer-motion";
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
      <div className="flex rounded-brutal border-3 border-base-ink overflow-hidden" role="group" aria-label="Periode grafik">
        {periodOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onPeriodChange(opt)}
            className={cn(
              "relative px-4 py-1.5 font-display font-bold text-xs transition-colors",
              period === opt
                ? "bg-base-ink text-base-surface"
                : "bg-base-surface text-base-ink/60 hover:bg-base-ink/5",
            )}
            aria-pressed={period === opt}
            aria-label={`${opt} bulan`}
          >
            {period === opt && (
              <motion.span
                layoutId="periodBg"
                className="absolute inset-0 bg-base-ink"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{opt}</span>
          </button>
        ))}
      </div>

      <div className="flex rounded-brutal border-3 border-base-ink overflow-hidden" role="group" aria-label="Tipe grafik">
        {chartTypeOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChartTypeChange(opt.value)}
            className={cn(
              "relative px-4 py-1.5 font-display font-bold text-xs transition-colors",
              chartType === opt.value
                ? "text-base-ink"
                : "bg-base-surface text-base-ink/60 hover:bg-base-ink/5",
            )}
            aria-pressed={chartType === opt.value}
            aria-label={opt.label}
          >
            {chartType === opt.value && (
              <motion.span
                layoutId="chartTypeBg"
                className={cn(
                  "absolute inset-0",
                  opt.value === "income" && "bg-accent-lime",
                  opt.value === "expense" && "bg-accent-pink",
                  opt.value === "both" && "bg-base-ink",
                )}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={cn(
                "relative z-10",
                chartType === opt.value && opt.value === "both" && "text-base-surface",
                chartType === opt.value && opt.value === "expense" && "text-white",
              )}
            >
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
