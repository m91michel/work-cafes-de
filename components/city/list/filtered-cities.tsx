'use client';

import { City, Country } from "@/libs/types";
import { useCTranslation } from "@/hooks/use-translation";
import { useQueryState } from "nuqs";
import { CityGridList, SuggestCityCard } from "./city-list";
import { FiltersSection } from "../filters/filters-section";

interface Props {
  cities: City[];
  countries: Country[];
  suggestCityCard?: boolean;
};

export function FilteredCitySection({
  cities = [],
  countries,
  suggestCityCard = false,
}: Props) {
  const { t } = useCTranslation('city');

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <FiltersSection countries={countries} />
      <FilteredCities
        cities={cities}
        suggestCityCard={suggestCityCard}
      />
    </section>
  )
  
  
}

type FilteredGridProps = {
  cities: City[];
  suggestCityCard?: boolean;
}
export function FilteredCities({
  cities = [],
  suggestCityCard = false,
}: FilteredGridProps) {
  const { t } = useCTranslation('city');
  const [query] = useQueryState("q");
  const filteredCities = cities.filter((city) => {
    const inDeName = city.name_de?.toLowerCase().includes(query?.toLowerCase() || "");
    const inEnName = city.name_en?.toLowerCase().includes(query?.toLowerCase() || "");
    return inDeName || inEnName;
  });

  return (
      <CityGridList
        cities={filteredCities}
        extraCard={suggestCityCard && <SuggestCityCard t={t} />}
        t={t}
      />
  );
}
