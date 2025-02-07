import OpenAI from "openai";

const PROMPT = `
Du erhältst folgenden Markdown-Text, der den Inhalt einer Café-Webseite beschreibt. Diese Webseite "cafezumarbeiten.de" fokussiert sich darauf, Arbeitsmöglichkeiten in Cafés sowie studentenspezifische Angebote hervorzuheben – beispielsweise WLAN-Verfügbarkeit, laptopfreundliche Arbeitsplätze oder besondere Events. Verarbeite diesen Text und generiere daraus acht Abschnitte, die jeweils zwischen 100 und 300 Wörtern lang sein sollen.

WICHTIG: Verwende ausschließlich Informationen, die im bereitgestellten Markdown enthalten sind. Erfinde keine zusätzlichen Details oder Fakten! Falls im Markdown keine Angaben zu einem bestimmten Abschnitt (z. B. WLAN, Remote-Arbeit, Getränkeangebot, Herkunft des Kaffees) vorhanden sind, gib bitte "NO_INFO" zurück.

1. **about_de**: Eine Beschreibung des Cafés auf Deutsch, die dessen Ambiente, Philosophie und Besonderheiten zusammenfasst.
2. **about_en**: A short description of the cafe in English, summarizing its ambiance, philosophy, and special features.
3. **food_content_de**: Eine Beschreibung der angebotenen Essensoptionen auf Deutsch. Falls keine Informationen vorhanden sind, gib "NO_INFO" zurück.
4. **food_content_en**: A description of the food options in English. If no information is available, return "NO_INFO".
5. **drinks_content_de**: Eine Beschreibung der Getränkeauswahl auf Deutsch mit Schwerpunkt auf Kaffee, inklusive Angaben zur Zubereitung oder Herkunft des Kaffees. Falls keine Informationen vorhanden sind, gib "NO_INFO" zurück.
6. **drinks_content_en**: A description of the drink selection in English, focusing on coffee, including details on preparation or coffee origin. If no information is available, return "NO_INFO".
7. **work_friendly_de**: Nur wenn Angeben! Information ob WLAN und Steckdosen vorhanden sind. Falls keine Informationen vorhanden sind, gib "NO_INFO" zurück.
8. **work_friendly_en**: If available! Information if WIFI and power outlets are available. Return "NO_INFO" if there is no information about work-friendly features.

Der finale Output soll folgendes JSON-Format haben:
{
    "about_de": "Beschreibung auf Deutsch (100-300 Wörter)",
    "about_en": "Description in English (100-300 words)",
    "food_content_de": "Beschreibung der Essensoptionen auf Deutsch (100-300 Wörter) oder 'NO_INFO'",
    "food_content_en": "Description of food options in English (100-300 words) or 'NO_INFO'",
    "drinks_content_de": "Beschreibung der Getränkeauswahl auf Deutsch (100-300 Wörter) oder 'NO_INFO'",
    "drinks_content_en": "Description of the drink selection in English (100-300 words) or 'NO_INFO'",
    "work_friendly_de": "'NO_INFO' or information about WIFI and power outlets (German)",
    "work_friendly_en": "'NO_INFO' or information about WIFI and power outlets (English)"
}
`;

type AIResponse = {
  about_de?: string | null;
  about_en?: string | null;
  food_content_de?: string | null;
  food_content_en?: string | null;
  drinks_content_de?: string | null;
  drinks_content_en?: string | null;
  work_friendly_de?: string | null;
  work_friendly_en?: string | null;
}

export async function generateAboutContent(content?: string, cafeName?: string | null, cafeCity?: string | null): Promise<AIResponse | null> {  
  console.log(`🪄 starting to generate about content`);
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
        {
          role: "user", content: `
          ${cafeName ? `Cafe name: ${cafeName}` : ''}
          ${cafeCity ? `City: ${cafeCity}` : ''}
          Website content:\n ${content}`
        },
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
                description: "About the cafe in German or 'NO_INFO'",
              },
              about_en: {
                type: "string",
                description: "About the cafe in English or 'NO_INFO'",
              },
              food_content_de: {
                type: "string",
                description: "Food content in German or 'NO_INFO'",
              },
              food_content_en: {
                type: "string",
                description: "Food content in English or 'NO_INFO'",
              },
              drinks_content_de: {
                type: "string",
                description: "Drinks content in German or 'NO_INFO'",
              },
              drinks_content_en: {
                type: "string",
                description: "Drinks content in English or 'NO_INFO'",  
              },
              work_friendly_de: {
                type: "string",
                description: "'NO_INFO' or information about WIFI and power outlets (German)",
              },
              work_friendly_en: {
                type: "string",
                description: "'NO_INFO' or information about WIFI and power outlets (English)",
              },
            },
            required: ["about_de", "about_en", "food_content_de", "food_content_en", "drinks_content_de", "drinks_content_en", "work_friendly_de", "work_friendly_en"],
          },
        },
      },
    });

    const response_json: AIResponse = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    if (!response_json.about_de) {
      console.log(`No about_de found for ${cafeName}`);
      return null;
    }

    const responseContent = normalizeResponse(response_json);
    console.log(`de content`, {
      about: responseContent.about_de,
      food: responseContent.food_content_de,
      drinks: responseContent.drinks_content_de,
      work_friendly: responseContent.work_friendly_de
    });
    return responseContent;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function normalizeResponse(response: AIResponse) {
  return {
    about_de: normalizeValue(response.about_de),
    about_en: normalizeValue(response.about_en),
    food_content_de: normalizeValue(response.food_content_de),
    food_content_en: normalizeValue(response.food_content_en),
    drinks_content_de: normalizeValue(response.drinks_content_de),
    drinks_content_en: normalizeValue(response.drinks_content_en),
    work_friendly_de: normalizeValue(response.work_friendly_de),
    work_friendly_en: normalizeValue(response.work_friendly_en),
  }
}

function normalizeValue(str?: string | null) {
  if (!str) {
    return null;
  }

  if (str === "NO_INFO") {
    return null;
  }

  return str.replace(/^"|"$/g, '');
}