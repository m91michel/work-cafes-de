import OpenAI from "openai";

const PROMPT = `Du bist ein hilfreicher Assistent, der einen Fließtext mit Öffnungszeiten formatiert. Deine Aufgabe ist es, die Öffnungszeiten von einem Cafe zu formatieren.
- Füge wenn nötig Leerzeichen zwischen den Öffnungszeiten ein.
- Erstelle eine Listen strukturierte Öffnungszeiten.
- Übersetze die Öffnungszeiten in Deutsch.

Beispiel:
- Montag: 10:00 - 18:00
- Dienstag: 10:00 - 18:00
- Mittwoch: 10:00 - 18:00
- Donnerstag: 10:00 - 18:00
- Freitag: 10:00 - 18:00
- Samstag: 10:00 - 18:00
- Sonntag: 10:00 - 18:00

{Weitere Informationen die für den Nutzer interessant sein können z.b. Ausnahmen für Mitglieder oder Digitale Nomaden.}
`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});
export async function processOpenHours(openHours: string): Promise<string | undefined> {
  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        { role: "user", content: `Open hours: ${openHours}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "links_object",
          schema: {
            type: "object",
            properties: {
              open_hours: {
                type: "string",
                description: "Formatted open hours with proper spacing",
              },
            },
            required: ["open_hours"],
          },
        },
      },
    });

    const response_json = JSON.parse(
      response.choices[0].message.content || "{}"
    );

    if (!response_json.open_hours) {
      console.log(`No open hours found`);
      return;
    }

    return response_json.open_hours;
  } catch (error) {
    console.error(error);
    return;
  }
}
