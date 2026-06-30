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
  const [isStyleGuide, setIsStyleGuide] = useState(false);

  useEffect(() => {
    setIsStyleGuide(window.location.pathname.startsWith("/dev/styleguide"));
  }, []);

  if (isStyleGuide) {
    return (
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <StyleGuide />
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
