import {
  fetchOutscraperResult,
  OutscraperReview,
} from "@/libs/apis/outscraper";
import { NextRequest, NextResponse } from "next/server";
import { containsWorkingKeywords } from "../../_utils/reviews";
import supabase from "@/libs/supabase/supabaseClient";
import { Database } from "@/types_db";

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

  const result = await fetchOutscraperResult(results_location);

  const { reviews_data = [], ...locationData } = result.data[0];

  console.log(locationData);

  // Get cafe id
  const { data: cafeData } = await supabase
    .from("cafes")
    .select("id, google_place_id")
    .eq("google_place_id", locationData.place_id)
    .maybeSingle();

  // Insert reviews
  for (const review of reviews_data) {
    const { error } = await supabase
      .from("reviews")
      .upsert({
        cafe_id: cafeData?.id,
        ...mapOutscraperReviewToSupabaseReview(review),
      }, {
        onConflict: 'text,source'
      })

    if (error) {
      console.error("Error inserting review", error);
    }
  }

  // Update cafe review count
  const { error } = await supabase
    .from("cafes")
    .update({
      review_count: reviews_data.length || 0,
    })
    .eq("google_place_id", locationData.place_id);

  if (error) {
    console.error("Error updating cafe", error);
  }

  return NextResponse.json({ message: "success" });
}

type SupabaseReview = Partial<
  Database["cafeforwork"]["Tables"]["reviews"]["Row"]
>;
const mapOutscraperReviewToSupabaseReview = (
  review: OutscraperReview
): SupabaseReview => {
  return {
    author_name: review.author_name,
    language: review.language,
    rating: review.rating,
    source: "Google Maps",
    source_url: review.author_url,
    text: review.review_text,
  };
};
