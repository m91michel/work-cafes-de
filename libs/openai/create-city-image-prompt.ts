import OpenAI from "openai";
import { imageModel } from "../replicate";

const PROMPT = `
You are an AI that generates detailed image prompts for an AI image model. Your task is to create a high-quality, photorealistic cityscape image prompt for the given city. The image should emphasize a specific aspect, such as time of day, architectural highlights, or atmospheric conditions. Follow this structured format:"

## 1. General Scene Description
Describe the city’s skyline or key landmarks.
Include relevant architectural elements (e.g., historic, modern, or mixed styles).
Mention any significant locations (e.g., churches, bridges, towers, plazas).

## 2. Time of Day & Lighting Variations
Choose one of the following variations:

- Golden Hour: Warm, soft sunlight casting long shadows, vibrant reflections on glass buildings.
- Evening: City lights turning on, creating a cozy, urban glow with deep blue skies.
- Night: A lively cityscape illuminated by streetlights, neon signs, and building lights.
- Foggy Morning: A mysterious, misty atmosphere with diffused light and muted colors.
- Winter Evening: Snow-covered rooftops, warm lights glowing through windows, and a festive mood.

## 3. Atmosphere & Mood Enhancements
Adjust the weather conditions (clear, cloudy, rainy, foggy).
Include seasonal details (autumn leaves, snow, summer greenery).
Define the ambiance (romantic, vibrant, peaceful, futuristic).

## 4. Example Output
"A high-quality, scenic cityscape of Munich, Germany, during golden hour. The Frauenkirche and New Town Hall stand tall, bathed in warm, golden light, with soft clouds in the background. The rooftops glow under the evening sky, while streetlights slowly start to illuminate the bustling city streets. The atmosphere is vibrant yet serene, capturing the essence of a European metropolis."
`;

export async function createCityImagePrompt(city: string) {  
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
        { role: "user", content: `City: ${city}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "city_image_prompt",
          schema: {
            type: "object",
            properties: {
              prompt: {
                type: "string",
                description: "Formatted city image prompt",
              },
            },
            required: ["prompt"],
          },
        },
      },
    });

    const response_json = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    if (!response_json.prompt) {
      console.log(`No prompt found for ${city}`);
      return null;
    }

    return response_json.prompt;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// mock: return Promise.resolve(`Erlangen (A high-quality, scenic cityscape of Erlangen, Germany, during evening time. The iconic Markgrafentheater and the stunning Church of St. John rise gracefully against the deepening blue sky, their historic facades glowing under the warm light of street lamps. The surrounding streets are bustling with locals and visitors, as cozy cafes begin to illuminate their patios. A gentle breeze stirs the lush greenery of the nearby parks, while old oak trees line the picturesque avenues, adding to the tranquil yet vibrant atmosphere of this charming university town.)`);