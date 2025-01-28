import { fetchOutscraperResult, OutscraperReview } from "@/libs/apis/outscraper";
import { NextRequest, NextResponse } from "next/server";
import { containsWorkingKeywords } from "../../_utils/reviews";
import supabase from "@/libs/supabase/supabaseClient";

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

  const workingReviews = (reviews_data ?? []).filter((review: OutscraperReview) =>
    containsWorkingKeywords(review.review_text)
  );

  console.log(locationData);

  const { error } = await supabase
    .from("cafes")
    .update({
      google_reviews: reviews_data,
      filtered_reviews: workingReviews,
      processed_at: new Date().toISOString(),
    })
    .eq("google_place_id", locationData.place_id);

  if (error) {
    console.error("Error updating cafe", error);
  }

  return NextResponse.json({ message: "success" });
}
