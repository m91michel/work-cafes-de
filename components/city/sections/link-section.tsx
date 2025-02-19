import { getCities } from "@/libs/supabase/cities";
import { CitySelector, CitySelectorByCountry } from "../city-selector";
import { getCountries } from "@/libs/supabase/countries";
import { TransHighlight } from "@/components/general/translation";

interface LinkSectionProps {
  className?: string;
}

export async function LinkSection() {
  const byCountries = await getCountries({
    status: "ACTIVE",
    limit: 10,
    offset: 0,
    sortBy: "city_count",
    sortOrder: "desc",
  });
  const byCafeCount = await getCities({
    limit: 10,
    offset: 0,
    sortBy: "cafes_count",
    sortOrder: "desc",
  });
  const byPopulation = await getCities({
    limit: 10,
    offset: 0,
    sortBy: "population",
    sortOrder: "desc",
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center">
              <TransHighlight i18nKey="all_cities.title" namespace="home" />
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <div className="flex-1 text-center font-bold">
          <h3>
            <TransHighlight i18nKey="all_cities.by_country.title" namespace="home" />
          </h3>
          <CitySelectorByCountry countries={byCountries} className="mt-4 flex-col" />
        </div>
        <div className="flex-1 text-center font-bold">
          <h3>
            <TransHighlight i18nKey="all_cities.by_cafe_count.title" namespace="home" />
          </h3>
          <CitySelector cities={byCafeCount} className="mt-4 flex-col" />
        </div>
        <div className="flex-1 text-center font-bold">
          <h3>
            <TransHighlight i18nKey="all_cities.by_population.title" namespace="home" />
          </h3>
          <CitySelector cities={byPopulation} className="mt-4 flex-col" />
        </div>
      </div>
    </section>
  );
}
