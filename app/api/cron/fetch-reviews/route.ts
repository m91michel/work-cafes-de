import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken, mergeObjects } from "@/libs/utils";
import { outscraperReviewsTask } from "@/libs/apis/outscraper";
import dayjs from "dayjs";
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

  const { data: cafes = [], error, count } = await supabase
    .from("cafes")
    .select("id, google_place_id, name, city_slug, address, review_count, processed", {
      count: "exact",
    })
    .not("google_place_id", "is", null)
    .is("processed->google_reviews_at", null)
    .eq("review_count", 0)
    .in("status", ["NEW", "DUPLICATE"])
    .order("created_at", { ascending: true })
    .limit(limit);

  if (!cafes || error) {
    console.error("Error fetching cafes", error);
    return NextResponse.json(
      { error: "Error fetching cafes" },
      { status: 500 }
    );
  }

  for (const cafe of cafes) {
    console.log(`⚡️ processing ${cafe.name} ${cafe.address}`);
    if (!cafe.google_place_id) {
      console.log(`No google_place_id for ${cafe.name}`);
      continue;
    }

    //@ts-ignore
    if (cafe.processed?.google_reviews_at) {
      console.log(`Skipping ${cafe.name} because it as already been processed`);
      continue;
    } else {
      await setProcessed(cafe);
    }

    const keywords = ["working", "wifi", "arbeiten", "wlan", "laptop"];
    for (const keyword of keywords) {
      await outscraperReviewsTask({
        id: cafe.google_place_id,
        keywords: keyword,
        async: true,
      });

      console.log(`✅ Task created for ${cafe.name} and keyword "${keyword}"`);
    }
  }

  const cities = cafes.map((cafe) => cafe.city_slug).join(", ");

  console.log(`✅ finished processing ${cafes.length} cafes (left: ${count}) in ${cities}`);

  return NextResponse.json({ message: "success", cafes });
}

async function setProcessed(cafe?: Pick<Cafe, "id" | "processed">) {
  if (!cafe) return;

  return await supabase
    .from("cafes")
    .update({
      processed: mergeObjects(cafe?.processed, {
        google_reviews_at: dayjs().toISOString(),
      }),
      processed_at: dayjs().toISOString(),
    })
    .eq("id", cafe.id);
}
