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
        "relative rounded-brutal border-3 border-base-ink bg-base-surface p-5 overflow-hidden group",
        accentClass,
      )}
      role="region"
      aria-label={`${title}: ${amount.toLocaleString("id-ID")} rupiah`}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -inset-full top-0 h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Icon with rotation on hover */}
      <motion.div
        className="absolute top-3 right-3 text-base-ink/20 group-hover:text-base-ink/30 transition-colors"
        aria-hidden="true"
        whileHover={{ rotate: 8 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        {icon}
      </motion.div>

      <p className="font-display font-bold text-sm text-base-ink/60 uppercase tracking-wider relative z-10">
        {title}
      </p>
      <p
        className="font-mono tabular-nums text-2xl font-bold mt-2 relative z-10 countup"
        aria-live="polite"
        aria-atomic="true"
      >
        <CountUpNumber target={amount} prefix="Rp " />
      </p>
      <div className="flex items-center gap-2 mt-1 relative z-10">
        <p className="font-body text-xs text-base-ink/40">{period}</p>
        {trend && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className={cn(
              "font-display font-bold text-xs inline-flex items-center gap-0.5",
              trend.isPositive ? "text-feedback-success" : "text-feedback-danger",
            )}
            aria-label={`${trend.isPositive ? "Naik" : "Turun"} ${Math.abs(trend.value)} persen dari bulan sebelumnya`}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {trend.isPositive
                ? <polyline points="18 15 12 9 6 15" />
                : <polyline points="6 9 12 15 18 9" />
              }
            </svg>
            {Math.abs(trend.value)}%
          </motion.span>
        )}
      </div>

      {/* Brutalist decorative corner */}
      <div className="absolute bottom-0 right-0 w-4 h-4 border-l-3 border-t-3 border-base-ink/10 rounded-tr-brutal pointer-events-none" />
    </motion.div>
  );
}
