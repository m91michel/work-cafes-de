import axios from "axios";
import { Cafe } from "./types";

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

export async function searchInGoogleMaps(cafe: Cafe) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        params: {
          input: `${cafe.name} ${cafe.city}`,
          inputtype: "textquery",
          fields:
            "place_id,photos,formatted_address,name,rating,opening_hours,geometry",
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    return response.data;
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
