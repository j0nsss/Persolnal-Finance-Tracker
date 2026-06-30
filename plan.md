# 💰 Personal Finance Tracker — Development Plan

> **Codename:** `NeoFin`
> **Visi Produk:** Dashboard keuangan personal dengan kompleksitas backend minimal, namun kualitas UI/UX setara produk SaaS premium. Diferensiasi utama terletak pada bahasa desain **Neo-Brutalism** yang konsisten, visualisasi data yang hidup, dan micro-interaction yang presisi di setiap titik sentuh.

---

## 🛠️ Tech Stack

| Layer | Teknologi | Catatan |
|---|---|---|
| Core Framework | React 18 + TypeScript | Strict mode aktif, no implicit `any` |
| Build Tool | Vite | HMR cepat, cocok untuk iterasi UI intensif |
| Styling | Tailwind CSS | Konfigurasi token kustom Neo-Brutalism (lihat §2.1) |
| Komponen Aksesibel | Radix UI (Primitives) | Dialog, Dropdown, Tabs, Tooltip, Toast |
| Animasi | Framer Motion | Wajib untuk seluruh state transition & gesture |
| Visualisasi Data | Recharts | Di-restyle total via custom `Tooltip`, `Bar`, `Cell` components |
| Icons | Lucide React | `strokeWidth={2.5}` agar selaras dengan border tebal |
| State Management | Zustand | Lihat justifikasi di §4.1 |
| Form Handling | React Hook Form + Zod | Validasi skema, error message ter-style brutalist |
| Utility | `clsx`, `tailwind-merge`, `date-fns` | — |

---

## 1. Arsitektur Proyek & Struktur Folder

Struktur mengikuti pendekatan **feature-based modular architecture**: komponen UI primitif global dipisah tegas dari logika fitur, sehingga dashboard, dan modul lain di masa depan (misal: Budget Planner) dapat ditambahkan tanpa menyentuh kode inti.

```
neofin/
├── public/
│   └── fonts/                      # Self-hosted display & mono fonts
├── src/
│   ├── assets/
│   │   └── icons/                  # SVG kustom non-Lucide (logo, ilustrasi kosong)
│   │
│   ├── components/
│   │   ├── ui/                     # 🧱 UI PRIMITIF NEO-BRUTALISM (global, tanpa logic bisnis)
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.variants.ts
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Card.variants.ts
│   │   │   ├── Badge/
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Modal/              # Wrapper Radix Dialog + Framer Motion
│   │   │   ├── Toast/              # Wrapper Radix Toast + Framer Motion
│   │   │   ├── Tabs/               # Wrapper Radix Tabs
│   │   │   ├── Tooltip/
│   │   │   ├── Skeleton/           # Loading state ber-tema brutalist (hard shadow shimmer)
│   │   │   └── CountUpNumber/      # Komponen angka animasi (lihat §2.5)
│   │   │
│   │   └── layout/                 # Struktur halaman (bukan fitur, bukan primitif)
│   │       ├── Sidebar/
│   │       ├── Topbar/
│   │       ├── PageTransition.tsx  # Wrapper AnimatePresence untuk tab/route
│   │       └── DashboardShell.tsx
│   │
│   ├── features/                   # 🎯 LOGIKA & UI SPESIFIK PER FITUR
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── SummaryCardGroup.tsx
│   │   │   │   ├── SummaryCard.tsx
│   │   │   │   ├── MonthlyBarChart.tsx
│   │   │   │   ├── CategoryDonutChart.tsx
│   │   │   │   └── ChartFilterBar.tsx
│   │   │   └── hooks/
│   │   │       └── useDashboardSummary.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── components/
│   │   │   │   ├── TransactionTable.tsx
│   │   │   │   ├── TransactionRow.tsx
│   │   │   │   ├── TransactionFilters.tsx
│   │   │   │   ├── TransactionSearchBar.tsx
│   │   │   │   └── EmptyState.tsx
│   │   │   ├── forms/
│   │   │   │   ├── TransactionFormModal.tsx
│   │   │   │   └── transactionSchema.ts   # Zod schema
│   │   │   └── hooks/
│   │   │       └── useTransactionActions.ts
│   │   │
│   │   └── budget/                 # (opsional, fase lanjutan)
│   │
│   ├── store/                      # 🗃️ STATE MANAGEMENT (Zustand)
│   │   ├── useTransactionStore.ts
│   │   ├── useUIStore.ts           # sidebar collapsed, active tab, theme
│   │   └── useToastStore.ts
│   │
│   ├── context/                    # React Context murni (bukan domain state)
│   │   └── ThemeProvider.tsx       # Untuk future dark-mode brutalist
│   │
│   ├── hooks/                      # Custom hooks lintas-fitur
│   │   ├── useCountUp.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useDebouncedValue.ts
│   │   └── useLocalStoragePersist.ts
│   │
│   ├── lib/
│   │   ├── mockApi/                # Simulasi backend (lihat §4.3)
│   │   │   ├── db.ts               # Seed data + localStorage adapter
│   │   │   └── transactionApi.ts   # delay() + CRUD functions
│   │   ├── utils.ts                # cn(), formatCurrency(), formatDate()
│   │   └── constants.ts            # CATEGORY_LIST, CHART_COLORS
│   │
│   ├── types/
│   │   ├── transaction.ts
│   │   ├── category.ts
│   │   └── budget.ts
│   │
│   ├── styles/
│   │   └── globals.css             # @layer base, font-face, CSS variables
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── tailwind.config.ts
├── tsconfig.json
└── plan.md
```

