import { Badge } from "../../../components/ui/Badge/Badge";
import { CATEGORY_LIST } from "../../../lib/constants";
import type { CategoryId } from "../../../types/category";

interface TransactionFiltersProps {
  activeFilters: CategoryId[];
  onToggleFilter: (id: CategoryId) => void;
}

export function TransactionFilters({ activeFilters, onToggleFilter }: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
      <Badge
        variant={activeFilters.length === 0 ? "accent" : "default"}
        onClick={() => {
          if (activeFilters.length > 0) {
            onToggleFilter("" as CategoryId);
          }
        }}
        className="cursor-pointer select-none"
        role="checkbox"
        aria-checked={activeFilters.length === 0}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (activeFilters.length > 0) onToggleFilter("" as CategoryId);
          }
        }}
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
            role="checkbox"
            aria-checked={isActive}
            aria-label={`Filter ${cat.label}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggleFilter(cat.id);
              }
            }}
          >
            {cat.label}
          </Badge>
        );
      })}
    </div>
  );
}
