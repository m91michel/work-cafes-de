import { City } from "@/libs/types";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

import { DefaultCafeImage } from "../cafe/Image";
import { Badge } from "../ui/badge";
import { isGerman } from "@/libs/environment";
import { countryFlag } from "@/config/countires";

type Props = {
  city: City;
};

export function CityCard({ city }: Props) {
  const name = isGerman ? city.name_de : city.name_en;
  const description = isGerman
    ? city.description_short_de
    : city.description_short_en;

  const flag = countryFlag(city.country);
  const country = flag ? `${flag} ${city.country}` : city.country;

  return (
    <Link href={`/cities/${city.slug}`} className="block">
      <div className="relative overflow-hidden rounded-lg aspect-[4/3] group">
        {city.preview_image && (
          <Image
            src={city.preview_image || ""}
            alt={`Preview image for ${name}`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        )}
        {!city.preview_image && <DefaultCafeImage className="object-cover" />}
        <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/60" />
        <div className="absolute inset-0 p-6 flex flex-col">
          <div className="flex-1">
            <h2 className="text-white text-4xl font-bold mb-2">{name}</h2>
            <p className="text-white/90 text-xl">{city.state}</p>
            {description && (
              <p className="text-white/90 mt-4 line-clamp-4 opacity-0 transition-opacity group-hover:opacity-100">
                {description}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center gap-2">
            <Badge variant="secondary">{country}</Badge>
            {city.cafes_count && (
              <Badge variant="secondary">
                <MapPin className="h-4 w-4 mr-1" />
                {city.cafes_count} Cafés
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