**Prinsip pemisahan:**
- `components/ui` → Tidak boleh mengimpor apa pun dari `features/` atau `store/`. Murni presentational + variant props.
- `features/*` → Boleh mengimpor dari `components/ui`, `store/`, dan `hooks/`, tapi tidak saling mengimpor antar-fitur lain.
- `store/` → Single source of truth untuk data transaksi; komponen UI tidak pernah memanipulasi array transaksi secara langsung.

---

## 2. Spesifikasi UI/UX & Micro-Interactions

### 2.1 Design Token Foundation (`tailwind.config.ts`)

Semua nilai visual brutalist di-hardcode sebagai token, bukan angka magic di tiap komponen.

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#F4F4F0",      // Off-white background
          ink: "#000000",     // Border & teks utama
          surface: "#FFFFFF", // Card background
        },
        accent: {
          lime: "#D4FF3F",
          pink: "#FF3F8E",
          orange: "#FF6B1A",
          blue: "#3F8EFF",    // aksen tersier untuk grafik kedua
        },
        feedback: {
          success: "#00C853",
          danger: "#FF3B30",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],  // Heading, label besar
        mono: ["'JetBrains Mono'", "monospace"],      // Angka, nominal uang
        body: ["'Inter'", "sans-serif"],               // Paragraf, deskripsi
      },
      boxShadow: {
        brutal: "4px 4px 0px #000000",
        "brutal-sm": "2px 2px 0px #000000",
        "brutal-lg": "8px 8px 0px #000000",
        "brutal-pressed": "1px 1px 0px #000000",
        "brutal-accent": "4px 4px 0px #D4FF3F",
      },
      borderWidth: { 3: "3px" },
      borderRadius: { brutal: "4px" },
    },
  },
};
```

**Aturan emas:** Setiap elemen interaktif (button, card, input, badge) **wajib** memiliki `border-3 border-base-ink` + salah satu varian `shadow-brutal`. Tidak ada elemen "melayang" tanpa border tegas.

### 2.2 Efek Hover & Klik Tombol ("Tombol Membal")

Pola animasi ini menjadi signature interaksi di seluruh aplikasi — digunakan ulang via komponen `<Button>` generik.

```tsx
// components/ui/Button/Button.tsx
const buttonMotion = {
  rest: { x: 0, y: 0, boxShadow: "4px 4px 0px #000000" },
  hover: { x: -1, y: -1, boxShadow: "5px 5px 0px #000000" },
  tap: { x: 2, y: 2, boxShadow: "1px 1px 0px #000000" },
};

<motion.button
  variants={buttonMotion}
  initial="rest"
  whileHover="hover"
  whileTap="tap"
  transition={{ type: "spring", stiffness: 500, damping: 25 }}
  className="border-3 border-base-ink bg-accent-lime font-display font-bold rounded-brutal px-5 py-2.5"
>
  {children}
