import type { Transaction } from "../../types/transaction";

const DB_KEY = "neofin_transactions";
const DB_VERSION_KEY = "neofin_db_version";
const DB_VERSION = 2;

export function getSeedData(): Transaction[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const makeDate = (monthOffset: number, day: number) => {
    const d = new Date(y, m + monthOffset, day);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  };

  const makeTS = (dateStr: string) => new Date(dateStr + "T08:00:00Z").toISOString();

  const t = (overrides: Partial<Transaction> & { date: string }): Transaction => ({
    id: crypto.randomUUID(),
    amount: 0,
    type: "expense",
    categoryId: "other",
    description: "",
    createdAt: makeTS(overrides.date),
    updatedAt: makeTS(overrides.date),
    ...overrides,
  });

  return [
    // === Income ===
    t({ amount: 8_500_000, type: "income", categoryId: "salary", date: makeDate(-5, 1), description: "Gaji Januari" }),
    t({ amount: 500_000, type: "income", categoryId: "investment", date: makeDate(-5, 15), description: "Dividen saham" }),
    t({ amount: 8_500_000, type: "income", categoryId: "salary", date: makeDate(-4, 1), description: "Gaji Februari" }),
    t({ amount: 8_500_000, type: "income", categoryId: "salary", date: makeDate(-3, 1), description: "Gaji Maret" }),
    t({ amount: 300_000, type: "income", categoryId: "investment", date: makeDate(-3, 10), description: "Bonus project freelance" }),
    t({ amount: 8_750_000, type: "income", categoryId: "salary", date: makeDate(-2, 1), description: "Gaji April" }),
    t({ amount: 8_750_000, type: "income", categoryId: "salary", date: makeDate(-1, 1), description: "Gaji Mei" }),
    t({ amount: 8_750_000, type: "income", categoryId: "salary", date: makeDate(0, 1), description: "Gaji Juni" }),
    t({ amount: 1_200_000, type: "income", categoryId: "investment", date: makeDate(0, 5), description: "THR" }),

    // === Food ===
    t({ amount: 45_000, categoryId: "food", date: makeDate(-5, 3), description: "Nasi goreng + es teh" }),
    t({ amount: 120_000, categoryId: "food", date: makeDate(-5, 12), description: "Makan malam di restoran" }),
    t({ amount: 35_000, categoryId: "food", date: makeDate(-4, 7), description: "Bakso dan minuman" }),
    t({ amount: 250_000, categoryId: "food", date: makeDate(-4, 20), description: "Belanja mingguan supermarket" }),
    t({ amount: 55_000, categoryId: "food", date: makeDate(-3, 5), description: "Ayam geprek + minum" }),
    t({ amount: 180_000, categoryId: "food", date: makeDate(-3, 18), description: "Makan malam bersama teman" }),
    t({ amount: 42_000, categoryId: "food", date: makeDate(-2, 8), description: "Sate padang" }),
    t({ amount: 95_000, categoryId: "food", date: makeDate(-2, 22), description: "Bakmi + topping" }),
    t({ amount: 38_000, categoryId: "food", date: makeDate(-1, 4), description: "Seblak" }),
    t({ amount: 210_000, categoryId: "food", date: makeDate(-1, 15), description: "Belanja sembako" }),
    t({ amount: 50_000, categoryId: "food", date: makeDate(0, 10), description: "Makan siang warteg" }),

    // === Transport ===
    t({ amount: 20_000, categoryId: "transport", date: makeDate(-5, 10), description: "Gojek ke kantor" }),
    t({ amount: 150_000, categoryId: "transport", date: makeDate(-4, 15), description: "Isi bensin motor" }),
    t({ amount: 25_000, categoryId: "transport", date: makeDate(-3, 8), description: "Transjakarta pulang-pergi" }),
    t({ amount: 160_000, categoryId: "transport", date: makeDate(-2, 5), description: "Isi bensin mobil" }),
    t({ amount: 30_000, categoryId: "transport", date: makeDate(-1, 12), description: "Grab ke mall" }),
    t({ amount: 155_000, categoryId: "transport", date: makeDate(0, 8), description: "Isi bensin motor" }),

    // === Housing ===
    t({ amount: 2_500_000, categoryId: "housing", date: makeDate(-5, 1), description: "Sewa kos bulan Jan" }),
    t({ amount: 500_000, categoryId: "housing", date: makeDate(-5, 5), description: "Listrik" }),
    t({ amount: 200_000, categoryId: "housing", date: makeDate(-5, 10), description: "Air PDAM" }),
    t({ amount: 2_500_000, categoryId: "housing", date: makeDate(-4, 1), description: "Sewa kos bulan Feb" }),
    t({ amount: 2_500_000, categoryId: "housing", date: makeDate(-3, 1), description: "Sewa kos bulan Mar" }),
    t({ amount: 2_500_000, categoryId: "housing", date: makeDate(-2, 1), description: "Sewa kos bulan Apr" }),
    t({ amount: 2_500_000, categoryId: "housing", date: makeDate(-1, 1), description: "Sewa kos bulan Mei" }),
    t({ amount: 2_500_000, categoryId: "housing", date: makeDate(0, 1), description: "Sewa kos bulan Jun" }),

    // === Entertainment ===
    t({ amount: 50_000, categoryId: "entertainment", date: makeDate(-5, 20), description: "Netflix subscription" }),
    t({ amount: 75_000, categoryId: "entertainment", date: makeDate(-4, 18), description: "Tiket bioskop" }),
    t({ amount: 50_000, categoryId: "entertainment", date: makeDate(-3, 22), description: "Spotify premium" }),
    t({ amount: 100_000, categoryId: "entertainment", date: makeDate(-2, 14), description: "Main futsal + sewa lapang" }),
    t({ amount: 50_000, categoryId: "entertainment", date: makeDate(-1, 25), description: "Netflix subscription" }),
    t({ amount: 50_000, categoryId: "entertainment", date: makeDate(0, 15), description: "Spotify premium" }),

    // === Health ===
    t({ amount: 150_000, categoryId: "health", date: makeDate(-5, 8), description: "Vitamin C + obat flu" }),
    t({ amount: 350_000, categoryId: "health", date: makeDate(-3, 12), description: "Cek kesehatan umum" }),
    t({ amount: 75_000, categoryId: "health", date: makeDate(-1, 20), description: "Obat maag" }),
    t({ amount: 200_000, categoryId: "health", date: makeDate(0, 3), description: "Konsultasi dokter gigi" }),

    // === Shopping ===
    t({ amount: 350_000, categoryId: "shopping", date: makeDate(-4, 25), description: "Beli kaos baru" }),
    t({ amount: 180_000, categoryId: "shopping", date: makeDate(-3, 28), description: "Buku + alat tulis" }),
    t({ amount: 500_000, categoryId: "shopping", date: makeDate(-1, 30), description: "Sepatu olahraga" }),
    t({ amount: 120_000, categoryId: "shopping", date: makeDate(0, 12), description: "Aksesoris HP" }),
  ];
}

export function loadTransactions(): Transaction[] {
  const version = localStorage.getItem(DB_VERSION_KEY);
  if (version !== String(DB_VERSION)) {
    const seed = getSeedData();
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    localStorage.setItem(DB_VERSION_KEY, String(DB_VERSION));
    return seed;
  }
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    return JSON.parse(raw);
  }
  const seed = getSeedData();
  localStorage.setItem(DB_KEY, JSON.stringify(seed));
  return seed;
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(DB_KEY, JSON.stringify(transactions));
}
