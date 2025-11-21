import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";
import { searchCafesForCity } from "@/libs/jobs/city/city-search-for-cafes";
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
    try {
      await searchCafesForCity(city);
    } catch (error) {
      console.error(`⚠️ Error processing city ${city.name_en || city.name_de}:`, error);
    }
  }

  const cityNames = uniq(cities.map((city) => city.name_en || city.name_de).filter(Boolean)).join(", ");
  const citiesLeft = cityCount ? cityCount - cities.length : 0;
  console.log(`✅ finished search for new cafes in ${cityNames}. ${citiesLeft} cities left`);

  return NextResponse.json({ message: "success" });
}
