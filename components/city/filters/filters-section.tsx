import { SortingOption, SortingOptions } from "@/components/general/inputs/sorting-options";
import { CountryFilter } from "./country-filter";
import { Country } from "@/libs/types";

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
    <div className="flex flex-wrap gap-4 justify-between mb-8">
      <CountryFilter countries={countries} />
      {/* Add more filters here */}
      <SortingOptions options={citySortingOptions} namespace="city" />
    </div>
  );
}
