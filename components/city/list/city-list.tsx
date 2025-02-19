import { City, TranslationProps } from "@/libs/types";

import { Button } from "@/components/ui/button";

import { MLink } from "@/components/general/link";
import { FilteredCities } from "./filtered-cities";

interface Props extends TranslationProps {
  title?: string;
  cities: City[];
  suggestCityCard?: boolean;
  showMoreButton?: boolean;
  buttonText?: string;
  filterSection?: React.ReactNode;
}

export function CityList({
  title,
  cities = [],
  showMoreButton = false,
  suggestCityCard = false,
  buttonText,
  filterSection,
  t,
}: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      {filterSection && filterSection}
      <FilteredCities cities={cities} suggestCityCard={suggestCityCard} />

      {showMoreButton && (
        <div className="flex justify-center mt-6">
          <Button variant="default" asChild>
            <MLink href="/cities">
              {buttonText || t("more_cities.button_text")}
            </MLink>
          </Button>
        </div>
      )}
    </section>
  );
}
