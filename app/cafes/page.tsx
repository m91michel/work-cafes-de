import { CafeList } from "@/components/cafe-directory";
import { CitySelector } from "@/components/city/city-selector";
import { getSEOTags } from "@/libs/seo";
import { getCafes } from "@/libs/supabase/cafes";
import { getCities } from "@/libs/supabase/cities";
import { FAQSection } from "@/components/faq";
import initTranslations from "@/libs/i18n/config";

export const revalidate = 5;

export const metadata = getSEOTags({
  title: `Entdecke die besten Cafés zum Arbeiten in Deutschland`,
  description: "Entdecke die besten Cafés zum Arbeiten in Deutschland! Finde ideale Orte für Kaffee und Produktivität mit unserer umfassenden Liste der Hotspots.",
  canonicalUrlRelative: "/cafes",
});

export default async function CafeIndex() {
  const { t } = await initTranslations(['cafe']);
  const cafes = await getCafes({ limit: 1000, offset: 0 });
  const cities = await getCities({ limit: 100, offset: 0 });

  return (
    <main className="flex-1 bg-background">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t('index.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('index.description')}
          </p>
        </div>
      </div>
      <CafeList
        cafes={cafes}
        title={t('index.title')}
      />

      <FAQSection />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {t('index.all_cities_title')}
        </h2>
        {cities && <CitySelector cities={cities} />}
      </section>
    </main>
  );
}
