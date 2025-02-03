import * as dotenv from "dotenv";
dotenv.config({ path: "../.env.local" }); // or just .env, depending on your env file name

import { select } from "@inquirer/prompts";
import { publishCafes } from "./actions/cafe-actions";
import { uploadNewCafes } from "./actions/upload-new-cafes";
import { citiesCommands } from "./actions/upsert-cities";
import { updateOpenHours } from "./actions/update-open-hours";
import { googleMapsActions } from "./actions/google-maps";
import { runMigrations } from "./actions/migrations";

type CommandAction = () => Promise<void>;

export interface Command {
  name: string;
  key: string;
  action: CommandAction;
}

const commands: Command[] = [
  ...citiesCommands,
  {
    name: "☕️ Cafes: Publish Cafes (Process → Published)",
    key: "publish-cafes",
    action: publishCafes,
  },
  {
    name: "💾 Cafes: Upload New Cafes",
    key: "upload-cafes",
    action: uploadNewCafes,
  },
  {
    name: "🕒 Cafes: Update Open Hours",
    key: "update-open-hours",
    action: updateOpenHours,
  },
  ...googleMapsActions,
  {
    name: "🪄 Run migrations",
    key: "run-migrations",
    action: runMigrations,
  },
];

async function main() {
  try {
    const selectedValue = await select({
      message: "What would you like to do?",
      choices: commands.map((cmd) => ({
        name: cmd.name,
        value: cmd.key,
      })),
    });

    const selectedCommand = commands.find((cmd) => cmd.key === selectedValue);

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

main().catch(console.error);
