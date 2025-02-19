import { isGerman } from "@/libs/environment";
import { City, TranslationProps } from "@/libs/types";
import { LocateIcon, MapPin } from "lucide-react";
import { TransHighlight } from "../../general/translation";
import { countryFlag } from "@/config/countires";

interface CityAboutProps extends TranslationProps {
  city: City;
}

export function CityAbout({ city, t }: CityAboutProps) {
  const name = isGerman ? city.name_de : city.name_en;
  const cityName = name || city.slug || "";
  const description = isGerman
    ? city.description_long_de
    : city.description_long_en;

  if (!description) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold mb-4">
        <TransHighlight
          i18nKey="about.title"
          values={{ name: cityName }}
          namespace="city"
        />
      </h2>

      <p className="text-xl text-muted-foreground">{description}</p>
    </section>
  );
}
