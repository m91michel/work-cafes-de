import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";

export const maxDuration = 60;

const LIMIT = 300;

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit")) || LIMIT;

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const {
    data: countries = [],
    error,
    count = 0,
  } = await supabase
    .from("countries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: true })
    .limit(limit);

  if (countries === null || countries === undefined || error) {
    console.error("⚠️ Error fetching countries", error);
    return NextResponse.json({ error: "Error fetching countries" });
  }

  let activeCountries = 0;
  let updatedCountries = 0;
  for (const country of countries) {
    if (!country.name) {
      console.error("⚠️ Country name is null", country);
      continue;
    }

    const { data: cities = [] } = await supabase
      .from("cities")
      .select("*")
      .eq("country", country.name)
      .eq("status", "PUBLISHED")
      .order("created_at", { ascending: true });

    if (cities === null || cities === undefined) {
      console.error("⚠️ Error fetching cities for country", country);
      continue;
    }

    const status = cities.length > 0 ? "ACTIVE" : country.status;
    if (status === "ACTIVE") {
      activeCountries++;
    }
    if (country.city_count === cities.length && country.status === status) {
      console.log(`👍 ${country.name} is up to date`);
      continue;
    }

    
    const { error } = await supabase
      .from("countries")
      .update({
        city_count: cities.length,
        status,
      })
      .eq("name", country.name);

    if (error) {
      console.error("⚠️ Error updating country", error);
      continue;
    }

    console.log(
      `✅ updated country ${country.name} (count: ${cities.length}, status: ${status})`
    );

    updatedCountries++;
  }

  console.log(
    `✅ finished processing ${updatedCountries}/${countries.length} countries. Active: ${activeCountries}. Total: ${count} countries`
  );

  return NextResponse.json({ message: "success" });
}
