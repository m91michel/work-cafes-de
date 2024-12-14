import { Database } from "@/types_db";


export type Cafe = Database['cafeforwork']['Tables']['cafes']['Row'] & {
  cities?: {
    name?: string | null;
    slug?: string | null;
  } | null
}

export type CityData = {
  [key: string]: Cafe[];
};

export type City = Database['cafeforwork']['Tables']['cities']['Row'];