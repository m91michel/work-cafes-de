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
    value: "published_at-desc",
    key: "published_at_desc",
  },
  {
    value: "published_at-asc",
    key: "published_at_asc",
  },
];

export function FiltersSection({ cities }: Props) {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-between mb-8">
      <CityFilter cities={cities} />
      {/* Add more filters here */}
      <div className="flex flex-row gap-4 items-center flex-wrap">
        {isDev && <ViewToggle />}
        <PageSizeSelect options={[25, 50, 100]} defaultValue={25} className="w-full md:w-auto" />
        <SortingOptions options={cafeSortingOptions} namespace="cafe" className="w-full md:w-auto" />
      </div>
    </div>
  );
}
