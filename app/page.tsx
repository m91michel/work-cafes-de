import { CafeList } from "@/components/cafe-directory";
import { CityList } from "@/components/city/city-list";
import { CitySelector } from "@/components/ui/city-selector";
import { getSEOTags } from "@/libs/seo";
import { getCafes, getCafesCount } from "@/libs/supabase/cafes";
import { getCities, getCitiesCount } from "@/libs/supabase/cities";
import { FAQSection } from "@/components/faq";
import { faqs } from "@/config/faq";
import { About } from "@/components/sections/About";
import { Gradient } from "@/components/general/gradient";
import { Hero } from "@/components/sections/Hero";

export const revalidate = 5;

export const metadata = getSEOTags({
  title: `Finde die besten Cafés zum produktiven Arbeiten in Deutschland`,
  description: `Entdecke die besten Cafés zum Arbeiten in Deutschland! Finde den perfekten Ort zum Studieren, Arbeiten oder Kaffeetrinken in deiner Stadt.`,
  canonicalUrlRelative: "/",
});

export default async function Home() {
  const cafes = await getCafes({ limit: 6, offset: 0 });
  const cities = await getCities({ limit: 6, offset: 0 });
  const cafesCount = await getCafesCount();

  const cafesButtonText = cafesCount ? `Entdecke ${cafesCount} Cafés` : "Entdecke alle Cafés";

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Finde ein <Gradient>Café zum Arbeiten</Gradient> in deiner Stadt
          </h1>
          <p className="text-xl text-muted-foreground">
            Entdecke die besten Cafés zum Arbeiten in Deutschland! Finde den perfekten Ort zum Studieren, Arbeiten oder Kaffeetrinken in deiner Stadt.
          </p>
        </div>
        { cities && <CitySelector cities={cities} /> }
      </div>
      <CafeList
        cafes={cafes}
        title="Die besten Cafés zum Arbeiten in Deutschland"
        showMoreButton={true}
        buttonText={cafesButtonText}
      />

      <CityList
        cities={cities}
        title="Finde ein Cafe zum Arbeiten in deiner Stadt"
        showMoreButton={true}
        buttonText="Entdecke alle Städte"
      />
  
      <FAQSection faqs={faqs} />

      <About />
    </main>
  );
}
