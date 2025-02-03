import { Database } from "@/types_db";

export type CafeStatus = 'NEW' | 'PUBLISHED' | 'PROCESSED' | 'CLOSED';

export type Cafe = Database['cafeforwork']['Tables']['cafes']['Row'] & {
  status?: CafeStatus | string | null;
  cities?: {
    name?: string | null;
    slug?: string | null;
  } | null
}

export type CityData = {
  [key: string]: Cafe[];
};

export type City = Database['cafeforwork']['Tables']['cities']['Row'];

export type Review = Database['cafeforwork']['Tables']['reviews']['Row'];

export interface TranslationProps {
  t: (key: string, params?: Record<string, string | number>) => string;
}