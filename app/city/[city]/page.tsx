import { getCafeBySlug, getCafes } from '@/libs/cafe-utils';
import { CafeCard } from '@/components/ui/cafe-card';
import { CityHero } from '@/components/city/city-hero';
import { notFound } from 'next/navigation';
import { getSEOTags } from '@/libs/seo';

interface CityPageProps {
  params: {
    city: string;
  };
}

// generate metadata
export async function generateMetadata({ params }: CityPageProps) {
  return getSEOTags({
    title: `Die besten Cafés in ${params.city}`,
    description: `Entdecke die besten Cafés in ${params.city}, die sich am besten fürs Arbeiten oder Studieren eignen. Wir haben die Bewertungen geprüft und die besten Cafés für dich ausgewählt.`,
    canonicalUrlRelative: `/city/${params.city}`,
  });
}

export async function generateStaticParams() {
  const cafes = await getCafes();
  return Object.keys(cafes).map((city) => ({
    city: city.toLowerCase(),
  }));
}

export default async function CityPage({ params }: CityPageProps) {
  const cafes = await getCafes();
  const cityName = Object.keys(cafes).find(
    (city) => city.toLowerCase() === params.city.toLowerCase()
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