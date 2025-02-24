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
    console.log(rawData);

    // Validate the input data
    const result = suggestCitySchema.safeParse(rawData)
    console.log(result.error);
    
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

    const { error: errorSuggestion } = await supabase
      .from("user_suggestions")
      .insert({
        email: data.email,
        record_type: "city",
        slug: generateSlug(data.city),
      });

    if (errorSuggestion) {
      await sendMessage(`Fehler beim Hinzufügen der Stadt ${data.city} zu den Vorschlägen: ${errorSuggestion.message}`);
      console.error(errorSuggestion);
    }
    const existingCity = await getCityByName(data.city);

    if (existingCity) {
      await sendMessage(`Stadt ${data.city} existiert bereits`);
      return {
        success: false,
        error: "City already exists",
      };
    }

    const { error } = await supabase
      .from("cities")
      .insert({
        name_de: data.city || "",
        name_en: data.city || "",
        country: countryData?.name || "",
        country_code: data.country,
        state: data.state || "",
        slug: generateSlug(data.city),
        status: "UNKNOWN",
        lat_long: `${data.latitude},${data.longitude}`,
      })
      .select();

    if (error) {
      await sendMessage(`Fehler beim Hinzufügen der Stadt ${data.city} zu den Städten: ${error.message}`);
      console.error(error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      };
    }

    const message = `✅ Ein Nutzer hat ${data.city} in ${countryData?.name} hinzugefügt`;
    await sendMessage(message);
    console.log(message);

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
