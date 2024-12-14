import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { uploadImagesToBunny } from "@/libs/bunny";
import { getPlaceDetails } from "@/libs/google-maps";

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
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!cafes) {
    return NextResponse.json({ message: "No cafes found" }, { status: 404 });
  }

  for (const cafe of cafes) {
    console.log(`processing ${cafe.name} ${cafe.address}`);

    const placeId = cafe.google_place_id;
    if (!placeId) {
      console.log(`No place id found for ${cafe.name}`);
      continue;
    }

    const placeDetails = await getPlaceDetails(placeId);
    console.log(`placeDetails: ${JSON.stringify(placeDetails, null, 2)}`);

    if (!placeDetails) {
      console.log(`No place details found for ${cafe.name}`);
      continue;
    }

    const photoUrls: string[] = placeDetails.photos.map((photo: any) => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    });
    if (showLogs) console.log(`photoUrls: ${JSON.stringify(photoUrls, null, 2)}`);

    const filename = `${cafe.slug}-thumb.jpg`;
    const bunnyUrl = await uploadImagesToBunny(photoUrls[0], filename, 'cafes');

    const formattedAddress = placeDetails.formatted_address;
    const lat_long = `${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}`;
    const rating = placeDetails.rating;
    
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
          ...placeDetails,
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