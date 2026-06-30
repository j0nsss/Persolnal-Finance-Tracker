import { TrendingUp, TrendingDown, Wallet, BarChart3, CalendarDays } from "lucide-react";
import { formatCurrency } from "../../../lib/utils";
import { useCountUp } from "../../../hooks/useCountUp";

interface ForecastCardProps {
  forecastBalance: number;
  averageMonthlyCashflow: number;
  currentBalance: number;
  dailyAvgExpense: number;
}

export function ForecastCard({
  forecastBalance,
  averageMonthlyCashflow,
  currentBalance,
  dailyAvgExpense,
}: ForecastCardProps) {
  const animatedForecast = useCountUp(forecastBalance, 1.4);
  const isPositive = forecastBalance >= 0;

  return (
    <div className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-brutal border-2 border-base-ink p-2 ${isPositive ? "bg-accent-lime" : "bg-accent-pink"}`}
          >
            {isPositive ? (
              <TrendingUp size={18} strokeWidth={2.5} />
            ) : (
              <TrendingDown size={18} strokeWidth={2.5} className="text-white" />
            )}
          </div>
          <div>
            <p className="font-display font-bold text-sm leading-none">Proyeksi Saldo</p>
            <p className="font-body text-[11px] text-base-ink/40 mt-0.5">Akhir bulan ini</p>
          </div>
        </div>
      </div>

      <p
        className={`font-mono tracking-tight tabular-nums text-2xl font-bold ${isPositive ? "text-feedback-success" : "text-feedback-danger"}`}
      >
        {formatCurrency(animatedForecast)}
      </p>

      <div className="space-y-2 border-t-2 border-base-ink/10 pt-3">
        <div className="flex items-center justify-between text-[11px] bg-accent-lime/20 rounded-sm px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <Wallet size={12} strokeWidth={2} className="text-base-ink/30 shrink-0" />
            <span className="font-body text-base-ink/40">Saldo saat ini</span>
          </div>
          <span
            className={`font-mono tracking-tight tabular-nums font-bold ${currentBalance >= 0 ? "text-feedback-success" : "text-feedback-danger"}`}
          >
            {formatCurrency(currentBalance)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] bg-accent-blue/15 rounded-sm px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <BarChart3 size={12} strokeWidth={2} className="text-base-ink/30 shrink-0" />
            <span className="font-body text-base-ink/40">Rata-rata cashflow</span>
          </div>
          <span
            className={`font-mono tracking-tight tabular-nums font-bold ${averageMonthlyCashflow >= 0 ? "text-feedback-success" : "text-feedback-danger"}`}
          >
            {formatCurrency(averageMonthlyCashflow)}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] bg-accent-orange/15 rounded-sm px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={12} strokeWidth={2} className="text-base-ink/30 shrink-0" />
            <span className="font-body text-base-ink/40">Rata-rata pengeluaran</span>
          </div>
          <span className="font-mono tracking-tight tabular-nums font-bold text-accent-orange">
            {formatCurrency(dailyAvgExpense)}
            <span className="text-base-ink/30 font-body">/hari</span>
          </span>
        </div>
      </div>

      <div className="border-t-2 border-base-ink/10 pt-3">
        <p
          className={`font-body text-[11px] leading-relaxed flex items-center gap-1 ${isPositive ? "text-feedback-success" : "text-feedback-danger"}`}
        >
          {isPositive
            ? "Estimasi saldo positif akhir bulan. Pertahankan!"
            : "Proyeksi defisit. Kurangi pengeluaran tidak esensial."}
        </p>
      </div>
    </div>
  );
}
