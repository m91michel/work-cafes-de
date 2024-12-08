export interface Cafe {
  city: string;
  name: string;
  address: string;
  wifi_quality: string;
  seating_comfort: string;
  ambiance: string;
  food_content: string;
  open_hours: string;
  website: string;
  preview_image: string;
  slug: string;
  // TODO: remove this
  amenities: string[];
}

export type CityData = {
  [key: string]: Cafe[];
};