'use client'

import { CafeCard } from "@/components/cafe/cafe-card";
import { Cafe, City } from "@/libs/types";
import { cn } from "@/libs/utils";
import { FiltersSection } from "../filters/filters-section";
import { useQueryState } from "nuqs";
import { MapContainer } from "../map/map-container";

interface Props {
  cafes: Cafe[];
  cities: City[];
  className?: string;
}

export function AdvancedCafeList({ cafes, cities, className }: Props) {
  const [view] = useQueryState('view', {
    defaultValue: 'list',
    shallow: false,
  });

  return (
    <section className={cn("max-w-7xl mx-auto md:px-4 py-12", className)}>
      <FiltersSection cities={cities} />

      {(view === 'list' || !view) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cafes.map((cafe) => (
            <CafeCard key={cafe.slug} cafe={cafe} />
          ))}
        </div>
      ) : (
        <MapContainer cafes={cafes} />
      )}
    </section>
  );
}
