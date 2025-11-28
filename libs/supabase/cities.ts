import { Cafe, City } from "../types";
import { fetchAllRecords } from "../utils";
import supabase from "./supabaseClient";

type CityQuery = {
  limit?: number;
  offset?: number;
  excludeSlug?: string;
  country?: string;
  sortBy?: string;
  sortOrder?: string;
};
export async function getCities(
  props: CityQuery = { limit: 100, offset: 0 }
): Promise<City[]> {
  const { limit = 100, offset = 0, excludeSlug, country, sortBy = 'population', sortOrder = 'desc' } = props;

  let query = supabase
    .from("cities")
    .select("*")
    .range(offset, offset + limit - 1)
    .neq("slug", excludeSlug || "")
    .gte("cafes_count", 1)
    .order(sortBy, { ascending: sortOrder === 'asc' });

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

export const getAllCities = async (props: CityQuery = {}) => await fetchAllRecords<City, CityQuery>(getCities, props);

export async function getCityBySlug(slug: string): Promise<City | null> {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

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

export async function updateCafeCount(city?: Partial<City>) {
  if (!city || !city.slug) {
    return;
  }

  // get total count of published cafes
  const { count = 0 } = await supabase
    .from("cafes")
    .select("name, slug, city_slug", { count: "exact" })
    .eq("status", "PUBLISHED")
    .eq("city_slug", city.slug);

  if (!count) {
    return;
  }

  const status = count > 0 ? "PUBLISHED" : city.status || "PROCESSING";

  console.log(`Updating ${city.slug} to count of ${count} cafes with status ${status}`);

  // update the city count
  await supabase
    .from("cities")
    .update({
      cafes_count: count,
      status,
    })
    .eq("slug", city.slug);
}

type DashboardFilters = {
  limit?: number;
  offset?: number;
  status?: string;
  state?: string;
  name?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export async function getCitiesForDashboard(
  {
    limit = 100,
    offset = 0,
    status,
    state,
    name,
    sortBy = "created_at",
    sortOrder = "desc",
  }: DashboardFilters = { limit: 100, offset: 0 }
): Promise<{ data: City[]; total: number }> {
  let query = supabase
    .from("cities")
    .select("*", { count: "exact" })
    .order(sortBy, { ascending: sortOrder === "asc" });

  if (status) {
    query = query.eq("status", status);
  }

  if (state) {
    query = query.eq("state", state);
  }

  if (name) {
    // Search in both name_de and name_en with OR operator
    // PostgREST .or() syntax: column.operator.value,column2.operator.value
    const searchPattern = `%${name}%`;
    query = query.or(`name_de.ilike.${searchPattern},name_en.ilike.${searchPattern}`);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching cities:", error);
    return { data: [], total: 0 };
  }

  return { data: data as City[], total: count || 0 };
}
