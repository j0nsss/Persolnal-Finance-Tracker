import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  BarChart3, Shield, Smartphone,
  Sparkles, ChevronDown, Check, Star, Zap,
  Wallet, PiggyBank, Target, ChartLine,
} from "lucide-react";
import { Button } from "../components/ui/Button/Button";
import { cn } from "../lib/utils";

interface LandingPageProps {
  onNavigate: (page: "login" | "register") => void;
}

const features = [
  {
    icon: Wallet,
    title: "Pantau Pemasukan",
    desc: "Catat semua sumber pemasukan dengan mudah. Lihat total pendapatan harian, mingguan, dan bulanan secara real-time.",
    color: "bg-accent-lime",
  },
  {
    icon: PiggyBank,
    title: "Kelola Pengeluaran",
    desc: "Lacak setiap transaksi dengan 9+ kategori detail. Tau persis kemana uangmu pergi setiap bulannya.",
    color: "bg-accent-pink",
  },
  {
    icon: ChartLine,
    title: "Analitik Interaktif",
    desc: "Grafik area, donut, dan tren mingguan yang interaktif. Dapatkan insight finansial dalam satu klik.",
    color: "bg-accent-blue",
  },
  {
    icon: Shield,
    title: "Aman & Terenkripsi",
    desc: "Data dienkripsi dan diamankan dengan Supabase RLS. Hanya kamu yang bisa mengakses data keuanganmu.",
    color: "bg-accent-orange",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    desc: "Tampilan optimal di semua perangkat — desktop, tablet, maupun HP. Pantau keuangan darimana saja.",
    color: "bg-accent-lime",
  },
  {
    icon: Target,
    title: "Proyeksi & Target",
    desc: "Fitur analitik dengan proyeksi pengeluaran, savings rate, dan forecast untuk bantu perencanaan masa depan.",
    color: "bg-accent-blue",
  },
];

const steps = [
  { num: "01", title: "Buat Akun", desc: "Daftar gratis dalam 30 detik. Tanpa kartu kredit, tanpa ribet.", color: "bg-accent-lime" },
  { num: "02", title: "Catat Transaksi", desc: "Tambah pemasukan & pengeluaran dengan form cepat. Kategori sudah tersedia.", color: "bg-accent-pink" },
  { num: "03", title: "Lihat Insight", desc: "Dashboard & analitik otomatis memberikan gambaran kondisi keuanganmu.", color: "bg-accent-blue" },
];

const testimonials = [
  { name: "Rina A.", role: "Freelancer Designer", text: "Sejak pakai NeoFin, pengeluaran bulanan saya turun 30%. Grafik kategorinya bikin saya sadar selama ini boros di makanan.", initial: "R" },
  { name: "Dimas P.", role: "Karyawan Swasta", text: "Ui-nya keren banget! Brutalist design-nya unik, beda dari aplikasi keuangan lain yang monoton. Statistiknya lengkap.", initial: "D" },
  { name: "Sari W.", role: "Mahasiswa", text: "Akhirnya nemu app pencatat keuangan yang gratis dan enak dipake. Fitur forecast-nya bantu aku rencanain budget bulan depan.", initial: "S" },
];

const faqs = [
  { q: "Apakah NeoFin benar-benar gratis?", a: "Ya, versi saat ini gratis sepenuhnya. Tidak ada biaya langganan atau fitur premium yang dikunci." },
  { q: "Apakah data keuangan saya aman?", a: "Sangat aman. Data disimpan di Supabase dengan enkripsi dan Row Level Security. Hanya kamu yang punya akses ke data pribadimu." },
  { q: "Bisa dipakai di HP?", a: "Bisa. NeoFin dirancang responsive untuk semua ukuran layar — desktop, tablet, dan smartphone." },
  { q: "Bagaimana cara mulai mencatat?", a: "Cukup daftar akun gratis, lalu klik tombol + pada halaman utama untuk menambahkan transaksi pertamamu." },
];

