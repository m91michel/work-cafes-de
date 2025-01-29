import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { uploadImageToBunny } from "@/libs/bunny";
import { getPlaceDetails, GoogleMapsCandidate, searchInGoogleMaps } from "@/libs/google-maps";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const showLogs = searchParams.get("showLogs") === "true";
  const limit = Number(searchParams.get("limit") || "20");

  if (isProd) {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  const { data: cafes } = await supabase
    .from("cafes")
    .select("*")
    .is("google_place_id", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!cafes) {
    return NextResponse.json({ message: "No cafes found" }, { status: 404 });
  }

  for (const cafe of cafes) {
    console.log(`processing ${cafe.name} ${cafe.address}`);

    const mapsCandidates = await searchInGoogleMaps(`${cafe.name} ${cafe.address}`);

    if (!mapsCandidates) {
      console.log(`No response from Google Maps API for ${cafe.name}`);
      continue;
    }
    if (mapsCandidates.length !== 1) {
      console.log(`Multiple candidates found for ${cafe.name}`);
      if (showLogs) console.log(`Google Places API response:`, JSON.stringify(mapsCandidates, null, 2));
      await supabase
        .from("cafes")
        .update({
          maps_data: {
            ...mapsCandidates,
          },
          processed: {
            maps_data: true,
          },
          processed_at: new Date().toISOString(),
        })
        .eq("id", cafe.id);

      await processMultipleCafes(mapsCandidates);
      continue;
    }

    const placeId = mapsCandidates[0].place_id;
    if (showLogs) console.log(`placeId: ${placeId}, data: ${JSON.stringify(mapsCandidates[0], null, 2)}`);

    const placeDetails = await getPlaceDetails(placeId);

    if (!placeDetails) {
      console.log(`No place details found for ${cafe.name}`);
      continue;
    }

    const photoUrls: string[] = placeDetails.photos.map((photo: any) => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    });
    if (showLogs) console.log(`photoUrls: ${JSON.stringify(photoUrls, null, 2)}`);

    const filename = `${cafe.slug}-thumb.jpg`;
    const bunnyUrl = await uploadImageToBunny(photoUrls[0], filename, 'cafes');

    const formattedAddress = mapsCandidates[0].formatted_address;
    const lat_long = `${mapsCandidates[0].geometry.location.lat},${mapsCandidates[0].geometry.location.lng}`;
    const rating = mapsCandidates[0].rating;
    
    const { error } = await supabase
      .from("cafes")
      .update({
        google_place_id: placeId,
        processed_at: new Date().toISOString(),
        address: formattedAddress,
        lat_long: lat_long,
        preview_image: bunnyUrl,
        google_rating: rating,
        maps_data: {
          ...mapsCandidates[0],
          photos: photoUrls,
        }
      })
      .eq("id", cafe.id);

    if (error) {
      console.log(`Error updating cafe: ${cafe.name}`, error);
    }
  }

  const processedCafes = cafes.map((cafe) => {
    return {
      id: cafe.id,
      name: cafe.name,
      preview_image: cafe.preview_image,
    };
  });
  return NextResponse.json({ 
    message: "success", 
    processed: processedCafes.length,
    data: processedCafes
  });
}

async function processMultipleCafes(candidates: GoogleMapsCandidate[]) {
  for (const candidate of candidates) {
    console.log(`processing ${candidate.name} ${candidate.formatted_address}`);
    await createNewCafe(candidate);
  }
}

async function createNewCafe(place: GoogleMapsCandidate) {
  const { error } = await supabase.from("cafes").insert({
    name: place.name,
    address: place.formatted_address,
    google_place_id: place.place_id,
    google_rating: place.rating,
    maps_data: place,
  });

  if (error) {
    console.log(`Error creating new cafe: ${place.name}`, error);
  }
}