import { CafeList } from "@/components/cafe-directory";
import { CityList } from "@/components/city/city-list";
import { CitySelector } from "@/components/ui/city-selector";
import { getSEOTags } from "@/libs/seo";
import { getCafes } from "@/libs/supabase/cafes";
import { getCities } from "@/libs/supabase/cities";
import { FAQSection } from "@/components/faq";
import { faqs } from "@/config/faq";

export const revalidate = 5;

export const metadata = getSEOTags({
  title: `Cafés zum Arbeiten`,
  description: `Finde die besten Cafes zum Arbeiten in Deutschland. Finde einen Platz zum Studieren, Arbeiten oder Treffen in deiner Stadt.`,
  canonicalUrlRelative: "/",
});

export default async function Home() {
  const cafes = await getCafes({ limit: 6, offset: 0 });
  const cities = await getCities({ limit: 6, offset: 0 });

  return (
    <main className="flex-1 bg-background">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Cafés zum Arbeiten in Deutschland
          </h1>
          <p className="text-xl text-muted-foreground">
            Finde den perfekten Platz zum Arbeiten, Coden oder Lernen in deiner
            Stadt
          </p>
        </div>
        { cities && <CitySelector cities={cities} /> }
      </div>
      <CafeList
        cafes={cafes}
        title="Die besten Cafés zum Arbeiten in Deutschland"
        showMoreButton={true}
      />

      <CityList
        cities={cities}
        title="Finde ein Cafe zum Arbeiten in deiner Stadt"
        showMoreButton={true}
      />

      <FAQSection faqs={faqs} />
    </main>
  );
}
