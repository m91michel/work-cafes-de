"use client";

import { Button } from '@/components/ui/button';
import { countryFlag } from '@/config/countires';
import Paths from '@/libs/paths';
import { City } from '@/libs/types';
import Link from 'next/link';

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
  const flag = countryFlag(city.country);
  return (
    <Button variant="outline" asChild>
      <Link href={Paths.city(city.slug)}>
        {flag} {city.name_de} {city.cafes_count && `(${city.cafes_count})`}
      </Link>
    </Button>
  );
}