import { FilePlus2 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-brutal border-3 border-base-ink bg-base-surface p-8 flex flex-col items-center justify-center gap-3">
      <FilePlus2 size={48} strokeWidth={1.5} className="text-base-ink/30" />
      <p className="font-display font-bold text-lg">Belum ada transaksi</p>
      <p className="font-body text-sm text-base-ink/40 text-center max-w-xs">
        Tambahkan transaksi pertama Anda untuk mulai melacak keuangan.
      </p>
    </div>
  );
}
