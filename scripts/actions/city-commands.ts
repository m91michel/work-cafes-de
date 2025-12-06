import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
import { readCsv } from "../utils/csv";
import { updateCountForCities } from "./update-cafe-count";
import { Command } from "..";
import { generateSlug } from "../../libs/utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  db: { schema: "cafeforwork" },
});

export const citiesCommands: Command[] = [
  {
    name: "🏙️ Cities: Update Cafe Count",
    key: "update-cafe-count",
    action: updateCountForCities,
  },
  {
    name: "🏙️ Cities: Upsert Cities from CSV",
    key: "upsert-cities",
    action: upsertCitiesFromCsv,
  },
  {
    name: "🏙️ Cities: Migration",
    key: "cities-migration",
    action: async () => {
      const { data: cities, error } = await supabase
        .from("cities")
        .select("*")
        .eq("status", "READY")
        .not("preview_image", "is", null)

      if (error) {
        console.error("❌ Error fetching cities:", error);
        return;
      }

      for (const city of cities) {
        console.log(`⚡️ Processing ${city.name_de} in ${city.country}`);
        const { data, error } = await supabase
          .from("cities")
          .update({
            status: "WAIT",
          })
          .eq("slug", city.slug)
          .select("name_de, name_en, slug, country, country_code, state, state_code, population, cafes_count, status")

        if (error) {
          console.error("❌ Error updating city:", error);
        } else {
          console.log("✅ City updated successfully:", data);
        }
      }

      console.log("✅ Cities migration completed");
    },
  },
];

export async function upsertCitiesFromCsv() {
  const cities = await readCsv<any>("../data/cities/europe-cities.csv");

  for (const city of cities) {
    const name = city.name_en || city.name_de;
    const slug = generateSlug(name);
    console.log(`⚡️ Processing ${name} in ${city.country} ${city.name_local}`);

    if (!name) {
      console.error("❌ City name is null", city);
      continue;
    }

    // Upsert cities into the Supabase database
    const { error } = await supabase
      .from("cities")
      .upsert({
        slug: city.slug || slug,
        name_de: city.name_de || city.name_en,
        name_en: city.name_en || city.name_de,
        country: city.country,
        country_code: city.country_code,
        name_local: city.name_local,
        // description_long_de: city.description_long_de || null,
        // description_long_en: city.description_long_en || null,
        // description_short_de: city.description_short_de || null,
        // description_short_en: city.description_short_en || null,
        // state: city.state,
        // state_code: city.state_code,
        population: city.population ? parseInt(city.population) : 0,
        cafes_count: 0,
        status: "NEW",
      }, { onConflict: 'slug', ignoreDuplicates: true })
      .select("name_en, name_de");

    if (error) {
      console.error("❌ Error upserting city:", error);
    } else {
      console.log(`✅ ${name} updated successfully`);
    }
  }
}
