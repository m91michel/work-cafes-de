import { City } from '@/libs/types';
import { MapPin } from 'lucide-react';

interface CityHeroProps {
  city: City;
  cafeCount: number;
}

export function CityHero({ city, cafeCount }: CityHeroProps) {
  const cityName = city.name || city.slug || ''
  return (
    <div className="bg-card border-b">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="h-5 w-5" />
          <span>{cityName}</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Die {cafeCount} besten Cafés in {cityName}
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Entdecke {cafeCount} sorgfältig {cafeCount === 1 ? 'ausgewähltes Cafe' : 'ausgewählten Cafes'} in {cityName} um zu Arbeiten oder mit deinen Kommilitonen zu lernen.
        </p>
      </div>
    </div>
  );
}