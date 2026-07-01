import { useState } from "react";
import { motion } from "framer-motion";
import { useUIStore } from "../../store/useUIStore";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { cn } from "../../lib/utils";

const navItems = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard" },
  { id: "transactions", label: "Transaksi", icon: "ArrowLeftRight" },
  { id: "analytics", label: "Analitik", icon: "BarChart3" },
  { id: "settings", label: "Pengaturan", icon: "Settings" },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, activeTab, setActiveTab } = useUIStore();
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
  const [hovered, setHovered] = useState(false);

  const isCollapsed = isTablet ? !hovered : sidebarCollapsed;

  return (
    <motion.aside
      onMouseEnter={() => isTablet && setHovered(true)}
      onMouseLeave={() => isTablet && setHovered(false)}
      animate={{ width: isCollapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-base-surface border-r-3 border-base-ink z-40",
        "flex flex-col py-6 overflow-hidden",
      )}
      aria-label="Navigasi utama"
    >
      <div className={cn("mb-8", isCollapsed ? "flex justify-center px-0" : "px-4")}>
        <h1 className="font-display font-bold text-xl tracking-tight">
          {isCollapsed ? "N" : "NeoFin"}
        </h1>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2" aria-label="Tab dashboard">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "relative flex items-center gap-3 w-full px-4 py-3 rounded-brutal font-display font-bold text-sm transition-colors",
              "hover:bg-base-ink/5",
              activeTab === item.id && "bg-accent-lime",
            )}
            aria-current={activeTab === item.id ? "page" : undefined}
            aria-label={item.label}
          >
            <span className="shrink-0 w-5 h-5 flex items-center justify-center" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {item.icon === "LayoutDashboard" && <><rect width="18" height="15" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4" /><path d="M3 10h18" /></>}
                {item.icon === "ArrowLeftRight" && <><path d="M8 3L4 7l4 4" /><path d="M16 3l4 4-4 4" /><path d="M4 7h16" /><path d="M4 17h16" /><path d="M8 21l-4-4 4-4" /><path d="M16 21l4-4-4-4" /></>}
                {item.icon === "BarChart3" && <><path d="M3 3v18h18" /><path d="M7 16v-3" /><path d="M12 16v-7" /><path d="M17 16v-5" /></>}
                {item.icon === "Settings" && <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>}
              </svg>
            </span>
            {!isCollapsed && <span>{item.label}</span>}
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-lime rounded-r-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

      {!isTablet && (
        <div className={cn("mt-auto pt-4", isCollapsed ? "flex justify-center" : "px-4")}>
          <button
            onClick={toggleSidebar}
            className="rounded-brutal border-3 border-base-ink p-2 hover:bg-base-ink/5 transition-colors"
            aria-label={isCollapsed ? "Perluas sidebar" : "Persempit sidebar"}
          >
            <motion.svg
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </motion.svg>
          </button>
        </div>
      )}
    </motion.aside>
  );
}
