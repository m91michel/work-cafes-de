import { StudyCityHero } from "@/components/city/sections/study-city-hero";
import { notFound } from "next/navigation";
import { getSEOTags } from "@/libs/seo";
import { getCafesByCity, getCafesCount } from "@/libs/supabase/cafes";
import { getAllCities, getCities, getCityBySlug } from "@/libs/supabase/cities";
import { SimpleCafeList } from "@/components/cafe/lists/simple-cafe-list";
import initTranslations from "@/libs/i18n/config";
import { isGerman } from "@/libs/environment";
import { StudyCityAbout } from "@/components/city/sections/study-city-about";
import { MapContainer } from "@/components/cafe/map/map-container";
import { CityListSection } from "@/components/city/sections/list-section";
import { LinkSection } from "@/components/city/sections/link-section";
import { StructuredCafeList } from "@/components/general/seo/structured-list";
import { getCityOGImage } from "@/libs/og-helper";
import Paths from "@/libs/paths";

type Params = Promise<{ city: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type Props = {
  params: Params;
  searchParams: SearchParams;
};

export const revalidate = 28800; // 8 hours

// generate metadata
export async function generateMetadata({ params }: Props) {
  const { t } = await initTranslations(["study"]);
  const slug = (await params).city;
  const city = await getCityBySlug(slug);
  const count = await getCafesCount({ citySlug: slug }) || 0;

  const dbName = isGerman ? city?.name_de : city?.name_en;
  const name = dbName || t("meta.show.your_city");

  const ogImage = getCityOGImage(city);

  return getSEOTags({
    title: t("meta.show.title", { name, count }),
    description: t("meta.show.description", { name }),
    canonicalUrlRelative: Paths.studyCity(slug),
    openGraph: {
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
    },
  });
}

export async function generateStaticParams() {
  const cities = await getAllCities();
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export default async function StudyCityPage({ params }: Props) {
  const { t } = await initTranslations(["study"]);
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
      <StudyCityHero city={city} cafeCount={cafes.length} t={t} />
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

      <SimpleCafeList
        cafes={cafes}
        title={t("cafe_list.title", { count: cafes.length, name: cityName })}
        subtitle={t("cafe_list.description")}
      />

      <StudyCityAbout city={city} cafes={cafes} t={t} />

      {cities.length > 0 && (
        <CityListSection
          title={t("more_cities.title", {
            country: city?.country || "Your Country",
          })}
          cities={cities}
          showMoreButton={true}
          t={t}
        />
      )}

      <LinkSection />
    </main>
  );
} 