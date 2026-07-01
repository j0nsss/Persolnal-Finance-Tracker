import { useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { CalendarDays } from "lucide-react";
import type { Transaction } from "../../../types/transaction";
import { formatCurrency } from "../../../lib/utils";

interface DailyTrackerCardProps {
  transactions: Transaction[];
}

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function DailyTrackerCard({ transactions }: DailyTrackerCardProps) {
  const { dailyData, average, todayLabel } = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const dailyData = days.map((day, i) => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      let total = 0;
      for (const t of transactions) {
        const tTime = new Date(t.date).getTime();
        if (tTime >= dayStart.getTime() && tTime <= dayEnd.getTime()) {
          if (t.type === "expense") total += t.amount;
        }
      }
      return { day: DAY_LABELS[i], value: total };
    });

    const daysSoFar = days.filter((d) => d <= now).length;
    const totalExpense = dailyData.reduce((s, d) => s + d.value, 0);
    const average = Math.round(totalExpense / Math.max(1, daysSoFar));
    const todayLabel = DAY_LABELS[days.findIndex((d) => d.toDateString() === now.toDateString())] || "Hari";

    return { dailyData, average, todayLabel };
  }, [transactions]);

  return (
    <motion.div
      whileHover={{ scale: 1.01, translateY: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="rounded-brutal border-3 border-base-ink bg-[#3F8EFF] shadow-brutal p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display font-bold text-[11px] text-black/50 uppercase tracking-wider">
            Rata-rata Harian
          </p>
          <p className="font-mono tracking-tight tabular-nums text-xl font-bold text-black mt-1">
            {formatCurrency(average)}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <CalendarDays size={10} strokeWidth={2.5} className="text-black/40" />
            <p className="font-body text-[10px] text-black/40">Minggu ini</p>
          </div>
        </div>
        <div className="rounded-brutal border-2 border-black/20 bg-black/10 px-2 py-1">
          <p className="font-display font-bold text-[9px] text-black uppercase tracking-wider">{todayLabel}</p>
        </div>
      </div>

      <div className="h-16 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000000" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#000000" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#000000"
              strokeWidth={2}
              fill="url(#dailyGrad)"
              dot={false}
              isAnimationActive={true}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
