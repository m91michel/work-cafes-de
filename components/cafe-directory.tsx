"use client";

import { useState } from 'react';
import { CitySelector } from '@/components/ui/city-selector';
import { CafeCard } from '@/components/ui/cafe-card';
import { CityData } from '@/lib/types';

interface CafeDirectoryProps {
  initialCities: string[];
  initialCafesData: CityData;
}

export function CafeDirectory({ initialCities, initialCafesData }: CafeDirectoryProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const cafesToShow = selectedCity 
    ? { [selectedCity]: initialCafesData[selectedCity] }
    : initialCafesData;
  
  const cities = selectedCity ? [selectedCity] : initialCities;

  return (
    <>
      <CitySelector 
        cities={initialCities} 
        onCitySelect={setSelectedCity} 
        selectedCity={selectedCity}
      />

      <div className="mt-12">
        {cities.map((city) => (
          <div key={city} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{city}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cafesToShow[city].map((cafe) => (
                <CafeCard key={cafe.name} cafe={cafe} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}