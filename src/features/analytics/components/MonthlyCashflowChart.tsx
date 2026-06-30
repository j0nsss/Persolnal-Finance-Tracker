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
import type { MonthlyCashflowItem } from "../hooks/useAnalyticsData";
import { formatCurrency } from "../../../lib/utils";

interface MonthlyCashflowChartProps {
  data: MonthlyCashflowItem[];
}

function CustomBarShape(props: BarProps) {
  const { x, y, width, height, fill } = props;
  if (x == null || y == null || width == null || height == null) return null;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      stroke="#000"
      strokeWidth={2}
      rx={2}
      ry={2}
    />
  );
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
  fill: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal-sm px-4 py-3">
      <p className="font-display font-bold text-sm mb-2">{label}</p>
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
    </div>
  );
}

export function MonthlyCashflowChart({ data }: MonthlyCashflowChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center border-3 border-dashed border-base-ink/20 rounded-brutal">
        <p className="font-body text-base-ink/40">Belum ada data</p>
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          barGap={4}
          barCategoryGap="20%"
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
            tickFormatter={(v: number) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(0)}jt`
                : v >= 1000
                  ? `${(v / 1000).toFixed(0)}rb`
                  : `${v}`
            }
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
          <Bar
            dataKey="expense"
            name="Pengeluaran"
            fill="#FF3F8E"
            shape={(props: BarProps) => <CustomBarShape {...props} />}
            isAnimationActive={true}
            animationDuration={400}
          />
          <Bar
            dataKey="income"
            name="Pemasukan"
            fill="#D4FF3F"
            shape={(props: BarProps) => <CustomBarShape {...props} />}
            isAnimationActive={true}
            animationDuration={400}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
