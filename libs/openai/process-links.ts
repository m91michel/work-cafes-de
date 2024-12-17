import { Cafe } from "@/libs/types";
import OpenAI from "openai";

const PROMPT = `You are a helpful assistant that formats a string with links. Your task is to add whitespace between the links and the text. 
For example: "Website: http://www.thecoffeegang.de/Facebook: https://www.facebook.com/thecoffeegangkoeln/" should be formatted as "Website: http://www.thecoffeegang.de Facebook: https://www.facebook.com/thecoffeegangkoeln/"
You can remove any additional text or formatting. Just keep a list of links with the format "Source: <link>"
In case one link is not valid, remove it from the list.
`;

export async function adjustLinks(cafe: Cafe) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        { role: "user", content: `Links for ${cafe.name}: ${cafe.links}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "links_object",
          schema: {
            type: "object",
            properties: {
              links: {
                type: "string",
                description: "Formatted links with proper spacing",
              },
            },
            required: ["links"],
          },
        },
      },
    });

    const response_json = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    if (!response_json.links) {
      console.log(`No links found for ${cafe.name}`);
      return null;
    }

    return response_json.links;
  } catch (error) {
    console.error(error);
    return null;
  }
}
