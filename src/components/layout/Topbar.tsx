import { motion } from "framer-motion";
import { useUIStore } from "../../store/useUIStore";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { cn } from "../../lib/utils";

const tabLabels: Record<string, string> = {
  overview: "Overview",
  transactions: "Transaksi",
  analytics: "Analitik",
};

const navItems = [
  { id: "overview", label: "Overview" },
  { id: "transactions", label: "Transaksi" },
  { id: "analytics", label: "Analitik" },
];

interface TopbarProps {
  onAddTransaction: () => void;
}

export function Topbar({ onAddTransaction }: TopbarProps) {
  const { activeTab, setActiveTab } = useUIStore();
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <header className="sticky top-0 z-30 bg-base-bg border-b-3 border-base-ink">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <h2 className="font-display font-bold text-xl md:text-2xl">
          {tabLabels[activeTab] || "Overview"}
        </h2>

        <button
          onClick={onAddTransaction}
          className="font-display font-bold text-sm rounded-brutal border-3 border-base-ink bg-accent-lime px-4 md:px-5 py-2.5 shadow-brutal hover:shadow-brutal-lg active:shadow-brutal-pressed transition-shadow"
          aria-label="Tambah transaksi baru"
        >
          + Transaksi
        </button>
      </div>

      {isMobile && (
        <nav className="px-4 pb-3" aria-label="Navigasi tab">
          <div className="flex items-center gap-1 bg-base-ink/5 rounded-brutal p-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "relative flex-1 font-display font-bold text-xs py-2 px-3 rounded-brutal transition-colors",
                    isActive
                      ? "text-base-ink"
                      : "text-base-ink/50 hover:text-base-ink/80",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveTab"
                      className="absolute inset-0 bg-base-surface border-2 border-base-ink rounded-brutal"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
