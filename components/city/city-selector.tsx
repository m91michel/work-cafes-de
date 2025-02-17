"use client";

import { Button } from '@/components/ui/button';
import { countryFlag } from '@/config/countires';
import { City } from '@/libs/types';
import { useRouter } from 'next/navigation';

interface CitySelectorProps {
  cities: City[];
}

export function CitySelector({ cities }: CitySelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {cities.map((city) => (
        <CityButton key={city.slug} city={city} />  
      ))}
    </div>
  );
}

export function CityButton({ city }: { city: City }) {
  const router = useRouter();
  const flag = countryFlag(city.country);
  return (
    <Button variant="outline" onClick={() => {
      router.push(`/cities/${city.slug}`);
    }}>
      {flag} {city.name_de} {city.cafes_count && `(${city.cafes_count})`}
    </Button>
  );
}