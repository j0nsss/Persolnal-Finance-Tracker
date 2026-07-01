import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import type { Transaction } from "../../../types/transaction";
import { formatCurrency } from "../../../lib/utils";

interface WeeklyTrendCardProps {
  transactions: Transaction[];
}

const WEEK_LABELS = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"];

export function WeeklyTrendCard({ transactions }: WeeklyTrendCardProps) {
  const { weeklyData, totalMovement } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const weeks = [
      { start: new Date(year, month, 1), end: new Date(year, month, 7) },
      { start: new Date(year, month, 8), end: new Date(year, month, 14) },
      { start: new Date(year, month, 15), end: new Date(year, month, 21) },
      { start: new Date(year, month, 22), end: new Date(year, month + 1, 0) },
    ];

    const weeklyData = weeks.map((week, i) => {
      const weekStart = new Date(week.start);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(week.end);
      weekEnd.setHours(23, 59, 59, 999);

      let total = 0;
      for (const t of transactions) {
        const tTime = new Date(t.date).getTime();
        if (tTime >= weekStart.getTime() && tTime <= weekEnd.getTime()) {
          total += t.amount;
        }
      }
      return { week: WEEK_LABELS[i], value: total };
    });

    const totalMovement = weeklyData.reduce((s, d) => s + d.value, 0);

    return { weeklyData, totalMovement };
  }, [transactions]);

  const maxVal = Math.max(...weeklyData.map((d) => d.value), 1);

  return (
    <motion.div
      whileHover={{ scale: 1.01, translateY: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="rounded-brutal border-3 border-base-ink bg-[#D4FF3F] shadow-brutal p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display font-bold text-[11px] text-black/50 uppercase tracking-wider">
            Arus Kas Mingguan
          </p>
          <p className="font-mono tracking-tight tabular-nums text-xl font-bold text-black mt-1">
            {formatCurrency(totalMovement)}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendingUp size={10} strokeWidth={2.5} className="text-black/40" />
            <p className="font-body text-[10px] text-black/40">Bulan ini</p>
          </div>
        </div>
      </div>

      <div className="h-16 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <Bar
              dataKey="value"
              fill="#FF3F8E"
              stroke="#000000"
              strokeWidth={2.5}
              radius={[4, 4, 0, 0]}
              minPointSize={5}
              isAnimationActive={true}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-1 mt-2">
        {weeklyData.map((d) => (
          <div key={d.week} className="text-center">
            <p className="font-mono text-[8px] text-black/40 font-bold">{d.week.replace("Minggu ", "W")}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
