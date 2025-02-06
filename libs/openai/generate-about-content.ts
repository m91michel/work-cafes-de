import OpenAI from "openai";

const PROMPT = `
Du erhältst folgenden Markdown-Text, der den Inhalt einer Café-Webseite beschreibt. Verarbeite diesen Text und generiere daraus sechs Abschnitte, die jeweils exakt 100 Wörter lang sind:

1. **about_de**: Eine kurze Beschreibung des Cafés auf Deutsch, die dessen Ambiente, Philosophie und Besonderheiten zusammenfasst.
2. **about_en**: A short description of the cafe in English, summarizing its ambiance, philosophy, and special features.
3. **food_content_de**: Eine Beschreibung der angebotenen Essensoptionen auf Deutsch. Falls keine Informationen vorhanden sind, gib "NO_INFO" zurück.
4. **food_content_en**: A description of the food options in English. If no information is available, return "NO_INFO".
5. **coffee_content_de**: Eine Beschreibung der Kaffeespezialitäten auf Deutsch, inklusive Angaben zur Kaffeemaschine oder der Herkunft des Kaffees. Falls keine Informationen vorhanden sind, gib "NO_INFO" zurück.
6. **coffee_content_en**: A description of the coffee options in English, including details on the coffee machine or the origin of the coffee. If no information is available, return "NO_INFO".

Der finale Output soll folgendes JSON-Format haben:
{
    "about_de": "kurze Beschreibung zu diesem Café (100 - 300 Wörter)",
    "about_en": "Short description about this cafe (100 - 300 words)",
    "food_content_de": "Beschreibung der Essensoptionen (100 - 300 Wörter) oder 'NO_INFO'",
    "food_content_en": "Description of food options (100 - 300 words) or 'NO_INFO'",
    "coffee_content_de": "Beschreibung der Kaffeespezialitäten (100 - 300 Wörter) oder 'NO_INFO'",
    "coffee_content_en": "Description of coffee options (100 - 300 words) or 'NO_INFO'"
}
`;

type AIResponse = {
  about_de: string;
  about_en: string;
  food_content_de: string;
  food_content_en: string;
  coffee_content_de: string;
  coffee_content_en: string;
}

export async function generateAboutContent(cafeName?: string | null, content?: string): Promise<AIResponse | null> {  
  if (!content) {
    console.log(`❌ content is missing`);
    return null;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        { role: "user", content: `Website content:\n ${content}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "reviews_analysis",
          schema: {
            type: "object",
            properties: {
              about_de: {
                type: "string",
                description: "About the cafe in German (100 words) or 'NO_INFO'",
              },
              about_en: {
                type: "string",
                description: "About the cafe in English (100 words) or 'NO_INFO'",
              },
              food_content_de: {
                type: "string",
                description: "Food content in German (100 words) or 'NO_INFO'",
              },
              food_content_en: {
                type: "string",
                description: "Food content in English (100 words) or 'NO_INFO'",
              },
              coffee_content_de: {
                type: "string",
                description: "Coffee content in German (100 words) or 'NO_INFO'",
              },
              coffee_content_en: {
                type: "string",
                description: "Coffee content in English (100 words) or 'NO_INFO'",  
              },
            },
            required: ["about_de", "about_en", "food_content_de", "food_content_en", "coffee_content_de", "coffee_content_en"],
          },
        },
      },
    });

    const response_json = JSON.parse(
      response.choices[0].message.content || "{}"
    );
    console.log(response_json);

    if (!response_json.about_de) {
      console.log(`No about_de found for ${cafeName}`);
      return null;
    }

    return response_json;
  } catch (error) {
    console.error(error);
    return null;
  }
}
