import { Cafe } from "@/libs/types";
import OpenAI from "openai";

const PROMPT = `
You are a link extraction assistant. When given an input string that includes various labeled links (e.g., "Website:", "Facebook:", "Instagram:", etc.), extract these links and output a JSON object with keys corresponding to each platform. Follow these rules:

Remove any query params like 'mtm_campaign' or 'utm_*' from the links.

1. **Include Only Provided Links:** Only include a key in the JSON if its corresponding link is present in the input. For example, if there is no "Instagram:" link, do not include an "instagram" key.
2. **Additional Platforms:** If additional platforms (beyond a predetermined set) are provided, add them as keys to the JSON object.
3. **Duplicate Domains:** If a domain name (i.e., the same link) appears more than once for a given platform, only include it once.
4. **Lowercase Keys:** All keys in the JSON object must be in lowercase.
5. **Output Format:** Only output the JSON object without any additional commentary or text.

### Examples
#### Input1
"Website: https://www.thecoffeegang.de/ Facebook: https://www.facebook.com/thecoffeegangkoeln/ Instagram: https://www.instagram.com/thecoffeegangkoeln/ MyCaffeGuru: https://www.mycaffeguru.de/thecoffeegangkoeln/"

#### Output1
{ links: {
  "website": "https://www.thecoffeegang.de/",
  "facebook": "https://www.facebook.com/thecoffeegangkoeln/",
  "instagram": "https://www.instagram.com/thecoffeegangkoeln/",
  "mycaffeguru": "https://www.mycaffeguru.de/thecoffeegangkoeln/"
}}

#### Input2
"Website: https://www.thecoffeegang.de/"

#### Output2
{ links: {
  "website": "https://www.thecoffeegang.de/"
}}
`;

type AIResponse = {
  website: string;
  [key: string]: string;
}

export async function processLinks(cafe: Cafe): Promise<AIResponse | null> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: "https://oai.helicone.ai/v1",
    defaultHeaders: {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`
    }
  });

  console.log(`Processing links ${cafe.links_text}`);

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        { role: "user", content: `Links for ${cafe.name}: ${cafe.links_text}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "links_object",
          schema: {
            type: "object",
            properties: {
              links: {
                type: "object",
                description: "Links with platform names as keys",
                patternProperties: {
                  "^[a-z]+$": {
                    type: "string",
                    format: "uri",
                    pattern: "^https?://[\\w\\-\\.]+\\.[a-zA-Z]{2,}(/[\\w\\-\\./?%&=]*)?$"
                  }
                },
                additionalProperties: false
              }
            },
            required: ["links"]
          }
        }
      },
    });

    const response_json = JSON.parse(
      response.choices[0].message.content || "{}"
    );
    console.log(response_json);

    if (Object.keys(response_json.links).length === 0) {
      console.log(`No links found for ${cafe.name}`);
      return null;
    }

    return response_json.links;
  } catch (error) {
    console.error(error);
    return null;
  }
}
