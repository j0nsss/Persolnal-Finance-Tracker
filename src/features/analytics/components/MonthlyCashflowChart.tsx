import { useId } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyCashflowItem } from "../hooks/useAnalyticsData";
import { formatCurrency } from "../../../lib/utils";

interface MonthlyCashflowChartProps {
  data: MonthlyCashflowItem[];
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
  fill: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const incomeEntry = payload.find((p) => p.dataKey === "income");
  const expenseEntry = payload.find((p) => p.dataKey === "expense");
  const income = incomeEntry?.value ?? 0;
  const expense = expenseEntry?.value ?? 0;
  const net = income - expense;

  return (
    <div className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal px-4 py-3 min-w-[180px]">
      <p className="font-display font-bold text-sm mb-2 border-b-2 border-base-ink/10 pb-1.5">
        {label}
      </p>
      {incomeEntry && (
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0 bg-cyan-400" />
          <span className="font-body text-base-ink/60">Pemasukan:</span>
          <span className="font-mono tracking-tight tabular-nums font-bold ml-auto text-feedback-success">
            {formatCurrency(incomeEntry.value)}
          </span>
        </div>
      )}
      {expenseEntry && (
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0 bg-accent-pink" />
          <span className="font-body text-base-ink/60">Pengeluaran:</span>
          <span className="font-mono tracking-tight tabular-nums font-bold ml-auto text-feedback-danger">
            {formatCurrency(expenseEntry.value)}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm mt-1.5 pt-1.5 border-t-2 border-base-ink/10">
        <span className="font-body text-base-ink/60">Net:</span>
        <span
          className={`font-mono tracking-tight tabular-nums font-bold ml-auto ${net > 0 ? "text-feedback-success" : net < 0 ? "text-feedback-danger" : "text-base-ink/50"}`}
        >
          {formatCurrency(net)}
        </span>
      </div>
    </div>
  );
}

export function MonthlyCashflowChart({ data }: MonthlyCashflowChartProps) {
  const gradientId = useId();

  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center border-2 border-dashed border-base-ink/20 rounded-brutal">
        <p className="font-body text-base-ink/40">Belum ada data</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);

  return (
    <div className="h-72">
      <svg width={0} height={0} className="absolute">
        <defs>
          <linearGradient id={`${gradientId}-income`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id={`${gradientId}-expense`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF007A" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#FF007A" stopOpacity={0.05} />
          </linearGradient>
        </defs>
      </svg>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#000"
            strokeOpacity={0.1}
            vertical={false}
            horizontal={true}
          />
          <XAxis
            dataKey="label"
            tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#000" }}
            tickLine={false}
            axisLine={{ stroke: "#000", strokeWidth: 2 }}
          />
          <YAxis
            domain={[0, maxVal * 1.15]}
            tick={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, fill: "#000" }}
            tickLine={false}
            axisLine={{ stroke: "#000", strokeWidth: 2 }}
            tickFormatter={(v: number) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(0)}jt`
                : v >= 1000
                  ? `${(v / 1000).toFixed(0)}rb`
                  : `${v}`
            }
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#000", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.15 }}
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Pengeluaran"
            stroke="#FF007A"
            strokeWidth={2.5}
            fill={`url(#${gradientId}-expense)`}
            dot={{ r: 3, fill: "#FF007A", stroke: "#000", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "#FF007A", stroke: "#000", strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={600}
            animationEasing="ease-in-out"
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Pemasukan"
            stroke="#00F0FF"
            strokeWidth={2.5}
            fill={`url(#${gradientId}-income)`}
            dot={{ r: 3, fill: "#00F0FF", stroke: "#000", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "#00F0FF", stroke: "#000", strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={600}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
