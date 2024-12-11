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
      <Button>
        Alle Städte
      </Button>
      
      {cities.map((city) => (
        <Button
          key={city.slug}
          variant="outline"
          onClick={() => {
            router.push(`/city/${city.slug}`);
          }}
        >
          {city.name}
        </Button>
      ))}
    </div>
  );
}