import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency } from "../../../lib/utils";
import { useCountUp } from "../../../hooks/useCountUp";

interface ForecastCardProps {
  forecastBalance: number;
  averageMonthlyCashflow: number;
  periodLabel: string;
}

export function ForecastCard({ forecastBalance, averageMonthlyCashflow, periodLabel }: ForecastCardProps) {
  const animatedForecast = useCountUp(forecastBalance, 1.2);

  const isPositive = averageMonthlyCashflow >= 0;

  return (
    <div className="rounded-brutal border-3 border-base-ink bg-base-surface p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`rounded-brutal border-3 border-base-ink p-2 ${isPositive ? "bg-accent-lime" : "bg-accent-pink"}`}>
          {isPositive ? (
            <TrendingUp size={20} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={20} strokeWidth={2.5} className="text-white" />
          )}
        </div>
        <div>
          <p className="font-display font-bold text-sm">Proyeksi Saldo</p>
          <p className="font-body text-[11px] text-base-ink/50">Akhir bulan ini</p>
        </div>
      </div>

      <p className={`font-mono tabular-nums text-2xl font-bold mb-3 ${forecastBalance >= 0 ? "text-feedback-success" : "text-feedback-danger"}`}>
        {formatCurrency(animatedForecast)}
      </p>

      <div className="flex items-center gap-2 text-xs">
        {isPositive ? (
          <Minus size={12} strokeWidth={2.5} className="text-feedback-success" />
        ) : (
          <TrendingDown size={12} strokeWidth={2.5} className="text-feedback-danger" />
        )}
        <span className="font-body text-base-ink/50">
          Rata-rata arus kas:{' '}
          <span className={`font-mono tabular-nums font-bold ${isPositive ? "text-feedback-success" : "text-feedback-danger"}`}>
            {formatCurrency(averageMonthlyCashflow)}
          </span>
          /bulan ({periodLabel})
        </span>
      </div>

      <div className="mt-3 pt-3 border-t-2 border-base-ink/10">
        <p className="font-body text-[11px] text-base-ink/40 leading-relaxed">
          {forecastBalance >= 0
            ? "Estimasi saldo positif. Pertahankan tren ini!"
            : "Proyeksi defisit. Coba kurangi pengeluaran tidak esensial."}
        </p>
      </div>
    </div>
  );
}
