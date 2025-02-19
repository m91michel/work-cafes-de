import { City, TranslationProps } from "@/libs/types";

import { Button } from "@/components/ui/button";

import { MLink } from "@/components/general/link";
import { CityCard } from "../city-card";
import Paths from "@/libs/paths";
import { PlusCircle } from "lucide-react";

interface Props extends TranslationProps {
  cities: City[];
  extraCard?: React.ReactNode;
}

export function CityGridList({ cities = [], extraCard }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cities.map((city) => (
        <CityCard key={city.slug} city={city} />
      ))}
      {cities.length === 0 && (
        <div className="bg-card rounded-lg p-6 border">
          <p className="text-muted-foreground">No cities found</p>
        </div>
      )}
      {cities.length > 0 && extraCard}
    </div>
  );
}

export function SuggestCityCard({ t }: TranslationProps) {
  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="flex items-center gap-3 mb-4">
        <PlusCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">
          {t("more_cities.suggest_title")}
        </h2>
      </div>
      <p className="text-muted-foreground mb-6">
        {t("more_cities.suggest_description")}
      </p>
      <Button asChild>
        <MLink href={Paths.suggestCity}>
          {t("more_cities.suggest_button")}
        </MLink>
      </Button>
    </div>
  );
}
