import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import type { AnalyticsPeriod } from "../hooks/useAnalyticsData";

interface PeriodToggleProps {
  period: AnalyticsPeriod;
  onChange: (p: AnalyticsPeriod) => void;
}

const options: { value: AnalyticsPeriod; label: string }[] = [
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "1Y", label: "1Y" },
  { value: "ALL", label: "ALL" },
];

export function PeriodToggle({ period, onChange }: PeriodToggleProps) {
  return (
    <div
      className="inline-flex rounded-brutal border-3 border-base-ink overflow-hidden divide-x-3 divide-base-ink"
      role="group"
      aria-label="Periode analitik"
    >
      {options.map((opt) => (
        <motion.button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          whileHover={period !== opt.value ? { x: -1, y: -1 } : undefined}
          whileTap={{ x: 1, y: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "px-4 py-2 font-display font-bold text-xs transition-all",
            period === opt.value
              ? "bg-base-ink text-accent-lime"
              : "bg-base-surface text-base-ink/60 hover:bg-base-ink/5",
          )}
          aria-pressed={period === opt.value}
        >
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}
