import { City, TranslationProps } from "@/libs/types";
import { MLink } from "@/components/general/link";
import { CityGridList } from "../list/city-list";
import { SuggestCityCard } from "../list/city-list";
import { ArrowRight } from "lucide-react";
import Paths from "@/libs/paths";

interface Props extends TranslationProps {
  title?: string;
  subtitle?: string;
  cities: City[];
  suggestCityCard?: boolean;
  showMoreButton?: boolean;
  buttonText?: string;
}

export function CityListSection({
  title,
  subtitle,
  cities = [],
  showMoreButton = false,
  suggestCityCard = false,
  buttonText,
  t,
}: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-top mb-6">
        <div className="flex flex-col gap-4">
          {title && <h2 className="text-2xl font-semibold">{title}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        {showMoreButton && (
          <div className="flex justify-end mt-4 md:mt-0">
            <MLink
              href={Paths.cities}
              className="flex items-center gap-2 text-primary"
            >
              {buttonText || t("more_cities.button_text")}
              <ArrowRight className="w-4 h-4" />
            </MLink>
          </div>
        )}
      </div>
      <CityGridList
        cities={cities}
        t={t}
        extraCard={suggestCityCard && <SuggestCityCard t={t} />}
      />
    </section>
  );
}
