"use client";

import { CafeCard } from "@/components/cafe/cafe-card";
import { Cafe } from "@/libs/types";
import { cn } from "@/libs/utils";

interface Props {
  title?: string;
  cafes: Cafe[];
  className?: string;
}

export function CafeList({ title, cafes, className }: Props) {
  return (
    <section className={cn("max-w-7xl mx-auto px-4 py-12", className)}>
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((cafe) => (
          <CafeCard key={cafe.slug} cafe={cafe} />
        ))}
      </div>
    </section>
  );
}
