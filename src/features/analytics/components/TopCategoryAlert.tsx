import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../../lib/utils";

interface TopCategoryAlertProps {
  categoryId: string | null;
  label: string | null;
  color: string | null;
  total: number | null;
  percentage: number | null;
  message: string;
}

export function TopCategoryAlert({
  categoryId,
  label,
  color,
  total,
  percentage,
  message,
}: TopCategoryAlertProps) {
  if (!categoryId || !label) {
    return (
      <div className="rounded-brutal border-3 border-base-ink bg-base-surface p-5 flex items-center gap-3">
        <div className="rounded-brutal border-3 border-base-ink bg-base-ink/5 p-2">
          <AlertTriangle size={20} strokeWidth={2.5} className="text-base-ink/30" />
        </div>
        <p className="font-body text-sm text-base-ink/40">Belum cukup data untuk analisis.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ rotate: -1 }}
      animate={{ rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="rounded-brutal border-3 border-base-ink bg-base-surface p-5"
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={{ rotate: 6 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="rounded-brutal border-3 border-base-ink shrink-0 p-2"
          style={{ backgroundColor: color ?? "#6B7280" }}
        >
          <AlertTriangle size={20} strokeWidth={2.5} className="text-white" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm mb-0.5">
            Kebocoran di <span style={{ color: color ?? undefined }}>{label}</span>
          </p>
          <p className="font-body text-xs text-base-ink/70 leading-relaxed">
            {message}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <span className="font-mono tabular-nums text-sm font-bold" style={{ color: color ?? undefined }}>
              {formatCurrency(total ?? 0)}
            </span>
            <span className="font-body text-[11px] text-base-ink/40">
              ({percentage}% dari total pengeluaran)
            </span>
          </div>

          <div className="flex items-center gap-1 mt-2 text-feedback-danger">
            <span className="font-display font-bold text-[11px] uppercase tracking-wider">Waspada</span>
            <ArrowRight size={12} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
