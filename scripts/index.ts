import * as dotenv from "dotenv";
dotenv.config({ path: "../.env.local" }); // or just .env, depending on your env file name

import { select } from "@inquirer/prompts";
import { publishCafes } from "./actions/cafe-actions";
import { updateCountForCities } from "./actions/update-cafe-count";
import { uploadNewCafes } from "./actions/upload-new-cafes";
import { upsertNewCities } from "./actions/upsert-cities";

type CommandAction = () => Promise<void>;

interface Command {
  name: string;
  key: string;
  action: CommandAction;
}

const commands: Command[] = [
  {
    name: "Publish Cafes (Process → Published)",
    key: "publish-cafes",
    action: publishCafes,
  },
  {
    name: "Update Cafe Count for Cities",
    key: "update-cafe-count",
    action: updateCountForCities,
  },
  {
    name: "Upload New Cafes",
    key: "upload-cafes",
    action: uploadNewCafes,
  },
  {
    name: "Upsert New Cities",
    key: "upsert-cities",
    action: upsertNewCities,
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
