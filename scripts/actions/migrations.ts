import { select } from "@inquirer/prompts";
import { Command } from "..";
import { translateCity } from "../../libs/openai/translate-city";
import { supabase } from "./google-maps";
import { processLinks } from "../../libs/openai/process-links";

const migrationsActions: Command[] = [
  {
    name: "Cafe: update published_at",
    key: "update-published-at",
    action: async () => {


      const { data: cafes, error, count } = await supabase
        .from("cafes")
        .select("*", { count: "exact" })
        .eq("status", "PUBLISHED")
        .is("published_at", null)

      if (error) {
        console.error("Error fetching cafes:", error);
        return;
      }

      for (const cafe of cafes) {
        const { error: updateError } = await supabase
          .from("cafes")
          .update({ published_at: cafe.processed_at })
          .eq("id", cafe.id);

        if (updateError) {
          console.error("Error updating cafe:", updateError);
          continue;
        }
        console.log(`✅ Cafe ${cafe.name} published_at updated`);
      }

      console.log(`✅ ${count} cafes updated (${cafes.length} left)`);
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
        const result = await processLinks(cafe);
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
