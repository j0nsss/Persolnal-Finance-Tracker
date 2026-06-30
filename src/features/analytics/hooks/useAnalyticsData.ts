import { useMemo, useState } from "react";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { CATEGORY_LIST } from "../../../lib/constants";
import type { CategoryId } from "../../../types/category";
import { format, subMonths, startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import { id as localeId } from "date-fns/locale/id";

export type AnalyticsPeriod = "3M" | "6M" | "1Y" | "ALL";

const periodMonthMap: Record<string, number | null> = {
  "3M": 3,
  "6M": 6,
  "1Y": 12,
  ALL: null,
};

export interface MonthlyCashflowItem {
  month: string;
  key: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  label: string;
  color: string;
  total: number;
  percentage: number;
}

export interface PeriodComparison {
  incomeChange: number;
  expenseChange: number;
  netChange: number;
  incomeTrend: "up" | "down" | "flat";
  expenseTrend: "up" | "down" | "flat";
}

export interface AnalyticsInsights {
  savingsRate: number;
  topCategory: { id: string; label: string; color: string; total: number; percentage: number } | null;
  topCategoryMessage: string;
  forecastBalance: number;
  averageMonthlyCashflow: number;
  dailyAvgExpense: number;
  expenseRatio: number;
  trend: "surplus" | "defisit" | "seimbang";
  highestExpenseMonth: { label: string; total: number } | null;
  lowestIncomeMonth: { label: string; total: number } | null;
  previousPeriodComparison: PeriodComparison | null;
}

function calcNumMonths(period: AnalyticsPeriod, transactions: { date: string }[]): number {
  const fixed = periodMonthMap[period];
  if (fixed != null) return fixed;
  if (transactions.length === 0) return 6;
  const dates = transactions.map((t) => new Date(t.date).getTime());
  const minDate = Math.min(...dates);
  const diffMs = Date.now() - minDate;
  const months = Math.ceil(diffMs / (30 * 24 * 60 * 60 * 1000));
  return Math.max(1, months);
}

export function useAnalyticsData() {
  const transactions = useTransactionStore((s) => s.transactions);

  const [period, setPeriod] = useState<AnalyticsPeriod>("6M");

  const numMonths = useMemo(() => calcNumMonths(period, transactions), [period, transactions]);

  const periodStart = useMemo(() => {
    const now = new Date();
    return startOfMonth(subMonths(now, numMonths - 1));
  }, [numMonths]);

  const periodEnd = useMemo(() => {
    const now = new Date();
    return endOfMonth(now);
  }, []);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date).getTime();
        return d >= periodStart.getTime() && d <= periodEnd.getTime();
      }),
    [transactions, periodStart, periodEnd],
  );

  const monthlyCashflow = useMemo((): MonthlyCashflowItem[] => {
    const now = new Date();
    const months: MonthlyCashflowItem[] = [];
    for (let i = numMonths - 1; i >= 0; i--) {
      const d = subMonths(now, i);
      const month = format(d, "yyyy-MM");
      const label = format(d, "MMM", { locale: localeId });
      months.push({ month, key: month, label, income: 0, expense: 0, net: 0 });
    }

    const monthBuckets = months.map((m) => ({
      key: m.key,
      start: startOfMonth(new Date(m.key + "-01T00:00:00")),
      end: endOfMonth(new Date(m.key + "-01T00:00:00")),
    }));

    for (const t of filteredTransactions) {
      const tTime = new Date(t.date).getTime();
      const bucket = monthBuckets.find(
        (b) => tTime >= b.start.getTime() && tTime <= b.end.getTime(),
      );
      if (bucket) {
        const entry = months.find((m) => m.key === bucket.key);
        if (entry) {
          if (t.type === "income") entry.income += t.amount;
          else entry.expense += t.amount;
        }
      }
    }

    for (const m of months) {
      m.net = m.income - m.expense;
    }

    return months;
  }, [filteredTransactions, numMonths]);

  const categoryBreakdown = useMemo((): CategoryBreakdownItem[] => {
    const expenseMap = new Map<CategoryId, number>();
    for (const t of filteredTransactions) {
      if (t.type === "expense") {
        expenseMap.set(t.categoryId, (expenseMap.get(t.categoryId) ?? 0) + t.amount);
      }
    }

    const totalExpense = Array.from(expenseMap.values()).reduce((a, b) => a + b, 0);
    const categoryMap = new Map(CATEGORY_LIST.map((c) => [c.id, c]));

    return Array.from(expenseMap.entries())
      .map(([id, total]) => {
        const cat = categoryMap.get(id);
        return {
          categoryId: id,
          label: cat?.label ?? "Lainnya",
          color: cat?.color ?? "#6B7280",
          total,
          percentage: totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  const currentMonthExpense = useMemo(() => {
    const now = new Date();
    const cmStart = startOfMonth(now).getTime();
    const cmEnd = endOfMonth(now).getTime();
    const expenseMap = new Map<CategoryId, number>();
    for (const t of transactions) {
      if (t.type === "expense") {
        const d = new Date(t.date).getTime();
        if (d >= cmStart && d <= cmEnd) {
          expenseMap.set(t.categoryId, (expenseMap.get(t.categoryId) ?? 0) + t.amount);
        }
      }
    }
    const categoryMap = new Map(CATEGORY_LIST.map((c) => [c.id, c]));
    let maxId: CategoryId | "" = "";
    let maxTotal = 0;
    for (const [id, total] of expenseMap) {
      if (total > maxTotal) {
        maxTotal = total;
        maxId = id;
      }
    }
    const totalExpense = Array.from(expenseMap.values()).reduce((a, b) => a + b, 0);
    const cat = maxId ? categoryMap.get(maxId) : undefined;
    return {
      topCategory: cat
        ? { id: cat.id, label: cat.label, color: cat.color, total: maxTotal, percentage: totalExpense > 0 ? Math.round((maxTotal / totalExpense) * 100) : 0 }
        : null,
      totalExpense,
    };
  }, [transactions]);

  const insights = useMemo((): AnalyticsInsights => {
    const now = new Date();
    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const totalExpense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const netCashflow = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((netCashflow / totalIncome) * 100) : 0;
    const expenseRatio = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

    const trend = savingsRate > 10 ? "surplus" : savingsRate < -5 ? "defisit" : "seimbang";

    const topCat = currentMonthExpense.topCategory;

    const topCategoryMessages: Record<string, string> = {
      food: "Pengeluaran makan lebih besar dari rata-rata. Evaluasi kebiasaan harian.",
      transport: "Biaya transportasi mulai menguras. Coba naik transportasi umum!",
      housing: "Pastikan biaya hunian tidak melebihi 30% dari total pemasukan.",
      entertainment: "Hiburan boleh, tapi jangan sampai mengganggu tabungan.",
      health: "Kesehatan itu mahal, jaga diri lebih baik!",
      shopping: "Belanja memang menyenangkan, tapi cek lagi needs vs wants.",
      salary: "",
      investment: "",
      other: "Ada pengeluaran tak terduga? Coba catat lebih detail.",
    };

    const message = topCat ? (topCategoryMessages[topCat.id] ?? `Kategori ${topCat.label} perlu diwaspadai.`) : "Belum ada data bulan ini.";

    const totalMonths = Math.max(1, numMonths);
    const avgMonthlyCashflow = Math.round(netCashflow / totalMonths);

    const daysInMonth = differenceInDays(endOfMonth(now), startOfMonth(now)) + 1;
    const daysElapsed = differenceInDays(now, startOfMonth(now)) + 1;
    const daysRemaining = daysInMonth - daysElapsed;
    const projectedCashflow = daysRemaining > 0 ? Math.round((avgMonthlyCashflow / daysInMonth) * daysRemaining) : 0;

    const currentBalance = transactions
      .reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);

    const dailyAvgExpense = daysElapsed > 0 ? Math.round(currentMonthExpense.totalExpense / daysElapsed) : 0;

    const sortedByExpense = [...monthlyCashflow].sort((a, b) => b.expense - a.expense);
    const highestExpenseMonth = sortedByExpense.length > 0
      ? { label: sortedByExpense[0].label, total: sortedByExpense[0].expense }
      : null;

    const sortedByIncome = [...monthlyCashflow].sort((a, b) => a.income - b.income);
    const lowestIncomeMonth = sortedByIncome.length > 0 && sortedByIncome[0].income > 0
      ? { label: sortedByIncome[0].label, total: sortedByIncome[0].income }
      : null;

    const previousPeriodStart = startOfMonth(subMonths(periodStart, numMonths));
    const prevFiltered = transactions.filter((t) => {
      const d = new Date(t.date).getTime();
      return d >= previousPeriodStart.getTime() && d < periodStart.getTime();
    });
    const prevIncome = prevFiltered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const prevExpense = prevFiltered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const prevNet = prevIncome - prevExpense;

    const calcTrend = (current: number, previous: number): "up" | "down" | "flat" => {
      if (previous === 0) return "flat";
      const ratio = (current - previous) / previous;
      if (ratio > 0.05) return "up";
      if (ratio < -0.05) return "down";
      return "flat";
    };

    const previousPeriodComparison: PeriodComparison | null = prevFiltered.length > 0 ? {
      incomeChange: prevIncome > 0 ? Math.round(((totalIncome - prevIncome) / prevIncome) * 100) : 0,
      expenseChange: prevExpense > 0 ? Math.round(((totalExpense - prevExpense) / prevExpense) * 100) : 0,
      netChange: prevNet !== 0 ? Math.round(((netCashflow - prevNet) / Math.abs(prevNet)) * 100) : netCashflow > 0 ? 100 : netCashflow < 0 ? -100 : 0,
      incomeTrend: calcTrend(totalIncome, prevIncome),
      expenseTrend: calcTrend(totalExpense, prevExpense),
    } : null;

    return {
      savingsRate,
      topCategory: topCat,
      topCategoryMessage: message,
      forecastBalance: currentBalance + projectedCashflow,
      averageMonthlyCashflow: avgMonthlyCashflow,
      dailyAvgExpense,
      expenseRatio,
      trend,
      highestExpenseMonth,
      lowestIncomeMonth,
      previousPeriodComparison,
    };
  }, [filteredTransactions, numMonths, currentMonthExpense, transactions, monthlyCashflow, periodStart]);

  return {
    period,
    setPeriod,
    monthlyCashflow,
    categoryBreakdown,
    insights,
    currentMonthExpense,
    filteredTransactions,
    totalIncome: filteredTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    totalExpense: filteredTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
  };
}
