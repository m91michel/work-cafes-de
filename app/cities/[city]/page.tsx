import { CityHero } from "@/components/city/sections/city-hero";
import { notFound } from "next/navigation";
import { getSEOTags } from "@/libs/seo";
import { getCafesByCity } from "@/libs/supabase/cafes";
import { getCities, getCityBySlug } from "@/libs/supabase/cities";
import { SimpleCafeList } from "@/components/cafe/lists/simple-cafe-list";
import initTranslations from "@/libs/i18n/config";
import { isGerman } from "@/libs/environment";
import { CityAbout } from "@/components/city/sections/city-about";
import { MapContainer } from "@/components/cafe/map/map-container";
import { CityListSection } from "@/components/city/sections/list-section";
import { LinkSection } from "@/components/city/sections/link-section";
import { StructuredCafeList } from "@/components/general/seo/structured-list";


type Params = Promise<{ city: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type Props = {
  params: Params;
  searchParams: SearchParams;
};

// generate metadata
export async function generateMetadata({ params }: Props) {
  const { t } = await initTranslations(["city"]);
  const slug = (await params).city;
  const city = await getCityBySlug(slug);

  const dbName = isGerman ? city?.name_de : city?.name_en;
  const name = dbName || t("meta.show.your_city");

  return getSEOTags({
    title: t("meta.show.title", { name }),
    description: t("meta.show.description", { name }),
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
  const { t } = await initTranslations(["city"]);
  const citySlug = (await params).city;
  const city = await getCityBySlug(citySlug);
  const cafes = (await getCafesByCity(citySlug)) || [];
  const cityName = isGerman ? city?.name_de : city?.name_en;
  const cities = await getCities({
    limit: 6,
    offset: 0,
    excludeSlug: citySlug,
    country: city?.country || undefined,
  });

  if (!city || !cityName) {
    return notFound();
  }

  return (
    <main className="flex-1 bg-background">
      <CityHero city={city} cafeCount={cafes.length} t={t} />
      <StructuredCafeList
        name={t("meta.show.title", { name: cityName })}
        description={t("meta.show.description", { name: cityName })}
        cafes={cafes}
      />

      <div className="max-w-7xl mx-auto px-4 py-12 mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          {t("map.title", { name: cityName })}
        </h2>
        <MapContainer cafes={cafes} provider="leaflet" />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">
          {t("hero.subtitle", { name: cityName })}
        </h2>
        <p className="text-muted-foreground">
          {t("hero.description", { count: cafes.length, name: cityName })}
        </p>
      </div>

      <SimpleCafeList cafes={cafes} />

      <CityAbout city={city} t={t} />

      {cities.length > 0 && (
        <CityListSection
          title={t("more_cities.title", { country: city?.country || "Your Country" })}
          cities={cities}
          showMoreButton={true}
          t={t}
        />
      )}

      <LinkSection />
    </main>
  );
}
