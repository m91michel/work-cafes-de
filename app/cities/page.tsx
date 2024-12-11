import { CityCard } from '@/components/city/city-card';
import { getSEOTags } from '@/libs/seo';
import { getCities } from '@/libs/supabase/cities';

export const revalidate = 0; // 24 hours

// generate metadata
export async function generateMetadata() {
  return getSEOTags({
    title: `Übersicht zu allen Städten auf Cafe zum Arbeiten`,
    description: `Entdecke die besten Städte mit Cafés zum Arbeiten auf unserer Website.`,
    canonicalUrlRelative: `/cities`,
  });
}

export default async function CityPage() {
  const cities = await getCities();

  if (!cities) {
    return <div>Keine Städte gefunden</div>;
  }

  return (
    <main className="flex-1 bg-background">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Übersicht zu allen Städten auf Cafe zum Arbeiten</h1>
          <p className="text-xl text-muted-foreground">Entdecke die besten Städte mit Cafés zum Arbeiten auf unserer Website.</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <CityCard key={city.slug} city={city} />
          ))}
        </div>
      </div>
    </main>
  );
}