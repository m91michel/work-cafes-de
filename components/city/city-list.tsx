import { City } from '@/libs/types';
import { CityCard } from './city-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

type Props = {
  title?: string;
  cities: City[];
  suggestCityCard?: boolean;
  showMoreButton?: boolean;
}

export function CityList({ title, cities, showMoreButton = false, suggestCityCard = false }: Props) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <CityCard key={city.slug} city={city} />
          ))}
          {suggestCityCard && (
            <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Stadt vorschlagen</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Du kennst eine Stadt, die noch nicht auf dieser Seite ist? Dann schlage sie uns vor!
            </p>
            <Button asChild>
              <a href="/helfe-uns" target="_blank" rel="noopener noreferrer">
                Stadt vorschlagen
              </a>
              </Button>
            </div>
          )}
        </div>
        {showMoreButton && (
          <div className="flex justify-center mt-6">
            <Button variant="default" asChild>
              <Link href="/cities">
                Alle Städte anzeigen
              </Link>
            </Button>
          </div>
        )}
      </section>
    );
  }