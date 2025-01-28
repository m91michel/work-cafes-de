import axios from "axios";

const API_KEY = process.env.SCRAPINGDOG_API_KEY;

// https://www.searchapi.io/api/v1/search?api_key=S7frgUU5C1hQQTGfYZGhhvHj&engine=google_maps_reviews&place_id=ChIJPUga9bNVn0cRZwxC39wZedQ&
// https://www.searchapi.io/api/v1/search?api_key=S7frgUU5C1hQQTGfYZGhhvHj&engine=google_maps_reviews&place_id=ChIJbRUkiBo9ukcRUors4e5HL_c&search_query=wifi|working
// https://www.searchapi.io/api/v1/search?api_key=S7frgUU5C1hQQTGfYZGhhvHj&data_id=0x89c25a21fb011c85%3A0x33df10e49762f8e4&engine=google_maps_reviews

export type ScrapingdogGoogleMapsReviewsParams = {
  data_id: string;
  language?: string;
  sort_by?: "qualityScore" | "newestFirst" | "ratingHigh" | "ratingLow";
  topic_id?: string;
  next_page_token?: string;
};

export async function fetchScrapingdogGoogleMapsReviews(
  params: ScrapingdogGoogleMapsReviewsParams
) {
  console.log(
    `⚡️ fetching scrapingdog google maps reviews for ${params.data_id}`
  );

  const {
    data_id,
    language = "en",
    sort_by = "qualityScore",
    topic_id,
    next_page_token,
  } = params;

  if (!API_KEY || !data_id) {
    throw new Error("api_key and data_id are required parameters");
  }

  try {
    const response = await axios.get(
      "http://api.scrapingdog.com/google_maps/reviews",
      {
        params: {
          api_key: API_KEY,
          data_id,
          language,
          sort_by,
          ...(topic_id && { topic_id }),
          ...(next_page_token && { next_page_token }),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching Google Maps reviews:", error);
    throw error;
  }
}
