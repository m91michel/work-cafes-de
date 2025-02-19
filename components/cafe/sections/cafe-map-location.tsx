"use client";

import { Card } from "../../ui/card";
import { useCTranslation } from "@/hooks/use-translation";
import { locationLink, directionLink } from "@/libs/google-maps";
import { Cafe } from "@/libs/types";
import { MapContainer, MapOptions } from "../map/map-container";
import { Button } from "@/components/ui/button";
import { MLink } from "@/components/general/link";
import { ExternalLink } from "lucide-react";

interface RatingCardProps {
  cafe: Cafe;
  className?: string;
}

const mapOptions: MapOptions = {
  zoom: 15,
  scrollWheelZoom: false,
  dragging: false,
  touchZoom: false,
  doubleClickZoom: false,
  zoomControl: false,
  boxZoom: false,
  keyboard: false,
};

export function CafeMapLocation({ cafe }: RatingCardProps) {
  const { t } = useCTranslation("cafe");
  const googleMapsLink = locationLink(cafe.name, cafe.google_place_id);
  const googleDirectionLink = directionLink(cafe.name, cafe.google_place_id);

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-3">{t("map.title")}</h2>

      <MapContainer
        cafes={[cafe]}
        provider="leaflet"
        height={300}
        mapOptions={mapOptions}
        contentRender={(cafe) => (
          <strong className="text-base font-semibold">{cafe.name}</strong>
        )}
      />
      <p className="text-muted-foreground">
        {cafe.address}{" "}
        <MLink
          href={googleDirectionLink}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          {t("details.directions")} <ExternalLink className="w-4 h-4 inline" />
        </MLink>
      </p>
      <Button variant="default" size="sm" asChild className="mt-3 w-full">
        <MLink href={googleMapsLink}>
          {t("map.button_title")}
          <ExternalLink className="w-4 h-4 ml-2" />
        </MLink>
      </Button>
    </Card>
  );
}
