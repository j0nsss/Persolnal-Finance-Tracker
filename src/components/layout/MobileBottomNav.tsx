import { motion } from "framer-motion";
import { useUIStore } from "../../store/useUIStore";
import { cn } from "../../lib/utils";

const navItems = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard" },
  { id: "transactions", label: "Transaksi", icon: "ArrowLeftRight" },
  { id: "analytics", label: "Analitik", icon: "BarChart3" },
];

export function MobileBottomNav() {
  const { activeTab, setActiveTab } = useUIStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-base-surface border-t-3 border-base-ink" aria-label="Navigasi bawah">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-brutal font-display font-bold text-xs transition-colors min-w-[72px]",
                isActive ? "bg-accent-lime" : "hover:bg-base-ink/5",
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              <span aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {item.icon === "LayoutDashboard" && <><rect width="18" height="15" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4" /><path d="M3 10h18" /></>}
                  {item.icon === "ArrowLeftRight" && <><path d="M8 3L4 7l4 4" /><path d="M16 3l4 4-4 4" /><path d="M4 7h16" /><path d="M4 17h16" /><path d="M8 21l-4-4 4-4" /><path d="M16 21l4-4-4-4" /></>}
                  {item.icon === "BarChart3" && <><path d="M3 3v18h18" /><path d="M7 16v-3" /><path d="M12 16v-7" /><path d="M17 16v-5" /></>}
                </svg>
              </span>
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-8 h-[3px] bg-base-ink rounded-b-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