</motion.button>
```

- **Rest → Hover:** shadow membesar tipis + elemen naik 1px, memberi kesan "siap ditekan".
- **Hover → Tap:** elemen turun 2–3px, shadow mengempis ke `1px 1px`, mensimulasikan tombol fisik tertekan ke permukaan.
- Transisi memakai `spring` (bukan `ease`/`duration` linear) agar terasa snappy dan tidak "lembek".
- Varian destruktif (Delete button) menggunakan palet `feedback-danger` dengan pola motion identik, hanya warna berbeda — konsistensi gestur penting untuk *learnability*.

### 2.3 Transisi Halaman / Tab Dashboard

Dashboard menggunakan single-page tab navigation (Overview, Transaksi, Analitik), bukan route terpisah, agar transisi terasa instan namun tetap "tegas" (tidak cross-fade lembut khas Material Design).

```tsx
// components/layout/PageTransition.tsx
const tabVariants = {
  initial: { opacity: 0, x: 24, rotate: -1 },
  animate: { opacity: 1, x: 0, rotate: 0 },
  exit: { opacity: 0, x: -24, rotate: 1 },
};

<AnimatePresence mode="wait" initial={false}>
  <motion.div
    key={activeTab}
    variants={tabVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
  >
    {renderActiveTabContent()}
  </motion.div>
</AnimatePresence>
```

Sedikit `rotate` (1°) saat masuk/keluar memberi tekstur "kertas dipindah secara kasar" yang selaras dengan estetika brutalist, alih-alih transisi yang terlalu mulus/korporat.

### 2.4 Card Interaktif (Summary Cards)

Hover pada card ringkasan (Pemasukan, Pengeluaran, Saldo) **mengubah arah shadow**, bukan sekadar membesarkannya — menciptakan ilusi cahaya berpindah arah.

```tsx
const cardMotion = {
  rest: { x: 0, y: 0, boxShadow: "6px 6px 0px #000000" },
  hover: { x: -3, y: -3, boxShadow: "9px 9px 0px #000000" },
};
```

Tambahan detail per kartu:
- Ikon kategori (Lucide) di pojok kanan-atas berputar `rotate: 8deg` saat hover via `whileHover` terpisah dari motion induk (nested motion component), menambah lapisan interaksi tanpa mengganggu shadow utama.
- Indikator trend (panah naik/turun + persentase) memiliki warna dinamis: `accent-lime`/`feedback-success` untuk tren positif pemasukan, `feedback-danger` untuk kenaikan pengeluaran.

### 2.5 Count-Up Number Animation

Dipakai di Summary Cards saat dashboard pertama dimuat, dan saat saldo berubah akibat transaksi baru.

```ts
// hooks/useCountUp.ts
import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export function useCountUp(target: number, duration = 1.2) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target]);
  return value;
}
```

Angka ditampilkan dengan `font-mono tabular-nums` agar lebar digit konsisten dan tidak "bergetar" secara horizontal saat berubah cepat.

### 2.6 Toast Notification Bergaya Brutalist

Memakai Radix `Toast` primitive sebagai fondasi aksesibilitas (focus trap, screen reader announcement), di-skin total dengan Framer Motion untuk entrance/exit.

```tsx
const toastVariants = {
  initial: { x: 100, opacity: 0, rotate: 4 },
  animate: { x: 0, opacity: 1, rotate: -2 },
  exit: { x: 100, opacity: 0, rotate: 4, transition: { duration: 0.15 } },
};
```

- Border `3px solid black`, `shadow-brutal-lg`, warna latar sesuai tipe pesan (`accent-lime` untuk sukses, `feedback-danger` untuk error/hapus).
- Rotasi miring kecil (-2°) memberi kesan "stiker ditempel buru-buru" — khas elemen brutalist yang sengaja sedikit "berantakan".
- Auto-dismiss 3.5 detik dengan progress bar tipis di bagian bawah toast (linear width animation) sebagai indikator visual countdown.

### 2.7 Hover State pada Grafik Data

- **Bar Chart (Recharts):** Custom `<Cell>` dengan `cursor={{ fill: "rgba(0,0,0,0.05)" }}` saat hover; bar yang di-hover mendapat `stroke="#000" strokeWidth={3}` dan sedikit `scaleY` melalui CSS transform pada `<Bar shape={CustomBarShape}>`.
- **Custom Tooltip:** Tooltip default Recharts diganti total dengan komponen kustom ber-`border-3 shadow-brutal-sm bg-base-surface`, menampilkan nominal dalam `font-mono` dan nama kategori dalam `font-display`.
- **Donut Chart:** Saat hover pada satu slice, slice tersebut "keluar" dari lingkaran (`outerRadius` membesar via state + transisi Recharts `isAnimationActive`), sementara label tengah donut (total) berganti menampilkan nominal kategori yang di-hover (dengan `useCountUp` di-trigger ulang).

---

## 3. Breakdown Fitur Dashboard Interaktif

### Modul 1 — Header & Navigation

| Aspek | Spesifikasi |
|---|---|
| Desktop | Sidebar vertikal fixed, lebar 240px, dapat dikolaps ke 72px (icon-only) via tombol toggle dengan animasi `width` Framer Motion |
| Tablet (768–1024px) | Sidebar default collapsed (icon-only), expand on hover/tap |
| Mobile (<768px) | Sidebar berubah menjadi bottom navigation bar fixed, atau off-canvas drawer dipicu dari Topbar (gunakan Radix `Dialog` dengan `slide-from-left`) |
| Topbar | Berisi judul tab aktif, search global (opsional), dan tombol "Tambah Transaksi" yang selalu terlihat (sticky), berfungsi sebagai entry point utama ke Modul 5 |
| Indikator Tab Aktif | Garis aksen `accent-lime` setebal 4px di sisi kiri item sidebar yang aktif, dianimasikan posisinya antar-item menggunakan `layoutId` Framer Motion (shared layout animation) |

### Modul 2 — Summary Cards (Metrik Utama)

Tiga kartu utama dalam grid responsif (`grid-cols-1 md:grid-cols-3`):

1. **Total Pemasukan** — ikon `TrendingUp`, aksen warna `accent-lime`.
2. **Total Pengeluaran** — ikon `TrendingDown`, aksen warna `accent-pink`.
3. **Saldo Bersih** — ikon `Wallet`, aksen warna `base-ink` (kartu ini sengaja kontras gelap untuk hierarki visual tertinggi).

Setiap kartu menampilkan: nominal (count-up), label periode ("Bulan Ini"), dan badge persentase perubahan dibanding bulan sebelumnya (dihitung dari data mock, lihat §4.3).

### Modul 3 — Interactive Analytics & Charts

- **Bar Chart Pengeluaran Bulanan:** Menampilkan 6–12 bulan terakhir, dengan toggle `Pemasukan vs Pengeluaran` (grouped bar) menggunakan `ChartFilterBar`. Filter periode (3M / 6M / 1Y) memicu re-render data via state lokal — **tanpa reload**, transisi data antar-filter dianimasikan menggunakan `isAnimationActive` Recharts dikombinasikan dengan `key` berbeda pada `<BarChart>` untuk memicu re-mount animasi smooth.
- **Donut Chart Breakdown Kategori:** Klik pada salah satu kategori di legend men-toggle visibility slice tersebut (opacity transition), berguna untuk fokus analisis kategori tertentu.
- Kedua chart berbagi state filter periode yang sama (lifted state di `DashboardOverview`) agar konsisten secara kontekstual.

### Modul 4 — Transaction Ledger (CRUD Section)

- **Tabel/List:** Desain responsif — tabel penuh di desktop, bertransformasi menjadi stacked card list di mobile (bukan horizontal scroll, demi UX brutalist yang tegas dan mudah dibaca).
- **Pencarian Cepat:** Input search dengan `useDebouncedValue` (300ms) memfilter berdasarkan deskripsi transaksi, real-time tanpa tombol submit.
- **Filter Kategori:** Multi-select chip/badge (gaya brutalist: badge persegi dengan border tebal, terpilih = invert warna bg/teks) di atas tabel.
- **Animasi Baris:**
  - Tambah: baris baru masuk dengan `initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}`, dibungkus `<AnimatePresence>` pada `<motion.tbody>`/list container, menggunakan `layout` prop agar baris lain otomatis re-posisi mulus.
  - Hapus: baris keluar dengan efek "coret lalu hilang" — `<motion.div exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}>` dikombinasi garis strikethrough singkat sebelum elemen benar-benar lenyap.
- **Empty State:** Ilustrasi sederhana (garis brutalist) + CTA "Tambah Transaksi Pertama" saat tidak ada data atau hasil filter kosong.

### Modul 5 — Quick Action Modal (Tambah/Edit Transaksi)

- Dibangun di atas Radix `Dialog` (fokus trap, ESC to close, klik overlay to close) untuk aksesibilitas penuh, dengan entrance animation `scale: 0.95 → 1` + `y: 20 → 0` bertenaga spring.
- **Form Fields:** Jumlah (nominal, `font-mono`, format ribuan otomatis on-blur), Tipe (Toggle segmented control: Pemasukan/Pengeluaran — perubahan tipe mengubah warna aksen modal secara real-time), Kategori (Select brutalist kustom, bukan native `<select>`), Tanggal (Date picker kustom atau native styled-ulang), Deskripsi (textarea opsional).
- **Validasi (Zod + React Hook Form):** Error muncul inline di bawah field dengan border input berubah merah + ikon `AlertTriangle`, disertai shake animation singkat (`x: [0, -6, 6, -4, 4, 0]`) pada field yang gagal validasi saat submit.
- Setelah submit berhasil → modal close dengan animasi exit, lalu Toast sukses (§2.6) muncul, dan baris baru masuk ke tabel dengan animasi Modul 4.

---

## 4. Strategi State Management & Mock Backend

### 4.1 Justifikasi: Zustand dibanding Context API

Untuk aplikasi ini, **Zustand** dipilih sebagai state manager utama atas Context API murni, dengan alasan teknis berikut:

- Operasi CRUD transaksi sangat sering (search, filter, sort, add, edit, delete) — Context API berisiko menyebabkan re-render berlebihan ke seluruh subtree consumer karena tidak memiliki selector granular bawaan.
- Zustand memungkinkan **selective subscription** (`useTransactionStore((s) => s.transactions)`), sehingga komponen seperti `SummaryCard` tidak ikut re-render saat hanya state pencarian (`searchQuery`) di `TransactionFilters` berubah.
- API minimal tanpa boilerplate Provider/Reducer, mempercepat development untuk scope MVP ini.
- Context API tetap dipertahankan secara terbatas untuk state non-domain seperti `ThemeProvider` (tema visual), yang memang idealnya di-broadcast ke seluruh tree tanpa frequent updates.

### 4.2 Skema TypeScript Interfaces

```ts
// types/category.ts
export type CategoryId =
  | "food" | "transport" | "housing" | "entertainment"
  | "health" | "shopping" | "salary" | "investment" | "other";

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;        // nama icon Lucide, mis. "UtensilsCrossed"
  color: string;        // hex, dipakai di chart & badge
  type: "income" | "expense" | "both";
}

