import { useEffect, useState, useCallback } from "react";
import { ThemeProvider } from "./context/ThemeProvider";
import { DashboardShell } from "./components/layout/DashboardShell";
import { DashboardOverview } from "./features/dashboard/components/DashboardOverview";
import { TransactionLedger } from "./features/transactions/components/TransactionLedger";
import { AnalyticsView } from "./features/analytics/components/AnalyticsView";
import { TransactionFormModal } from "./features/transactions/forms/TransactionFormModal";
import { useTransactionActions } from "./features/transactions/hooks/useTransactionActions";
import { StyleGuide } from "./pages/dev/StyleGuide";
import { useUIStore } from "./store/useUIStore";

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
        return <AnalyticsView />;
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
        <StyleGuide />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}

export default App;
