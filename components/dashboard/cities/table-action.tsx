"use client";

import { City } from "@/libs/types";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { ProcessCityButton } from "./buttons/ProcessCityButton";

interface CityActionsProps {
  city: City;
}

export function CityActions({ city }: CityActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {city.slug && (
        <Link
          href={`/cities/${city.slug}`}
          className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      )}

      <ProcessCityButton city={city} />
    </div>
  );
}

