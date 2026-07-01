import { useMemo, useId } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { id } from "date-fns/locale/id";
import type { Transaction } from "../../../types/transaction";
import { formatCurrency } from "../../../lib/utils";
import type { PeriodFilter } from "./ChartFilterBar";

interface MonthlyAreaChartProps {
  transactions: Transaction[];
  period: PeriodFilter;
}

const monthsMap: Record<PeriodFilter, number> = {
  "3M": 3,
  "6M": 6,
  "1Y": 12,
};

interface TooltipEntry {
  name: string;
  value: number;
  fill: string;
  dataKey: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;

  const incomeEntry = payload.find((p) => p.dataKey === "income");
  const expenseEntry = payload.find((p) => p.dataKey === "expense");
  const income = incomeEntry?.value ?? 0;
  const expense = expenseEntry?.value ?? 0;
  const net = income - expense;

  return (
    <div className="rounded-brutal border-3 border-base-ink bg-base-ink shadow-brutal px-4 py-3 min-w-[180px]">
      <p className="font-display font-bold text-sm text-white mb-2 border-b-2 border-white/10 pb-1.5">
        {label}
      </p>
      {incomeEntry && (
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0 bg-[#D4FF3F]" />
          <span className="font-body text-white/60">Pemasukan:</span>
          <span className="font-mono tracking-tight tabular-nums font-bold ml-auto text-[#D4FF3F]">
            {formatCurrency(incomeEntry.value)}
          </span>
        </div>
      )}
      {expenseEntry && (
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0 bg-[#FF3F8E]" />
          <span className="font-body text-white/60">Pengeluaran:</span>
          <span className="font-mono tracking-tight tabular-nums font-bold ml-auto text-[#FF3F8E]">
            {formatCurrency(expenseEntry.value)}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm mt-1.5 pt-1.5 border-t-2 border-white/10">
        <span className="font-body text-white/60">Net:</span>
        <span className={`font-mono tracking-tight tabular-nums font-bold ml-auto ${net > 0 ? "text-[#D4FF3F]" : net < 0 ? "text-[#FF3F8E]" : "text-white/50"}`}>
          {formatCurrency(net)}
        </span>
      </div>
    </div>
  );
}

export function MonthlyAreaChart({ transactions, period }: MonthlyAreaChartProps) {
  const gradientId = useId();
  const numMonths = monthsMap[period];

  const chartData = useMemo(() => {
    const now = new Date();
    const months: { label: string; income: number; expense: number }[] = [];
    for (let i = numMonths - 1; i >= 0; i--) {
      const date = subMonths(now, i);
      const label = format(date, "MMM", { locale: id });
      months.push({ label, income: 0, expense: 0 });
    }

    const startDates = months.map((_, i) => {
      const date = subMonths(now, numMonths - 1 - i);
      return {
        start: startOfMonth(date).getTime(),
        end: endOfMonth(date).getTime(),
      };
    });

    for (const t of transactions) {
      const tTime = new Date(t.date).getTime();
      const idx = startDates.findIndex((s) => tTime >= s.start && tTime <= s.end);
      if (idx !== -1) {
        if (t.type === "income") months[idx].income += t.amount;
        else months[idx].expense += t.amount;
      }
    }
    return months;
  }, [transactions, numMonths]);

  const maxVal = Math.max(...chartData.flatMap((d) => [d.income, d.expense]), 1);

  if (chartData.every((d) => d.income === 0 && d.expense === 0)) {
    return (
      <div className="h-72 flex items-center justify-center border-3 border-dashed border-base-ink/20 rounded-brutal">
        <p className="font-body text-base-ink/40">Belum ada data transaksi</p>
      </div>
    );
  }

  return (
    <div className="h-72">
      <svg width={0} height={0} className="absolute">
        <defs>
          <linearGradient id={`${gradientId}-income`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4FF3F" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#D4FF3F" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id={`${gradientId}-expense`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF3F8E" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#FF3F8E" stopOpacity={0.05} />
          </linearGradient>
        </defs>
      </svg>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#000" strokeOpacity={0.1} vertical={false} horizontal={true} />
          <XAxis dataKey="label" tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#000" }} tickLine={false} axisLine={{ stroke: "#000", strokeWidth: 2 }} />
          <YAxis domain={[0, maxVal * 1.15]} tick={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, fill: "#000" }} tickLine={false} axisLine={{ stroke: "#000", strokeWidth: 2 }} tickFormatter={(v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}jt` : v >= 1000 ? `${(v / 1000).toFixed(0)}rb` : `${v}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#000", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.15 }} />
          <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="#000" strokeWidth={3} fill={`url(#${gradientId}-expense)`} dot={{ r: 3, fill: "#FF3F8E", stroke: "#000", strokeWidth: 2 }} activeDot={{ r: 5, fill: "#FF3F8E", stroke: "#000", strokeWidth: 2 }} isAnimationActive={true} animationDuration={600} animationEasing="ease-in-out" />
          <Area type="monotone" dataKey="income" name="Pemasukan" stroke="#000" strokeWidth={3} fill={`url(#${gradientId}-income)`} dot={{ r: 3, fill: "#D4FF3F", stroke: "#000", strokeWidth: 2 }} activeDot={{ r: 5, fill: "#D4FF3F", stroke: "#000", strokeWidth: 2 }} isAnimationActive={true} animationDuration={600} animationEasing="ease-in-out" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
