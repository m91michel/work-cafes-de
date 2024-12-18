import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { uploadImagesToBunny } from "@/libs/bunny";
import { getPlaceDetails } from "@/libs/google-maps";
import { Cafe } from "@/libs/types";
import { processOpenHours } from "@/libs/openai/process-open-hours";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const showLogs = searchParams.get("showLogs") === "true";
  const limit = Number(searchParams.get("limit") || "2");

  if (isProd) {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  const { data: cafes } = await supabase
    .from("cafes")
    .select("*")
    .is("preview_image", null)
    .neq("google_place_id", null)
    .eq("status", "NEW")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!cafes) {
    return NextResponse.json({ message: "No cafes found" }, { status: 404 });
  }

  for (const cafe of cafes) {
    console.log(`⚡️ processing ${cafe.name} ${cafe.address}`);

    const placeId = cafe.google_place_id;
    if (!placeId) {
      console.log(`No place id found for ${cafe.name}`);
      await setCafeStatus(cafe, 'PROCESSED');
      continue;
    }

    const placeDetails = await getPlaceDetails(placeId);

    if (!placeDetails) {
      console.log(`No place details found for ${cafe.name}`);
      await setCafeStatus(cafe, 'PROCESSED');
      continue;
    }

    const photos = placeDetails.photos || [];
    const photoUrls: string[] = photos.map((photo: any) => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    });
    if (showLogs) console.log(`photoUrls: ${JSON.stringify(photoUrls, null, 2)}`);

    let bunnyUrl;
    if (photoUrls.length > 0) {
      const filename = `${cafe.slug}-thumb.jpg`;
      bunnyUrl = await uploadImagesToBunny(photoUrls[0], filename, 'cafes');
    }

    const formattedAddress = placeDetails.formatted_address;
    const lat_long = `${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}`;
    const rating = placeDetails.rating;
    const weekdayText = placeDetails.opening_hours?.weekday_text;
    let openHours = weekdayText?.join("\n");

    if (openHours) {
      openHours = await processOpenHours(openHours);
    }
    
    const { error } = await supabase
      .from("cafes")
      .update({
        google_place_id: placeId,
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
        processed: {
          ...(typeof cafe.processed === 'object' && cafe.processed !== null ? cafe.processed : {}),
          open_hours_at: new Date().toISOString(),
        },
        status: 'PROCESSED'
      })
      .eq("id", cafe.id);

    if (error) {
      console.log(`⚠️ Error updating cafe: ${cafe.name}`, error);
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

async function setCafeStatus(cafe: Pick<Cafe, 'slug' | 'name'>, status: 'PROCESSED' | 'PUBLISHED') {
  const { error } = await supabase
    .from("cafes")
    .update({ status })
    .eq("slug", cafe.slug || "");

  if (error) {
    console.log(`⚠️ Error updating cafe: ${cafe.name}`, error);
  }
}