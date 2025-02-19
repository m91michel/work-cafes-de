import { City, TranslationProps } from "@/libs/types";

import { Button } from "@/components/ui/button";

import { MLink } from "@/components/general/link";
import { CityGridList } from "../list/city-list";
import { SuggestCityCard } from "../list/city-list";

interface Props extends TranslationProps {
  title?: string;
  cities: City[];
  suggestCityCard?: boolean;
  showMoreButton?: boolean;
    buttonText?: string;
}

export function CityListSection({
  title,
  cities = [],
  showMoreButton = false,
  suggestCityCard = false,
  buttonText,
  t,
}: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <CityGridList
        cities={cities}
        t={t}
        extraCard={suggestCityCard && <SuggestCityCard t={t} />}
      />

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
