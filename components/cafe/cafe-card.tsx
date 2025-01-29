"use client";

import { Card } from "@/components/ui/card";
import { Wifi, Power, Volume2, Armchair, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Cafe } from "@/libs/types";
import { DefaultCafeImage } from "./Image";
import {
  AmbianceBadge,
  SeatingComfortBadge,
  WifiQualityBadge,
} from "./cafe-badges";

interface CafeCardProps {
  cafe: Cafe;
}

export function CafeCard({ cafe }: CafeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Link href={`/cafes/${cafe.slug}`} className="block relative h-48">
          {cafe.preview_image && (
            <Image
              src={cafe.preview_image}
              alt={cafe.name || "Preview Image of the Cafe"}
              fill
              unoptimized
              className="object-cover"
            />
          )}
          {!cafe.preview_image && <DefaultCafeImage />}
        </Link>

        {cafe.cities && (
          <Link
            href={`/cities/${cafe.cities?.slug}`}
            className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-black/60 transition-colors"
          >
            {cafe.cities?.name}
          </Link>
        )}

        <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <Star className="h-4 w-4 fill-current" />
          <span>{cafe.google_rating?.toFixed(1) || "0.0"}</span>
        </div>
      </div>

      <div className="pb-6 px-6 pt-4">
        <Link href={`/cafes/${cafe.slug}`}>
          <h3 className="text-xl font-semibold mb-4 hover:text-primary transition-colors">
            {cafe.name}
          </h3>
        </Link>

        <div className="flex gap-2 text-sm flex-wrap">
          <div className="flex items-center gap-1">
            <WifiQualityBadge
              value={cafe.wifi_qualitity}
              icon={<Wifi className="h-4 w-4 mr-1" />}
            />
          </div>
          <div className="flex items-center gap-1">
            <SeatingComfortBadge
              value={cafe.seating_comfort}
              icon={<Armchair className="h-4 w-4 mr-1" />}
            />
          </div>
          <div className="flex items-center gap-1">
            <AmbianceBadge
              value={cafe.ambiance}
              icon={<Volume2 className="h-4 w-4 mr-1" />}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
