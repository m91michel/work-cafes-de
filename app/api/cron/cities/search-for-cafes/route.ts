import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken, generateSlug } from "@/libs/utils";
import { GoogleMapsPlace, searchPlaces } from "@/libs/google-maps";
import { sendMessage } from "@/libs/telegram";
import { Cafe } from "@/libs/types";
import { uniq } from "lodash";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const maxDuration = 60;

const LIMIT = 1;

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") || LIMIT);
  const citySlug = searchParams.get("citySlug");

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  console.log(`⚡️ start processing cafes (limit: ${limit}, citySlug: ${citySlug})`);

   const query = supabase
    .from("cities")
    .select("*", { count: "exact" })
    .order("population", { ascending: true })
    .order("status", { ascending: false }) // Boosted cities first
    .limit(limit);

  if (citySlug) {
    query.eq("slug", citySlug);
  } else {
    query.in("status", ["READY", "BOOSTED"])
  }

  const { data: cities = [], error, count: cityCount } = await query;

  if (cities === null || cities === undefined || error) {
    console.error("⚠️ Error fetching cafes", error);
    return NextResponse.json({ error: "Error fetching cafes" });
  }

  for (const city of cities) {
    let cafesAdded = 0;
    let cafesWithError: string[] = [];
    let firstAddress = "";
    console.log(`⚡️ start processing ${city.name_en} (${city.slug})`);


    const DACH_COUNTRIES = ["DE", "AT", "CH"];
    const isDACHCountry = DACH_COUNTRIES.includes(city.country_code || "");
    const cityName = isDACHCountry ? city.name_de : city.name_en;

    if (!cityName) {
      console.error("⚠️ City name is null", city);
      continue;
    }
    const searchQuery = isDACHCountry
      ? `cafe zum arbeiten in ${cityName}`
      : `cafe for working in ${cityName}`;
    const places = await searchPlaces(searchQuery, { type: "cafe" });

    if (places === null || places === undefined) {
      console.error("⚠️ Error searching for cafes", places);
      continue;
    }

    for (const [index, place] of places.entries()) {
      const cityNames = [city.name_local, cityName].filter(Boolean) as string[];
      if (!isInCity(place, cityNames)) {
        console.log(`⚠️ ${place.formatted_address} is not in ${city.name_local || cityName}`);
        firstAddress = place.formatted_address || "";
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
        user_ratings_total: place.user_ratings_total,
        price_level: place.price_level,
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

      cafesAdded++;
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

    if (cafesAdded === 0) {
      console.log(`⚠️ No cafes added for ${city.name_en}`);
      await sendMessage(
        `⚠️ No cafes added for ${city.name_en}: \n\n- ${cafesWithError.join(
          "\n- "
        )} \n\nAddress: ${firstAddress}`
      );
    }
    const status = cafesAdded > 0 ? "PROCESSING" : "CHECK!";
    await supabase
      .from("cities")
      .update({ status: status })
      .eq("slug", city.slug);
  }

  const cityNames = uniq(cities.map((city) => city.name_en)).join(", ");
  const citiesLeft = cityCount ? cityCount - cities.length : 0;
  console.log(`✅ finished search for new cafes in ${cityNames}. ${citiesLeft} cities left`);

  return NextResponse.json({ message: "success" });
}

function isInCity(place: GoogleMapsPlace, cityNames: string[]): boolean {
  if (!place.formatted_address) return false;
  if (!cityNames || cityNames.length == 0) return false

  // Convert to lowercase and remove special characters for comparison
  const normalizedAddress = place.formatted_address.toLowerCase();
  for (const name of cityNames) { 
    const normalizedCity = name.replace("City", "").trim().toLowerCase();
    if (normalizedAddress.includes(normalizedCity)) {
      return true
    }
  }

  return false
}
