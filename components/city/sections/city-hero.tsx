import { isGerman } from "@/libs/environment";
import { City, TranslationProps } from "@/libs/types";
import { Coffee, LocateIcon, MapPin } from "lucide-react";
import { TransHighlight } from "../../general/translation";
import { countryFlag } from "@/config/countires";
import Image from "next/image";

interface CityHeroProps extends TranslationProps {
  city: City;
  cafeCount: number;
}

export function CityHero({ city, cafeCount, t }: CityHeroProps) {
  const name = isGerman ? city.name_de : city.name_en;
  const cityName = name || city.slug || "";
  const description = isGerman
    ? city.description_short_de
    : city.description_short_en;
  const flag = countryFlag(city.country);

  return (
    <section className="bg-card min-h-[500px]">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:gap-12 items-center">
          {/* Content */}
          <div className="flex-1 w-full md:w-1/2 py-6 md:py-0 mb-6 md:mb-0">
            {/* Location Badge */}
            <div className="mb-6 flex flex-col md:flex-row items-start gap-2">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm backdrop-blur-sm">
                <MapPin className="mr-1 h-4 w-4 text-primary" />
                <span className="font-medium text-primary">{cityName}</span>
                {city.country !== cityName && (
                  <>
                    <span className="mx-1 text-primary">|</span>
                    <span className="text-primary font-medium">
                      {flag} {city.country}
                    </span>
                  </>
                )}
              </div>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm backdrop-blur-sm">
                <Coffee className="mr-1 h-4 w-4 text-primary" />
                <span className="text-primary font-medium">
                  <TransHighlight
                    i18nKey="hero.places_found"
                    values={{ count: cafeCount }}
                    namespace="city"
                  />
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <TransHighlight
                i18nKey="hero.title"
                values={{ name: cityName }}
                namespace="city"
              />
            </h1>
            {description && (
              <p className="text-lg md:text-xl text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {/* Image */}
          <div className="flex-1 w-full md:w-1/2">
            <div className="relative aspect-[4/3] md:aspect-[4/3] w-full rounded-lg overflow-hidden">
              <Image
                src={city.preview_image || ""}
                alt={`${cityName} skyline`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
