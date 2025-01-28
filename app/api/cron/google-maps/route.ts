import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";
import { Review } from "@/libs/google-maps";
import { OutscraperReview, outscraperReviewsTask } from "@/libs/apis/outscraper";
import { containsWorkingKeywords, reviewKeywords } from "../../_utils/reviews";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    .select("id, google_place_id, name, address")
    .not("google_place_id", "is", null)
    .eq("filtered_reviews", [])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!cafes || error) {
    console.error("Error fetching cafes", error);
    return NextResponse.json({ error: "Error fetching cafes" }, { status: 500 });
  }

  for (const cafe of cafes) {
    console.log(`⚡️ processing ${cafe.name} ${cafe.address}`);
    if (!cafe.google_place_id) {
      console.log(`No google_place_id for ${cafe.name}`);
      continue;
    }

    const task = await outscraperReviewsTask({
      id: cafe.google_place_id,
      keywords: reviewKeywords.join("|"),
      async: true,
    });

    console.log("✅ Task created for", cafe.name, task);
  }

  console.log(`⚡️ finished processing ${cafes.length} cafes`);

  return NextResponse.json({ message: "success", cafes });
}
