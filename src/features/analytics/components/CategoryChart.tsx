import { useState, useMemo, useCallback } from "react";
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

export function CategoryChart({ data }: CategoryChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [legendHoveredIndex, setLegendHoveredIndex] = useState<number | null>(null);

  const visibleData = useMemo(
    () => data.filter((d) => !hiddenIds.has(d.categoryId)),
    [data, hiddenIds],
  );

  const activeIndex = hoveredIndex ?? legendHoveredIndex;
  const activeSlice = activeIndex != null ? visibleData[activeIndex] ?? null : null;

  const totalExpense = useMemo(
    () => visibleData.reduce((s, d) => s + d.total, 0),
    [visibleData],
  );

  const centerLabel = activeSlice
    ? { title: activeSlice.label, value: `${activeSlice.percentage}%` }
    : { title: "Total", value: formatCurrency(totalExpense) };

  const toggleVisibility = useCallback((id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center border-3 border-dashed border-base-ink/20 rounded-brutal">
        <p className="font-body text-base-ink/40">Belum ada data pengeluaran</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={visibleData.map((d) => ({ ...d, value: d.total || 0.001 }))}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={400}
              activeIndex={activeIndex != null ? activeIndex : undefined}
              activeShape={(props: unknown) => {
                const p = props as { cx: number; cy: number; innerRadius: number; outerRadius: number; startAngle: number; endAngle: number; fill: string };
                return (
                  <g>
                    <path
                      d={describeArc(p.cx, p.cy, p.outerRadius + 8, p.startAngle, p.endAngle)}
                      fill={p.fill}
                      stroke="#000"
                      strokeWidth={2}
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
              {visibleData.map((entry, index) => (
                <Cell
                  key={entry.categoryId}
                  fill={entry.color}
                  stroke="#000"
                  strokeWidth={2}
                  opacity={
                    hoveredIndex != null || legendHoveredIndex != null
                      ? index === hoveredIndex || index === legendHoveredIndex
                        ? 1
                        : 0.4
                      : 1
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="font-display font-bold text-[10px] text-base-ink/50 uppercase tracking-wider">
            {centerLabel.title}
          </p>
          <p className="font-mono tabular-nums text-sm font-bold mt-0.5">
            {centerLabel.value}
          </p>
        </div>
      </div>

      <div className="w-full space-y-1.5" role="group" aria-label="Legenda kategori">
        {data.map((item, index) => {
          const isHidden = hiddenIds.has(item.categoryId);
          const isHovered = legendHoveredIndex === index || hoveredIndex === index;

          return (
            <button
              key={item.categoryId}
              type="button"
              onClick={() => toggleVisibility(item.categoryId)}
              onMouseEnter={() => setLegendHoveredIndex(index)}
              onMouseLeave={() => setLegendHoveredIndex(null)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-brutal border-2 transition-all text-left",
                isHidden
                  ? "border-base-ink/20 opacity-40"
                  : isHovered
                    ? "border-base-ink bg-base-ink/5"
                    : "border-transparent hover:border-base-ink/40",
              )}
              aria-pressed={!isHidden}
              aria-label={`${item.label}: ${item.percentage}% (${formatCurrency(item.total)})${isHidden ? " — tersembunyi" : ""}`}
            >
              <span
                className="w-3 h-3 rounded-brutal shrink-0"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="flex-1 font-display font-bold text-xs truncate">
                {item.label}
              </span>
              <span className="font-mono tabular-nums text-[11px] font-bold text-base-ink/60">
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
