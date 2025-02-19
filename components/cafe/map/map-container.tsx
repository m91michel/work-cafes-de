"use client";

import dynamic from "next/dynamic";
import { Cafe } from "@/libs/types";
import { cn } from "@/libs/utils";

export type MapOptions = {
  zoom?: number;
  scrollWheelZoom?: boolean;
  dragging?: boolean;
  touchZoom?: boolean;
  doubleClickZoom?: boolean;
  zoomControl?: boolean;
  boxZoom?: boolean;
  keyboard?: boolean;
  attributionControl?: boolean;
};

interface Props {
  cafes: Cafe[];
  className?: string;
  provider?: "leaflet" | "google" | "mapbox";
  height?: number | string;
  contentRender?: (cafe: Cafe) => React.ReactNode;
  mapOptions?: MapOptions;
}

export function MapContainer({
  cafes,
  className,
  provider = "leaflet",
  ...props
}: Props) {
  switch (provider) {
    case "google":
      return <DynamicGoogleMap cafes={cafes} className={className} />;
    case "mapbox":
      return <DynamicMapboxMap cafes={cafes} className={className} />;
    default:
      return (
        <DynamicLeafletMap cafes={cafes} className={className} height={props.height || 600} {...props} />
      );
  }
}

function DynamicLeafletMap({ cafes, className, provider, ...props }: Props) {
  const DynamicMap = dynamic(
    () => import("./leaf-map").then((mod) => mod.LeafletMap),
    {
      ssr: false,
      loading: () => (
        <div
          className="w-full rounded-lg bg-muted animate-pulse"
          style={{ height: props.height }}
        />
      ),
    }
  );

  return <DynamicMap cafes={cafes} className={className} {...props} />;
}

const DynamicGoogleMap = dynamic(
  () => import("./google-map").then((mod) => mod.CafeGoogleMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-lg bg-muted animate-pulse" />
    ),
  }
);

const DynamicMapboxMap = dynamic(
  () => import("./mapbox-map").then((mod) => mod.CafeMapBox),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] rounded-lg bg-muted animate-pulse" />
    ),
  }
);
