import { supabase } from "./client";
import type { Transaction } from "../../types/transaction";
import type { CategoryId } from "../../types/category";

function toTransaction(row: Record<string, unknown>): Transaction {
  return {
    id: row.id as string,
    amount: row.amount as number,
    type: row.type as "income" | "expense",
    categoryId: row.category_id as CategoryId,
    description: (row.description as string) ?? "",
    date: row.date as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export const transactionApi = {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ((data ?? []) as Record<string, unknown>[]).map(toTransaction);
  },

  async create(
    payload: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ): Promise<Transaction> {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        amount: payload.amount,
        type: payload.type,
        category_id: payload.categoryId,
        description: payload.description,
        date: payload.date,
      } as never)
      .select()
      .single();

    if (error) throw error;
    return toTransaction(data as Record<string, unknown>);
  },

  async update(
    id: string,
    payload: Partial<Transaction>,
  ): Promise<Transaction> {
    const updates: Record<string, unknown> = {};
    if (payload.amount !== undefined) updates.amount = payload.amount;
    if (payload.type !== undefined) updates.type = payload.type;
    if (payload.categoryId !== undefined) updates.category_id = payload.categoryId;
    if (payload.description !== undefined) updates.description = payload.description;
    if (payload.date !== undefined) updates.date = payload.date;

    const { data, error } = await supabase
      .from("transactions")
      .update(updates as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return toTransaction(data as Record<string, unknown>);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
