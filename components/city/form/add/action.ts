"use server";

import supabase from "@/libs/supabase/supabaseClient";
import { generateSlug } from "@/libs/utils";
import { fromZodError } from "zod-validation-error";
import { suggestCitySchema } from "./schema";
import { sendMessage } from "@/libs/telegram";

export async function suggestCityAction(formData: FormData) {
  try {
    const rawData = {
      city: formData.get("city"),
      state: formData.get("state"),
      country: formData.get("country"),
      email: formData.get("email"),
      placeId: formData.get("placeId"),
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
    }

    // Validate the input data
    const result = suggestCitySchema.safeParse(rawData)
    
    if (!result.success) {
      return {
        success: false,
        error: fromZodError(result.error).message,
      }
    }

    const { data } = result

    // Your existing logic, now using validated data
    const { data: countryData } = await supabase
      .from("countries")
      .select("*")
      .eq("code", data.country)
      .single();

    // Check if city already exists with exact match
    const existingCity = await getCityByName(data.city, data.country, data.state);

    // Generate slug for user suggestion
    const slug = await generateCitySlug(data.city, data.country, data.state);
    
    const { error: errorSuggestion } = await supabase
      .from("user_suggestions")
      .insert({
        email: data.email,
        record_type: "city",
        country: countryData?.code || data.country,
        slug: slug,
      });

    if (errorSuggestion) {
      await sendMessage(`Fehler beim Hinzufügen der Stadt ${data.city} zu den Vorschlägen: ${errorSuggestion.message}`);
      console.error(errorSuggestion);
    }

    if (!existingCity) {
      // Insert the new city
      const { error } = await supabase
        .from("cities")
        .insert({
          name_de: data.city || "",
          name_en: data.city || "",
          country: countryData?.name || "",
          country_code: data.country,
          state: data.state || "",
          state_code: data.state || "",
          slug: slug,
          status: "UNKNOWN",
          lat_long: `${data.latitude},${data.longitude}`,
        })
        .select();

      if (error) {
        await sendMessage(`Fehler beim Hinzufügen der Stadt ${data.city} zu den Städten: ${error.message}`);
        console.error(error);
      }
    }

    const message = `✅ Ein Nutzer hat ${data.city}${data.state ? `, ${data.state}` : ''} in ${countryData?.name} hinzugefügt`;
    await sendMessage(message);

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

export async function getCityByName(name: string, countryCode?: string, stateCode?: string) {
  let query = supabase
    .from("cities")
    .select("*")
    .eq("name_en", name);

  if (countryCode) {
    query = query.eq("country_code", countryCode);
  }

  if (stateCode) {
    query = query.eq("state_code", stateCode);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching cities:", error);
    return null;
  }

  return data?.[0] || null;
}

async function generateCitySlug(cityName: string, countryCode?: string, stateCode?: string) {
  // Check if there are any existing cities with the same name
  const { data: existingCities } = await supabase
    .from("cities")
    .select("name_en, country_code, state_code")
    .eq("name_en", cityName);

  // If no cities with this name exist or only one exists in a different country,
  // we can use a simple slug
  if (!existingCities || existingCities.length === 0) {
    return generateSlug(cityName);
  }

  // If there are cities with the same name, we need to include country code
  // and potentially state code to disambiguate
  if (countryCode) {
    // Check if there are multiple cities with the same name in this country
    const citiesInCountry = existingCities.filter(
      city => city.country_code === countryCode
    );

    if (citiesInCountry.length > 0 && stateCode) {
      // If there are cities in this country, include state code
      return generateSlug(`${cityName}-${countryCode}-${stateCode}`);
    }
    
    // Otherwise just use country code
    return generateSlug(`${cityName}-${countryCode}`);
  }

  // Fallback to simple slug if no country code is provided
  return generateSlug(cityName);
}