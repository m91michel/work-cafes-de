import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";
import { generateAboutContent } from "@/libs/openai/generate-about-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const maxDuration = 60;

const LIMIT = 1;

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") || LIMIT);

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  console.log(`⚡️ start processing cafes (limit: ${limit})`);

  const { data: cafes = [], error } = await supabase
    .from("cafes")
    .select("*")
    .eq("status", "PUBLISHED")
    .is("about_content", null)
    .is("website_content", null)
    .not("website_url", "is", null)
    .limit(limit);

  if (cafes === null || cafes === undefined || error) {
    console.error("⚠️ Error fetching cafes", error);
    return NextResponse.json({ error: "Error fetching cafes" });
  }

  let count = 0;
  for (const cafe of cafes) {
    console.log(`⚡️ processing ${cafe.name} ${cafe.address}`);

    // jina ai to get the content as markdown
    // example: https://r.jina.ai/https://cafe-uetelier.de/
    const content = await fetch(`https://r.jina.ai/${cafe.website_url}`).then(res => res.text());

    const result = await generateAboutContent(cafe.name, content);

    if (!result) {
      console.log(`❌ about not generated for ${cafe.name}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from("cafes")
      .update({
        website_content: content,
        about_content: {
          de: result.about_de,
          en: result.about_en,
        },
        food_contents: {
          de: result.food_content_de,
          en: result.food_content_en,
        },
        coffee_content: {
          de: result.coffee_content_de,
          en: result.coffee_content_en,
        },
      })
      .eq("id", cafe.id);

    if (updateError) {
      console.log(`❌ about not updated for ${cafe.name}`);
      continue;
    }

    console.log(`✅ about generated for ${cafe.name}`);
    count++;
  }

  console.log(`✅ finished processing ${count}/${cafes.length} cafes`);

  return NextResponse.json({ message: "success" });
}

