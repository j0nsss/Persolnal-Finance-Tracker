import { Card } from "../../../components/ui/Card/Card";
import { Input } from "../../../components/ui/Input/Input";
import { Badge } from "../../../components/ui/Badge/Badge";

export function TransactionLedger() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Cari transaksi..." />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="accent">Semua</Badge>
        <Badge variant="default">Makanan</Badge>
        <Badge variant="default">Transportasi</Badge>
        <Badge variant="default">Hiburan</Badge>
      </div>

      <Card className="p-8 flex flex-col items-center justify-center gap-3">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-base-ink/30">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" x2="12" y1="18" y2="12" />
          <line x1="9" x2="15" y1="15" y2="15" />
        </svg>
        <p className="font-display font-bold text-lg">Belum ada transaksi</p>
        <p className="font-body text-sm text-base-ink/40 text-center max-w-xs">
          Tambahkan transaksi pertama Anda untuk mulai melacak keuangan.
        </p>
      </Card>
    </div>
  );
}
