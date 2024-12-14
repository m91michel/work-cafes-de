import { City } from '@/libs/types';
import { MapPin } from 'lucide-react';

interface CityHeroProps {
  city: City;
  cafeCount: number;
}

export function CityHero({ city, cafeCount }: CityHeroProps) {
  const cityName = city.name || city.slug || ''
  return (
    <div className="bg-card">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="h-5 w-5" />
          <span>{cityName} | {city.state} - {cafeCount} Cafés gefunden</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Die {cafeCount} besten Cafés in {cityName}
        </h1>
        {city.description_long && (
          <p className="text-xl text-muted-foreground">
            {city.description_long}
          </p>
        )}
      </div>
    </div>
  );
}