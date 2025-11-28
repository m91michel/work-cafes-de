import supabase from "../supabaseClient";
import { City } from "../../types";
import type { BaseFilters } from "../cafes";

export async function getCitiesForImageGeneration(
  { limit = 10 }: BaseFilters = { limit: 10 }
): Promise<{ data: City[]; count: number }> {
  const { data, error, count } = await supabase
    .from("cities")
    .select("*", { count: "exact" })
    .is("preview_image", null)
    .in("status", ["PUBLISHED"])
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching data:", error);
    return { data: [], count: 0 };
  }

  return { data: data as City[], count: count || 0 };
}

