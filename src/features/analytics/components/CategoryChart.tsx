import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { CategoryBreakdownItem } from "../hooks/useAnalyticsData";
import { formatCurrency } from "../../../lib/utils";
import { cn } from "../../../lib/utils";

interface CategoryChartProps {
  data: CategoryBreakdownItem[];
}

const SLICE_COLORS = ["#9E00FF", "#FF6B1A", "#FFD600", "#00C853"];

export function CategoryChart({ data }: CategoryChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [legendHoveredIndex, setLegendHoveredIndex] = useState<number | null>(null);

  const activeIndex = hoveredIndex ?? legendHoveredIndex;
  const activeSlice = activeIndex != null ? data[activeIndex] ?? null : null;

  const totalExpense = useMemo(
    () => data.reduce((s, d) => s + d.total, 0),
    [data],
  );

  const centerLabel = activeSlice
    ? { title: activeSlice.label, subtitle: `${activeSlice.percentage}%` }
    : { title: "TOTAL", subtitle: formatCurrency(totalExpense) };

  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center border-2 border-dashed border-base-ink/20 rounded-brutal">
        <p className="font-body text-base-ink/40">Belum ada data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <ResponsiveContainer width={220} height={220}>
          <PieChart>
            <Pie
              data={data.map((d) => ({ ...d, value: d.total || 0.001 }))}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={500}
              animationEasing="ease-in-out"
              activeIndex={activeIndex != null ? activeIndex : undefined}
              activeShape={(props: unknown) => {
                const p = props as { cx: number; cy: number; innerRadius: number; outerRadius: number; startAngle: number; endAngle: number; fill: string };
                return (
                  <g>
                    <path
                      d={describeArc(p.cx, p.cy, p.outerRadius + 6, p.startAngle, p.endAngle)}
                      fill={p.fill}
                      stroke="#000"
                      strokeWidth={1.5}
                    />
                    <path
                      d={describeArc(p.cx, p.cy, p.innerRadius, p.startAngle, p.endAngle)}
                      fill={p.fill}
                  stroke="#000"
                  strokeWidth={2}
                />
              </g>
            );
          }}
          onMouseEnter={(_, index) => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.categoryId}
              fill={SLICE_COLORS[index % SLICE_COLORS.length]}
              stroke="#000"
              strokeWidth={2}
                  opacity={
                    hoveredIndex != null || legendHoveredIndex != null
                      ? index === hoveredIndex || index === legendHoveredIndex
                        ? 1
                        : 0.3
                      : 1
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2">
          <p className="font-display font-bold text-[10px] text-base-ink/40 uppercase tracking-widest">
            {centerLabel.title}
          </p>
          <p className="font-mono tracking-tight tabular-nums text-lg font-bold mt-0.5 leading-tight text-center break-words max-w-full">
            {centerLabel.subtitle}
          </p>
        </div>
      </div>

      <div
        className="w-full grid grid-cols-2 gap-x-2 gap-y-1"
        role="group"
        aria-label="Legenda kategori"
      >
        {data.map((item, index) => {
          const isHovered = legendHoveredIndex === index || hoveredIndex === index;
          const sliceColor = SLICE_COLORS[index % SLICE_COLORS.length];

          return (
            <button
              key={item.categoryId}
              type="button"
              onMouseEnter={() => setLegendHoveredIndex(index)}
              onMouseLeave={() => setLegendHoveredIndex(null)}
              className={cn(
                "flex items-center gap-2 px-2.5 py-2 rounded-brutal border-2 transition-all text-left",
                isHovered
                  ? "border-base-ink bg-base-ink/5"
                  : "border-transparent hover:border-base-ink/30",
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: sliceColor }}
              />
              <span className="flex-1 font-display font-semibold text-[11px] text-base-ink/80 truncate leading-tight">
                {item.label}
              </span>
              <span className="font-mono tracking-tight tabular-nums text-[10px] font-bold text-base-ink/50">
                {item.percentage}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", cx, cy,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z",
  ].join(" ");
}
