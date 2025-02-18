import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken, formatLinks, mergeObjects } from "@/libs/utils";
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

  const { data: cafes = [], error, count } = await supabase
    .from("cafes")
    .select("*", { count: "exact" })
    .not("google_place_id", "is", null)
    .eq("status", "NEW")
    .gte("review_count", 1) // only process cafes with at least 1 review
    .is("processed->google_details_at", null)
    .order("created_at", { ascending: true })
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
      console.log(`📸 uploaded image for ${cafe.name}`);
    }

    const formattedAddress = placeDetails.formatted_address;
    const lat_long = `${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}`;
    const rating = placeDetails.rating;
    const weekdayText = placeDetails.opening_hours?.weekday_text;
    const website = placeDetails.website && `Website: ${placeDetails.website}`;
    let openHours = weekdayText?.join("\n");

    if (openHours) {
      openHours = await processOpenHours(openHours);
      console.log(`📅 processed open hours for ${cafe.name}`);
    }
    
    const { error } = await supabase
      .from("cafes")
      .update({
        processed: mergeObjects(cafe?.processed, {
          google_details_at: dayjs().toISOString(),
        }),
        processed_at: dayjs().toISOString(),
        address: formattedAddress,
        lat_long: lat_long,
        preview_image: bunnyUrl,
        google_rating: rating,
        open_hours: openHours,
        website_url: formatLinks(placeDetails.website),
        links: website,
        user_ratings_total: placeDetails.user_ratings_total,
        price_level: placeDetails.price_level,
        maps_data: {
          ...placeDetails as any,
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

  const cities = cafes.map((cafe) => cafe.city_slug).join(", ");
  console.log(`✅ finished processing ${cafes.length} cafes (left: ${count}) in ${cities}`);

  return NextResponse.json({ message: "success" });
}
