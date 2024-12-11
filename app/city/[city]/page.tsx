
import { CafeCard } from '@/components/ui/cafe-card';
import { CityHero } from '@/components/city/city-hero';
import { notFound } from 'next/navigation';
import { getSEOTags } from '@/libs/seo';
import { getCafes, getCafesByCity } from '@/libs/supabase/cafes';
import { getCityBySlug } from '@/libs/supabase/cities';

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
  const city = await getCityBySlug(citySlug);
  const cafes = await getCafesByCity(citySlug) || [];
  

  if (!city || !city.name) {
    notFound();
  }

  return (
    <main className="flex-1 bg-background">
      <CityHero city={city} cafeCount={cafes.length} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cafes.map((cafe) => (
            <CafeCard key={cafe.name} cafe={cafe} />
          ))}
        </div>
      </div>
    </main>
  );
}