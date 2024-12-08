import { getCafes } from '@/lib/cafe-utils';
import { CafeDirectory } from '@/components/cafe-directory';
import { isDev } from '@/lib/environment';

export const revalidate = isDev ? 5 : 3600; 

export default async function Home() {
  const cafesData = await getCafes();

  const cities = Object.keys(cafesData).sort();

  return (
    <main className="flex-1 bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Work-Friendly Cafes in Germany</h1>
          <p className="text-xl text-muted-foreground">
            Find the perfect spot to work, code, or study in your city
          </p>
        </div>

        <CafeDirectory initialCities={cities} initialCafesData={cafesData} />
      </div>
    </main>
  );
}