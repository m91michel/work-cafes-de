import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { Cafe } from "@/libs/types";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// This route is called after a successful login. It exchanges the code for a session and redirects to the callback URL (see config.js).
export async function GET() {
  if (isProd) {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  // get cafes where processed->hours is null or false
  const { data: cafes } = await supabase
    .from("cafes")
    .select("*")
    .is("processed_at", null)
    .limit(10);

  if (!cafes) {
    return NextResponse.json({ message: "No cafes found" }, { status: 404 });
  }

  for (const cafe of cafes) {
    const hours = await processWithOpenAI(cafe);

    const { error } = await supabase
      .from("cafes")
      .update({
        processed_at: new Date().toISOString(),
        open_hours: hours,
      })
      .eq("id", cafe.id);

    if (error) {
      console.log(`Error updating cafe: ${cafe.name}`, error);
    }
  }

  return NextResponse.json({ message: "success", cafes });
}

async function processWithOpenAI(cafe: Cafe) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that extracts from a text input. Format the input text into an array of objects with the following properties: "day", "open", "close".`,
      },
      { role: "user", content: `Open hours for ${cafe.name}` },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "open_hours",
        strict: true,
        schema: {
          type: "object",
          properties: {
            open_hours: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "string" },
                  open: { type: "string" },
                  close: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  });

  console.log(response.choices[0].message.content);

  return response.choices[0].message.content;
}

async function processLinks(text: string) {
  const links = text.match(/https?:\/\/[^\s/$.?#].[^\s]*/g);
  console.log(links);
}
