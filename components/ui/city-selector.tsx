"use client";

import { Button } from '@/components/ui/button';
import { City } from '@/libs/types';
import { useRouter } from 'next/navigation';

interface CitySelectorProps {
  cities: City[];
  showAllButton?: boolean;
}

export function CitySelector({ cities, showAllButton = false }: CitySelectorProps) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {showAllButton && (
        <Button>
          Alle Städte
        </Button>
      )}
      
      {cities.map((city) => (
        <Button
          key={city.slug}
          variant="outline"
          onClick={() => {
            router.push(`/cities/${city.slug}`);
          }}
        >
          {city.name}
        </Button>
      ))}
    </div>
  );
}