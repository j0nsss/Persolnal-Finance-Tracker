import { useMemo } from "react";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export function useDashboardSummary() {
  const transactions = useTransactionStore((s) => s.transactions);

  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const prevMonthStart = startOfMonth(subMonths(now, 1));
  const prevMonthEnd = endOfMonth(subMonths(now, 1));

  const currentMonthStartTime = currentMonthStart.getTime();
  const currentMonthEndTime = currentMonthEnd.getTime();
  const prevMonthStartTime = prevMonthStart.getTime();
  const prevMonthEndTime = prevMonthEnd.getTime();

  const currentMonthTxs = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date).getTime();
        return d >= currentMonthStartTime && d <= currentMonthEndTime;
      }),
    [transactions, currentMonthStartTime, currentMonthEndTime],
  );

  const prevMonthTxs = useMemo(
    () =>
      transactions.filter((t) => {
        const d = new Date(t.date).getTime();
        return d >= prevMonthStartTime && d <= prevMonthEndTime;
      }),
    [transactions, prevMonthStartTime, prevMonthEndTime],
  );

  const calcSummary = (txs: typeof transactions) => {
    const income = txs
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = txs
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  };

  const current = calcSummary(currentMonthTxs);
  const prev = calcSummary(prevMonthTxs);

  const calcTrend = (currentVal: number, prevVal: number): number | undefined => {
    if (prevVal === 0) return undefined;
    return Math.round(((currentVal - prevVal) / prevVal) * 100);
  };

  return {
    income: current.income,
    expense: current.expense,
    balance: current.balance,
    incomeTrend: calcTrend(current.income, prev.income),
    expenseTrend: calcTrend(current.expense, prev.expense),
    period: "Bulan Ini",
  };
}
