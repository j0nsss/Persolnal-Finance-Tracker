import { supabase } from "./client";
import type { Transaction } from "../../types/transaction";
import type { CategoryId } from "../../types/category";
import { CATEGORY_LIST } from "../constants";

const VALID_CATEGORY_IDS = new Set(CATEGORY_LIST.map((c) => c.id));
const VALID_TYPES = new Set(["income", "expense"]);

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Unauthorized");
  return data.user.id;
}

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

function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").replace(/[<>]/g, "");
}

function validatePayload(payload: {
  amount: number;
  type: string;
  categoryId: string;
  description?: string;
  date: string;
}): void {
  if (!Number.isInteger(payload.amount) || payload.amount <= 0) {
    throw new Error("Jumlah harus berupa angka positif");
  }
  if (payload.amount > 999_999_999) {
    throw new Error("Jumlah terlalu besar");
  }
  if (!VALID_TYPES.has(payload.type)) {
    throw new Error("Tipe transaksi tidak valid");
  }
  if (!VALID_CATEGORY_IDS.has(payload.categoryId as CategoryId)) {
    throw new Error("Kategori tidak valid");
  }
  if ((payload.description ?? "").length > 500) {
    throw new Error("Deskripsi terlalu panjang (maks 500 karakter)");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) {
    throw new Error("Format tanggal tidak valid");
  }
  const d = new Date(payload.date);
  if (isNaN(d.getTime())) {
    throw new Error("Tanggal tidak valid");
  }
}

export const transactionApi = {
  async getAll(): Promise<Transaction[]> {
    const userId = await requireUserId();

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ((data ?? []) as Record<string, unknown>[]).map(toTransaction);
  },

  async create(
    payload: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ): Promise<Transaction> {
    const userId = await requireUserId();
    validatePayload(payload);

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        amount: payload.amount,
        type: payload.type,
        category_id: payload.categoryId,
        description: sanitize(payload.description ?? ""),
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
    const userId = await requireUserId();

    if (payload.amount !== undefined) {
      if (!Number.isInteger(payload.amount) || payload.amount <= 0) {
        throw new Error("Jumlah harus berupa angka positif");
      }
      if (payload.amount > 999_999_999) {
        throw new Error("Jumlah terlalu besar");
      }
    }
    if (payload.type !== undefined && !VALID_TYPES.has(payload.type)) {
      throw new Error("Tipe transaksi tidak valid");
    }
    if (payload.categoryId !== undefined && !VALID_CATEGORY_IDS.has(payload.categoryId)) {
      throw new Error("Kategori tidak valid");
    }
    const sanitizedDescription = payload.description !== undefined ? sanitize(payload.description) : undefined;
    if ((sanitizedDescription ?? "").length > 500) {
      throw new Error("Deskripsi terlalu panjang (maks 500 karakter)");
    }

    const updates: Record<string, unknown> = {};
    if (payload.amount !== undefined) updates.amount = payload.amount;
    if (payload.type !== undefined) updates.type = payload.type;
    if (payload.categoryId !== undefined) updates.category_id = payload.categoryId;
    if (sanitizedDescription !== undefined) updates.description = sanitizedDescription;
    if (payload.date !== undefined) updates.date = payload.date;

    const { data, error } = await supabase
      .from("transactions")
      .update(updates as never)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error("Transaksi tidak ditemukan");
    return toTransaction(data as Record<string, unknown>);
  },

  async remove(id: string): Promise<void> {
    const userId = await requireUserId();

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  },
};
