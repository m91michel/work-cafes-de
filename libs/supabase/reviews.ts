import { Review } from "../types";
import supabase from "./supabaseClient";

export const getReviewsById = async (cafeId?: string | null): Promise<Review[]> => {
  if (!cafeId) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("cafe_id", cafeId);

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data as Review[];
};

export const getReviewsCount = async (): Promise<number> => {
  const { count } = await supabase
    .from("reviews")
    .select("*", { count: "exact" });

  return count ?? 0;
};