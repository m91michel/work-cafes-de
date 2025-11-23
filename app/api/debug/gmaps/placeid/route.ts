import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { GoogleMapsCandidate, getGoogleMapsId } from "@/libs/google-maps";

export const dynamic = "force-dynamic";

// find google place id for cafes without one
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

    const mapsCandidates = await getGoogleMapsId(`${cafe.name} ${cafe.city}`);

    if (!mapsCandidates) {
      console.log(`No response from Google Maps API for ${cafe.name}`);
      continue;
    }else if (mapsCandidates.length === 1) {
      console.log(`Found 1 candidate for ${cafe.name}`);
      const placeId = mapsCandidates[0].place_id;
      
      const { error } = await supabase
        .from("cafes")
        .update({
          google_place_id: placeId,
        })
        .eq("id", cafe.id);

      if (error) {
        console.log(`Error updating cafe: ${cafe.name}`, error);
      }
    } else {
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
    source: "GOOGLE_MAPS_SEARCH",
    status: "NEW",
  });

  if (error) {
    console.log(`Error creating new cafe: ${place.name}`, error);
  }
}