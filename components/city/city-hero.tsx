import { isGerman } from '@/libs/environment';
import { City, TranslationProps } from '@/libs/types';
import { LocateIcon, MapPin } from 'lucide-react';
import { TransHighlight } from '../general/translation';
import { countryFlag } from '@/config/countires';

interface CityHeroProps extends TranslationProps {
  city: City;
  cafeCount: number;
}

export function CityHero({ city, cafeCount, t }: CityHeroProps) {
  const name = isGerman ? city.name_de : city.name_en;
  const cityName = name || city.slug || '';
  const description = isGerman ? city.description_long_de : city.description_long_en;
  const flag = countryFlag(city.country);
  
  return (
    <div className="bg-card">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="h-5 w-5" />
          <span>{cityName} | {flag} {city.country}</span>
          <LocateIcon className="h-5 w-5" />
          <span>{t('hero.cafe_count', { count: cafeCount })}</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          <TransHighlight i18nKey="hero.title" values={{ name: cityName }} namespace="city" />
        </h1>
        {description && (
          <p className="text-xl text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}