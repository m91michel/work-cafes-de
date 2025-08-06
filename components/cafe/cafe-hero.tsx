import Image from "next/image";
import { Cafe } from "@/libs/types";
import { DefaultCafeImage } from "./Image";
import { Button } from "../ui/button";
import { Flag, Globe, MapPinned } from "lucide-react";
import { MLink } from "../general/link";
import { countryFlag } from "@/config/countires";
import Paths from "@/libs/paths";
import { locationLink } from "@/libs/google-maps";

interface CafeHeroProps {
  cafe: Cafe;
}

export function CafeHero({ cafe }: CafeHeroProps) {
  const flag = countryFlag(cafe.cities?.country);
  const cityHref = cafe.city_slug ? Paths.city(cafe.city_slug) : "";
  const googleMapsLink = locationLink(cafe.name, cafe.google_place_id);
  const reportHref = Paths.cafeReport(cafe.slug, cafe.name);

  return (
    <div className="relative h-[400px] max-w-7xl mx-auto px-4">
      <div className="relative h-full w-full rounded-b-xl overflow-hidden">
        <div className="relative h-full w-full px-4">
          {cafe.preview_image && (
            <Image
              src={cafe.preview_image}
              alt={cafe.name || ""}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          )}
          {!cafe.preview_image && <DefaultCafeImage />}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl px-4 md:px-8 py-8 flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold text-white">{cafe.name}</h1>
              <MLink
                href={cityHref}
                className="text-xl text-white/90 flex items-center gap-2 hover:text-primary"
              >
                {flag} {cafe.city}
              </MLink>
            </div>
            <div className="flex flex-row gap-2 items-end flex-wrap">
              {cafe.website_url && (
                <Button variant="default" size="sm" asChild>
                  <MLink href={cafe.website_url}>
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </MLink>
                </Button>
              )}
              <Button variant="secondary" size="sm" asChild>
                <MLink href={googleMapsLink}>
                  <MapPinned className="w-4 h-4 mr-2" />
                  Google Maps
                </MLink>
              </Button>
              <Button variant="secondary" size="sm" asChild title="Report">
                <MLink href={reportHref} noFollow>
                  <Flag className="w-4 h-4" />
                </MLink>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
