import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Category, TutorsQuery } from "@/services/tutor.service";

interface TutorsFilterProps {
  categories: Category[];
  filters: TutorsQuery;
  onChange: (partial: Partial<TutorsQuery>) => void;
  onReset: () => void;
}

export function TutorsFilter({ categories, filters, onChange, onReset }: TutorsFilterProps) {
  const hasActive = !!(filters.categoryId || filters.minPrice || filters.maxPrice);

  return (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Category</p>
        <Select
          value={filters.categoryId ?? "all"}
          onValueChange={(v) => onChange({ categoryId: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Price range</p>
          <span className="text-xs text-muted-foreground">
            ${filters.minPrice ?? 0} – ${filters.maxPrice ?? 200}+
          </span>
        </div>
        <Slider
          min={0}
          max={200}
          step={5}
          value={[filters.minPrice ?? 0, filters.maxPrice ?? 200]}
          onValueChange={([min, max]) => onChange({ minPrice: min, maxPrice: max })}
        />
      </div>

      {/* Reset */}
      {hasActive && (
        <Button variant="ghost" size="sm" onClick={onReset} className="w-full rounded-xl">
          <X className="h-3.5 w-3.5 mr-1.5" />
          Reset filters
        </Button>
      )}
    </div>
  );
}