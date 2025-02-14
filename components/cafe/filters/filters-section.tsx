import { City } from "@/libs/types";

import { CityFilter } from "./city-filter";

type Props = {
  cities: City[];
};

export function FiltersSection({ cities }: Props) {
  return (
    <div className="flex flex-wrap gap-4 justify-between mb-8">
      <CityFilter cities={cities} />
      {/* Add more filters here */}
    </div>
  );
}
