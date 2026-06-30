import { useUIStore } from "../../store/useUIStore";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const tabLabels: Record<string, string> = {
  overview: "Overview",
  transactions: "Transaksi",
  analytics: "Analitik",
};

interface TopbarProps {
  onAddTransaction: () => void;
}

export function Topbar({ onAddTransaction }: TopbarProps) {
  const { activeTab, toggleSidebar } = useUIStore();
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <header className="sticky top-0 z-30 bg-base-bg border-b-3 border-base-ink">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="rounded-brutal border-3 border-base-ink p-2 hover:bg-base-ink/5 transition-colors"
              aria-label="Buka menu navigasi"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <h2 className="font-display font-bold text-xl md:text-2xl">
            {tabLabels[activeTab] || "Overview"}
          </h2>
        </div>

        <button
          onClick={onAddTransaction}
          className="font-display font-bold text-sm rounded-brutal border-3 border-base-ink bg-accent-lime px-4 md:px-5 py-2.5 shadow-brutal hover:shadow-brutal-lg active:shadow-brutal-pressed transition-shadow"
          aria-label="Tambah transaksi baru"
        >
          + Transaksi
        </button>
      </div>
    </header>
  );
}
