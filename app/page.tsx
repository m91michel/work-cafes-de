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
import { LinkSection } from "@/components/city/sections/link-section";
import HomeHero from "@/components/general/sections/home-hero";

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
    sortOrder: "asc",
  });

  const activeCountries = await getCountries({ status: "ACTIVE" });

  return (
    <main className="flex-1">
      <HomeHero cafesCount={cafesCount} />

      <SimpleCafeList
        cafes={cafes}
        title={t("cafes.title")}
        showMoreLink={true}
        buttonText={t("cafes.buttonText")}
      />

      <SimpleCafeList
        cafes={newCafes}
        subtitle={t("cafes.new_cafes_subtitle")}
        title={t("cafes.new_cafes_title")}
        showMoreLink={true}
        buttonText={t("cafes.buttonText")}
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

      <LinkSection />
    </main>
  );
}
