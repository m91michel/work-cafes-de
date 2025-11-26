import dayjs from "dayjs";
import supabase from "../supabaseClient";
import { Cafe } from "../../types";
import type { BaseFilters } from "../cafes";

export async function getCafesForGoogleMapsDetails(
  { limit = 10 }: BaseFilters = { limit: 10 }
): Promise<{ data: Cafe[]; count: number }> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*", { count: "exact" })
    .not("google_place_id", "is", null)
    // .gte("review_count", 1) // only process cafes with at least 1 review
    .is("processed->google_details_at", null)
    .in("status", ["PUBLISHED"])
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching data:", error);
    return { data: [], count: 0 };
  }

  return { data: data as Cafe[], count: count || 0 };
}

export async function getPublishedCafesForRegularUpdate(
  { limit = 10 }: BaseFilters = { limit: 10 }
): Promise<{ data: Cafe[]; count: number }> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*", { count: "exact" })
    .not("google_place_id", "is", null)
    .not("processed->google_details_at", "is", null)
    .lt("processed_at", dayjs().subtract(30, "day").toISOString())
    .in("status", ["PUBLISHED"])
    // oldest first
    .order("processed->google_details_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching data:", error);
    return { data: [], count: 0 };
  }

  return { data: data as Cafe[], count: count || 0 };
}

export async function getCafesToFetchReviews(
  { limit = 10 }: BaseFilters = { limit: 10 }
): Promise<{ data: Cafe[]; count: number }> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*, cities(country_code)", { count: "exact" })
    .not("google_place_id", "is", null)
    .not("city_slug", "is", null)
    .not("city", "is", null)
    .is("processed->google_reviews_at", null)
    .eq("review_count", 0)
    .gte("google_rating", 3)
    .in("status", ["NEW", "PROCESSED"])
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching data:", error);
    return { data: [], count: 0 };
  }
  return { data: data as Cafe[], count: count || 0 };
}

export async function getCafesToEvaluate(
  { limit = 10 }: BaseFilters = { limit: 10 }
): Promise<{ data: Cafe[]; count: number }> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*", { count: "exact" })
    .in("status", ["PROCESSED"])
    // checked is null
    .is("processed->checked_reviews_at", null)
    .gte("review_count", 1)
    // wait 30 minutes before processing again
    .lte("processed_at", dayjs().subtract(30, "minute").toISOString())
    .is("checked", null)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching data:", error);
    return { data: [], count: 0 };
  }
  return { data: data as Cafe[], count: count || 0 };
}

export async function getCafesToFetchAboutContent(
  { limit = 10 }: BaseFilters = { limit: 10 }
): Promise<{ data: Cafe[]; count: number }> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*", { count: "exact" })
    .eq("status", "PUBLISHED")
    .not("website_url", "is", null)
    .is("processed->fetched_website_content_at", null)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching data:", error);
    return { data: [], count: 0 };
  }
  return { data: data as Cafe[], count: count || 0 };
}

export async function getCafesForGoogleMapsImages(
  { limit = 10 }: BaseFilters = { limit: 10 }
): Promise<{ data: Cafe[]; count: number }> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*", { count: "exact" })
    .not("google_place_id", "is", null)
    .is("preview_image", null)
    .in("status", ["PUBLISHED"])
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching data:", error);
    return { data: [], count: 0 };
  }

  return { data: data as Cafe[], count: count || 0 };
}
