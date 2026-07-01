import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./context/ThemeProvider";
import { DashboardShell } from "./components/layout/DashboardShell";
import { DashboardOverview } from "./features/dashboard/components/DashboardOverview";
import { TransactionLedger } from "./features/transactions/components/TransactionLedger";
import { TransactionFormModal } from "./features/transactions/forms/TransactionFormModal";
import { useTransactionActions } from "./features/transactions/hooks/useTransactionActions";
import { StyleGuide } from "./pages/dev/StyleGuide";
import { useUIStore } from "./store/useUIStore";
import { useAuthStore } from "./store/useAuthStore";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

const AnalyticsView = lazy(() =>
  import("./features/analytics/components/AnalyticsView").then((m) => ({
    default: m.AnalyticsView,
  })),
);

function DashboardContent() {
  const { activeTab } = useUIStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const { handleAdd } = useTransactionActions();

  const handleAddTransaction = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "transactions":
        return <TransactionLedger />;
      case "analytics":
        return (
          <Suspense fallback={<div className="h-64 flex items-center justify-center"><p className="font-display font-bold text-base-ink/40">Memuat...</p></div>}>
            <AnalyticsView />
          </Suspense>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <>
      <DashboardShell onAddTransaction={handleAddTransaction}>
        {renderTab()}
      </DashboardShell>
      <TransactionFormModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAdd}
      />
    </>
  );
}

function App() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const [page, setPage] = useState<"landing" | "login" | "register">("landing");
  const [isStyleGuide, setIsStyleGuide] = useState(false);

  useEffect(() => {
    setIsStyleGuide(window.location.pathname.startsWith("/dev/styleguide"));
    initialize();
  }, [initialize]);

  if (isStyleGuide) {
    return (
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <StyleGuide />
        </MotionConfig>
      </ThemeProvider>
    );
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <div className="min-h-screen bg-base-bg flex items-center justify-center">
            <p className="font-display font-bold text-base-ink/40">Memuat...</p>
          </div>
        </MotionConfig>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          {page === "landing" && <LandingPage onNavigate={setPage} />}
          {page === "login" && <LoginPage onNavigate={setPage} />}
          {page === "register" && <RegisterPage onNavigate={setPage} />}
        </MotionConfig>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <DashboardContent />
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
