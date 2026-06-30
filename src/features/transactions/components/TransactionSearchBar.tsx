import { Input } from "../../../components/ui/Input/Input";
import { Search } from "lucide-react";

interface TransactionSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function TransactionSearchBar({ value, onChange }: TransactionSearchBarProps) {
  return (
    <div className="relative">
      <Search
        size={18}
        strokeWidth={2.5}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-base-ink/40"
        aria-hidden="true"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari transaksi..."
        className="pl-11"
        aria-label="Cari transaksi berdasarkan deskripsi"
      />
    </div>
  );
}
