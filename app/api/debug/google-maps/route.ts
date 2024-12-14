import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import axios from "axios";
import FormData from "form-data";
import { Cafe } from "@/libs/types";
import { uploadImagesToBunny } from "@/libs/bunny";
import { getPlaceDetails } from "@/libs/google-maps";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  if (isProd) {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  const { data: cafes } = await supabase
    .from("cafes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (!cafes) {
    return NextResponse.json({ message: "No cafes found" }, { status: 404 });
  }

  for (const cafe of cafes) {
    console.log(`processing ${cafe.name} ${cafe.address}`);

    // @ts-ignore
    const response = await searchInGoogleMaps(cafe);

    if (!response) {
      console.log(`No response from Google Maps API for ${cafe.name}`);
      continue;
    }
    if (response.candidates.length !== 1) {
      console.log(`Multiple candidates found for ${cafe.name}`);
      console.log(`Google Places API response:`, JSON.stringify(response.candidates, null, 2));
      continue;
    }

    const placeId = response.candidates[0].place_id;
    console.log(`placeId: ${placeId}, data: ${JSON.stringify(response.candidates[0], null, 2)}`);

    const placeDetails = await getPlaceDetails(placeId);

    if (!placeDetails) {
      console.log(`No place details found for ${cafe.name}`);
      continue;
    }

    const photoUrls = placeDetails.photos.map((photo: any) => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    });

    const filename = `${cafe.name}-${cafe.address}.jpg`;
    const bunnyImageUrls = await uploadImagesToBunny(photoUrls, filename, 'cafes');

    const formattedAddress = response.candidates[0].formatted_address;
    const lat_long = `${response.candidates[0].geometry.location.lat},${response.candidates[0].geometry.location.lng}`;
    
    const { error } = await supabase
      .from("cafes")
      .update({
        google_place_id: placeId,
        processed_at: new Date().toISOString(),
        address: formattedAddress,
        lat_long: lat_long,
        maps_data: response.candidates[0],
        bunny_image_urls: bunnyImageUrls,
      })
      .eq("id", cafe.id);

    if (error) {
      console.log(`Error updating cafe: ${cafe.name}`, error);
    }
  }

  return NextResponse.json({ message: "success", cafes });
}