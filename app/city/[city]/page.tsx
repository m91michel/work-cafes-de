import { getCafes } from '@/libs/cafe-utils';
import { CafeCard } from '@/components/ui/cafe-card';
import { CityHero } from '@/components/city/city-hero';
import { notFound } from 'next/navigation';
import { getSEOTags } from '@/libs/seo';

type Params = Promise<{ city: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
type Props = {
  params: Params
  searchParams: SearchParams
}

// generate metadata
export async function generateMetadata({ params }: Props) {
  const city = (await params).city
  return getSEOTags({
    title: `Die besten Cafés in ${city}`,
    description: `Entdecke die besten Cafés in ${city}, die sich am besten fürs Arbeiten oder Studieren eignen. Wir haben die Bewertungen geprüft und die besten Cafés für dich ausgewählt.`,
    canonicalUrlRelative: `/city/${city}`,
  });
}

export async function generateStaticParams() {
  const cafes = await getCafes();
  return Object.keys(cafes).map((city) => ({
    city: city.toLowerCase(),
  }));
}

export default async function CityPage({ params }: Props) {
  const citySlug = (await params).city
  const cafes = await getCafes();
  const cityName = Object.keys(cafes).find(
    (city) => city.toLowerCase() === citySlug.toLowerCase()
  );

  if (!cityName || !cafes[cityName]) {
    notFound();
  }

  const cityCafes = cafes[cityName];

  return (
    <main className="flex-1 bg-background">
      <CityHero cityName={cityName} cafeCount={cityCafes.length} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cityCafes.map((cafe) => (
            <CafeCard key={cafe.name} cafe={cafe} />
          ))}
        </div>
      </div>
    </main>
  );
}