import { Card } from "@/components/ui/card";
import { Clock, LinkIcon, MapPin } from "lucide-react";
import { Cafe } from "@/libs/types";
import { CafeLinks } from "./links";
import Link from "next/link";

interface CafeDetailsProps {
  cafe: Cafe;
}

export function CafeDetails({ cafe }: CafeDetailsProps) {
  const openingHours = cafe.open_hours?.split("\n").map((hours, index) => (
    <div key={index} className="text-sm">
      {hours}
      {hours.length == 0 && <br />}
    </div>
  ));
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${cafe.name}&query_place_id=${cafe.google_place_id}`;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Über dieses Café</h2>

      <div className="grid gap-6">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-1" />

          <div>
            <h3 className="font-medium">Adresse</h3>
            <p className="text-muted-foreground">
              {cafe.address}{" "}
              <Link
                href={googleMapsLink}
                target="_blank"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Google Maps
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-5">
            <Clock className="h-5 w-5 text-muted-foreground mt-1" />
          </div>
          <div>
            <h3 className="font-medium">Essen</h3>
            <div className="text-muted-foreground">
              {cafe.food_content ||
                "Wir können leider keine Informationen zu Essen für dieses Cafe finden."}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-5">
            <Clock className="h-5 w-5 text-muted-foreground mt-1" />
          </div>
          <div>
            <h3 className="font-medium">Öffnungszeiten</h3>
            <div className="text-muted-foreground">
              {openingHours ||
                "Wir können leider keine Öffnungszeiten für dieses Cafe finden."}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <LinkIcon className="h-5 w-5 text-muted-foreground mt-1" />

          <div className="w-full">
            <h3 className="font-medium">Links</h3>
            {cafe.links && <CafeLinks cafe={cafe} />}
            {!cafe.links && (
              <p className="text-muted-foreground">Keine Links verfügbar</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
