import { motion } from "framer-motion";
import { TrendingUp, ArrowLeftRight, BarChart3, Shield, Sparkles, Smartphone } from "lucide-react";
import { Button } from "../components/ui/Button/Button";
import { cn } from "../lib/utils";

interface LandingPageProps {
  onNavigate: (page: "login" | "register") => void;
}

const features = [
  {
    icon: TrendingUp,
    title: "Pantau Pemasukan",
    desc: "Catat semua sumber pemasukan dengan mudah dan lihat perkembangan finansialmu secara real-time.",
    color: "bg-accent-lime",
  },
  {
    icon: ArrowLeftRight,
    title: "Kelola Pengeluaran",
    desc: "Lacak setiap transaksi dengan kategori detail. Tau persis kemana uangmu pergi.",
    color: "bg-accent-pink",
  },
  {
    icon: BarChart3,
    title: "Analitik Cerdas",
    desc: "Grafik interaktif dan insight otomatis untuk bantu kamu mengambil keputusan finansial.",
    color: "bg-accent-blue",
  },
  {
    icon: Shield,
    title: "Data Lokal",
    desc: "Semua data disimpan aman di perangkatmu. Privasi tetap terjaga, tanpa perlu khawatir.",
    color: "bg-accent-orange",
  },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-base-bg">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-base-bg border-b-3 border-base-ink">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-brutal border-3 border-base-ink bg-accent-lime flex items-center justify-center">
              <Sparkles size={16} strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg">NeoFin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onNavigate("login")}>
              Masuk
            </Button>
            <Button size="sm" onClick={() => onNavigate("register")}>
              Daftar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b-3 border-base-ink">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-1.5 rounded-brutal border-2 border-base-ink bg-accent-lime px-3 py-1.5 font-display font-bold text-xs mb-4">
                <Sparkles size={12} strokeWidth={2.5} />
                Personal Finance Tracker
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
                Kendalikan{" "}
                <span className="bg-accent-lime px-2 -mx-1">Keuanganmu</span>
                {" "}dengan Gaya
              </h1>
              <p className="font-body text-base-ink/60 mt-4 text-lg max-w-md leading-relaxed">
                NeoFin membantu kamu mencatat, memantau, dan menganalisis keuangan pribadi
                dengan tampilan brutalist yang keren dan intuitif.
              </p>
              <div className="flex items-center gap-3 mt-8">
                <Button size="lg" onClick={() => onNavigate("register")}>
                  Mulai Gratis
                </Button>
                <Button variant="ghost" size="lg" onClick={() => onNavigate("login")}>
                  Sudah punya akun?
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal-lg p-6">
                {/* Mock dashboard preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-brutal border-2 border-base-ink bg-accent-lime" />
                      <span className="font-display font-bold text-sm">NeoFin</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-base-ink/20" />
                      <div className="w-2 h-2 rounded-full bg-base-ink/20" />
                      <div className="w-2 h-2 rounded-full bg-feedback-danger" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-brutal border-2 border-base-ink bg-accent-lime p-3">
                      <p className="font-display font-bold text-[9px] text-black/50 uppercase">Pemasukan</p>
                      <p className="font-mono font-bold text-sm mt-0.5">Rp 8,7jt</p>
                    </div>
                    <div className="rounded-brutal border-2 border-base-ink bg-accent-pink p-3">
                      <p className="font-display font-bold text-[9px] text-black/50 uppercase">Pengeluaran</p>
                      <p className="font-mono font-bold text-sm mt-0.5">Rp 3,2jt</p>
                    </div>
                    <div className="rounded-brutal border-2 border-base-ink bg-accent-blue p-3">
                      <p className="font-display font-bold text-[9px] text-black/50 uppercase">Saldo</p>
                      <p className="font-mono font-bold text-sm mt-0.5">Rp 5,5jt</p>
                    </div>
                  </div>
                  <div className="h-20 rounded-brutal border-2 border-base-ink bg-base-bg flex items-center justify-center">
                    <Smartphone size={20} className="text-base-ink/20" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-brutal border-3 border-base-ink bg-accent-lime/30 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b-3 border-base-ink">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
              Kenapa NeoFin?
            </h2>
            <p className="font-body text-base-ink/60 mt-3 max-w-lg mx-auto">
              Dibuat untuk kamu yang ingin serius mengatur keuangan tanpa ribet.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "rounded-brutal border-3 border-base-ink shadow-brutal p-5",
                  feat.color,
                )}
              >
                <div className="w-10 h-10 rounded-brutal border-2 border-base-ink bg-base-surface flex items-center justify-center mb-4">
                  <feat.icon size={18} strokeWidth={2.5} />
                </div>
                <h3 className="font-display font-bold text-base">{feat.title}</h3>
                <p className="font-body text-sm text-base-ink/70 mt-2 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
            Siap Mengatur Keuanganmu?
          </h2>
          <p className="font-body text-base-ink/60 mt-3 max-w-md mx-auto">
            Gratis, tanpa ribet. Mulai catat pemasukan dan pengeluaranmu sekarang.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" onClick={() => onNavigate("register")}>
              Daftar Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-3 border-base-ink bg-base-ink">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-brutal border-2 border-white/30 bg-accent-lime flex items-center justify-center">
                <Sparkles size={10} strokeWidth={2.5} className="text-base-ink" />
              </div>
              <span className="font-display font-bold text-sm text-white">NeoFin</span>
            </div>
            <p className="font-body text-xs text-white/40">
              &copy; 2026 NeoFin. Dibuat dengan semangat finansial.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
