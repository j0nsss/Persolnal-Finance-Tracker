import { useState, useMemo, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import type { Transaction } from "../../../types/transaction";
import { CATEGORY_LIST } from "../../../lib/constants";
import type { CategoryId } from "../../../types/category";
import { useCountUp } from "../../../hooks/useCountUp";
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
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.12 }}
      className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal-sm px-4 py-3"
    >
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
    </motion.div>
  );
}

function CenterLabel({ total, activeSlice }: { total: number; activeSlice: DonutSlice | null }) {
  const displayValue = activeSlice ? activeSlice.value : total;
  const displayTitle = activeSlice ? activeSlice.name : "Total";
  const displayColor = activeSlice ? activeSlice.color : undefined;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <motion.p
        key={displayTitle}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="font-display font-bold text-xs uppercase tracking-wider"
        style={{ color: displayColor ?? "rgba(0,0,0,0.4)" }}
      >
        {displayTitle}
      </motion.p>
      <motion.p
        key={`val-${displayValue}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="font-mono tabular-nums text-lg font-bold mt-0.5"
      >
        <CountUpLabel target={displayValue} />
      </motion.p>
    </div>
  );
}

function CountUpLabel({ target }: { target: number }) {
  const value = useCountUp(target, 0.6);
  return <>{formatCurrency(value)}</>;
}

function LegendItem({
  slice,
  isHidden,
  onClick,
}: {
  slice: DonutSlice;
  isHidden: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-brutal border-2 transition-all ${
        isHidden
          ? "border-base-ink/20 opacity-40"
          : "border-base-ink hover:bg-base-ink/5 hover:border-accent-orange"
      }`}
      aria-pressed={!isHidden}
      aria-label={`${slice.name}: ${formatCurrency(slice.value)}${isHidden ? " (tersembunyi)" : ""}`}
    >
      <span
        className="w-3 h-3 rounded-brutal shrink-0"
        style={{ backgroundColor: slice.color }}
        aria-hidden="true"
      />
      <span className="flex-1 text-left font-display font-bold text-sm">
        {slice.name}
      </span>
      <span className="font-mono tabular-nums text-xs font-bold" aria-hidden="true">
        {formatCurrency(slice.value)}
      </span>
    </motion.button>
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

  const activeSlice = activeIndex !== null && visibleSlices[activeIndex] ? visibleSlices[activeIndex] : null;

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
        <div className="text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-base-ink/20">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          <p className="font-body text-base-ink/40">Belum ada data pengeluaran</p>
        </div>
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
              outerRadius={activeIndex !== null ? 98 : 88}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={500}
              animationEasing="ease-out"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {visibleSlices.map((entry, index) => (
                <Cell
                  key={entry.categoryId}
                  fill={entry.color}
                  stroke="#000"
                  strokeWidth={activeIndex === index ? 3 : 2}
                  style={{ transition: "all 0.15s ease" }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <CenterLabel total={total} activeSlice={activeSlice} />
      </div>

      <div className="flex-1 w-full space-y-1.5">
        {slices.map((slice) => (
          <LegendItem
            key={slice.categoryId}
            slice={slice}
            isHidden={hiddenCategories.has(slice.categoryId)}
            onClick={() => toggleCategory(slice.categoryId)}
          />
        ))}
      </div>
    </div>
  );
}
