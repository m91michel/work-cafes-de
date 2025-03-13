import { Database } from "@/types_db";
import { KeyPrefix, Namespace, TFunction } from "i18next";
import { FallbackNs } from "react-i18next";

export type CafeStatus = 'NEW' | 'PUBLISHED' | 'PROCESSED' | 'CLOSED' | 'DISCARDED';
export const validStatuses = ["NEW", "PROCESSED", "PUBLISHED", "CLOSED", "NOT_FRIENDLY", "DISCARDED"];

export type Cafe = Database['cafeforwork']['Tables']['cafes']['Row'] & {
  status?: CafeStatus | string | null;
  cities?: {
    name_de?: string | null;
    name_en?: string | null;
    slug?: string | null;
    country?: string | null;
    country_code?: string | null;
  } | null
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

export interface RedditSearch {
  id: string;
  subreddits: string[];
  query: string;
  time_frame: "hour" | "day" | "week" | "month" | "year" | "all";
  sort: "relevance" | "hot" | "top" | "new" | "comments";
  result_limit?: number;
  is_active?: boolean;
  last_checked?: string | null;
}

export interface RedditPost {
  id?: string;
  reddit_id: string;
  subreddit: string;
  title: string;
  selftext?: string;
  url: string;
  permalink: string;
  created_utc: number;
  author: string;
  num_comments: number;
  is_relevant?: boolean;
  has_been_replied?: boolean;
  reply_id?: string;
  notes?: string;
  search_id?: string;
  created_at?: string;
  updated_at?: string;
}