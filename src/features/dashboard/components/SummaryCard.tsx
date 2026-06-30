import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { CountUpNumber } from "../../../components/ui/CountUpNumber/CountUpNumber";
import { cn } from "../../../lib/utils";

interface SummaryCardProps {
  title: string;
  amount: number;
  period: string;
  icon: ReactNode;
  accentClass?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function SummaryCard({
  title,
  amount,
  period,
  icon,
  accentClass = "",
  trend,
}: SummaryCardProps) {
  return (
    <motion.div
      variants={{
        rest: { x: 0, y: 0, boxShadow: "6px 6px 0px #000000" },
        hover: { x: -3, y: -3, boxShadow: "9px 9px 0px #000000" },
      }}
      initial="rest"
      whileHover="hover"
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "relative rounded-brutal border-3 border-base-ink bg-base-surface p-5 overflow-hidden",
        accentClass,
      )}
      role="region"
      aria-label={`${title}: ${amount.toLocaleString("id-ID")} rupiah`}
    >
      <div className="absolute top-3 right-3 text-base-ink/20" aria-hidden="true">
        {icon}
      </div>
      <p className="font-display font-bold text-sm text-base-ink/60 uppercase tracking-wider">
        {title}
      </p>
      <p className="font-mono tabular-nums text-2xl font-bold mt-2" aria-live="polite" aria-atomic="true">
        <CountUpNumber target={amount} prefix="Rp" />
      </p>
      <div className="flex items-center gap-2 mt-1">
        <p className="font-body text-xs text-base-ink/40">{period}</p>
        {trend && (
          <span
            className={`font-display font-bold text-xs ${
              trend.isPositive ? "text-feedback-success" : "text-feedback-danger"
            }`}
            aria-label={`${trend.isPositive ? "Naik" : "Turun"} ${Math.abs(trend.value)} persen dari bulan sebelumnya`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
