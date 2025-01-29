
import { CityHero } from '@/components/city/city-hero';
import { notFound } from 'next/navigation';
import { getSEOTags } from '@/libs/seo';
import { getCafesByCity } from '@/libs/supabase/cafes';
import { getCities, getCityBySlug } from '@/libs/supabase/cities';
import { CafeList } from '@/components/cafe-directory';
import { CityList } from '@/components/city/city-list';

type Params = Promise<{ city: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
type Props = {
  params: Params
  searchParams: SearchParams
}

// generate metadata
export async function generateMetadata({ params }: Props) {
  const slug = (await params).city
  const city = await getCityBySlug(slug);
  const name = city?.name || 'deiner Stadt';

  return getSEOTags({
    title: `Die besten Cafés in ${name}`,
    description: `Entdecke die besten Cafés in ${name}, die sich am besten fürs Arbeiten oder Studieren eignen. Wir haben die Bewertungen geprüft und die besten Cafés für dich ausgewählt.`,
    canonicalUrlRelative: `/cities/${slug}`,
  });
}

export async function generateStaticParams() {
  const cities = await getCities({ limit: 100 });
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export default async function CityPage({ params }: Props) {
  const citySlug = (await params).city
  const city = await getCityBySlug(citySlug);
  const cafes = await getCafesByCity(citySlug) || [];
  const cities = await getCities({ limit: 3, offset: 0, excludeSlug: citySlug });
  

  if (!city || !city.name) {
    notFound();
  }

  return (
    <main className="flex-1 bg-background">
      <CityHero city={city} cafeCount={cafes.length} />
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold">
          Entdecke {cafes.length} sorgfältig {cafes.length === 1 ? 'ausgewähltes Cafe' : 'ausgewählte Cafes'} in {city.name}.
        </h2>
        <p className="text-muted-foreground">Finde den passenden Ort um zu arbeiten, lesen oder mit deinen Kommilitonen zu lernen.</p>
      </div>

      <CafeList cafes={cafes} />

      <CityList title="Finde Cafes in anderen Städten" cities={cities} showMoreButton={true} />
    </main>
  );
}