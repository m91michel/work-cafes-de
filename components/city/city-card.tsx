import { City } from "@/libs/types";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

import { DefaultCafeImage } from "../cafe/Image";
import { Badge } from "../ui/badge";

type Props = {
  city: City
};

export function CityCard({ city }: Props) {
  return (
    <Link href={`/cities/${city.slug}`} className="block">
      <div className="relative overflow-hidden rounded-lg aspect-[4/3] group">
        {city.preview_image && (
          <Image
            src={city.preview_image || ""}
            alt={city.name_de || ""}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        )}
        {!city.preview_image && <DefaultCafeImage className="object-cover" />}
        <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/60" />
        <div className="absolute inset-0 p-6 flex flex-col">
          <div className="flex-1">
            <h2 className="text-white text-4xl font-bold mb-2">{city.name_de}</h2>
            <p className="text-white/90 text-xl">{city.state}</p>
            {city.description_short && (
              <p className="text-white/90 mt-4 line-clamp-4 opacity-0 transition-opacity group-hover:opacity-100">
                {city.description_short}
              </p>
            )}
          </div>
          {city.cafes_count && (
            <div>
              <Badge variant="secondary">
                <MapPin className="h-4 w-4 mr-1" />
                {city.cafes_count} Cafés
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}