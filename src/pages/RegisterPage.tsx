import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "../components/ui/Button/Button";
import { Input } from "../components/ui/Input/Input";
import { useAuthStore } from "../store/useAuthStore";

interface RegisterPageProps {
  onNavigate: (page: "landing" | "login") => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama harus diisi");
      return;
    }
    if (!email.trim()) {
      setError("Email harus diisi");
      return;
    }
    if (!password.trim()) {
      setError("Password harus diisi");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      setSuccessEmail(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pendaftaran gagal, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  if (successEmail) {
    return (
      <div className="min-h-screen bg-base-bg flex flex-col">
        <header className="border-b-3 border-base-ink">
          <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <button onClick={() => onNavigate("landing")} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-brutal border-3 border-base-ink bg-accent-lime flex items-center justify-center">
                <Sparkles size={16} strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-lg">NeoFin</span>
            </button>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal-lg p-6 md:p-8 text-center">
              <div className="w-12 h-12 rounded-brutal border-3 border-base-ink bg-accent-lime flex items-center justify-center mx-auto mb-4">
                <Sparkles size={20} strokeWidth={2.5} />
              </div>
              <h1 className="font-display font-bold text-2xl tracking-tight">Cek Email Kamu</h1>
              <p className="font-body text-sm text-base-ink/50 mt-3 leading-relaxed">
                Akun <strong>{successEmail}</strong> berhasil dibuat.
                <br />
                Klik link konfirmasi yang sudah dikirim ke email kamu sebelum login.
              </p>
              <Button className="mt-6 w-full" onClick={() => onNavigate("login")}>
                Ke Halaman Login
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-bg flex flex-col">
      {/* Mini navbar */}
      <header className="border-b-3 border-base-ink">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-brutal border-3 border-base-ink bg-accent-lime flex items-center justify-center">
              <Sparkles size={16} strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg">NeoFin</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="rounded-brutal border-3 border-base-ink bg-base-surface shadow-brutal-lg p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-brutal border-3 border-base-ink bg-accent-lime flex items-center justify-center mx-auto mb-4">
                <UserPlus size={20} strokeWidth={2.5} />
              </div>
              <h1 className="font-display font-bold text-2xl tracking-tight">Daftar</h1>
              <p className="font-body text-sm text-base-ink/50 mt-1">
                Buat akun NeoFin baru
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-display font-bold text-xs uppercase tracking-wider text-base-ink/60 block mb-1.5">
                  Nama Lengkap
                </label>
                <Input
                  type="text"
                  placeholder="Nama kamu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="font-display font-bold text-xs uppercase tracking-wider text-base-ink/60 block mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="font-display font-bold text-xs uppercase tracking-wider text-base-ink/60 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-ink/40 hover:text-base-ink/70"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-display font-bold text-xs uppercase tracking-wider text-base-ink/60 block mb-1.5">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-ink/40 hover:text-base-ink/70"
                    aria-label={showConfirm ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="font-body text-sm text-feedback-danger flex items-center gap-1">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Memuat..." : "Daftar"}
              </Button>
            </form>

            <p className="font-body text-sm text-center text-base-ink/50 mt-6">
              Sudah punya akun?{" "}
              <button
                onClick={() => onNavigate("login")}
                className="font-display font-bold text-base-ink underline hover:text-accent-blue transition-colors"
              >
                Masuk
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
