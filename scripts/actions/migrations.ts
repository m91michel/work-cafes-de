import { select } from "@inquirer/prompts";
import { Command } from "..";
import { translateCity } from "../../libs/openai/translate-city";
import { supabase } from "./google-maps";
import { processLinks } from "../../libs/openai/process-links";
import { mergeObjects } from "../../libs/utils";
import { Cafe } from "../../libs/types";

const migrationsActions: Command[] = [
  {
    name: "🍰 Cafes: Reset google reviews",
    key: "reset-google-reviews",
    action: async () => {
      const { data: cafes, error, count } = await supabase
        .from("cafes")
        .select("*", { count: "exact" })
        .eq("status", "PROCESSED")
        // .not("processed->google_reviews_at", "is", null)
        // .eq("processed->google_reviews_at", "null")
        // .eq("review_count", 0)
        .order("created_at", { ascending: false })
        .limit(1000);


      if (error) {
        console.error("Error fetching cafes:", error);
        return;
      }

      let processedCount = 0;
      for (const cafe of cafes) {
        console.log(`⚡️ Processing cafe ${cafe.name} in ${cafe.city}`);
        // console.log(pick(cafe, "name", "city", "processed", "review_count"));
        const { error: updateError } = await supabase
          .from("cafes")
          .update({
            processed: mergeObjects(cafe?.processed, {
              checked_reviews_at: undefined
            }),
            checked: null,
          })
          .eq("id", cafe.id);

        if (updateError) {
          console.error("Error updating cafe:", updateError);
          continue;
        }
        console.log(`✅ Cafe ${cafe.name} discarded`);
        processedCount++;
      }

      const left = count ? count - processedCount : 0;
      console.log(`✅ ${processedCount} cafes updated (${left} left)`);
    },
  },
  {
    name: "🏙️ Cities: Translate Cities",
    key: "translate-cities",
    action: async () => {
      const { data: cities, error } = await supabase
        .from("cities")
        .select("*")
        .is("name_en", null)
        .limit(100);

      if (error) {
        console.error("Error fetching cities:", error);
        return;
      }
      for (const city of cities) {
        const result = await translateCity(city);
        console.log(result);
        if (!result) {
          console.error("Error translating city:", city.name_de);
          continue;
        }
        const { error: updateError } = await supabase
          .from("cities")
          .update({
            name_en: result?.name_en,
            description_short_en: result?.description_short_en,
            description_long_en: result?.description_long_en,
          })
          .eq("slug", city.slug);
        if (updateError) {
          console.error("Error updating city:", updateError);
          continue;
        }
        console.log(`✅ City ${city.name_de} translated to ${result.name_en}`);
      }
    },
  },
  {
    name: "🔗 Cafes: Migrate Links",
    key: "migrate-links",
    action: async () => {
      const { data: cafes, error } = await supabase
        .from("cafes")
        .select("*")
        .not("links_text", "is", null)
        .is("website_url", null)
        .eq("status", "PUBLISHED")
        .order("created_at", { ascending: false })
        .limit(100);
        
      if (error) {
        console.error("Error fetching cafes:", error);
        return;
      }

      for (const cafe of cafes) {
        console.log(`Processing cafe ${cafe.name}`);
        const result = await processLinks(cafe as Cafe);
        console.log(result);
        if (!result) {
          console.error("Error processing links:", cafe.name);
          continue;
        }
        const { website, ...otherLinks } = result;
        
        const { error: updateError } = await supabase
          .from("cafes")
          .update({
            links: otherLinks,
            website_url: website,
          })
          .eq("id", cafe.id);
        
        if (updateError) {
          console.error("Error updating cafe:", updateError);
          continue;
        }
        console.log(`✅ Cafe ${cafe.name} links migrated`);
      }

      console.log(`✅ ${cafes.length} cafes migrated`);
    },
  },
  {
    name: "🍰 Cafes: Update city slug",
    key: "update-city-slug",
    action: async () => {
      const { data: cafes, error, count } = await supabase
        .from("cafes")
        .select("*", { count: "exact" })
        .eq("city_slug", "warsaw-pl-masovian-voivodeship")
        .order("created_at", { ascending: false })
        .limit(100);


      if (error) {
        console.error("Error fetching cafes:", error);
        return;
      }

      let processedCount = 0;
      for (const cafe of cafes) {
        console.log(`⚡️ Processing cafe ${cafe.name} in ${cafe.city}`);
        // console.log(pick(cafe, "name", "city", "processed", "review_count"));
        const { error: updateError } = await supabase
          .from("cafes")
          .update({
            city_slug: "warsaw",
          })
          .eq("id", cafe.id);

        if (updateError) {
          console.error("Error updating cafe:", updateError);
          continue;
        }
        console.log(`✅ Cafe ${cafe.name} discarded`);
        processedCount++;
      }

      const left = count ? count - processedCount : 0;
      console.log(`✅ ${processedCount} cafes updated (${left} left)`);
    },
  },
];

export async function runMigrations() {
  try {
    const selectedValue = await select({
      message: "Which migration would you like to run?",
      choices: migrationsActions.map((cmd) => ({
        name: cmd.name,
        value: cmd.key,
      })),
    });

    const selectedCommand = migrationsActions.find(
      (cmd) => cmd.key === selectedValue
    );

    if (selectedCommand) {
      try {
        await selectedCommand.action();
      } catch (error) {
        console.error("Error executing command:", error);
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log("👋 until next time!");
    } else {
      throw error;
    }
  }
}
