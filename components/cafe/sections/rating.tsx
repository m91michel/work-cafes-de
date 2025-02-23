"use client";

import { ExternalLink } from "lucide-react";
import { Card } from "../../ui/card";
import { useCTranslation } from "@/hooks/use-translation";
import { locationLink } from "@/libs/google-maps";
import { Cafe } from "@/libs/types";
import { MLink } from "../../general/link";
import { FiveStarRating } from "@/components/general/data-display/five-start-rating";

interface RatingCardProps {
  cafe: Cafe;
  className?: string;
}

export function CafeRatingCard({ cafe }: RatingCardProps) {
  const { t } = useCTranslation("cafe");
  const googleMapsLink = locationLink(cafe.name, cafe.google_place_id);

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-3">{t("rating.title")}</h2>

      <div className="space-y-5">
        <FiveStarRating rating={cafe.google_rating || 0} />
        <p>
          <MLink href={googleMapsLink} className="text-sm text-muted-foreground">
            {t("rating.source")}
            <ExternalLink className="ml-1 w-4 h-4 inline" />
          </MLink>
        </p>
      </div>
    </Card>
  );
}