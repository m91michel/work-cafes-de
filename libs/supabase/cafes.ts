import { Cafe, CafeStatus } from "../types";
import supabase from "./supabaseClient";

type BaseFilters = {
  limit?: number;
  offset?: number;
};
export async function getCafes(
  { limit = 100, offset = 0 }: BaseFilters = { limit: 100, offset: 0 }
): Promise<Cafe[]> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*, cities(name_de, name_en, slug)", { count: 'exact' })
    .eq('status', 'PUBLISHED')
    .range(offset, offset + limit - 1)
    .not('google_rating', 'is', null)
    .order("google_rating", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data as Cafe[];
}

export async function getBestCafes(
  { limit = 100, offset = 0 }: BaseFilters = { limit: 100, offset: 0 }
): Promise<Cafe[]> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*, cities(name_de, name_en, slug)", { count: 'exact' })
    .eq('status', 'PUBLISHED')
    .range(offset, offset + limit - 1)
    .not('google_rating', 'is', null)
    .gte("review_count", 3)
    .order("google_rating", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data as Cafe[];
}

export async function getAllCafes(
  { limit = 100, offset = 0 }: BaseFilters = { limit: 100, offset: 0 }
): Promise<Cafe[]> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*, cities(name_de, name_en, slug)", { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data as Cafe[];
}

export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
  const { data, error } = await supabase
    .from("cafes")
    .select("*, cities(name_de, name_en, slug)")
    .eq("slug", slug)
    .single();

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
    .eq('status', 'PUBLISHED')
    .neq("slug", excludeSlug)
    .range(offset, offset + limit - 1)
    .order("review_count", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data;
}


export async function getCafesCount(): Promise<number | null> {
  const { error, count } = await supabase
    .from("cafes")
    .select("name, slug", { count: 'exact' })
    .eq('status', 'PUBLISHED');

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return count;
}