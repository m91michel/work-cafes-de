import { select } from "@inquirer/prompts";
import { Command } from "..";
import { translateCity } from "../../libs/openai/translate-city";
import { supabase } from "./google-maps";

const migrationsActions: Command[] = [
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
