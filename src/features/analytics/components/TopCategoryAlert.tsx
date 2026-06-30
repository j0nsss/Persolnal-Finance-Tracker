import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { formatCurrency, cn } from "../../../lib/utils";
import { useCountUp } from "../../../hooks/useCountUp";

interface TopCategoryAlertProps {
  categoryId: string | null;
  label: string | null;
  color: string | null;
  total: number | null;
  percentage: number | null;
  message: string;
  dailyAvg: number | null;
}

export function TopCategoryAlert({
  categoryId,
  label,
  color,
  total,
  percentage,
  message,
  dailyAvg,
}: TopCategoryAlertProps) {
  const animatedTotal = useCountUp(total ?? 0, 1);

  const hasWarning = categoryId && label;

  return (
    <div
      className={cn(
        "rounded-brutal border-3 shadow-brutal p-5",
        hasWarning ? "border-feedback-danger bg-amber-50" : "border-base-ink bg-base-surface",
      )}
    >
      {!hasWarning ? (
        <div className="flex items-center gap-3">
          <div className="rounded-brutal border-2 border-base-ink/20 bg-base-ink/5 p-2">
            <AlertTriangle size={18} strokeWidth={2.5} className="text-base-ink/30" />
          </div>
          <p className="font-body text-sm text-base-ink/40">Belum cukup data untuk analisis.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, 4, 0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-brutal border-2 border-base-ink shrink-0 p-2"
              style={{ backgroundColor: color ?? "#6B7280" }}
            >
              <AlertTriangle size={18} strokeWidth={2.5} className="text-white" />
            </motion.div>

            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm">
                Kebocoran di{" "}
                <span style={{ color: color ?? undefined }}>{label}</span>
              </p>
              <p className="font-body text-xs text-base-ink/60 mt-0.5 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm border-t-2 border-base-ink/10 pt-3">
            <span className="font-body text-[11px] text-base-ink/40">Total bulan ini</span>
            <span
              className="font-mono tracking-tight tabular-nums font-bold"
              style={{ color: color ?? undefined }}
            >
              {formatCurrency(animatedTotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="font-body text-base-ink/40">Persentase</span>
            <span className="font-mono tracking-tight tabular-nums font-bold text-base-ink/70">
              {percentage}%
            </span>
          </div>

          {dailyAvg != null && dailyAvg > 0 && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-body text-base-ink/40">Rata-rata per hari</span>
              <span className="font-mono tracking-tight tabular-nums font-bold text-base-ink/70">
                {formatCurrency(dailyAvg)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 mt-1 text-feedback-danger">
            <span className="font-display font-bold text-[10px] uppercase tracking-wider">
              Perlu Evaluasi
            </span>
            <ArrowRight size={12} strokeWidth={2.5} />
          </div>
        </div>
      )}
    </div>
  );
}
