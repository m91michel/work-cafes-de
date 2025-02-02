import { Card } from "@/components/ui/card";
import { Clock, ExternalLink, LinkIcon, MapPin } from "lucide-react";
import { Cafe } from "@/libs/types";
import { CafeLinks } from "./links";
import Link from "next/link";
import { directionLink } from "@/libs/google-maps";
import { TranslationProps } from "@/libs/types";

interface CafeDetailsProps extends TranslationProps {
  cafe: Cafe;
}

export function CafeDetails({ cafe, t }: CafeDetailsProps) {
  const openingHours = cafe.open_hours?.split("\n").map((hours, index) => (
    <div key={index} className="text-sm">
      {hours}
      {hours.length == 0 && <br />}
    </div>
  ));
  const googleMapsLink = directionLink(cafe.name, cafe.google_place_id);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">{t("details.title")}</h2>

      <div className="grid gap-6">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-1" />

          <div>
            <h3 className="font-medium">{t("details.address")}</h3>
            <p className="text-muted-foreground">
              {cafe.address}{" "}
              <Link
                href={googleMapsLink}
                target="_blank"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {t("details.directions")} <ExternalLink className="w-4 h-4 inline" />
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-5">
            <Clock className="h-5 w-5 text-muted-foreground mt-1" />
          </div>
          <div>
            <h3 className="font-medium">{t("details.food")}</h3>
            <div className="text-muted-foreground">
              {cafe.food_content || t("details.no_food_content")}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-5">
            <Clock className="h-5 w-5 text-muted-foreground mt-1" />
          </div>
          <div>
            <h3 className="font-medium">{t("details.hours")}</h3>
            <div className="text-muted-foreground">
              {openingHours || t("details.no_hours_content")}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <LinkIcon className="h-5 w-5 text-muted-foreground mt-1" />

          <div className="w-full">
            <h3 className="font-medium">{t("details.links")}</h3>
            {cafe.links && <CafeLinks cafe={cafe} />}
            {!cafe.links && (
              <p className="text-muted-foreground">{t("details.no_links_content")}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
