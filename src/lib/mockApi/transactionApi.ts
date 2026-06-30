import type { Transaction } from "../../types/transaction";
import { loadTransactions, saveTransactions } from "./db";

const ARTIFICIAL_DELAY = 400;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let cached: Transaction[] | null = null;

function getData(): Transaction[] {
  if (!cached) {
    cached = loadTransactions();
  }
  return cached;
}

function persist(): void {
  if (cached) {
    saveTransactions(cached);
  }
}

export const transactionApi = {
  async getAll(): Promise<Transaction[]> {
    await delay(ARTIFICIAL_DELAY);
    return [...getData()];
  },

  async create(payload: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Promise<Transaction> {
    await delay(ARTIFICIAL_DELAY);
    const now = new Date().toISOString();
    const newItem: Transaction = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    cached = [newItem, ...getData()];
    persist();
    return newItem;
  },

  async update(id: string, payload: Partial<Transaction>): Promise<Transaction> {
    await delay(ARTIFICIAL_DELAY);
    const data = getData();
    const index = data.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Transaction not found");
    const updated: Transaction = {
      ...data[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    data[index] = updated;
    cached = data;
    persist();
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay(ARTIFICIAL_DELAY);
    cached = getData().filter((t) => t.id !== id);
    persist();
  },
};
