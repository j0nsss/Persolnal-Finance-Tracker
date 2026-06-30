import type { CategoryId } from "./category";

export interface UserBudget {
  id: string;
  categoryId: CategoryId;
  monthlyLimit: number;
  month: string;
  currentSpent: number;
}
