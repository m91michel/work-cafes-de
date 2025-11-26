import { City } from "@/libs/types";
import OpenAI from "openai";

const PROMPT = `
You are an expert city description generator. Your task is to create an engaging city description based on the following input parameters:
- City name
- State
- Country
- Language (either "German" or "English")

Instructions:
1. Generate the description in the language specified by the Language input.
   - If the language is "English", all text must be in English.
   - If the language is "German", all text must be in German.
2. The output must be a JSON object with exactly the following keys:
   - "name": The city's name in the specified language (use the appropriate variant if applicable).
   - "state": Provide a state if not provided in the input.
   - "description_short": A concise, one-sentence description highlighting key facts about the city.
   - "description_long": A detailed description (over 100 words) covering cultural, historical, geographical, and economic aspects of the city.
3. Use the provided city name, state, and country as context for generating the descriptions.

Example Input:
City name: Munich
State: Bavaria
Country: Germany  
Language: German

Example Expected JSON Output Format:
{
    "name": "Munich (or München if language is German)",
    "state": "Bavaria",
    "description_short": "A one-sentence description of the city in the specified language.",
    "description_long": "A detailed description (over 100 words) of the city in the specified language."
}

Ensure that your output strictly adheres to the JSON format with the four specified keys.
`;

type ReturnType = {
  name: string;
  state: string;
  description_short: string;
  description_long: string;
};

export async function generateCityDescription(city: City, lang: "de" | "en"): Promise<ReturnType | null> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: "https://oai.helicone.ai/v1",
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`
    }
  });

  const language = lang === "de" ? "German" : "English";
  const cityName = city.name_en || city.name_de;

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        {
          role: "user",
          content: `
          City name: ${cityName}\n
          State: ${city.state || "-"}\n
          Country: ${city.country}\n
          Language: ${language}
        `,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "links_object",
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: `City name in ${language}`,
              },
              state: {
                type: "string",
                description: "State in English",
              },
              description_short: {
                type: "string",
                description: `Short description in ${language}`,
              },
              description_long: {
                type: "string",
                description: `Long description in ${language}`,
              },
            },
            required: ["name", "state", "description_short", "description_long"],
          },
        },
      },
    });

    const response_json = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    if (!response_json.name || !response_json.description_short || !response_json.description_long) {
      console.log(`No description found for ${cityName}`);
      return null;
    }

    return response_json;
  } catch (error) {
    console.error(error);
    return null;
  }
}
