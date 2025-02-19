import { SortingOption, SortingOptions } from "@/components/general/inputs/sorting-options";
import { CountryFilter } from "./country-filter";
import { Country } from "@/libs/types";
import { CitySearchFilter } from "./city-search-filter";

type Props = {
  countries: Country[];
};

export const citySortingOptions: SortingOption[] = [
  {
    value: 'population-desc',
    key: 'population_desc',
  },
  {
    value: 'population-asc',
    key: 'population_asc',
  },
  {
    value: 'updated_at-desc',
    key: 'updated_at_desc',
  },
  {
    value: 'updated_at-asc',
    key: 'updated_at_asc',
  },
];
export function FiltersSection({ countries }: Props) {
  return (
    <div className="mb-6">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-3 sm:hidden">
        <CitySearchFilter className="w-full" />
        <div className="flex gap-4">
          <CountryFilter countries={countries} className="w-1/2" />
          <SortingOptions options={citySortingOptions} namespace="city" className="w-1/2" />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex flex-wrap gap-4 justify-between">
        <div className="flex gap-4">
          <CountryFilter countries={countries} className="min-w-48" />
          <CitySearchFilter className="min-w-[200px]" />
        </div>
        <SortingOptions options={citySortingOptions} namespace="city" />
      </div>
    </div>
  );
}
