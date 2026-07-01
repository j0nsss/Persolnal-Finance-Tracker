<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/NeoFin-v1.0-000?style=flat&labelColor=000&color=A3E635">
  <img alt="NeoFin banner" src="https://img.shields.io/badge/NeoFin-v1.0-000?style=flat&labelColor=000&color=A3E635">
</picture>

<h1 align="center">
  <br>
  <img src="public/favicon.svg?v=2" alt="NeoFin" width="64" height="64">
  <br>
  NeoFin
  <br>
  <sub>Personal Finance Tracker</sub>
</h1>

<p align="center">
  <strong>💰 Neo-Brutalism · ⚡ React 19 · 🗄️ Supabase</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#database">Database</a>
</p>

<div align="center">
  <table>
    <tr>
      <td><b>Framework</b></td>
      <td>React 19 · TypeScript 6 · Vite 8</td>
    </tr>
    <tr>
      <td><b>Styling</b></td>
      <td>Tailwind CSS 3 · Neo-Brutalism · Class Variance Authority</td>
    </tr>
    <tr>
      <td><b>Backend</b></td>
      <td>Supabase (PostgreSQL · Auth · RLS)</td>
    </tr>
    <tr>
      <td><b>Animations</b></td>
      <td>Framer Motion 12 · Spring physics · Micro-interactions</td>
    </tr>
    <tr>
      <td><b>Charts</b></td>
      <td>Recharts · Count-up numbers · Sparklines</td>
    </tr>
  </table>
</div>

---

## ✨ Features

| Area | Highlights |
|------|------------|
| **📊 Overview** | Summary cards with count-up + sparkline + trend, chart filter by period, monthly area chart, category donut chart, daily tracker, weekly trend, animated DinoRun easter egg |
| **📋 Transactions** | Full CRUD ledger, search by description, category filter, weekly spend chart, optimistic updates |
| **📈 Analytics** | 3M/6M/1Y/ALL period toggle, cashflow area chart, category breakdown, savings rate, monthly forecast |
| **🔐 Auth** | Email/password login & register, Supabase session management, RLS-protected data, auto-profile creation |
| **🎨 Design** | Consistent Neo-Brutalism — 3px borders, 4px hard shadows, bold typography (Space Grotesk + Inter), spring animations on every interaction |
| **📱 Responsive** | Collapsible sidebar (desktop), hover-expand (tablet), bottom tab nav (mobile collapsed into topbar) |

## 🧰 Tech Stack

| Layer | Tool |
|-------|------|
| **Language** | TypeScript 6 (strict mode) |
| **Framework** | React 19, Vite 8 |
| **Styling** | Tailwind CSS 3, CVA, clsx, tailwind-merge |
| **State** | Zustand 5, Context (theme only) |
| **Backend** | Supabase (PostgreSQL, Auth, Row Level Security) |
| **Animation** | Framer Motion 12 |
| **Charts** | Recharts, date-fns |
| **Forms** | react-hook-form, zod, @hookform/resolvers |
| **UI Kit** | Radix UI (Dialog, Dropdown, Tabs, Toast, Tooltip) |
| **Icons** | Lucide React |
| **Linting** | Oxlint |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

### Setup

```bash
# 1. Clone & install
git clone https://github.com/j0nsss/Persolnal-Finance-Tracker.git
cd Persolnal-Finance-Tracker
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase project credentials

# 3. Set up the database
#   - Go to your Supabase Dashboard > SQL Editor
#   - Run src/lib/supabase/schema.sql
#   - (Optional) Run src/lib/supabase/seed.sql for sample data

# 4. Start development
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run Oxlint |

## 🗄️ Database

PostgreSQL schema managed via Supabase:

- **`profiles`** — Auto-created on sign-up via DB trigger. One row per user.
- **`transactions`** — Each row belongs to a user. CHECK constraints on `amount > 0`, `type` (income/expense), `category_id` (whitelist). Indexed on `(user_id, date DESC)`.
- **RLS** — All operations scoped to `auth.uid()`. Users can only see/modify their own data.

Run `src/lib/supabase/schema.sql` in Supabase SQL Editor to initialise.

## 🌐 Deployment

The app is a static SPA — deploy anywhere that supports SPA fallback:

- **Vercel**: `npm run build` → deploy `dist/`
- **Netlify**: add `/* /index.html 200` redirect

Ensure your Supabase project URL and anon key are set as environment variables on your hosting platform.

## 🧱 Project Structure

```
src/
├── components/        # UI primitives & layout
│   ├── ui/           # Button, Card, Input, Modal, Select, Toast, …
│   └── layout/       # Sidebar, Topbar, DashboardShell
├── features/          # Domain feature modules
│   ├── dashboard/    # Overview tab
│   ├── analytics/    # Analytics tab
│   └── transactions/  # Ledger tab
├── lib/
│   ├── supabase/     # client, authApi, transactionApi, schema
│   └── constants.ts  # Categories, configuration
├── pages/            # Public pages (Landing, Login, Register)
├── store/            # Zustand stores (auth, transactions, UI, toast)
├── types/            # TypeScript type definitions
├── hooks/            # Shared hooks (count-up, debounce, media query)
├── context/          # ThemeProvider
├── styles/           # Tailwind global CSS
└── App.tsx           # Root with tab-based routing
```

## 📄 License

All Rights Reserved. See [LICENSE](./LICENSE) for details.

---

<p align="center">
  Built with ❤️ using React + TypeScript + Supabase
</p>
