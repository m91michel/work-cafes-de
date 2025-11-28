import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken, mergeObjects } from "@/libs/utils";
import { analyzeReviews } from "@/libs/openai/analyze-reviews";
import dayjs from "dayjs";
import { updateCafeCount } from "@/libs/supabase/cities";
import { uniq } from "lodash";
import { prepareReviews } from "@/libs/review-utils";
import { enqueueJob as enqueueUpdateCafeStats } from "@/libs/jobs/city/update-cafe-stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const maxDuration = 120;

const LIMIT = 1;

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") || LIMIT);

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  console.log(`⚡️ start processing cafes (limit: ${limit})`);

  const {
    data: cafes = [],
    error,
    count,
  } = await supabase
    .from("cafes")
    .select("*", { count: "exact" })
    .eq("status", "PROCESSED")
    .is("processed->checked_reviews_at", null)
    .gte("review_count", 1)
    .is("checked", null)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (cafes === null || cafes === undefined || error) {
    console.error("⚠️ Error fetching cafes", error);
    return NextResponse.json({ error: "Error fetching cafes" });
  }
  console.log(cafes.length);

  let processedCount = 0;
  for (const cafe of cafes) {
    console.log(`⚡️ processing ${cafe.name} ${cafe.address}`);

    const { data: reviews = [], error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .eq("cafe_id", cafe.id)
      .order("created_at", { ascending: false });

    if (reviewsError || reviews === null) {
      console.error(`⚠️ Error fetching reviews: ${cafe.name}`, reviewsError);
      continue;
    }

    const gtpReviews = prepareReviews(reviews);

    const aiResult = await analyzeReviews(gtpReviews);

    console.log(aiResult);

    if (aiResult?.status) {
      const publishedAt =
        aiResult.status === "PUBLISHED" ? dayjs().toISOString() : null;

      const { error: updateError } = await supabase
        .from("cafes")
        .update({
          status: aiResult.status,
          wifi_qualitity: aiResult.wifi_quality,
          ambiance: aiResult.ambiance,
          seating_comfort: aiResult.seating_comfort,
          processed: mergeObjects(cafe?.processed, {
            checked_reviews_at: dayjs().toISOString(),
          }),
          checked: "AUTOMATED",
          processed_at: dayjs().toISOString(),
          published_at: publishedAt,
        })
        .eq("id", cafe.id);

      if (updateError) {
        console.error(`⚠️ Error updating cafe: ${cafe.name}`, updateError);
        continue;
      }

      // If cafe was published, enqueue a delayed job to update city cafe stats
      // The delay ensures we batch multiple cafe publications together
      // If another cafe is published within 5 minutes, the job will be replaced with a new 5-minute delay
      if (aiResult.status === "PUBLISHED" && cafe.city_slug) {
        await enqueueUpdateCafeStats(cafe.city_slug, 15);
      }

      processedCount++;
      console.log(`🎉 processed ${cafe.name}`);
    } else {
      console.error(`⚠️ Error analyzing reviews: ${cafe.name}`);
      continue;
    }
  }

  const cities = uniq(cafes.map((cafe) => cafe.city_slug)).join(", ");
  const cafesLeft = count ? count - processedCount : 0;

  console.log(
    `✅ finished processing ${processedCount}/${cafes.length} (left: ${cafesLeft}) cafes in ${cities}.`
  );

  return NextResponse.json({ message: "success" });
}


