export type CategoryId =
  | "food" | "transport" | "housing" | "entertainment"
  | "health" | "shopping" | "salary" | "investment" | "other";

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
  type: "income" | "expense" | "both";
}
