import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken, formatLinks, mergeObjects } from "@/libs/utils";
import { getPlaceDetails } from "@/libs/google-maps";
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
    .eq("status", "PUBLISHED")
    .is("website_url", null)
    .is("links", null)
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

    const fields = "type,url,website,formatted_address,name,rating,geometry";
    const placeDetails = await getPlaceDetails(cafe.google_place_id, {
      fields,
    });

    if (!placeDetails) {
      console.error(`⚠️ No place details found for ${cafe.name}`);
      continue;
    }

    console.log(`⚡️ placeDetails: ${JSON.stringify(placeDetails)}`);
    const formattedAddress = placeDetails.formatted_address;
    if (formattedAddress !== cafe.address) {
      console.log(
        `⚡️ address has changes: ${cafe.address} -> ${formattedAddress}`
      );
    }
    const lat_long = `${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}`;
    if (lat_long !== cafe.lat_long) {
      console.log(`⚡️ lat_long has changes: ${cafe.lat_long} -> ${lat_long}`);
    }

    const rating = placeDetails.rating;
    if (rating !== cafe.google_rating) {
      console.log(`⚡️ rating has changes: ${cafe.google_rating} -> ${rating}`);
    }

    const website = formatLinks(placeDetails.website);
    console.log(`⚡️ placeDetails.website: ${placeDetails.website}`);
    if (website !== cafe.links) {
      console.log(`⚡️ links has changes: ${cafe.links} -> ${website}`);
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
        google_rating: rating,
        website_url: website,
      })
      .eq("id", cafe.id);

    if (error) {
      console.error(`⚠️ Error updating cafe: ${cafe.name}`, error);
    }

    console.log(`✅ finished processing ${cafe.name}`);
  }

  console.log(`✅ ${cafes.length} cafes`);

  return NextResponse.json({ message: "success" });
}