// types/transaction.ts
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;                  // uuid
  amount: number;               // selalu positif; tipe (income/expense) menentukan sign
  type: TransactionType;
  categoryId: CategoryId;
  description: string;
  date: string;                 // ISO 8601 (YYYY-MM-DD)
  createdAt: string;            // ISO timestamp, untuk sorting "terbaru"
  updatedAt: string;
}

// types/budget.ts
export interface UserBudget {
  id: string;
  categoryId: CategoryId;
  monthlyLimit: number;
  month: string;                 // format "YYYY-MM"
  currentSpent: number;          // dihitung derived dari transactions, di-cache di store
}
```

### 4.3 Arsitektur Mock Backend

Backend disimulasikan sepenuhnya di sisi klien menggunakan `localStorage` sebagai persistence layer, dibungkus dengan fungsi async + artificial delay agar UI sudah terbiasa menangani *loading state* sejak awal — memudahkan migrasi ke REST API/Supabase di kemudian hari tanpa refactor besar pada komponen.

```ts
// lib/mockApi/transactionApi.ts
const DB_KEY = "neofin_transactions";
const ARTIFICIAL_DELAY = 400; // ms, simulasi network latency

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const transactionApi = {
  async getAll(): Promise<Transaction[]> {
    await delay(ARTIFICIAL_DELAY);
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : seedData;
  },

  async create(payload: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Promise<Transaction> {
    await delay(ARTIFICIAL_DELAY);
    const newItem: Transaction = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // ...persist ke localStorage, return item baru
    return newItem;
  },

  async update(id: string, payload: Partial<Transaction>): Promise<Transaction> { /* ... */ },
  async remove(id: string): Promise<void> { /* ... */ },
};
```

**Pola Store (Zustand) yang mengonsumsi mock API:**

```ts
// store/useTransactionStore.ts
interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  searchQuery: string;
  activeFilters: CategoryId[];
  fetchAll: () => Promise<void>;
  addTransaction: (data: NewTransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setSearchQuery: (q: string) => void;
}
```

Setiap mutasi (`addTransaction`, `deleteTransaction`) melakukan **optimistic update** terlebih dahulu ke state lokal (agar animasi UI §2.4 langsung terasa instan), baru kemudian sinkron ke `localStorage` — dengan rollback sederhana jika operasi mock API gagal (simulasi error rate kecil opsional untuk testing error state UI).

---

## 5. Roadmap Pengembangan (Milestones)

### 🔹 Fase 1 — Setup & Base Theme Foundation
- [ ] Inisialisasi proyek Vite + React + TypeScript (strict mode)
- [ ] Konfigurasi Tailwind dengan seluruh design token (§2.1)
- [ ] Setup font lokal (Space Grotesk, JetBrains Mono, Inter) via `@font-face`
- [ ] Install & konfigurasi Radix UI, Framer Motion, Recharts, Lucide, Zustand, RHF + Zod
- [ ] Buat halaman style-guide internal (`/dev/styleguide`) untuk preview seluruh komponen `ui/` primitif secara terisolasi

### 🔹 Fase 2 — Core Components & Layout
- [ ] Bangun seluruh komponen `components/ui` (Button, Card, Input, Select, Modal, Toast, Badge, Tabs, Skeleton)
- [ ] Bangun `DashboardShell`, `Sidebar` (dengan state collapse), `Topbar`
- [ ] Implementasi layout responsif dasar (breakpoint sidebar → bottom nav)
- [ ] Setup `PageTransition` & struktur tab dashboard kosong (Overview, Transaksi, Analitik)

### 🔹 Fase 3 — State & CRUD Logic
- [ ] Implementasi `mockApi` lengkap dengan seed data realistis (min. 30 transaksi dummy lintas kategori & bulan)
- [ ] Bangun `useTransactionStore` (Zustand) dengan seluruh action CRUD
- [ ] Hubungkan `TransactionTable` ke store — render data asli, tanpa animasi dahulu
- [ ] Bangun `TransactionFormModal` lengkap dengan validasi Zod, hubungkan ke `addTransaction`/`updateTransaction`
- [ ] Implementasi search + filter kategori (logika murni, animasi menyusul di Fase 4)

### 🔹 Fase 4 — Interactivity & Animation Polish
- [ ] Terapkan seluruh micro-interaction §2 (tombol membal, card shadow-shift, count-up, toast brutalist)
- [ ] Animasi tambah/hapus baris transaksi (`AnimatePresence` + `layout`)
- [ ] Style-ulang total Recharts (custom Tooltip, custom Bar shape, custom Donut center label, hover states §2.7)
- [ ] Shared layout animation untuk indikator tab aktif di Sidebar (`layoutId`)
- [ ] Review motion timing secara global — pastikan tidak ada animasi yang terasa lambat/berlebihan (audit `duration` tiap transisi, target 150–300ms untuk micro, 250–400ms untuk page-level)

### 🔹 Fase 5 — Responsiveness & Optimization
- [ ] QA penuh di breakpoint mobile (<480px), tablet, desktop, dan ultra-wide (>1440px)
- [ ] Audit aksesibilitas: kontras warna (terutama teks di atas `accent-lime`/`accent-orange`), keyboard navigation penuh, `aria-label` pada semua ikon interaktif, `prefers-reduced-motion` fallback (matikan/sederhanakan animasi non-esensial)
- [ ] Optimasi performa: `React.memo` pada `TransactionRow`, virtualisasi list jika data >100 item (`react-window`), lazy-load tab Analitik
- [ ] Lighthouse audit (target skor Performance & Accessibility ≥ 90)
- [ ] Cross-browser check (Chrome, Safari, Firefox) khususnya rendering `box-shadow` hard-edge dan font loading

---

## ✅ Definition of Done (per Modul)

Sebuah modul dianggap selesai jika memenuhi seluruh kriteria berikut, bukan hanya "berfungsi secara fungsional":

1. Visual 100% konsisten dengan design token §2.1 (tidak ada warna/shadow/border hardcode di luar token).
2. Seluruh interaksi memiliki state `rest`, `hover`, dan `active/tap` yang terdefinisi via Framer Motion.
3. Responsif penuh di tiga breakpoint utama tanpa overflow/elemen terpotong.
4. Dapat dioperasikan penuh via keyboard (Tab, Enter, Esc) berkat fondasi Radix UI.
5. Tidak ada *layout shift* yang mengganggu saat data dimuat (gunakan `Skeleton` saat `isLoading`).
