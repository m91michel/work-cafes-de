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
  title: `Entdecke die besten Cafés zum Arbeiten in Deutschland`,
  description: "Entdecke die besten Cafés zum Arbeiten in Deutschland! Finde ideale Orte für Kaffee und Produktivität mit unserer umfassenden Liste der Hotspots.",
  canonicalUrlRelative: "/cafes",
});

export default async function CafeIndex() {
  const cafes = await getCafes({ limit: 1000, offset: 0 });
  const cities = await getCities({ limit: 100, offset: 0 });

  return (
    <main className="flex-1 bg-background">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Alle Cafés zum Arbeiten auf unserer Website
          </h1>
          <p className="text-xl text-muted-foreground">
            Hier findest du eine Liste aller Cafés, die auf unserer Website verfügbar sind. Helfe uns, die Liste zu vervollständigen, indem du neue Cafés hinzufügst.
          </p>
        </div>
      </div>
      <CafeList
        cafes={cafes}
        title="Alle Cafés zum Arbeiten auf unserer Website"
      />

      <FAQSection faqs={faqs} />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Eine Liste aller Städte, die für das Arbeiten in Cafés verfügbar sind
        </h2>
        {cities && <CitySelector cities={cities} />}
      </section>
    </main>
  );
}
