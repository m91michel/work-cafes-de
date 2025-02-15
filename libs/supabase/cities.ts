import { Cafe, City } from "../types";
import supabase from "./supabaseClient";

type GetCafeProps = {
  limit?: number;
  offset?: number;
  excludeSlug?: string;
  country?: string;
};
export async function getCities(
  props: GetCafeProps = { limit: 100, offset: 0 }
): Promise<City[]> {
  const { limit = 100, offset = 0, excludeSlug, country } = props;

  let query = supabase
    .from("cities")
    .select("*")
    .range(offset, offset + limit - 1)
    .neq("slug", excludeSlug || "")
    .gte("cafes_count", 1)
    .order("population", { ascending: false });

  if (country) {
    query = query.eq("country", country);
  }

  const { data, error } = await query;

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
    .select("name_de, slug", { count: "exact" })
    .gte("cafes_count", 1);

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return count;
}

export async function updateCafeCount(cafe?: Partial<Cafe>) {
  if (!cafe || !cafe.city_slug) {
    return;
  }

  // get total count of published cafes
  const { count = 0 } = await supabase
    .from("cafes")
    .select("name, slug, city_slug", { count: "exact" })
    .eq("status", "PUBLISHED")
    .eq("city_slug", cafe.city_slug);

  if (!count) {
    return;
  }

  const status = count > 0 ? "PUBLISHED" : cafe.status || "PROCESSING";

  console.log(`Updating ${cafe.city_slug} to count of ${count} cafes with status ${status}`);

  // update the city count
  await supabase
    .from("cities")
    .update({
      cafes_count: count,
      status,
    })
    .eq("slug", cafe.city_slug);
}
