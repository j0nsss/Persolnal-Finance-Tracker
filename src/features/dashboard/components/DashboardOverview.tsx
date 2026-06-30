import { Card } from "../../../components/ui/Card/Card";
import { Skeleton } from "../../../components/ui/Skeleton/Skeleton";

export function DashboardOverview() {
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="font-display font-bold text-sm text-base-ink/60 uppercase tracking-wider">Pemasukan</p>
          <p className="font-mono tabular-nums text-2xl font-bold mt-2">Rp 0</p>
          <p className="font-body text-xs mt-1 text-base-ink/40">Bulan Ini</p>
        </Card>
        <Card className="p-5">
          <p className="font-display font-bold text-sm text-base-ink/60 uppercase tracking-wider">Pengeluaran</p>
          <p className="font-mono tabular-nums text-2xl font-bold mt-2">Rp 0</p>
          <p className="font-body text-xs mt-1 text-base-ink/40">Bulan Ini</p>
        </Card>
        <Card className="p-5 border-accent-lime">
          <p className="font-display font-bold text-sm text-base-ink/60 uppercase tracking-wider">Saldo Bersih</p>
          <p className="font-mono tabular-nums text-2xl font-bold mt-2">Rp 0</p>
          <p className="font-body text-xs mt-1 text-base-ink/40">Bulan Ini</p>
        </Card>
      </div>

      <Card className="p-5">
        <p className="font-display font-bold text-lg mb-4">Pengeluaran Bulanan</p>
        <div className="h-64 flex items-center justify-center border-3 border-dashed border-base-ink/20 rounded-brutal">
          <p className="font-body text-base-ink/40">Grafik akan muncul di Fase 4</p>
        </div>
      </Card>

      <Card className="p-5">
        <p className="font-display font-bold text-lg mb-4">Breakdown Kategori</p>
        <div className="h-64 flex items-center justify-center border-3 border-dashed border-base-ink/20 rounded-brutal">
          <p className="font-body text-base-ink/40">Donut chart akan muncul di Fase 4</p>
        </div>
      </Card>
    </div>
  );
}
