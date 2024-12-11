import { getCafes } from '@/libs/cafe-utils';
import { CafeDirectory } from '@/components/cafe-directory';
import { getSEOTags } from '@/libs/seo';

export const revalidate = 5; 

export const metadata = getSEOTags({
  title: `Cafés zum Arbeiten`,
  description: `Finde die besten Cafes zum Arbeiten in Deutschland. Finde einen Platz zum Studieren, Arbeiten oder Treffen in deiner Stadt.`,
  canonicalUrlRelative: "/",
});

export default async function Home() {
  const cafesData = await getCafes();

  const cities = Object.keys(cafesData).sort();

  return (
    <main className="flex-1 bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Cafés zum Arbeiten in Deutschland</h1>
          <p className="text-xl text-muted-foreground">
            Finde den perfekten Platz zum Arbeiten, Coden oder Lernen in deiner Stadt
          </p>
        </div>

        <CafeDirectory initialCities={cities} initialCafesData={cafesData} />
      </div>
    </main>
  );
}