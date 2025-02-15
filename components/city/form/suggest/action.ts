"use server";

import supabase from "@/libs/supabase/supabaseClient";
import { generateSlug } from "@/libs/utils";

export async function suggestCityAction(formData: FormData) {
  try {
    // Your server-side logic here
    const city = formData.get("city") as string;
    const countryCode = formData.get("country") as string;

    const { data: countryData } = await supabase
      .from("countries")
      .select("*")
      .eq("code", countryCode)
      .single();

    const existingCity = await getCityByName(city);

    if (existingCity) {
      return {
        success: false,
        error: "City already exists",
      };
    }

    const { error } = await supabase
      .from("cities")
      .insert({
        name_de: city || "",
        name_en: city || "",
        country: countryData?.name || "",
        country_code: countryCode,
        slug: generateSlug(city),
        status: "UNKNOWN",
      })
      .select();

    if (error) {
      console.error(error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      };
    }

    console.log(`✅ City ${city} in ${countryData?.name} saved`);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getCityByName(name: string) {
  const { data } = await supabase
    .from("cities")
    .select("*")
    .eq("name_en", name)
    .maybeSingle();

  return data;
}
