import { getPlaceDetails, searchInGoogleMaps } from "../../libs/google-maps";
import { input } from "@inquirer/prompts";
import { Command } from "..";
import { outscraperReviewsTask } from "../../libs/apis/outscraper";
import { reviewKeywords } from "../../app/api/_utils/reviews";
import { fetchScrapingdogGoogleMapsReviews } from "../../libs/apis/scrapingdog";
import { Database } from "@/types_db";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  db: { schema: "cafeforwork" },
});

const searchForPlace = async () => {
  const query = await input({
    message: "Enter the search query",
  });
  const placeDetails = await searchInGoogleMaps(query);
  console.log(placeDetails);
};

const getDetails = async () => {
  const placeId = await input({
    message: "Enter the place id",
  });
  const placeDetails = await getPlaceDetails(placeId, { language: "en" });
  console.log(placeDetails);
};

export const googleMapsActions: Command[] = [
  {
    name: "🔍 Google Maps: Search for Place",
    key: "google-maps-search",
    action: searchForPlace,
  },
  {
    name: "🌐 Google Maps: Get Place Details",
    key: "google-maps-get-details",
    action: getDetails,
  },
  {
    name: "🌐 Outscraper: Trigger Task",
    key: "outscraper-trigger-task",
    action: async () => {
      const placeId = await input({
        message: "Enter the place id",
      });
      for (const keyword of reviewKeywords) {
        const reviews = await outscraperReviewsTask({
          id: placeId,
          keywords: keyword,
        });
        console.log(reviews);
      }
    },
  },
  {
    name: "🌐 Scrapingdog: Trigger Task",
    key: "scrapingdog-trigger-task",
    action: async () => {
      const placeId = await input({
        message: "Enter the place id",
      });
      const reviews = await fetchScrapingdogGoogleMapsReviews({
        data_id: placeId,
      });
      console.log(reviews);
    },
  },
  {
    name: "📝 Reviews: Migrate Reviews",
    key: "reviews-migrate",
    action: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .is("published_at", null);

      if (error) {
        console.error("Error fetching reviews", error);
        return;
      }

      console.log(`⚡️ Processing ${data.length} reviews`);

      for (const review of data) {
        const { error } = await supabase
          .from("reviews")
          .update({
            published_at: review.updated_at,
          })
          .eq("id", review.id);

        if (error) {
          console.error("Error updating review", error);
        }
      }
    },
  },
];
