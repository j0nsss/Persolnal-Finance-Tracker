import { useState, useMemo, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { Transaction } from "../../../types/transaction";
import { CATEGORY_LIST } from "../../../lib/constants";
import type { CategoryId } from "../../../types/category";
import { formatCurrency } from "../../../lib/utils";

interface CategoryDonutChartProps {
  transactions: Transaction[];
}

interface DonutSlice {
  name: string;
  value: number;
  color: string;
  categoryId: string;
}

const categoryMap = new Map(CATEGORY_LIST.map((c) => [c.id, c]));

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: DonutSlice }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal-sm px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-3 h-3 rounded-brutal shrink-0"
          style={{ backgroundColor: data.color }}
        />
        <p className="font-display font-bold text-sm">{data.name}</p>
      </div>
      <p className="font-mono tabular-nums text-sm font-bold">
        {formatCurrency(data.value)}
      </p>
    </div>
  );
}

export function CategoryDonutChart({ transactions }: CategoryDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());

  const slices = useMemo(() => {
    const expenseTxs = transactions.filter((t) => t.type === "expense");
    const totals = new Map<CategoryId, number>();
    for (const t of expenseTxs) {
      totals.set(t.categoryId, (totals.get(t.categoryId) || 0) + t.amount);
    }

    const result: DonutSlice[] = [];
    for (const [id, value] of totals) {
      const cat = categoryMap.get(id);
      if (cat) {
        result.push({
          name: cat.label,
          value,
          color: cat.color,
          categoryId: id,
        });
      }
    }
    result.sort((a, b) => b.value - a.value);
    return result;
  }, [transactions]);

  const visibleSlices = useMemo(
    () => slices.filter((s) => !hiddenCategories.has(s.categoryId)),
    [slices, hiddenCategories],
  );

  const total = useMemo(
    () => visibleSlices.reduce((sum, s) => sum + s.value, 0),
    [visibleSlices],
  );

  const centerLabel = useMemo(() => {
    if (activeIndex !== null && visibleSlices[activeIndex]) {
      return {
        title: visibleSlices[activeIndex].name,
        value: formatCurrency(visibleSlices[activeIndex].value),
      };
    }
    return {
      title: "Total",
      value: formatCurrency(total),
    };
  }, [activeIndex, visibleSlices, total]);

  const toggleCategory = useCallback((categoryId: string) => {
    setHiddenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  if (slices.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border-3 border-dashed border-base-ink/20 rounded-brutal">
        <p className="font-body text-base-ink/40">Belum ada data pengeluaran</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative shrink-0">
        <ResponsiveContainer width={240} height={240}>
          <PieChart>
            <Pie
              data={visibleSlices.map((s) => ({
                ...s,
                value: s.value || 0.001,
              }))}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={activeIndex !== null ? 95 : 85}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={400}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {visibleSlices.map((entry) => (
                <Cell
                  key={entry.categoryId}
                  fill={entry.color}
                  stroke="#000"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="font-display font-bold text-xs text-base-ink/60 uppercase tracking-wider">
            {centerLabel.title}
          </p>
          <p className="font-mono tabular-nums text-sm font-bold mt-0.5">
            {centerLabel.value}
          </p>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        {slices.map((slice) => {
          const isHidden = hiddenCategories.has(slice.categoryId);
          return (
            <button
              key={slice.categoryId}
              type="button"
              onClick={() => toggleCategory(slice.categoryId)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-brutal border-2 transition-all ${
                isHidden
                  ? "border-base-ink/20 opacity-40"
                  : "border-base-ink hover:bg-base-ink/5"
              }`}
            >
              <span
                className="w-3 h-3 rounded-brutal shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="flex-1 text-left font-display font-bold text-sm">
                {slice.name}
              </span>
              <span className="font-mono tabular-nums text-xs font-bold">
                {formatCurrency(slice.value)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
