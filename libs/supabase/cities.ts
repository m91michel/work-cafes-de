import { City } from "../types";
import supabase from "./supabaseClient";

type GetCafeProps = {
  limit?: number;
  offset?: number;
  excludeSlug?: string;
};
export async function getCities(
  props: GetCafeProps = { limit: 100, offset: 0 }
): Promise<City[]> {
  const { limit = 100, offset = 0, excludeSlug } = props;

  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .range(offset, offset + limit - 1)
    .neq("slug", excludeSlug)
    .gte("cafes_count", 1)
    .order("population", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data;
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return data;
}

export async function getCitiesCount(): Promise<number | null> {
  const { error, count } = await supabase
    .from("cities")
    .select("name, slug", { count: "exact" })
    .gte("cafes_count", 1);

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return count;
}

export async function updateCafeCount(slug?: string | null) {
  if (!slug) {
    return;
  }

  // get total count of published cafes
  const { count = 0 } = await supabase
    .from("cafes")
    .select("name, slug, city_slug", { count: "exact" })
    .eq("status", "PUBLISHED")
    .eq("city_slug", slug);

  console.log(`Updating ${slug} to count of ${count} cafes`);

  // update the city count
  await supabase.from("cities").update({ cafes_count: count }).eq("slug", slug);
}
