import { getSEOTags } from "@/libs/seo";
import { getAllCities } from "@/libs/supabase/cities";
import { countries, StaticCountryType } from "@/config/countires";
import initTranslations from "@/libs/i18n/config";
import { isGerman } from "@/libs/environment";
import { City, Country } from "@/libs/types";
import Link from "next/link";
import Paths from "@/libs/paths";
import { TransHighlight } from "@/components/general/translation";
import { LinkSection } from "@/components/city/sections/link-section";

export const revalidate = 3600 * 24 * 30; // 30 days

export async function generateMetadata() {
  const { t } = await initTranslations(["study"]);

  return getSEOTags({
    title: t("cities_index.meta.title"),
    description: t("cities_index.meta.description"),
    canonicalUrlRelative: "/study/cities",
  });
}

// Group cities by country
function groupCitiesByCountry(cities: City[], countries: StaticCountryType[]) {
  const countryMap = new Map(
    countries.map((country) => [country.code, country])
  );
  const grouped = new Map<
    string,
    { country: StaticCountryType; cities: City[] }
  >();

  cities.forEach((city) => {
    const countryCode = city.country_code || city.country || "";
    const country = countryMap.get(countryCode);

    if (country) {
      if (!grouped.has(countryCode)) {
        grouped.set(countryCode, { country, cities: [] });
      }
      grouped.get(countryCode)!.cities.push(city);
    }
  });

  // Sort countries by number of cities (descending)
  return Array.from(grouped.values()).sort(
    (a, b) => b.cities.length - a.cities.length
  );
}

export default async function StudyCitiesIndexPage() {
  const { t } = await initTranslations(["study"]);
  const cities = await getAllCities();

  const groupedCities = groupCitiesByCountry(cities, countries);

  return (
    <main className="flex-1 bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <TransHighlight i18nKey="cities_index.title" namespace="study" />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
            {t("cities_index.description")}
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
            {t("cities_index.cities_count", { count: cities.length })}
          </div>
        </div>
      </section>

      {/* Cities by Country */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid gap-12">
          {groupedCities.map(({ country, cities: countryCities }) => {
            const countryName = isGerman ? country.name_de : country.name;
            return (
              <div key={country.code} className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <span className="text-4xl">{country.flag}</span>
                    {countryName}
                    <span className="text-lg font-normal text-muted-foreground">
                      ({countryCities.length}{" "}
                      {countryCities.length === 1
                        ? t("cities_index.city")
                        : t("cities_index.cities")}
                      )
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {countryCities
                    .sort((a, b) => (b.cafes_count || 0) - (a.cafes_count || 0))
                    .map((city) => {
                      const cityName = isGerman ? city.name_de : city.name_en;
                      const cafeCount = city.cafes_count || 0;

                      return (
                        <Link
                          key={city.slug}
                          href={Paths.studyCity(city.slug)}
                          className="group block p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {cityName}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              {cafeCount}{" "}
                              {cafeCount === 1
                                ? t("cities_index.cafe")
                                : t("cities_index.cafes")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t("cities_index.city_description", {
                              city: cityName,
                            })}
                          </p>
                        </Link>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6">
            {t("cities_index.seo.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {t("cities_index.seo.why_study_cafes.title")}
              </h3>
              <p className="mb-4">
                {t("cities_index.seo.why_study_cafes.description")}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {t("cities_index.seo.global_coverage.title")}
              </h3>
              <p className="mb-4">
                {t("cities_index.seo.global_coverage.description", {
                  count: countries.length,
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <LinkSection />
    </main>
  );
}
