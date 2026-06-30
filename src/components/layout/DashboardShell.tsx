import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useUIStore } from "../../store/useUIStore";
import { cn } from "../../lib/utils";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { sidebarCollapsed } = useUIStore();
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className="min-h-screen bg-base-bg">
      {!isMobile && <Sidebar />}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          !isMobile && (sidebarCollapsed ? "ml-[72px]" : "ml-[240px]"),
        )}
      >
        {children}
      </main>
    </div>
  );
}
