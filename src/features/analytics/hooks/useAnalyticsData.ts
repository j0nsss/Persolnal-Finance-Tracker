import { useMemo, useState } from "react";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { CATEGORY_LIST } from "../../../lib/constants";
import type { CategoryId } from "../../../types/category";
import { format, subMonths, startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import { id as localeId } from "date-fns/locale/id";

export type AnalyticsPeriod = "3M" | "6M" | "1Y";

const periodMonthMap: Record<AnalyticsPeriod, number> = {
  "3M": 3,
  "6M": 6,
  "1Y": 12,
};

export interface MonthlyCashflowItem {
  month: string;
  key: string;
  label: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  label: string;
  color: string;
  total: number;
  percentage: number;
}

export interface AnalyticsInsights {
  savingsRate: number;
  topCategory: { id: string; label: string; color: string; total: number; percentage: number } | null;
  topCategoryMessage: string;
  forecastBalance: number;
  averageMonthlyCashflow: number;
}

export function useAnalyticsData() {
  const transactions = useTransactionStore((s) => s.transactions);

  const [period, setPeriod] = useState<AnalyticsPeriod>("6M");

  const numMonths = periodMonthMap[period];

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
      months.push({ month, key: month, label, income: 0, expense: 0 });
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

    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

    const topCat = currentMonthExpense.topCategory;

    const topCategoryMessages: Record<string, string> = {
      food: "Pengeluaran makan kamu sudah setara cicilan motor. Rem sedikit!",
      transport: "Biaya transportasi mulai menguras. Coba naik transportasi umum!",
      housing: "Hunian memang prioritas, tapi pastikan tidak超過 30% income ya.",
      entertainment: "Hiburan itu penting, tapi jangan sampai dompet menangis.",
      health: "Kesehatan itu mahal, jaga diri lebih baik!",
      shopping: "Belanja memang menyenangkan, tapi cek lagi needs vs wants.",
      salary: "",
      investment: "",
      other: "Ada pengeluaran tak terduga? Coba catat lebih detail.",
    };

    const message = topCat ? (topCategoryMessages[topCat.id] ?? `Kategori ${topCat.label} perlu diwaspadai.`) : "Belum ada data bulan ini.";

    const totalMonths = numMonths;
    const avgMonthlyCashflow = totalMonths > 0 ? Math.round((totalIncome - totalExpense) / totalMonths) : 0;

    const daysInMonth = differenceInDays(endOfMonth(now), startOfMonth(now)) + 1;
    const daysElapsed = differenceInDays(now, startOfMonth(now)) + 1;
    const daysRemaining = daysInMonth - daysElapsed;
    const projectedCashflow = daysRemaining > 0 ? Math.round((avgMonthlyCashflow / daysInMonth) * daysRemaining) : 0;

    const currentBalance = transactions
      .reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);

    return {
      savingsRate,
      topCategory: topCat,
      topCategoryMessage: message,
      forecastBalance: currentBalance + projectedCashflow,
      averageMonthlyCashflow: avgMonthlyCashflow,
    };
  }, [filteredTransactions, numMonths, currentMonthExpense, transactions]);

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
