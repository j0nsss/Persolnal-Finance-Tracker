import { motion } from "framer-motion";
import { useUIStore } from "../../store/useUIStore";
import { cn } from "../../lib/utils";

const navItems = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard" },
  { id: "transactions", label: "Transaksi", icon: "ArrowLeftRight" },
  { id: "analytics", label: "Analitik", icon: "BarChart3" },
];

export function Sidebar() {
  const { sidebarCollapsed, activeTab, setActiveTab } = useUIStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-base-surface border-r-3 border-base-ink z-40",
        "flex flex-col py-6 overflow-hidden",
      )}
    >
      <div className={cn("px-4 mb-8", sidebarCollapsed && "flex justify-center px-0")}>
        <h1 className="font-display font-bold text-xl tracking-tight">
          {sidebarCollapsed ? "N" : "NeoFin"}
        </h1>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "relative flex items-center gap-3 w-full px-4 py-3 rounded-brutal font-display font-bold text-sm transition-colors",
              "hover:bg-base-ink/5",
              activeTab === item.id && "bg-accent-lime",
            )}
          >
            <span className="shrink-0 w-5 h-5 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {item.icon === "LayoutDashboard" && <><rect width="18" height="15" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4" /><path d="M3 10h18" /></>}
                {item.icon === "ArrowLeftRight" && <><path d="M8 3L4 7l4 4" /><path d="M16 3l4 4-4 4" /><path d="M4 7h16" /><path d="M4 17h16" /><path d="M8 21l-4-4 4-4" /><path d="M16 21l4-4-4-4" /></>}
                {item.icon === "BarChart3" && <><path d="M3 3v18h18" /><path d="M7 16v-3" /><path d="M12 16v-7" /><path d="M17 16v-5" /></>}
              </svg>
            </span>
            {!sidebarCollapsed && <span>{item.label}</span>}
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
    </motion.aside>
  );
}
