import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken, generateSlug } from "@/libs/utils";
import { GoogleMapsCandidate, GoogleMapsPlace, searchPlaces } from "@/libs/google-maps";

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

  const { data: cities = [], error } = await supabase
    .from("cities")
    .select("*")
    .eq("status", "NEW")
    .limit(limit);

  if (cities === null || cities === undefined || error) {
    console.error("⚠️ Error fetching cafes", error);
    return NextResponse.json({ error: "Error fetching cafes" });
  }

  for (const city of cities) {
    if (!city.name) {
      console.error("⚠️ City name is null", city);
      continue;
    }

    const places = await searchPlaces(`cafe zum arbeiten in ${city.name}`, { type: "cafe" });

    if (places === null || places === undefined) {
      console.error("⚠️ Error searching for cafes", places);
      continue;
    }

    for (const place of places) {
      if (!isInCity(place, city.name)) {
        console.log(`⚠️ ${place.formatted_address} is not in ${city.name}`);
        continue;
      }

      // check if its operational
      if (place.business_status !== "OPERATIONAL") {
        console.log(`⚠️ ${place.formatted_address} is not operational`);
        continue;
      }

      const formattedAddress = place.formatted_address;
      const lat_long = `${place.geometry?.location?.lat},${place.geometry?.location?.lng}`;
      const rating = place.rating;
      const google_place_id = place.place_id;
      const slug = generateSlug(`${place.name}-${city.slug}`);

      const { data, error } = await supabase
        .from("cafes")
        .upsert({
          name: place.name,
          city_slug: city.slug,
          city: city.name,
          address: formattedAddress,
          slug: slug,
          lat_long: lat_long,
          google_rating: rating,
          google_place_id: google_place_id,
          status: "NEW",
        }, {
          onConflict: 'google_place_id',
          ignoreDuplicates: true,
        })
        .select("id")
        .maybeSingle();

      if (error) {
        console.error("⚠️ Error inserting cafe", error);
        continue;
      }

      console.log(`🎉 processed ${place.name} (${data?.id})`);
    }
  }

  console.log(`✅ finished search for new cafes in ${cities.length} cities`);

  return NextResponse.json({ message: "success" });
}

export function isInCity(place: GoogleMapsPlace, cityName: string): boolean {
  if (!place.formatted_address) return false;
  
  // Convert to lowercase and remove special characters for comparison
  const normalizedAddress = place.formatted_address.toLowerCase();
  const normalizedCity = cityName.toLowerCase();
  
  return normalizedAddress.includes(normalizedCity);
}