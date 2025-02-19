"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  MarkerEvent,
  useMap,
} from "react-map-gl/mapbox";
import { LngLatBounds } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Cafe } from "@/libs/types";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/libs/utils";

// Advantages:
// - Beautiful default styling
// - Better performance with large datasets
// - More advanced features out of the box
// - Better TypeScript support
// - Built-in clustering

// Disadvantages:
// - Requires API key
// - Larger bundle size
// - Usage limits/pricing

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface Props {
  cafes: Cafe[];
  className?: string;
}

interface Bounds {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

function parseLatLong(latLong: string | null): [number, number] | null {
  if (!latLong) return null;
  const [lat, long] = latLong.split(",").map(Number);
  if (isNaN(lat) || isNaN(long)) return null;
  return [lat, long];
}

function getBounds(coords: [number, number][]): Bounds | null {
  if (coords.length === 0) return null;

  const lats = coords.map(([lat]) => lat);
  const lngs = coords.map(([lng]) => lng);

  return {
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
  };
}

export function CafeMapBox({ cafes, className }: Props) {
  const [popupInfo, setPopupInfo] = useState<Cafe | null>(null);
  const { current: map } = useMap();

  // Get cafes with valid coordinates
  const cafesWithCoords = useMemo(
    () => cafes.filter((cafe) => parseLatLong(cafe.lat_long)),
    [cafes]
  );

  // Extract all coordinates for bounds calculation
  const allCoords = useMemo(
    () =>
      cafesWithCoords
        .map((cafe) => parseLatLong(cafe.lat_long))
        .filter((coords): coords is [number, number] => coords !== null),
    [cafesWithCoords]
  );

  // Calculate bounds
  const bounds = useMemo(() => getBounds(allCoords), [allCoords]);

  // Fit bounds when coordinates or map changes
  useEffect(() => {
    if (map && bounds) {
      const mapboxBounds = new LngLatBounds(
        [bounds.minLng, bounds.minLat],
        [bounds.maxLng, bounds.maxLat]
      );

      map.fitBounds(mapboxBounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 13,
        duration: 1000,
      });
    }
  }, [map, bounds]);

  const handleMarkerClick = useCallback(
    (e: MarkerEvent<MouseEvent>, cafe: Cafe) => {
      e.originalEvent.stopPropagation();
      setPopupInfo(cafe);
    },
    []
  );

  if (!MAPBOX_TOKEN) {
    console.error("Mapbox token is required");
    return null;
  }

  return (
    <div
      className={cn(
        "w-full h-[600px] rounded-lg overflow-hidden relative",
        className
      )}
    >
      <Map
        id="main-map"
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: bounds ? bounds.minLng : 13.404954,
          latitude: bounds ? bounds.minLat : 52.520008,
          zoom: 13,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        <NavigationControl />

        {cafesWithCoords.map((cafe) => {
          const coords = parseLatLong(cafe.lat_long);
          if (!coords) return null;
          const [lat, lng] = coords;

          return (
            <Marker
              key={cafe.slug}
              latitude={lat}
              longitude={lng}
              anchor="bottom"
              onClick={(e) => handleMarkerClick(e, cafe)}
            />
          );
        })}

        {popupInfo && (
          <Popup
            anchor="bottom"
            longitude={parseLatLong(popupInfo.lat_long)?.[1] || 0}
            latitude={parseLatLong(popupInfo.lat_long)?.[0] || 0}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
          >
            <h3 className="font-semibold text-lg">{popupInfo.name}</h3>
            <div className="flex items-center mt-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1">{popupInfo.google_rating}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {popupInfo.address}
            </p>
          </Popup>
        )}
      </Map>
    </div>
  );
}
