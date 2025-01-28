import * as dotenv from "dotenv";
dotenv.config({ path: "../.env.local" });

import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
import { readCsv } from "../utils/csv";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  db: { schema: "cafeforwork" },
});

export async function upsertNewCities() {
  const cities = await readCsv<any>("../data/cities.csv");

  for (const city of cities) {
    console.log(`⚡️ Processing ${city.name} in ${city.country}`);

    const { data: existingCity } = await supabase
      .from("cities")
      .select("name, slug")
      .eq("slug", city.slug)
      .single();

    if (existingCity) {
      console.log(`✅ City ${city.name} already exists in ${city.country}`);
      continue;
    }

    // Upsert cities into the Supabase database
    const { data, error } = await supabase
      .from("cities")
      .upsert({
        ...city,
        population: city.population ? parseInt(city.population) : null,
      })
      .select("name");

    if (error) {
      console.error("❌ Error upserting city:", error);
    } else {
      console.log("✅ City upserted successfully:", data);
    }
  }
}

