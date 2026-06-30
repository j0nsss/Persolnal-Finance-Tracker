import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileBottomNav } from "./MobileBottomNav";
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

  return (
    <div className="min-h-screen bg-base-bg">
      {!isMobile && <Sidebar />}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          !isMobile && (sidebarCollapsed ? "ml-[72px]" : "ml-[240px]"),
          isMobile && "pb-20",
        )}
      >
        <Topbar onAddTransaction={onAddTransaction} />
        <div className="p-4 md:p-6">
          <PageTransition activeKey={activeTab}>
            {children}
          </PageTransition>
        </div>
      </main>
      {isMobile && <MobileBottomNav />}
    </div>
  );
}
