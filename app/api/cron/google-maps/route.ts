import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";
import { getPlaceDetails } from "@/libs/google-maps";
import { uploadImageToBunny } from "@/libs/bunny";
import { processOpenHours } from "@/libs/openai/process-open-hours";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const maxDuration = 60;

const LIMIT = 1;

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") || LIMIT);

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  console.log(`⚡️ start processing cafes (limit: ${limit})`);

  const { data: cafes = [], error } = await supabase
    .from("cafes")
    .select("*")
    .not("google_place_id", "is", null)
    .eq("status", "NEW")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cafes === null || cafes === undefined || error) {
    console.error("⚠️ Error fetching cafes", error);
    return NextResponse.json({ error: "Error fetching cafes" });
  }

  for (const cafe of cafes) {
    console.log(`⚡️ processing ${cafe.name} ${cafe.address}`);
    if (!cafe.google_place_id) {
      console.log(`⚠️ No google_place_id for ${cafe.name}`);
      continue;
    }

    const placeDetails = await getPlaceDetails(cafe.google_place_id);

    if (!placeDetails) {
      console.error(`⚠️ No place details found for ${cafe.name}`);
      continue;
    }

    // process photos
    const photos = placeDetails.photos || [];
    const photoUrls: string[] = photos.map((photo: any) => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    });

    let bunnyUrl;
    if (photoUrls.length > 0) {
      const filename = `${cafe.slug}-thumb.jpg`;
      bunnyUrl = await uploadImageToBunny(photoUrls[0], filename, 'cafes');
    }

    const formattedAddress = placeDetails.formatted_address;
    const lat_long = `${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}`;
    const rating = placeDetails.rating;
    const weekdayText = placeDetails.opening_hours?.weekday_text;
    let openHours = weekdayText?.join("\n");

    if (openHours) {
      openHours = await processOpenHours(openHours);
    }

    const processed = {
      ...(typeof cafe?.processed === "object" && cafe?.processed !== null
        ? cafe?.processed
        : {}),
      google_details_at: dayjs().toISOString(),
    };
    
    const { error } = await supabase
      .from("cafes")
      .update({
        processed,
        processed_at: new Date().toISOString(),
        address: formattedAddress,
        lat_long: lat_long,
        preview_image: bunnyUrl,
        google_rating: rating,
        open_hours: openHours,
        maps_data: {
          ...placeDetails,
          photos: photoUrls
        },
        status: 'PROCESSED'
      })
      .eq("id", cafe.id);

    if (error) {
      console.error(`⚠️ Error updating cafe: ${cafe.name}`, error);
    }
  
    console.log(`🎉 processed ${cafe.name}`);
  }

  console.log(`✅ finished processing ${cafes.length} cafes`);

  return NextResponse.json({ message: "success" });
}
