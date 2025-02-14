import { CafeCard } from "@/components/cafe/cafe-card";
import { Cafe, City } from "@/libs/types";
import { cn } from "@/libs/utils";
import { FiltersSection } from "../filters/filters-section";

interface Props {
  cafes: Cafe[];
  cities: City[];
  className?: string;
}

export function AdvancedCafeList({ cafes, cities, className }: Props) {
  return (
    <section className={cn("max-w-7xl mx-auto px-4 py-12", className)}>
      <FiltersSection cities={cities} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((cafe) => (
          <CafeCard key={cafe.slug} cafe={cafe} />
        ))}
      </div>
    </section>
  );
}
