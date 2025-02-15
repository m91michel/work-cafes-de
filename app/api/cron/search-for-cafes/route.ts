import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken, generateSlug } from "@/libs/utils";
import { GoogleMapsPlace, searchPlaces } from "@/libs/google-maps";
import { sendMessage } from "@/libs/telegram";
import { Cafe } from "@/libs/types";

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
    .order("population", { ascending: false })
    .limit(limit);

  if (cities === null || cities === undefined || error) {
    console.error("⚠️ Error fetching cafes", error);
    return NextResponse.json({ error: "Error fetching cafes" });
  }

  for (const city of cities) {
    let cafesWithError: string[] = [];
    if (!city.name_de) {
      console.error("⚠️ City name is null", city);
      continue;
    }

    const isGermany = city.country === "Germany";
    const cityName = isGermany ? city.name_de : city.name_en;
    if (!cityName) {
      console.error("⚠️ City name is null", city);
      continue;
    }
    const searchQuery = isGermany
      ? `cafe zum arbeiten in ${cityName}`
      : `cafe for working in ${cityName}`;
    const places = await searchPlaces(searchQuery, { type: "cafe" });

    if (places === null || places === undefined) {
      console.error("⚠️ Error searching for cafes", places);
      continue;
    }

    for (const [index, place] of places.entries()) {
      if (!isInCity(place, cityName)) {
        console.log(`⚠️ ${place.formatted_address} is not in ${cityName}`);
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

      const attributes: Partial<Cafe> = {
        name: place.name,
        city_slug: city.slug,
        city: city.name_de,
        address: formattedAddress,
        slug: slug,
        lat_long: lat_long,
        google_rating: rating,
        google_place_id: google_place_id,
      };

      const { data, error } = await supabase
        .from("cafes")
        .upsert(
          {
            ...attributes,
            status: "NEW",
          },
          {
            onConflict: "google_place_id",
            ignoreDuplicates: true,
          }
        )
        .select("id")
        .maybeSingle();

      if (error && error.code === "23505") {
        console.log(`💭 Handling key violation for cafe`, error);

        const slug = generateSlug(`${place.name}-${city.slug}-${index}`);

        const { error: duplicateError } = await supabase
          .from("cafes")
          .upsert(
            {
              ...attributes,
              slug: slug,
              status: "DUPLICATE",
            },
            {
              onConflict: "google_place_id",
              ignoreDuplicates: true,
            }
          )
          .select("id")
          .maybeSingle();

        if (duplicateError) {
          console.error("⚠️ Error inserting cafe", duplicateError);
          cafesWithError.push(`✴️ ${place.name} (${slug})`);
        } else {
          console.log(`✴️ duplicate cafe ${place.name} (${slug})`);
        }

        continue;
      } else if (error) {
        console.error(
          `⚠️ Unknown error inserting cafe ${place.name} in ${city.name_en}`,
          error
        );
        cafesWithError.push(`❌ ${place.name} (${slug})`);
        continue;
      }

      console.log(`🎉 processed ${place.name} (${data?.id})`);
    }

    if (cafesWithError.length > 0) {
      console.log(`⚠️ Cafes with errors: ${cafesWithError.length}`);
      await sendMessage(
        `⚠️ Cafes with errors in ${city.name_en}: \n\n- ${cafesWithError.join(
          "\n- "
        )}`
      );
    }

    await supabase
      .from("cities")
      .update({ status: "PROCESSING" })
      .eq("slug", city.slug);
  }

  console.log(`✅ finished search for new cafes in ${cities.length} cities`);

  return NextResponse.json({ message: "success" });
}

function isInCity(place: GoogleMapsPlace, cityName: string): boolean {
  if (!place.formatted_address) return false;

  // Convert to lowercase and remove special characters for comparison
  const normalizedAddress = place.formatted_address.toLowerCase();
  const normalizedCity = cityName.replace("City", "").trim().toLowerCase();

  return normalizedAddress.includes(normalizedCity);
}
