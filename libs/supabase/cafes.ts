import { Cafe } from "../types";
import supabase from "./supabaseClient";

type GetCafeProps = {
  limit?: number;
  offset?: number;
};
export async function getCafes(
  { limit = 100, offset = 0 }: GetCafeProps = { limit: 100, offset: 0 }
): Promise<Cafe[]> {
  const { data, error, count } = await supabase
    .from("cafes")
    .select("*, cities(name, slug)", { count: 'exact' })
    .eq('status', 'PUBLISHED')
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }
  console.log(count);

  return data as Cafe[];
}

export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
  const { data, error } = await supabase
    .from("cafes")
    .select("*, cities(name, slug)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  // @ts-ignore
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  // @ts-ignore
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