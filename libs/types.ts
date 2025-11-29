import { Database } from "@/types_db";
import { KeyPrefix, Namespace, TFunction } from "i18next";
import { FallbackNs } from "react-i18next";

export type CafeStatus = 'NEW' | 'PUBLISHED' | 'PROCESSED' | 'CLOSED' | 'DISCARDED' | 'ERROR';
export const validStatuses = ["NEW", "PROCESSED", "PUBLISHED", "CLOSED", "NOT_FRIENDLY", "DISCARDED", "ERROR"];

export type Processed = {
  google_details_at?: string | null;
  google_reviews_at?: string | null;
  checked_reviews_at?: string | null;
  fetched_website_content_at?: string | null;
  [key: string]: string | null | undefined;
};

export type Cafe = Database['cafeforwork']['Tables']['cafes']['Row'] & {
  status?: CafeStatus | string | null;
  cities?: {
    name_de?: string | null;
    name_en?: string | null;
    slug?: string | null;
    country?: string | null;
    country_code?: string | null;
  } | null
  processed?: Processed | null;
}

export type CityData = {
  [key: string]: Cafe[];
};

export type City = Database['cafeforwork']['Tables']['cities']['Row'];

export type Review = Database['cafeforwork']['Tables']['reviews']['Row'];

export type Country = Database['cafeforwork']['Tables']['countries']['Row'];

// general types
export interface TranslationProps {
  t: TFunction<FallbackNs<Namespace>, KeyPrefix<FallbackNs<Namespace>>>
}

export type PageParams<T> = Promise<T>
export type PageSearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export type PageProps<T = any> = {
  params: PageParams<T>;
  searchParams: PageSearchParams;
};
