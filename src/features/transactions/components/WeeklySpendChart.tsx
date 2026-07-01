import { useMemo } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis } from "recharts";
import { startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import type { Transaction } from "../../../types/transaction";

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

interface WeeklySpendChartProps {
  transactions: Transaction[];
}

export function WeeklySpendChart({ transactions }: WeeklySpendChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map((day, i) => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      let total = 0;
      for (const t of transactions) {
        if (t.type !== "expense") continue;
        const tTime = new Date(t.date).getTime();
        if (tTime >= dayStart.getTime() && tTime <= dayEnd.getTime()) {
          total += t.amount;
        }
      }
      return { day: DAY_LABELS[i], value: total };
    });
  }, [transactions]);

  return (
    <div className="bg-white border-3 border-black shadow-brutal p-5">
      <p className="font-display font-bold text-[11px] text-black/50 uppercase tracking-wider mb-3">
        Pengeluaran Harian (Minggu Ini)
      </p>
      <div className="h-[88px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fill: "#000" }}
              dy={4}
            />
            <Bar
              dataKey="value"
              fill="#FF3F8E"
              stroke="#000000"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
              minPointSize={4}
              isAnimationActive={true}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
