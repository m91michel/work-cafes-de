"use client";

import { Button } from '@/components/ui/button';
import { City } from '@/libs/types';
import { useRouter } from 'next/navigation';

interface CitySelectorProps {
  cities: City[];
}

export function CitySelector({ cities }: CitySelectorProps) {
  const router = useRouter();
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {cities.map((city) => (
        <Button
          key={city.slug}
          variant="outline"
          onClick={() => {
            router.push(`/cities/${city.slug}`);
          }}
        >
          {city.name} {city.cafes_count && `(${city.cafes_count})`}
        </Button>
      ))}
    </div>
  );
}