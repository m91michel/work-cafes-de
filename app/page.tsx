import { SimpleCafeList } from "@/components/cafe/lists/simple-cafe-list";
import { CitySelector } from "@/components/city/city-selector";
import { getSEOTags } from "@/libs/seo";
import { getBestCafes, getCafes, getCafesCount } from "@/libs/supabase/cafes";
import { getCities, getCitiesCount } from "@/libs/supabase/cities";
import initTranslations from "@/libs/i18n/config";
import { Cafe, City } from "@/libs/types";
import { TransHighlight } from "@/components/general/translation";
import { CityListSection } from "@/components/city/sections/list-section";
import { FAQSection } from "@/components/general/sections/faq";
import { About } from "@/components/general/sections/About";
import { getCountries } from "@/libs/supabase/countries";

// export const revalidate = 5; // dev
export const revalidate = 3600; // 1 hour

export async function generateMetadata() {
  const { t } = await initTranslations(["common"]);
  return getSEOTags({
    title: t("meta.title"),
    description: t("meta.description"),
    canonicalUrlRelative: "/",
  });
}

export default async function Home() {
  const cafes = await getBestCafes({ limit: 6, offset: 0 });
  const cities = await getCities({ limit: 6, offset: 0 });

  return <HomeContent cafes={cafes} cities={cities} />;
}

interface HomeContentProps {
  cafes: Cafe[];
  cities: City[];
}
async function HomeContent({ cafes, cities }: HomeContentProps) {
  const { t } = await initTranslations(["home"]);
  const citiesCount = await getCitiesCount();
  const { data: newCafes, total: cafesCount } = await getCafes({
    limit: 6,
    offset: 0,
    sortBy: "published_at",
    sortOrder: "desc",
  });
  const allCities = await getCities({ limit: 1000, offset: 0 });
  const activeCountries = await getCountries({ status: "ACTIVE" });

  const cafesButtonText =
    cafesCount != null
      ? t("cafes.buttonText_count", { count: cafesCount })
      : t("cafes.buttonText");

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <TransHighlight i18nKey="home:hero.title" />
          </h1>
          <p className="text-xl text-muted-foreground">{t("hero.subtitle")}</p>
        </div>
        {cities && <CitySelector cities={cities} />}
      </div>
      <SimpleCafeList
        cafes={cafes}
        title={t("cafes.title")}
        showMoreButton={true}
        buttonText={cafesButtonText}
      />

      <SimpleCafeList
        cafes={newCafes}
        subtitle={t("cafes.new_cafes_subtitle")}
        title={t("cafes.new_cafes_title")}
        showMoreButton={true}
        buttonText={cafesButtonText}
      />

      <CityListSection
        cities={cities}
        title={t("cities.title")}
        showMoreButton={true}
        buttonText={t("cities.buttonText")}
        t={t}
      />

      <FAQSection />

      <About
        cafeCount={cafesCount}
        cityCount={citiesCount}
        countryCount={activeCountries.length}
      />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {t("all_cities.title")}
        </h2>
        {allCities && <CitySelector cities={allCities} />}
      </section>
    </main>
  );
}
