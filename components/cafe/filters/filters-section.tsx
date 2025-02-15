import { City } from "@/libs/types";

import { CityFilter } from "./city-filter";
import { SortingOptions } from "@/components/general/inputs/sorting-options";

type Props = {
  cities: City[];
};

export const cafeSortingOptions = [
  {
    value: 'google_rating-desc',
    key: 'rating_desc',
  },
  {
    value: 'google_rating-asc',
    key: 'rating_asc',
  },
  {
    value: 'created_at-desc',
    key: 'created_at_desc',
  },
  {
    value: 'created_at-asc',
    key: 'created_at_asc',
  },
];

export function FiltersSection({ cities }: Props) {
  return (
    <div className="flex flex-wrap gap-4 justify-between mb-8">
      <CityFilter cities={cities} />
      {/* Add more filters here */}
      <SortingOptions options={cafeSortingOptions} namespace="cafe" />
    </div>
  );
}
