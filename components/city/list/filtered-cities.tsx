'use client';

import { City, TranslationProps } from "@/libs/types";
import { CityCard } from "../city-card";
import { Button } from "@/components/ui/button";

import { PlusCircle } from "lucide-react";
import Paths from "@/libs/paths";
import { MLink } from "@/components/general/link";
import { useQueryState } from "next-usequerystate";
import { isGerman } from "@/libs/environment";
import { useCTranslation } from "@/hooks/use-translation";

interface Props {
  cities: City[];
  suggestCityCard?: boolean;
  showMoreButton?: boolean;
  buttonText?: string;
};

export function FilteredCities({
  cities = [],
  suggestCityCard = false,
}: Props) {
  const { t } = useCTranslation('city');
  const [query] = useQueryState("q");
  const filteredCities = cities.filter((city) => {
    const inDeName = city.name_de?.toLowerCase().includes(query?.toLowerCase() || "");
    const inEnName = city.name_en?.toLowerCase().includes(query?.toLowerCase() || "");
    return inDeName || inEnName;
  });

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <CityCard key={city.slug} city={city} />
        ))}
        {cities.length === 0 && (
          <div className="bg-card rounded-lg p-6 border">
            <p className="text-muted-foreground">
              No cities found
            </p>
          </div>
        )}
        {suggestCityCard && (
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">{t('more_cities.suggest_title')}</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              {t('more_cities.suggest_description')}
            </p>
            <Button asChild>
              <MLink href={Paths.suggestCity}>
                {t('more_cities.suggest_button')}
              </MLink>
            </Button>
          </div>
        )}
      </div>
  );
}
