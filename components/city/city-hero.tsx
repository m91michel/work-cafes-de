import { City, TranslationProps } from '@/libs/types';
import { MapPin } from 'lucide-react';

interface CityHeroProps extends TranslationProps {
  city: City;
  cafeCount: number;
}

export function CityHero({ city, cafeCount, t }: CityHeroProps) {
  const cityName = city.name_de || city.slug || ''
  return (
    <div className="bg-card">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="h-5 w-5" />
          <span>{cityName} | {city.state} - {t('hero.cafe_count', { count: cafeCount })}</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          {t('hero.title', { count: cafeCount, name: cityName })}
        </h1>
        {city.description_long_de && (
          <p className="text-xl text-muted-foreground">
            {city.description_long_de}
          </p>
        )}
      </div>
    </div>
  );
}