import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { startOfMonth, endOfMonth } from "date-fns";
import { CATEGORY_LIST } from "../../../lib/constants";
import { formatCurrency } from "../../../lib/utils";
import type { Transaction } from "../../../types/transaction";
import type { CategoryId } from "../../../types/category";

interface TopCategoryCardProps {
  transactions: Transaction[];
}

const categoryLabelMap = new Map(CATEGORY_LIST.map((c) => [c.id, c.label]));

const BAR_COLORS = ["#FF3F8E", "#3F8EFF", "#D4FF3F"];

type Mode = "today" | "month";

export function TopCategoryCard({ transactions }: TopCategoryCardProps) {
  const [mode, setMode] = useState<Mode>("today");

  const topCategories = useMemo(() => {
    const now = new Date();
    let filtered: Transaction[];

    if (mode === "today") {
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999);
      const tsStart = todayStart.getTime();
      const tsEnd = todayEnd.getTime();
      filtered = transactions.filter((t) => {
        if (t.type !== "expense") return false;
        const tTime = new Date(t.date).getTime();
        return tTime >= tsStart && tTime <= tsEnd;
      });
    } else {
      const msStart = startOfMonth(now).getTime();
      const msEnd = endOfMonth(now).getTime();
      filtered = transactions.filter((t) => {
        if (t.type !== "expense") return false;
        const tTime = new Date(t.date).getTime();
        return tTime >= msStart && tTime <= msEnd;
      });
    }

    const grouped: Record<string, number> = {};
    for (const t of filtered) {
      grouped[t.categoryId] = (grouped[t.categoryId] || 0) + t.amount;
    }

    const sorted = Object.entries(grouped)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    const total = sorted.reduce((s, [, v]) => s + v, 0);

    return sorted.map(([id, amount], i) => ({
      id: id as CategoryId,
      label: categoryLabelMap.get(id as CategoryId) ?? "Lainnya",
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: BAR_COLORS[i % BAR_COLORS.length],
    }));
  }, [transactions, mode]);

  const toggleButton = (value: Mode, label: string) => (
    <button
      key={value}
      onClick={() => setMode(value)}
      className={`px-3 py-1 font-display font-bold text-[10px] uppercase tracking-wider transition-all duration-200 ${
        mode === value
          ? "bg-black text-white"
          : "bg-white text-black/60 hover:text-black hover:bg-black/5"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white border-3 border-black shadow-brutal p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display font-bold text-[11px] text-black/50 uppercase tracking-wider">
          Destinasi Dana
        </p>
        <div className="flex rounded-brutal border-2 border-black overflow-hidden">
          {toggleButton("today", "Hari Ini")}
          {toggleButton("month", "Bulan Ini")}
        </div>
      </div>

      {topCategories.length === 0 ? (
        <p className="font-body text-xs text-black/40 text-center py-6">
          Belum ada pengeluaran
        </p>
      ) : (
        <div className="space-y-4">
          {topCategories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-display font-bold text-xs text-black">
                  {cat.label}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-[11px] tabular-nums text-black/60">
                    {cat.percentage}%
                  </span>
                  <span className="font-mono font-bold text-[10px] tabular-nums text-black/40">
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
              </div>
              <div className="h-3 rounded-brutal border-2 border-black bg-black/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className="h-full rounded-brutal"
                  style={{ backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
