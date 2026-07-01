import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  type BarProps,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { id } from "date-fns/locale/id";
import { motion } from "framer-motion";
import type { Transaction } from "../../../types/transaction";
import { formatCurrency } from "../../../lib/utils";
import type { PeriodFilter } from "./ChartFilterBar";

type ChartTypeFilter = "income" | "expense" | "both";

interface MonthlyBarChartProps {
  transactions: Transaction[];
  period: PeriodFilter;
  chartType: ChartTypeFilter;
}

const monthsMap: Record<PeriodFilter, number> = {
  "3M": 3,
  "6M": 6,
  "1Y": 12,
};

const barColors = {
  expense: { base: "#FF3F8E", hover: "#FF6BA8" },
  income: { base: "#D4FF3F", hover: "#E0FF7A" },
};

interface CustomBarShapeProps extends BarProps {
  hoveredBar: string | null;
  payload?: { label?: string };
}

function CustomBarShape(props: CustomBarShapeProps) {
  const { x, y, width, height, fill, hoveredBar, payload } = props;
  if (x == null || y == null || width == null || height == null) return null;
  const key = payload?.label || "";
  const isHovered = hoveredBar === key;
  const yNum = y as number;
  const hNum = height as number;

  return (
    <rect
      x={x}
      y={isHovered ? yNum - 4 : yNum}
      width={width}
      height={isHovered ? hNum + 4 : hNum}
      fill={fill}
      stroke="#000"
      strokeWidth={isHovered ? 3 : 2}
      rx={2}
      ry={2}
      style={{ transition: "all 0.15s ease" }}
    />
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; fill: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.12 }}
      className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal-sm px-4 py-3"
    >
      <p className="font-display font-bold text-sm mb-2 border-b-2 border-base-ink/10 pb-1.5">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-brutal shrink-0"
            style={{ backgroundColor: entry.fill }}
          />
          <span className="font-body text-base-ink/60">{entry.name}:</span>
          <span className="font-mono tabular-nums font-bold">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

export function MonthlyBarChart({ transactions, period, chartType }: MonthlyBarChartProps) {
  const numMonths = monthsMap[period];
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const chartData = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string; income: number; expense: number }[] = [];
    for (let i = numMonths - 1; i >= 0; i--) {
      const date = subMonths(now, i);
      const key = format(date, "yyyy-MM");
      const label = format(key + "-01", "MMM", { locale: id });
      months.push({ key, label, income: 0, expense: 0 });
    }

    const startDates = months.map((m) => ({
      key: m.key,
      start: startOfMonth(new Date(m.key + "-01")).getTime(),
      end: endOfMonth(new Date(m.key + "-01")).getTime(),
    }));

    for (const t of transactions) {
      const tTime = new Date(t.date).getTime();
      const bucket = startDates.find(
        (s) => tTime >= s.start && tTime <= s.end,
      );
      if (bucket) {
        const entry = months.find((m) => m.key === bucket.key);
        if (entry) {
          if (t.type === "income") entry.income += t.amount;
          else entry.expense += t.amount;
        }
      }
    }
    return months;
  }, [transactions, numMonths]);

  const showIncome = chartType === "income" || chartType === "both";
  const showExpense = chartType === "expense" || chartType === "both";

  return (
    <div className="relative">
      {chartData.every((d) => d.income === 0 && d.expense === 0) ? (
        <div className="h-64 flex items-center justify-center border-3 border-dashed border-base-ink/20 rounded-brutal">
          <p className="font-body text-base-ink/40">Belum ada data transaksi</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            key={`${period}-${chartType}`}
            data={chartData}
            margin={{ top: 12, right: 8, left: -16, bottom: 0 }}
            barGap={4}
            barCategoryGap="20%"
            onMouseLeave={() => setHoveredBar(null)}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#000"
              strokeOpacity={0.1}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#000" }}
              tickLine={false}
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
            />
            <YAxis
              tick={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, fill: "#000" }}
              tickLine={false}
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
              tickFormatter={(v: number) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}jt` : v >= 1000 ? `${(v / 1000).toFixed(0)}rb` : `${v}`)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
            {showExpense && (
              <Bar
                dataKey="expense"
                name="Pengeluaran"
                fill={barColors.expense.base}
                shape={(props: BarProps) => (
                  <CustomBarShape {...props} hoveredBar={hoveredBar} />
                )}
                isAnimationActive={true}
                animationDuration={500}
                animationEasing="ease-out"
                onMouseEnter={(data: { label: string }) => setHoveredBar(data?.label)}
              />
            )}
            {showIncome && (
              <Bar
                dataKey="income"
                name="Pemasukan"
                fill={barColors.income.base}
                shape={(props: BarProps) => (
                  <CustomBarShape {...props} hoveredBar={hoveredBar} />
                )}
                isAnimationActive={true}
                animationDuration={500}
                animationEasing="ease-out"
                onMouseEnter={(data: { label: string }) => setHoveredBar(data?.label)}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
