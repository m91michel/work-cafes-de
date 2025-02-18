import { City } from "@/libs/types";

import { CityFilter } from "./city-filter";
import { SortingOptions } from "@/components/general/inputs/sorting-options";
import { PageSizeSelect } from "@/components/general/inputs/page-size-select";
import { ViewToggle } from "@/components/general/inputs/view-toggle";
import { isDev } from "@/libs/environment";

type Props = {
  cities: City[];
};

export const cafeSortingOptions = [
  {
    value: "google_rating-desc",
    key: "rating_desc",
  },
  {
    value: "google_rating-asc",
    key: "rating_asc",
  },
  {
    value: "created_at-desc",
    key: "created_at_desc",
  },
  {
    value: "created_at-asc",
    key: "created_at_asc",
  },
];

export function FiltersSection({ cities }: Props) {
  return (
    <div className="flex flex-wrap gap-4 justify-between mb-8">
      <CityFilter cities={cities} />
      {/* Add more filters here */}
      <div className="flex flex-row gap-2 items-center">
        {isDev && <ViewToggle />}
        <PageSizeSelect options={[25, 50, 100]} defaultValue={25} />
        <SortingOptions options={cafeSortingOptions} namespace="cafe" />
      </div>
    </div>
  );
}
