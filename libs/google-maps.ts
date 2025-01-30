import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

export type Review = {
  author_name?: string;
  author_url?: string;
  language?: string;
  original_language?: string;
  profile_photo_url?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
  time?: number;
  translated?: boolean;
};

export type GoogleMapsCandidate = {
  formatted_address?: string;
  name?: string;
  photos?: any[];
  place_id?: string;
  rating?: number;
  opening_hours?: any;
  geometry?: any;
  reviews?: Review[];
};

// search for one place
export async function searchInGoogleMaps(
  query: string
): Promise<GoogleMapsCandidate[] | null> {
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

type Options = {
  language?: string;
  fields?: string;
};

export async function getPlaceDetails(
  placeId?: string,
  options?: Options
) {
  if (!placeId) return null;

  const {
    language = "de",
    fields = "photos,formatted_address,name,rating,opening_hours,geometry,reviews",
  } = options || {};

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          fields: fields,
          language: language,
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

export const locationLink = (
  query?: string | null,
  placeId?: string | null
) => {
  if (!query || !placeId) return "";
  return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${placeId}`;
};

export const directionLink = (
  query?: string | null,
  placeId?: string | null
) => {
  if (!query || !placeId) return "";
  return `https://www.google.com/maps/dir/?api=1&destination=${query}&query_place_id=${placeId}`;
};

type SearchPlacesOptions = {
  language?: string;
  type?: string; // eg. cafe
  location?: string; // eg. 49.4747642,10.9872371
};

// search for multiple places
export async function searchPlaces(
  query: string,
  options?: SearchPlacesOptions
): Promise<GoogleMapsPlace[] | null> {
  const { language, type = "cafe", location } = options || {};
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: query,
          type: type,
          // radius - TODO: Check if this is needed
          language: language,
          location: location,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const data = response.data;

    if (!data || !data.results || data.results.length === 0) {
      console.log(`No Google Maps data found for ${query}:`, data);
      return null;
    }

    return data.results;
  } catch (error) {
    console.error(`Error fetching data from Google Places API:`, error);
    return null;
  }
}

export type GoogleMapsPlace = {
  business_status?: string;
  formatted_address?: string;
  geometry?: {
    location?: {
      lat?: number;
      lng?: number;
    };
  };
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  name?: string;
  opening_hours?: {
    open_now?: boolean;
  };
  photos?: any[];
  place_id?: string; // eg. ChIJzQjSIBxVn0cRAq1JBsrBUzE
  plus_code?: {
    compound_code?: string; // FXFP+WV Fürth
    global_code?: string; // 8FXGFXFP+WV
  };
  rating?: number;
  reference?: string;
  types?: string[];
  user_ratings_total?: number;
}