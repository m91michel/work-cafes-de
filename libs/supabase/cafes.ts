import { Cafe } from "../types";
import { fetchAllRecords } from "../utils";
import supabase from "./supabaseClient";

type BaseFilters = {
  limit?: number;
  offset?: number;
  citySlug?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
export async function getCafes(
  {
    limit = 100,
    offset = 0,
    citySlug,
    sortBy = "google_rating",
    sortOrder = "desc",
  }: BaseFilters = { limit: 100, offset: 0 }
): Promise<{ data: Cafe[]; total: number }> {
  let query = supabase
    .from("cafes")
    .select("*, cities(name_de, name_en, slug, country)", { count: "exact" })
    .eq("status", "PUBLISHED")
    .not("google_rating", "is", null)
    .order(sortBy, { ascending: sortOrder === "asc" });

  if (citySlug) {
    query = query.eq("city_slug", citySlug);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching data:", error);
    return { data: [], total: 0 };
  }

  return { data: data as Cafe[], total: count || 0 };
}

export async function getBestCafes(
  { limit = 100, offset = 0 }: BaseFilters = { limit: 100, offset: 0 }
): Promise<Cafe[]> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*, cities(name_de, name_en, slug, country)", { count: "exact" })
    .eq("status", "PUBLISHED")
    .range(offset, offset + limit - 1)
    .not("google_rating", "is", null)
    .gte("review_count", 3)
    .order("google_rating", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data as Cafe[];
}

export async function getCafesWithUnpublished(
  { limit = 100, offset = 0 }: BaseFilters = { limit: 100, offset: 0 }
): Promise<Cafe[]> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*, cities(name_de, name_en, slug, country, country_code)", { count: "exact" })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data as Cafe[];
}

export async function getCafeBySlug(slug?: string | null): Promise<Cafe | null> {
  if (!slug) {
    return null;
  }

  const { data, error } = await supabase
    .from("cafes")
    .select("*, cities(name_de, name_en, slug, country, country_code)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return data;
}

type Options = {
  limit?: number;
  offset?: number;
  excludeSlug?: string;
};
export async function getCafesByCity(
  citySlug: string,
  options: Options = { limit: 100, offset: 0 }
): Promise<Cafe[]> {
  const { limit = 100, offset = 0, excludeSlug } = options;

  const { data, error } = await supabase
    .from("cafes")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("status", "PUBLISHED")
    .neq("slug", excludeSlug || "")
    .range(offset, offset + limit - 1)
    .order("google_rating", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data;
}

type CafesCountOptions = {
  citySlug?: string;
};
export async function getCafesCount({
  citySlug,
}: CafesCountOptions = {}): Promise<number | null> {
  if (!citySlug) {
    return null;
  }

  let query = supabase
    .from("cafes")
    .select("name, slug", { count: "exact" })
    .eq("status", "PUBLISHED");

  if (citySlug) {
    query = query.eq("city_slug", citySlug);
  }

  const { error, count } = await query;

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return count;
}

// Just return cafes without count -> used for getAllPublishedCafes
export async function getPublishedCafes(
  {
    limit = 100,
    offset = 0,
  }: BaseFilters = { limit: 100, offset: 0 }
): Promise<Cafe[]> {
  let query = supabase
    .from("cafes")
    .select("*", { count: "exact" })
    .eq("status", "PUBLISHED")
    .order("created_at", { ascending: false });

  const { data, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching data:", error);
    return []
  }

  return data as Cafe[];
}
export const getAllPublishedCafes = async (props: BaseFilters = {}) => await fetchAllRecords<Cafe, BaseFilters>(getPublishedCafes, props);