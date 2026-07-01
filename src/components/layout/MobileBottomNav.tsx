import { motion } from "framer-motion";
import { useUIStore } from "../../store/useUIStore";
import { cn } from "../../lib/utils";

const navItems = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard" },
  { id: "transactions", label: "Transaksi", icon: "ArrowLeftRight" },
  { id: "analytics", label: "Analitik", icon: "BarChart3" },
  { id: "settings", label: "Pengaturan", icon: "Settings" },
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
                  {item.icon === "Settings" && <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>}
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
