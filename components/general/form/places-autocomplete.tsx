"use client";

import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Library } from "@googlemaps/js-api-loader";
import { cn } from "@/libs/utils";
import { isGerman } from "@/libs/environment";

const libraries: Library[] = ["places"];

export interface PlaceResult {
  name: string;
  placeId: string;
  city: string;
  address: string;
  state: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

type PlaceType = "cafe" | "city" | string;

interface PlacesAutocompleteProps {
  className?: string;
  label?: string;
  placeholder?: string;
  types?: PlaceType[];
  componentRestrictions?: { country: string[] };
  country?: string;
  onPlaceSelect: (place: PlaceResult | null) => void;
}

export function PlacesAutocomplete({
  onPlaceSelect,
  className,
  label,
  placeholder,
  types = ["(cities)"],
  componentRestrictions = { country: [] },
}: PlacesAutocompleteProps) {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  // // Effect to update restrictions when componentRestrictions changes
  // useEffect(() => {
  //   if (autocomplete) {
  //     autocomplete.setComponentRestrictions(componentRestrictions || { country: [] });
  //   }
  // }, [autocomplete, JSON.stringify(componentRestrictions)]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    language: isGerman ? "de" : "en",
    libraries,
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (place.geometry && place.address_components) {
        const addressComponents = place.address_components;

        const placeData: PlaceResult = {
          name: place.name || "",
          placeId: place.place_id || "",
          address: place.formatted_address || "",
          city:
            addressComponents.find((component) =>
              component.types.includes("locality")
            )?.long_name || "",
          state:
            addressComponents.find((component) =>
              component.types.includes("administrative_area_level_1")
            )?.long_name || "",
          country:
            addressComponents.find((component) =>
              component.types.includes("country")
            )?.long_name || "",
          countryCode:
            addressComponents.find((component) =>
              component.types.includes("country")
            )?.short_name || "",
          latitude: place.geometry.location?.lat() || 0,
          longitude: place.geometry.location?.lng() || 0,
        };

        onPlaceSelect(placeData);
      }
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: types ? [types].flat() : undefined,
          componentRestrictions: componentRestrictions,
        }}
      >
        <Input
          type="text"
          placeholder={placeholder}
          className={cn("w-full", className)}
        />
      </Autocomplete>
    </div>
  );
}
