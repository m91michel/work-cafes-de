"use client";

import { ExternalLink, Star, StarHalf } from "lucide-react";
import { Card } from "../../ui/card";
import { useCTranslation } from "@/hooks/use-translation";
import { locationLink } from "@/libs/google-maps";
import { Cafe } from "@/libs/types";
import { MLink } from "../../general/link";

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
        <Rating rating={cafe.google_rating || 0} />
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

interface RatingProps {
  rating: number | null;
  className?: string;
}

export function Rating({ rating, className = "" }: RatingProps) {
  const { t } = useCTranslation("cafe");

  if (!rating) {
    return <p>{t("rating.no_rating")}</p>;
  }

  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;

  const renderStar = (index: number) => {
    if (index < fullStars) {
      return <Star className="fill-yellow-500 text-yellow-500" key={index} />;
    } else if (index === fullStars && hasHalfStar) {
      return (
        <div className="relative w-6 h-6" key={index}>
          <Star className="absolute text-yellow-500 w-6 h-6" />
          <StarHalf className="absolute fill-yellow-500 text-yellow-500 w-6 h-6" />
        </div>
      );
    } else {
      return <Star className="text-yellow-500" key={index} />;
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex" aria-hidden="true">
        {[...Array(5)].map((_, index) => renderStar(index))}
      </div>
      <span
        className="font-bold text-sm"
        aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
