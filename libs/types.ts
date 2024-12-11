import { Database } from "@/types_db";

export type Cafe = Database['cafeforwork']['Tables']['cafes']['Row']

// export interface Cafe {
//   city: string | null;
//   name: string | null;  
//   address: string | null;
//   wifi_quality: string | null;
//   seating_comfort: string | null;
//   ambiance: string | null;
//   food_content: string | null;
//   open_hours: string | null;
//   website: string | null;
//   preview_image: string | null;
//   slug: string | null;
//   // TODO: remove this
//   amenities: string[] | null;
// }

export type CityData = {
  [key: string]: Cafe[];
};

export type City = Database['cafeforwork']['Tables']['cities']['Row'];