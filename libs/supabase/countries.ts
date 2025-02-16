import supabase from "@/libs/supabase/supabaseClient";
import { Country } from "../types";

type GetCountriesOptions = {
  status?: string;
  limit?: number;
  offset?: number;
};
export async function getCountries(
  options: GetCountriesOptions = {}
): Promise<Country[]> {
  const { limit = 100, offset = 0, status } = options;

  let query = supabase
    .from("countries")
    .select("*")
    .range(offset, offset + limit - 1);

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
