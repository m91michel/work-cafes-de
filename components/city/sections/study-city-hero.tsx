import { isGerman } from "@/libs/environment";
import { City, TranslationProps } from "@/libs/types";
import { TransHighlight } from "../../general/translation";
import { getCountryByCode } from "@/config/countires";

interface StudyCityHeroProps extends TranslationProps {
  city: City;
  cafeCount: number;
}

export function StudyCityHero({ city, cafeCount, t }: StudyCityHeroProps) {
  const country = getCountryByCode(city?.country_code || "");
  const name = isGerman ? city.name_de : city.name_en;
  const cityName = name || city.slug || "";
  const countryName = country?.name_de || country?.name || "";

  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <TransHighlight
            i18nKey="hero.title"
            values={{ name: cityName }}
            namespace="study"
          />
        </h1>

        <div className="mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
            {cafeCount === 1
              ? t("hero.places_found_one", { count: cafeCount })
              : t("hero.places_found", { count: cafeCount })}
          </span>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
          {t("hero.subtitle", { name: cityName })}
        </p>

        <p className="text-lg text-muted-foreground max-w-5xl mx-auto leading-relaxed">
          {t("hero.description", { name: cityName, country: countryName })}
        </p>
      </div>
    </section>
  );
}
