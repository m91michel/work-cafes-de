import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
import { readCsv } from "../utils/csv";
import { updateCountForCities } from "./update-cafe-count";
import { Command } from "..";

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
      const { data: cities, error } = await supabase.from("cities").select("*");

      if (error) {
        console.error("❌ Error fetching cities:", error);
        return;
      }

      for (const city of cities) {
        console.log(`⚡️ Processing ${city.name} in ${city.country}`);
        const { error } = await supabase
          .from("cities")
          .update({
            status: "PUBLISHED",
          })
          .eq("slug", city.slug);

        if (error) {
          console.error("❌ Error updating city:", error);
        } else {
          console.log("✅ City updated successfully:", city);
        }
      }

      console.log("✅ Cities migration completed");
    },
  },
];

export async function upsertCitiesFromCsv() {
  const cities = await readCsv<any>("../data/cities.csv");

  for (const city of cities) {
    console.log(`⚡️ Processing ${city.name} in ${city.country}`);



    // Upsert cities into the Supabase database
    const { error } = await supabase
      .from("cities")
      .upsert({
        slug: city.slug,
        name: city.name,
        country: city.country,
        country_code: city.country_code,
        description_long: city.description_long || '',
        description_short: city.description_short || '',
        state: city.state,
        state_code: city.state_code,
        population: city.population ? parseInt(city.population) : 0,
        cafes_count: 0,
      }, { onConflict: 'slug' })
      .select("name");

    if (error) {
      console.error("❌ Error upserting city:", error);
    } else {
      console.log(`✅ ${city.name} updated successfully`);
    }
  }
}
