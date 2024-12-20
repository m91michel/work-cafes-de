import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

export type GoogleMapsCandidate = {
  formatted_address: string;
  name: string;
  photos: any[];
  place_id: string;
  rating: number;
  opening_hours: any;
  geometry: any;
}

export async function searchInGoogleMaps(query: string): Promise<GoogleMapsCandidate[] | null> {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        params: {
          input: query,
          inputtype: "textquery",
          fields:
            "place_id,photos,formatted_address,name,rating,opening_hours,geometry",
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const data = response.data;

    if (!data || data?.candidates?.length === 0) {
      console.log(`No Google Maps data found for ${query}:`, data);
      return null;
    }

    if (data && data?.candidates?.length > 1) {
      console.log(`Multiple candidates found for ${query}:`, data);
      return data.candidates;
    }

    return data.candidates;
  } catch (error) {
    console.error(`Error fetching data from Google Places API:`, error);
    return null;
  }
}

export async function getPlaceDetails(placeId: string) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          fields: "photos,formatted_address,name,rating,opening_hours,geometry",
          language: "de",
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    return response.data.result;
  } catch (error) {
    console.error(
      `Error fetching place details from Google Places API:`,
      error
    );
    return null;
  }
}

export const locationLink = (query?: string | null, placeId?: string | null) => {
  if (!query || !placeId) return "";
  return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${placeId}`;
};

export const directionLink = (query?: string | null, placeId?: string | null) => {
  if (!query || !placeId) return "";
  return `https://www.google.com/maps/dir/?api=1&destination=${query}&query_place_id=${placeId}`;
};
