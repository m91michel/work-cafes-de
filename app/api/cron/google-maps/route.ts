import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";
import { getPlaceDetails, Review } from "@/libs/google-maps";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LIMIT = 10;

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
    .is("google_reviews", null)
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

    const englishPlaceDetails = await getPlaceDetails(cafe.google_place_id, { language: "en" });
    const germanPlaceDetails = await getPlaceDetails(cafe.google_place_id, { language: "de" });

    if (!englishPlaceDetails?.reviews) {
      console.log(`No english place details found for ${cafe.name}`);
    }
    if (!germanPlaceDetails?.reviews) {
      console.log(`No german place details found for ${cafe.name}`);
    }

    const englishReviews = englishPlaceDetails.reviews || [];
    const germanReviews = germanPlaceDetails.reviews || [];

    const reviews = [...englishReviews, ...germanReviews];
    const workingReviews = reviews.filter(containsWorkingKeywords);

    console.log(reviews);

    const { error } = await supabase
      .from("cafes")
      .update({
        google_reviews: reviews,
        filtered_reviews: workingReviews,
        processed_at: new Date().toISOString(),
      })
      .eq("id", cafe.id);

    if (error) {
      console.error("Error updating cafe", error);
    }
  }

  console.log(`⚡️ finished processing ${cafes.length} cafes`);

  return NextResponse.json({ message: "success", cafes });
}

function containsWorkingKeywords(review: Review) {
  const keywords = [
    // English terms
    "working", "wifi", "internet", "free", "free wifi", "free internet",
    // German terms
    "arbeiten", "internet", "kostenlos", "kostenloses wifi", "kostenloses internet",
    "steckdosen", "arbeitsplatz"
  ];
  return keywords.some(keyword => 
    review.text?.toLowerCase().includes(keyword.toLowerCase())
  );
}