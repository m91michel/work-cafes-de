interface Viewport {
  northeast: {
    lat: number;
    lng: number;
  };
  southwest: {
    lat: number;
    lng: number;
  };
}

interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

interface OpeningHours {
  open_now: boolean;
  periods: {
    open: {
      day: number;
      time: string;
    };
    close: {
      day: number;
      time: string;
    };
  }[];
  weekday_text: string[];
}

export interface GooglePlaceDetails {
  business_status?: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: Viewport;
  };
  name: string;
  opening_hours?: OpeningHours;
  photos?: Photo[];
  price_level?: number;
  rating?: number;
  types: string[];
  url: string;
  user_ratings_total?: number;
  website?: string;
} 