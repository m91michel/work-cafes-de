"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CitySelectorProps {
  cities: string[];
  selectedCity: string | null;
  onCitySelect: (city: string | null) => void;
}

export function CitySelector({ cities, selectedCity, onCitySelect }: CitySelectorProps) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        variant={selectedCity === null ? "default" : "outline"}
        onClick={() => onCitySelect(null)}
      >
        All Cities
      </Button>
      
      {cities.map((city) => (
        <Button
          key={city}
          variant={selectedCity === city ? "default" : "outline"}
          onClick={() => {
            onCitySelect(city);
            router.push(`/city/${city.toLowerCase()}`);
          }}
        >
          {city}
        </Button>
      ))}
    </div>
  );
}