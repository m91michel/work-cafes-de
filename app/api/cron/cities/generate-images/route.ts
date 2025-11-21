import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";
import { enqueue } from "@/libs/jobs";
import { uniq } from "lodash";

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

  console.log(`⚡️ start enqueuing city image generation jobs (limit: ${limit})`);

  const { data: cities = [], error } = await supabase
    .from("cities")
    .select("name_de, name_en, slug, status")
    .is("preview_image", null)
    .in("status", ["NEW", "READY", "PUBLISHED"])
    .order("population", { ascending: false })
    .limit(limit);

  if (cities === null || cities === undefined || error) {
    console.error("⚠️ Error fetching cities", error);
    return NextResponse.json({ error: "Error fetching cities" });
  }

  let enqueued = 0;
  for (const city of cities) {
    const cityName = city.name_en || city.name_de;
    if (!cityName || !city.slug) {
      console.error("⚠️ City name or slug is null", city);
      continue;
    }

    try {
      await enqueue.cityGenerateImage(city.slug);
      enqueued++;
    } catch (error) {
      console.error(`⚠️ Error enqueuing job for ${cityName}:`, error);
    }
  }

  const citySlugs = uniq(cities.map((city) => city.slug)).join(", ");
  console.log(`✅ finished enqueuing ${enqueued} city image generation jobs for ${citySlugs}`);

  return NextResponse.json({ 
    message: "success",
    enqueued,
    total: cities.length 
  });
}
