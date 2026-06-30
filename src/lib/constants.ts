import type { Category } from "../types/category";

export const CATEGORY_LIST: Category[] = [
  { id: "food", label: "Makanan", icon: "UtensilsCrossed", color: "#FF6B1A", type: "expense" },
  { id: "transport", label: "Transportasi", icon: "Car", color: "#3F8EFF", type: "expense" },
  { id: "housing", label: "Hunian", icon: "Home", color: "#8B5CF6", type: "expense" },
  { id: "entertainment", label: "Hiburan", icon: "Gamepad2", color: "#FF3F8E", type: "expense" },
  { id: "health", label: "Kesehatan", icon: "HeartPulse", color: "#EF4444", type: "expense" },
  { id: "shopping", label: "Belanja", icon: "ShoppingBag", color: "#F59E0B", type: "expense" },
  { id: "salary", label: "Gaji", icon: "Briefcase", color: "#00C853", type: "income" },
  { id: "investment", label: "Investasi", icon: "TrendingUp", color: "#10B981", type: "income" },
  { id: "other", label: "Lainnya", icon: "Ellipsis", color: "#6B7280", type: "both" },
];

export const CHART_COLORS = CATEGORY_LIST.map((c) => c.color);
