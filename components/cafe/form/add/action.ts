"use server";

import supabase from "@/libs/supabase/supabaseClient";
import { generateSlug } from "@/libs/utils";
import { fromZodError } from "zod-validation-error";
import { suggestCafeSchema } from "./schema";
import { sendMessage } from "@/libs/telegram";

export async function suggestCityAction(formData: FormData) {
  try {
    // Your server-side logic here
    const rawData = {
      name: formData.get("name"),
      address: formData.get("address"),
      countryCode: formData.get("countryCode"),
      email: formData.get("email"),
      city: formData.get("city"),
      url: formData.get("url"),
      message: formData.get("message"),
      placeId: formData.get("placeId"),
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
    }

    console.log(rawData)

    // Validate the input data
    const result = suggestCafeSchema.safeParse(rawData)
    
    if (!result.success) {
      return {
        success: false,
        error: fromZodError(result.error).message,
      }
    }

    const { data } = result

    const slug = generateSlug(`${data.name}-${data.city}-${data.countryCode}`)
    
    const { error: errorSuggestion } = await supabase
      .from("user_suggestions")
      .insert({
        email: data.email,
        record_type: "cafe",
        message: data.message || "",
        slug: slug,
        form_values: JSON.stringify(rawData)
      });

    if (errorSuggestion) {
      await sendMessage(`Fehler beim Hinzufügen des Cafés ${data.name} zu den Vorschlägen: ${errorSuggestion.message}`);
      console.error(errorSuggestion);
    }

    // Replace the city check/creation logic with the new method
    const city = await ensureCity({
      name: data.city || "",
      country: data.countryCode || "",
      countryCode: data.countryCode || "",
    });
    const citySlug = city?.slug;

    const { error } = await supabase
      .from("cafes")
      .insert({
        name: data.name || "",
        address: data.address || "",
        city: data.city || "",
        country_code: data.countryCode,
        website_url: data.url || "",
        google_place_id: data.placeId,
        city_slug: citySlug,
        lat_long: `${data.latitude},${data.longitude}`,
        slug: slug,
        source: "USER",
        status: "UNKNOWN",
      })
      .select();

    if (error) {
      await sendMessage(`Fehler beim Hinzufügen des Cafés ${data.name} zu den Cafés: ${error.message}`);
      console.error(error);

      if (error.code === "23505") {
        await sendMessage(`Das Café ${data.name} existiert bereits`);
        return {
          success: false,
          error: "Café already exists. We will double check the data and add it to the database if it's correct.",
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      };
    }

    const message = `✅ Ein Nutzer hat ${data.name} in ${data.countryCode} hinzugefügt`;
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

type CityProps = {
  name: string;
  country: string;
  countryCode: string;
}

async function ensureCity({ name, country, countryCode }: CityProps) {
  const citySlug = generateSlug(name);
  
  const { data: existingCity, error: cityCheckError } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", citySlug)
    .single();

  if (cityCheckError && cityCheckError.code !== "PGRST116") {
    console.error("Error checking city:", cityCheckError);
    return null;
  }

  if (!existingCity) {
    const { error: cityCreateError } = await supabase
      .from("cities")
      .insert({
        name_de: name,
        name_en: name,
        slug: citySlug,
        country_code: countryCode,
        country: country,
        status: "UNKNOWN"
      });

    if (cityCreateError) {
      await sendMessage(`Fehler beim Erstellen der Stadt ${name}: ${cityCreateError.message}`);
      console.error("Error creating city:", cityCreateError);
      return null;
    }
  }

  return existingCity;
}