function FaqItem({ q, a, open: defaultOpen }: { q: string; a: string; open?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="rounded-brutal border-3 border-base-ink bg-base-surface overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left"
      >
        <span className="font-display font-bold text-sm md:text-base pr-4">{q}</span>
        <ChevronDown
          size={16}
          strokeWidth={3}
          className={cn(
            "shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t-3 border-base-ink px-4 md:px-5 py-4">
          <p className="font-body text-sm text-base-ink/70 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="min-h-screen bg-base-bg">
      {/* ──────── Navbar ──────── */}
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

      {/* ──────── Hero ──────── */}
      <section ref={heroRef} className="border-b-3 border-base-ink overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-1.5 rounded-brutal border-2 border-base-ink bg-accent-lime px-3 py-1.5 font-display font-bold text-xs mb-4">
                <Sparkles size={12} strokeWidth={2.5} />
                Personal Finance Tracker
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
                Kendalikan{" "}
                <span className="bg-accent-lime px-2 -mx-1">Keuanganmu</span>
                <br />
                dengan Gaya
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
              <div className="flex items-center gap-4 mt-6 text-xs font-body text-base-ink/40">
                <span className="flex items-center gap-1"><Check size={12} strokeWidth={3} /> Gratis</span>
                <span className="flex items-center gap-1"><Check size={12} strokeWidth={3} /> No card required</span>
                <span className="flex items-center gap-1"><Check size={12} strokeWidth={3} /> 100% privat</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: heroY }}
              className="relative"
            >
              <div className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal-lg p-5 md:p-6">
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
                    <BarChart3 size={20} className="text-base-ink/20" strokeWidth={1.5} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-brutal border-2 border-base-ink p-2.5">
                      <p className="font-display font-bold text-[8px] text-base-ink/40 uppercase tracking-wider">Hari Ini</p>
                      <p className="font-mono font-bold text-xs mt-0.5 text-feedback-danger">−Rp 185rb</p>
                    </div>
                    <div className="rounded-brutal border-2 border-base-ink p-2.5">
                      <p className="font-display font-bold text-[8px] text-base-ink/40 uppercase tracking-wider">Minggu Ini</p>
                      <p className="font-mono font-bold text-xs mt-0.5 text-accent-lime">+Rp 2,1jt</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-brutal border-3 border-base-ink bg-accent-lime/30 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────── Trust Bar ──────── */}
      <section className="border-b-3 border-base-ink bg-base-surface">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
          <p className="font-display font-bold text-xs text-center text-base-ink/30 uppercase tracking-widest mb-6">
            Dipercaya oleh ribuan pengguna
          </p>
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            {[
              { value: "10rb+", label: "Pengguna Aktif", color: "text-accent-lime" },
              { value: "50rb+", label: "Transaksi Tercatat", color: "text-accent-pink" },
              { value: "Rp 100M+", label: "Total Dana Terkelola", color: "text-accent-blue" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={cn("font-display font-bold text-xl md:text-2xl", stat.color)}>{stat.value}</p>
                <p className="font-body text-[10px] md:text-xs text-base-ink/40 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── How It Works ──────── */}
      <section className="border-b-3 border-base-ink">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
              Cara Kerjanya
            </h2>
            <p className="font-body text-base-ink/60 mt-3 max-w-lg mx-auto">
              Mulai dalam 3 langkah mudah. Gak perlu jadi ahli keuangan.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={cn(
                  "rounded-brutal border-3 border-base-ink shadow-brutal p-5 md:p-6 relative",
                  step.color,
                )}
              >
                <span className="font-display font-bold text-3xl md:text-4xl text-black/10 absolute top-3 right-4">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-brutal border-2 border-base-ink bg-base-surface flex items-center justify-center mb-4 relative">
                  <span className="font-display font-bold text-sm">{step.num}</span>
                </div>
                <h3 className="font-display font-bold text-base md:text-lg relative">{step.title}</h3>
                <p className="font-body text-sm text-base-ink/70 mt-2 leading-relaxed relative">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Features ──────── */}
      <section className="border-b-3 border-base-ink bg-base-surface">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-1.5 rounded-brutal border-2 border-base-ink bg-accent-lime px-3 py-1.5 font-display font-bold text-xs mb-4">
              <Zap size={12} strokeWidth={2.5} />
              Fitur Lengkap
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="font-body text-base-ink/60 mt-3 max-w-lg mx-auto">
              Dari catatan transaksi hingga analitik prediktif — satu app untuk semua.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "rounded-brutal border-3 border-base-ink shadow-brutal-sm p-5",
                  feat.color + "/60",
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

      {/* ──────── Testimonials ──────── */}
      <section className="border-b-3 border-base-ink">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
              Yang Mereka Katakan
            </h2>
            <p className="font-body text-base-ink/60 mt-3 max-w-lg mx-auto">
              Ribuan pengguna sudah merasakan manfaat NeoFin.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal-sm p-5 md:p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={12} strokeWidth={0} className="fill-accent-orange text-accent-orange" />
                  ))}
                </div>
                <p className="font-body text-sm text-base-ink/80 leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-brutal border-2 border-base-ink bg-accent-lime flex items-center justify-center">
                    <span className="font-display font-bold text-xs">{t.initial}</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-xs">{t.name}</p>
                    <p className="font-body text-[10px] text-base-ink/40">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── FAQ ──────── */}
      <section className="border-b-3 border-base-ink bg-base-surface">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
              Pertanyaan Umum
            </h2>
            <p className="font-body text-base-ink/60 mt-3 max-w-lg mx-auto">
              Hal-hal yang sering ditanyakan tentang NeoFin.
            </p>
          </motion.div>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="border-b-3 border-base-ink">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Siap Mengatur Keuanganmu?
            </h2>
            <p className="font-body text-base-ink/60 mt-3 max-w-md mx-auto text-lg">
              Gratis, tanpa ribet. Mulai catat pemasukan dan pengeluaranmu sekarang.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button size="lg" onClick={() => onNavigate("register")}>
                Daftar Sekarang
              </Button>
            </div>
            <p className="font-body text-xs text-base-ink/40 mt-4">
              Tidak perlu kartu kredit. Batalkan kapan saja.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────── Footer ──────── */}
      <footer className="bg-base-ink">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded-brutal border-2 border-white/30 bg-accent-lime flex items-center justify-center">
                  <Sparkles size={10} strokeWidth={2.5} className="text-base-ink" />
                </div>
                <span className="font-display font-bold text-sm text-white">NeoFin</span>
              </div>
              <p className="font-body text-xs text-white/40 leading-relaxed max-w-xs">
                Personal finance tracker dengan desain brutalist. Catat, pantau, dan kendalikan keuanganmu.
              </p>
            </div>
            <div>
              <p className="font-display font-bold text-xs text-white/50 uppercase tracking-wider mb-3">Produk</p>
              <ul className="space-y-2">
                {["Fitur", "Harga", "FAQ"].map((l) => (
                  <li key={l} className="font-body text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer">{l}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-display font-bold text-xs text-white/50 uppercase tracking-wider mb-3">Perusahaan</p>
              <ul className="space-y-2">
                {["Blog", "Karier", "Kontak"].map((l) => (
                  <li key={l} className="font-body text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer">{l}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-display font-bold text-xs text-white/50 uppercase tracking-wider mb-3">Legal</p>
              <ul className="space-y-2">
                {["Privasi", "Syarat & Ketentuan"].map((l) => (
                  <li key={l} className="font-body text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer">{l}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-white/30">
              &copy; 2026 NeoFin. All rights reserved.
            </p>
            <p className="font-body text-[10px] text-white/20">
              Dibuat dengan semangat literasi finansial.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
