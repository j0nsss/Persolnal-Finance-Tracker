import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { UtensilsCrossed, Car, Home, Gamepad2, HeartPulse, ShoppingBag, Briefcase, TrendingUp, Ellipsis, type LucideIcon } from "lucide-react";
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
  percentage: number;
}

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  Home,
  Gamepad2,
  HeartPulse,
  ShoppingBag,
  Briefcase,
  TrendingUp,
  Ellipsis,
};

const categoryMap = new Map(CATEGORY_LIST.map((c) => [c.id, c]));

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
        className="font-display font-bold text-[10px] uppercase tracking-widest"
        style={{ color: displayColor ?? "rgba(0,0,0,0.4)" }}
      >
        {displayTitle}
      </motion.p>
      <motion.p
        key={`val-${displayValue}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="font-mono tabular-nums text-base font-bold mt-0.5"
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

export function CategoryDonutChart({ transactions }: CategoryDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalExpense = useMemo(
    () => transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [transactions],
  );

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
          percentage: totalExpense > 0 ? Math.round((value / totalExpense) * 100) : 0,
        });
      }
    }
    result.sort((a, b) => b.value - a.value);
    return result;
  }, [transactions, totalExpense]);

  const activeSlice = activeIndex !== null && slices[activeIndex] ? slices[activeIndex] : null;

  if (slices.length === 0) {
    return (
      <div className="h-48 md:h-64 flex items-center justify-center border-3 border-dashed border-base-ink/20 rounded-brutal">
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
      <div className="relative w-full max-w-[220px] mx-auto md:mx-0 shrink-0">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={slices.map((s) => ({ ...s, value: s.value || 0.001 }))}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={activeIndex !== null ? 90 : 82}
              paddingAngle={4}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={500}
              animationEasing="ease-out"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {slices.map((entry, index) => (
                <Cell
                  key={entry.categoryId}
                  fill={entry.color}
                  stroke="#000"
                  strokeWidth={activeIndex === index ? 3 : 2}
                  style={{ transition: "all 0.15s ease" }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <CenterLabel total={totalExpense} activeSlice={activeSlice} />
      </div>

      <div className="flex-1 w-full grid grid-cols-2 gap-2">
        {slices.map((slice, index) => {
          const cat = categoryMap.get(slice.categoryId as CategoryId);
          const IconComponent = cat ? iconMap[cat.icon] || Ellipsis : Ellipsis;
          const isActive = activeIndex === index;

          return (
            <motion.div
              key={slice.categoryId}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              whileHover={{ scale: 1.02, translateY: -1 }}
              className={`rounded-brutal border-3 border-base-ink bg-base-surface p-3 flex flex-col gap-1.5 cursor-pointer transition-shadow ${isActive ? "shadow-brutal" : "shadow-brutal-sm"}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-brutal border-2 border-base-ink p-1.5 shrink-0"
                  style={{ backgroundColor: slice.color }}
                >
                  <IconComponent size={14} strokeWidth={2.5} className="text-white" />
                </div>
                <span className="font-display font-bold text-[11px] text-base-ink leading-tight truncate">
                  {slice.name}
                </span>
              </div>
              <span className="font-mono tracking-tight tabular-nums text-sm font-bold text-base-ink">
                {formatCurrency(slice.value)}
              </span>
              <div className="w-full h-2 rounded-sm border border-base-ink bg-base-ink/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${slice.percentage}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-sm"
                  style={{ backgroundColor: slice.color }}
                />
              </div>
              <span className="font-mono text-[9px] text-base-ink/40 font-bold">
                {slice.percentage}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
