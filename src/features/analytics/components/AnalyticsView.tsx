import { Card } from "../../../components/ui/Card/Card";

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <Card className="p-8 flex flex-col items-center justify-center gap-3 min-h-[400px]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-base-ink/30">
          <line x1="18" x2="18" y1="20" y2="10" />
          <line x1="12" x2="12" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="14" />
        </svg>
        <p className="font-display font-bold text-lg">Analitik</p>
        <p className="font-body text-sm text-base-ink/40 text-center max-w-xs">
          Grafik dan insight mendalam akan tersedia setelah ada data transaksi.
        </p>
      </Card>
    </div>
  );
}
