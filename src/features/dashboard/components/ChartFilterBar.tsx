import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";

export type PeriodFilter = "3M" | "6M" | "1Y";

interface ChartFilterBarProps {
  period: PeriodFilter;
  onPeriodChange: (p: PeriodFilter) => void;
}

const periodOptions: PeriodFilter[] = ["3M", "6M", "1Y"];

export function ChartFilterBar({ period, onPeriodChange }: ChartFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-2 h-6 sm:h-8 bg-accent-lime rounded-r-full shrink-0" />
        <div className="w-2 h-6 sm:h-8 bg-accent-pink rounded-r-full shrink-0" />
        <p className="font-display font-bold text-sm sm:text-lg leading-tight">Arus Kas Bulanan</p>
      </div>
      <div className="flex rounded-brutal border-3 border-base-ink overflow-hidden self-start sm:self-auto" role="group" aria-label="Periode grafik">
        {periodOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onPeriodChange(opt)}
            className={cn(
              "relative px-3 sm:px-4 py-1.5 font-display font-bold text-xs transition-colors",
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
    </div>
  );
}
