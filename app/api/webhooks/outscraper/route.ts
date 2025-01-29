import {
  fetchOutscraperResult,
  OutscraperReview,
} from "@/libs/apis/outscraper";
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/libs/supabase/supabaseClient";
import dayjs from "dayjs";
import { Review } from "@/libs/types";

/* Example request body
{
  id: 'a-44cab432-54db-4d56-b81c-f97b51bee451',
  user_id: 'e502bde6b0714ca5a0e4fcc1c8872cc4',
  status: 'SUCCESS',
  api_task: true,
  results_location: 'https://api.app.outscraper.com/requests/a-44cab432-54db-4d56-b81c-f97b51bee451',
  quota_usage: [ { product_name: 'Google Maps Reviews', quantity: 250 } ]
}
*/

type OutscraperRequestBody = {
  id: string;
  user_id: string;
  status: string;
  api_task: boolean;
  results_location: string;
  quota_usage: { product_name: string; quantity: number }[];
};

export async function POST(request: NextRequest) {
  const body: OutscraperRequestBody = await request.json();

  console.log(`⚡️ start processing request`, body);
  const { results_location } = body;

  console.log(`⚡️ url`, results_location);

  const result = await fetchOutscraperResult(results_location);

  for (const [index, location] of (result.data || []).entries()) {
    const { reviews_data = [], ...locationData } = location;
    console.log(`⚡️ processing review from ${locationData.place_id} (${index+1}/${result.data.length}) with ${reviews_data.length} reviews`);
  
    // Get cafe id
    const { data: cafe, error: cafeError } = await supabase
      .from("cafes")
      .select("id, name,google_place_id,review_count,processed")
      .eq("google_place_id", locationData.place_id)
      .maybeSingle();

    let reviewCountAdded = 0;

    console.log(`⚡️ cafe`, cafe);

    if (cafeError) {
      console.error("Error fetching cafe", cafeError);
    }

    if (!cafe) {
      console.error("Cafe not found", locationData.place_id);
      continue;
    }

    // Insert reviews
    for (const review of reviews_data) {
      console.log(`⚡️ processing review from ${review.author_title}`, review.review_id);
      const { error } = await supabase.from("reviews").upsert(
        {
          cafe_id: cafe?.id,
          ...mapOutscraperReviewToSupabaseReview(review),
        },
        {
          onConflict: "source_id",
          ignoreDuplicates: true,
        }
      );

      if (error) {
        console.error(`Error inserting review from ${review.author_title} ${review.review_id}`, error);
        continue;
      }

      reviewCountAdded++;
    }

    const reviewCount = (cafe?.review_count || 0) + reviewCountAdded;
    const processed = {
      ...(typeof cafe?.processed === 'object' && cafe?.processed !== null ? cafe?.processed : {}),
      google_reviews_at: dayjs().toISOString(),
    };
    // Update cafe review count
    const { error } = await supabase
      .from("cafes")
      .update({
        review_count: reviewCount,
        processed,
        processed_at: dayjs().toISOString(),
      })
      .eq("google_place_id", locationData.place_id);

    if (error) {
      console.error("Error updating cafe", error);
    }

    console.log(`✅ ${cafe?.name} finished processing ${reviews_data.length} reviews`);
  }

  return NextResponse.json({ message: "success" });
}

const mapOutscraperReviewToSupabaseReview = (
  review: OutscraperReview
): Partial<Review> => {
  let text: Partial<Review> = {};

  switch (review.original_language) {
    case "en":
      text = {
        text_en: review.review_text,
      };
      break;
    case "de":
      text = {
        text_de: review.review_text,
      };
      break;
    default:
      text = {
        text_original: review.review_text,
      };
      break;
  }

  return {
    author_name: review.author_title,
    author_url: review.author_link,
    author_image: review.author_image,
    language: review.original_language?.toLowerCase(),
    rating: review.review_rating,
    source: "Google Maps",
    source_url: review.review_link,
    published_at: dayjs(review.review_datetime_utc).toISOString(),
    source_id: review.review_id,
    ...text,
  };
};
