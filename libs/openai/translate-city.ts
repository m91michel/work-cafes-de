import { City } from "@/libs/types";
import OpenAI from "openai";

const PROMPT = `System Prompt:
You are a professional translator and content improver. Your task is to translate a German city name, short description, and long description into fluent, natural, and engaging English while maintaining accuracy. Improve the readability and clarity of the descriptions while preserving their original meaning.

Instructions:

Translate the German city name into its commonly used English equivalent (e.g., Nürnberg → Nuremberg).
Translate the short and long descriptions into English, improving fluency, readability, and engagement.
Ensure the tone remains professional and appealing for an audience interested in travel, remote work, and productivity.
Keep the structure and key details intact but refine awkward phrasing.
Return the output in the following JSON format:

'''json
{
    "name_en": "English city name",
    "description_short_en": "Improved English translation of the short description.",
    "description_long_en": "Improved English translation of the long description."
}
'''
`;

type ReturnType = {
  name_en: string;
  description_short_en: string;
  description_long_en: string;
};

export async function translateCity(city: City): Promise<ReturnType | null> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: "https://oai.helicone.ai/v1",
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`
    }
  });

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        { role: "user", content: `German city name: ${city.name_de}\nShort description: ${city.description_short_de}\nLong description: ${city.description_long_de}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "links_object",
          schema: {
            type: "object",
            properties: {
              name_en: {
                type: "string",
                description: "English city name",
              },
              description_short_en: {
                type: "string",
                description: "English short description",
              },
              description_long_en: {
                type: "string",
                description: "English long description",
              },
            },
            required: ["name_en", "description_short_en", "description_long_en"],
          },
        },
      },
    });

    const response_json = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    if (!response_json.name_en || !response_json.description_short_en || !response_json.description_long_en) {
      console.log(`No translation found for ${city.name_de}`);
      return null;
    }

    return response_json;
  } catch (error) {
    console.error(error);
    return null;
  }
}
