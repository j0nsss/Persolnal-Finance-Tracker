import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { PageTransition } from "./PageTransition";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useUIStore } from "../../store/useUIStore";
import { cn } from "../../lib/utils";

interface DashboardShellProps {
  onAddTransaction: () => void;
  children: ReactNode;
}

export function DashboardShell({ onAddTransaction, children }: DashboardShellProps) {
  const { sidebarCollapsed, activeTab } = useUIStore();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");

  const sidebarOffset = () => {
    if (isMobile) return "ml-0";
    if (isTablet) return "ml-[72px]";
    return sidebarCollapsed ? "ml-[72px]" : "ml-[240px]";
  };

  return (
    <div className="min-h-screen bg-base-bg">
      {!isMobile && <Sidebar />}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarOffset(),
        )}
      >
        <Topbar onAddTransaction={onAddTransaction} />
        <div className="p-4 md:p-6">
          <PageTransition activeKey={activeTab}>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
