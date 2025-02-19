import supabase from "@/libs/supabase/supabaseClient";
import { Country } from "../types";

type GetCountriesOptions = {
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
};
export async function getCountries(
  options: GetCountriesOptions = {}
): Promise<Country[]> {
  const { limit = 100, offset = 0, status, sortBy = "name", sortOrder = "desc" } = options;

  let query = supabase
    .from("countries")
    .select("*")
    .range(offset, offset + limit - 1)
    .order(sortBy, { ascending: sortOrder === 'asc' });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: countries, error } = await query;

  if (error) {
    console.error("Error fetching countries:", error);
    return [];
  }

  return countries;
}

export async function getCountryByCode(code?: string | null): Promise<Country | null> {
  if (!code) return null;

  const { data: country, error } = await supabase
    .from("countries")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    console.error("Error fetching country:", error);
    return null;
  }

  return country;
}
