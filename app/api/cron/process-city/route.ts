import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";
import { generateCityDescription } from "@/libs/openai/generate-citiy-description";
import dayjs from "dayjs";
import { City } from "@/libs/types";

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

  console.log(`⚡️ start processing cities (limit: ${limit})`);

  const { data: cities = [], error } = await supabase
    .from("cities")
    .select("*")
    .is("preview_image", null)
    .eq("status", "NEW")
    .order("population", { ascending: false })
    .limit(limit);

  if (cities === null || cities === undefined || error) {
    console.error("⚠️ Error fetching cities", error);
    return NextResponse.json({ error: "Error fetching cities" });
  }

  let processed = 0;
  for (const city of cities) {
    const cityName = city.name_en || city.name_de;
    
    if (!cityName) {
      console.error("⚠️ City name is null", city);
      continue;
    }

    let description_short_de = null;
    let description_short_en = null;
    let description_long_de = null;
    let description_long_en = null;

    const result_en = await generateCityDescription(city, "de");
    if (!result_en) {
      console.error(`⚠️ Error generating city description for ${city.name_en}`);
      setCityAsProcessed(city);
      continue;
    }
    description_short_en = result_en.description_short;
    description_long_en = result_en.description_long;

    const result_de = await generateCityDescription(city, "en");
    if (!result_de) {
      console.error(`⚠️ Error generating city description for ${city.name_de}`);
      setCityAsProcessed(city);
      continue;
    }
    description_short_de = result_de.description_short;
    description_long_de = result_de.description_long;

    const { error: updateError } = await supabase
      .from("cities")
      .update({
        name_de: city.name_de || result_de.name,
        name_en: city.name_en || result_en.name,
        state: city.state || result_en.state,
        description_short_de,
        description_short_en,
        description_long_de,
        description_long_en,
        processed_at: dayjs().toISOString(),
        status: "READY",
      })
      .eq("slug", city.slug);

    if (updateError) {
      console.error(`⚠️ Error updating city ${city.name_de}:`, updateError);
    }

    processed++;
  }

  console.log(`✅ finished processing ${processed}/${cities.length} cities`);

  return NextResponse.json({ message: "success" });
}


async function setCityAsProcessed(city: City) {
  const { error: updateError } = await supabase
    .from("cities")
    .update({
      processed_at: dayjs().toISOString(),
    })
    .eq("slug", city.slug);

  if (updateError) {
    console.log(`❌ city not updated for ${city.name_en}`);
  }
}