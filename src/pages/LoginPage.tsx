import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "../components/ui/Button/Button";
import { Input } from "../components/ui/Input/Input";
import { useAuthStore } from "../store/useAuthStore";

interface LoginPageProps {
  onNavigate: (page: "landing" | "register") => void;
}

const FAILED_ATTEMPT_KEY = "neofin_login_attempts";
const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 60_000;

function getRemainingCooldown(): number {
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPT_KEY);
    if (!raw) return 0;
    const { count, time } = JSON.parse(raw);
    if (count >= MAX_ATTEMPTS) {
      const elapsed = Date.now() - time;
      if (elapsed < COOLDOWN_MS) return COOLDOWN_MS - elapsed;
      localStorage.removeItem(FAILED_ATTEMPT_KEY);
    }
  } catch { /* ignore */ }
  return 0;
}

function recordFailedAttempt() {
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPT_KEY);
    const entry = raw ? JSON.parse(raw) : { count: 0, time: Date.now() };
    entry.count += 1;
    entry.time = Date.now();
    localStorage.setItem(FAILED_ATTEMPT_KEY, JSON.stringify(entry));
  } catch { /* ignore */ }
}

function resetAttempts() {
  localStorage.removeItem(FAILED_ATTEMPT_KEY);
}

function toGenericAuthError(err: unknown): string {
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
    return "Email atau password salah";
  }
  if (msg.includes("email not confirmed") || msg.includes("email_not_confirmed")) {
    return "Email belum dikonfirmasi. Cek email kamu";
  }
  if (msg.includes("rate limit") || msg.includes("rate_limit")) {
    return "Terlalu banyak percobaan. Coba lagi nanti";
  }
  return "Login gagal, coba lagi";
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      setError(`Terlalu banyak percobaan. Coba lagi ${Math.ceil(remaining / 1000)} detik`);
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

    setLoading(true);
    try {
      await login(email, password);
      resetAttempts();
    } catch (err) {
      recordFailedAttempt();
      setError(toGenericAuthError(err));
    } finally {
      setLoading(false);
    }
  };

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
                <LogIn size={20} strokeWidth={2.5} />
              </div>
              <h1 className="font-display font-bold text-2xl tracking-tight">Masuk</h1>
              <p className="font-body text-sm text-base-ink/50 mt-1">
                Masuk ke akun NeoFin kamu
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-display font-bold text-xs uppercase tracking-wider text-base-ink/60 block mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error && !email.trim() ? error : undefined}
                />
              </div>

              <div>
                <label className="font-display font-bold text-xs uppercase tracking-wider text-base-ink/60 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
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

              {error && (
                <p className="font-body text-sm text-feedback-danger flex items-center gap-1">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Memuat..." : "Masuk"}
              </Button>
            </form>

            <p className="font-body text-sm text-center text-base-ink/50 mt-6">
              Belum punya akun?{" "}
              <button
                onClick={() => onNavigate("register")}
                className="font-display font-bold text-base-ink underline hover:text-accent-blue transition-colors"
              >
                Daftar
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
