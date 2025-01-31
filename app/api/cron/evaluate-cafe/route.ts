import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";
import { Review } from "@/libs/types";
import { AIReview, analyzeReviews } from "@/libs/openai/analyze-reviews";
import dayjs from "dayjs";

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

  const { data: cafes = [], error } = await supabase
    .from("cafes")
    .select("*")
    .eq("status", "PROCESSED")
    .gte("review_count", 1)
    .order("review_count", { ascending: false })
    .limit(limit);

  if (cafes === null || cafes === undefined || error) {
    console.error("⚠️ Error fetching cafes", error);
    return NextResponse.json({ error: "Error fetching cafes" });
  }
  console.log(cafes.length);

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

    const processed = {
      ...(typeof cafe?.processed === "object" && cafe?.processed !== null
        ? cafe?.processed
        : {}),
      checked_reviews_at: dayjs().toISOString(),
    };

    if (aiResult?.status) {
      const { error: updateError } = await supabase
        .from("cafes")
        .update({
          status: aiResult.status,
          wifi_qualitity: aiResult.wifi_quality,
          ambiance: aiResult.ambiance,
          seating_comfort: aiResult.seating_comfort,
          processed,
          processed_at: new Date().toISOString(),
        })
        .eq("id", cafe.id);

      if (updateError) {
        console.error(`⚠️ Error updating cafe: ${cafe.name}`, updateError);
        continue;
      }

      console.log(`🎉 processed ${cafe.name}`);
    } else {
      console.error(`⚠️ Error analyzing reviews: ${cafe.name}`);
      continue;
    }
  }

  console.log(`✅ finished processing ${cafes.length} cafes`);

  return NextResponse.json({ message: "success" });
}

function prepareReviews(reviews: Review[]): AIReview[] {
  if (reviews.length === 0) {
    return [];
  }

  return reviews.map((review) => ({
    name: review.author_name || "",
    date: review.created_at || "",
    review: getReviewText(review),
  }));
}

function getReviewText(review: Review) {
  if(review.text_en) {
    return review.text_en;
  }

  if(review.text_de) {
    return review.text_de;
  }

  return review.text_original || "";
}