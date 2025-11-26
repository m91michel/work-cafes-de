import axios from "axios";

// curl -X GET "https://api.app.outscraper.com/maps/reviews-v3?query=The%20NoMad%20Restaurant,%20NY,%20USA&reviewsLimit=3" -H  "X-API-KEY: YOUR-API-KEY"

export type OutscraperReviewsParams = {
  id: string;
  offset?: number;
  sort?: "most_relevant" | "newest" | "highest_rating" | "lowest_rating";
  keywords?: string;
  reviewsLimit?: number;
  language?: string;
  ignoreEmpty?: boolean;
  async?: boolean;
};

export async function outscraperReviewsTask(params?: OutscraperReviewsParams) {
  const {
    id,
    offset,
    sort = "most_relevant",
    keywords,
    reviewsLimit = 10,
    language,
    async = true,
    ignoreEmpty = true,
  } = params || {};

  if (!id) {
    console.error("ID is required");
    return null;
  }

  console.log("starting outscraper task with params:", {
    id,
    keywords,
    reviewsLimit,
  });

  try {
    const response = await axios.get(
      "https://api.app.outscraper.com/maps/reviews-v3",
      {
        params: {
          query: id,
          reviewsLimit,
          sort,
          offset,
          reviewsQuery: keywords,
          language,
          ignoreEmpty,
          async: async,
        },
        headers: {
          "X-API-KEY": process.env.OUTSCRAPER_API_KEY,
        },
      }
    );

    if (response.status === 200 || response.status === 202) {
      console.log("outscraper task id:", response.data.id);
      return response.data;
    }

    console.log("outscraper task error", response.data, response.status);
    return null;
  } catch (error) {
    console.error("error fetching outscraper reviews", error);
    return null;
  }
}

type OutscraperRequestBody = {
  id: string;
  status: string;
  data: OutscraperRequestData[];
};

type OutscraperRequestData = {
  query: string;
  name: string;
  place_id: string;
  reviews_data: OutscraperReview[];
};
export type OutscraperReview = {
  google_id: string;
  review_id: string;
  author_title: string;
  author_link: string;
  author_image: string;
  review_text: string;
  review_rating: number;
  review_link: string;
  review_datetime_utc: string;
  review_timestamp: number;
  translated: boolean;
  original_language: string;
  review_questions: Record<string, string>;
};
// example: https://api.app.outscraper.com/requests/a-44cab432-54db-4d56-b81c-f97b51bee451
export async function fetchOutscraperResult(url: string) {
  console.log(`⚡️ fetching outscraper result from ${url}`);
  const response = await axios.get<OutscraperRequestBody>(url);
  return response.data;
}

export type OutscraperBalanceResponse = {
  balance?: number;
  quota?: {
    [productName: string]: {
      limit?: number;
      used?: number;
      remaining?: number;
    };
  };
};

export async function fetchOutscraperBalance(): Promise<OutscraperBalanceResponse | null> {
  if (!process.env.OUTSCRAPER_API_KEY) {
    console.error("OUTSCRAPER_API_KEY is not set");
    return null;
  }

  try {
    // Try the balance endpoint
    const response = await axios.get(
      "https://api.outscraper.cloud/profile/balance",
      {
        headers: {
          "X-API-KEY": process.env.OUTSCRAPER_API_KEY,
        },
      }
    );

    console.log("outscraper balance response", response.data);

    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch (error: any) {
    // If balance endpoint doesn't exist, return null
    // We'll track usage from webhook data instead
    if (error.response?.status === 404) {
      console.log("Outscraper balance endpoint not available, will track from webhooks");
    } else {
      console.error("error fetching outscraper balance", error);
    }
    return null;
  }
}
