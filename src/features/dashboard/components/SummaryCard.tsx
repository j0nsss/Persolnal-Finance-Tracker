import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { CountUpNumber } from "../../../components/ui/CountUpNumber/CountUpNumber";
import { cn } from "../../../lib/utils";

interface SummaryCardProps {
  title: string;
  amount: number;
  period: string;
  icon: ReactNode;
  bgClass: string;
  sparklineData: number[];
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
  bgClass,
  sparklineData,
  trend,
}: SummaryCardProps) {
  const chartPoints = sparklineData.map((v, i) => ({ i, v }));

  return (
    <motion.div
      whileHover={{ scale: 1.01, translateY: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative rounded-brutal border-3 border-base-ink shadow-brutal p-5 overflow-hidden",
        bgClass,
      )}
      role="region"
      aria-label={`${title}: ${amount.toLocaleString("id-ID")} rupiah`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="font-display font-bold text-[11px] text-black/50 uppercase tracking-wider">
            {title}
          </p>
          <p className="font-mono tabular-nums text-2xl font-bold mt-1 text-black">
            <CountUpNumber target={amount} prefix="Rp " />
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-body text-[10px] text-black/40">{period}</p>
            {trend && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className={cn(
                  "font-display font-bold text-[10px] inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-brutal border-2 border-black/20",
                  trend.isPositive ? "text-black bg-white/30" : "text-black bg-white/30",
                )}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  {trend.isPositive
                    ? <polyline points="18 15 12 9 6 15" />
                    : <polyline points="6 9 12 15 18 9" />
                  }
                </svg>
                {Math.abs(trend.value)}%
              </motion.span>
            )}
          </div>
        </div>
        <motion.div
          className="text-black/25"
          whileHover={{ rotate: 8, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          {icon}
        </motion.div>
      </div>

      <div className="absolute bottom-1 right-1 w-24 h-12 opacity-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartPoints}>
            <Line type="monotone" dataKey="v" stroke="#000" strokeWidth={2} dot={false} isAnimationActive={true} animationDuration={800} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute bottom-0 right-0 w-4 h-4 border-l-3 border-t-3 border-black/10 rounded-tr-brutal pointer-events-none" />
    </motion.div>
  );
}
