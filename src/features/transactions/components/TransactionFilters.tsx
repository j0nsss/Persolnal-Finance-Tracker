import { Badge } from "../../../components/ui/Badge/Badge";
import { CATEGORY_LIST } from "../../../lib/constants";
import type { CategoryId } from "../../../types/category";

interface TransactionFiltersProps {
  activeFilters: CategoryId[];
  onToggleFilter: (id: CategoryId) => void;
}

export function TransactionFilters({ activeFilters, onToggleFilter }: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={activeFilters.length === 0 ? "accent" : "default"}
        onClick={() => {
          if (activeFilters.length > 0) {
            onToggleFilter("" as CategoryId);
          }
        }}
        className="cursor-pointer select-none"
      >
        Semua
      </Badge>
      {CATEGORY_LIST.map((cat) => {
        const isActive = activeFilters.includes(cat.id);
        return (
          <Badge
            key={cat.id}
            variant={isActive ? "accent" : "default"}
            onClick={() => onToggleFilter(cat.id)}
            className="cursor-pointer select-none"
          >
            {cat.label}
          </Badge>
        );
      })}
    </div>
  );
}
