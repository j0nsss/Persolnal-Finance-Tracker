import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Palette,
  Globe,
  Shield,
  Info,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { cn } from "../../../lib/utils";

const sections = [
  {
    id: "profile",
    label: "Profil",
    icon: User,
    description: "Nama, email, dan informasi akun",
  },
  {
    id: "appearance",
    label: "Tampilan",
    icon: Palette,
    description: "Tema dan preferensi visual",
  },
  {
    id: "notifications",
    label: "Notifikasi",
    icon: Bell,
    description: "Atur pemberitahuan pengeluaran",
  },
  {
    id: "language",
    label: "Bahasa & Wilayah",
    icon: Globe,
    description: "Locale, mata uang, dan format angka",
  },
  {
    id: "privacy",
    label: "Privasi & Keamanan",
    icon: Shield,
    description: "Kata sandi dan sesi masuk",
  },
  {
    id: "about",
    label: "Tentang",
    icon: Info,
    description: "Versi aplikasi dan lisensi",
  },
];

const appearanceOptions = [
  { value: "light", label: "Terang" },
  { value: "dark", label: "Gelap" },
  { value: "system", label: "Sistem" },
];

const currencyOptions = [
  { value: "IDR", label: "IDR (Rp)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
];

export function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [activeSection, setActiveSection] = useState("profile");
  const [theme, setTheme] = useState("light");
  const [currency, setCurrency] = useState("IDR");
  const [notificationToggles, setNotificationToggles] = useState([true, true, false]);

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 bg-base-surface border-3 border-base-ink rounded-brutal shadow-brutal">
              <div className="w-20 h-20 rounded-full border-3 border-base-ink bg-accent-lime flex items-center justify-center">
                <span className="font-display font-bold text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-xl">{user?.name || "User"}</h3>
                <p className="font-body text-base-ink/60">{user?.email || "user@example.com"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block font-display font-bold text-sm">Nama Lengkap</label>
              <input
                type="text"
                defaultValue={user?.name || ""}
                className="w-full px-4 py-3 font-body rounded-brutal border-3 border-base-ink bg-base-surface focus:outline-none focus:shadow-brutal transition-shadow"
                placeholder="Nama kamu"
              />
            </div>

            <div className="space-y-4">
              <label className="block font-display font-bold text-sm">Email</label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="w-full px-4 py-3 font-body rounded-brutal border-3 border-base-ink bg-base-surface focus:outline-none focus:shadow-brutal transition-shadow"
                placeholder="email@example.com"
              />
            </div>

            <button className="font-display font-bold text-sm rounded-brutal border-3 border-base-ink bg-accent-lime px-6 py-3 shadow-brutal hover:shadow-brutal-lg active:shadow-brutal-pressed transition-shadow">
              Simpan Perubahan
            </button>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm">Mode Tampilan</h3>
              <div className="flex gap-3">
                {appearanceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={cn(
                      "flex-1 px-4 py-4 rounded-brutal border-3 border-base-ink font-display font-bold text-sm transition-all",
                      theme === opt.value
                        ? "bg-accent-lime shadow-brutal"
                        : "bg-base-surface hover:shadow-brutal-sm",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-base-surface border-3 border-base-ink rounded-brutal shadow-brutal">
              <h3 className="font-display font-bold text-sm mb-4">Preview Warna</h3>
              <div className="flex gap-3">
                {["bg-accent-lime", "bg-accent-pink", "bg-accent-orange", "bg-accent-blue", "bg-base-ink"].map((c) => (
                  <div key={c} className={cn("w-10 h-10 rounded-brutal border-3 border-base-ink", c)} />
                ))}
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            {[
              { label: "Pengingat pencatatan harian", desc: "Ingatkan untuk mencatat pengeluaran setiap hari" },
              { label: "Alert batas budget", desc: "Notifikasi saat pengeluaran mendekati batas budget" },
              { label: "Ringkasan mingguan", desc: "Kirim ringkasan pengeluaran setiap hari Minggu" },
            ].map((item, idx) => (
              <label
                key={item.label}
                className="flex items-center justify-between p-6 bg-base-surface border-3 border-base-ink rounded-brutal cursor-pointer hover:shadow-brutal-sm transition-shadow"
              >
                <div className="space-y-1">
                  <span className="font-display font-bold text-sm">{item.label}</span>
                  <p className="font-body text-xs text-base-ink/60">{item.desc}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationToggles[idx]}
                  onClick={() =>
                    setNotificationToggles((prev) =>
                      prev.map((v, i) => (i === idx ? !v : v)),
                    )
                  }
                  className={cn(
                    "relative w-12 h-7 rounded-full border-3 border-base-ink cursor-pointer transition-colors",
                    notificationToggles[idx] ? "bg-accent-lime" : "bg-base-bg",
                  )}
                >
                  <motion.div
                    layout
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-base-ink"
                    animate={{ x: notificationToggles[idx] ? 22 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </label>
            ))}
          </div>
        );

      case "language":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm">Mata Uang</h3>
              <div className="flex gap-3">
                {currencyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCurrency(opt.value)}
                    className={cn(
                      "flex-1 px-4 py-4 rounded-brutal border-3 border-base-ink font-display font-bold text-sm transition-all",
                      currency === opt.value
                        ? "bg-accent-lime shadow-brutal"
                        : "bg-base-surface hover:shadow-brutal-sm",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-base-surface border-3 border-base-ink rounded-brutal shadow-brutal">
              <h3 className="font-display font-bold text-sm mb-2">Format Angka</h3>
              <p className="font-body text-sm text-base-ink/60">
                Rp 1.234.567,00 — Indonesia (Indonesia)
              </p>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-6 bg-base-surface border-3 border-base-ink rounded-brutal hover:shadow-brutal-sm transition-shadow">
              <div className="text-left space-y-1">
                <span className="font-display font-bold text-sm">Ubah Kata Sandi</span>
                <p className="font-body text-xs text-base-ink/60">Minimal 8 karakter dengan huruf dan angka</p>
              </div>
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>

            <button className="w-full flex items-center justify-between p-6 bg-base-surface border-3 border-base-ink rounded-brutal hover:shadow-brutal-sm transition-shadow">
              <div className="text-left space-y-1">
                <span className="font-display font-bold text-sm">Hapus Akun</span>
                <p className="font-body text-xs text-feedback-danger/80">Semua data akan dihapus permanen</p>
              </div>
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        );

      case "about":
        return (
          <div className="space-y-4">
            <div className="p-6 bg-base-surface border-3 border-base-ink rounded-brutal shadow-brutal">
              <h3 className="font-display font-bold text-lg mb-1">NeoFin</h3>
              <p className="font-body text-sm text-base-ink/60">Personal Finance Tracker</p>
              <div className="mt-4 pt-4 border-t-2 border-base-ink/10 space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-base-ink/60">Versi</span>
                  <span className="font-mono font-bold">1.0.0</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-base-ink/60">Lisensi</span>
                  <span className="font-mono font-bold">MIT</span>
                </div>
              </div>
            </div>

            <a
              href="#"
              className="block p-4 bg-base-surface border-3 border-base-ink rounded-brutal hover:shadow-brutal-sm transition-shadow"
            >
              <span className="font-display font-bold text-sm">Kebijakan Privasi</span>
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <nav
          className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0"
          aria-label="Menu pengaturan"
        >
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-brutal font-display font-bold text-sm text-left whitespace-nowrap border-3 border-transparent transition-all shrink-0",
                  isActive
                    ? "bg-accent-lime border-base-ink shadow-brutal-sm"
                    : "hover:bg-base-ink/5",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={2.5} aria-hidden="true" />
                <span className="hidden lg:inline">{section.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
}
