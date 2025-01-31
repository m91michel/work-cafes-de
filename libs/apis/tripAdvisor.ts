import axios from "axios";

const API_KEY = process.env.TRIPADVISOR_API_KEY;

export type TripAdvisorSearchParams = {
  searchQuery: string;
  language?: string;
};

interface TripAdvisorSearchResponse {
  data: Array<{
    location_id: string;
    name: string;
    address_obj: {
      street1: string;
      street2: string | null;
      city: string;
      state: string | null;
      country: string;
      postalcode: string;
    };
    latitude: string;
    longitude: string;
    category: {
      key: string;
      name: string;
    };
  }>;
}

export async function searchTripAdvisorLocation(
  params: TripAdvisorSearchParams
) {
  const { searchQuery, language = "de" } = params;
  console.log(`⚡️ searching TripAdvisor location for "${searchQuery}"`);

  if (!API_KEY || !searchQuery) {
    console.log("❌ API_KEY or searchQuery is missing");
    return null;
  }

  try {
      const response = await axios.get<TripAdvisorSearchResponse>(
      "https://api.content.tripadvisor.com/api/v1/location/search",
      {
        params: {
          key: API_KEY,
          searchQuery,
          category: "coffee_tea",
          language,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.status !== 200) {
      console.error("Error searching TripAdvisor location:", response.data);
    }

    return response.data.data;
  } catch (error) {
    console.error("Error searching TripAdvisor location:", error);
    return null;
  }
}
