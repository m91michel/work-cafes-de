import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken, mergeObjects } from "@/libs/utils";
import { generateAboutContent } from "@/libs/openai/generate-about-content";
import { getJinaContent } from "@/libs/apis/jinaAi";
import { Cafe } from "@/libs/types";
import dayjs from "dayjs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const maxDuration = 60;

const LIMIT = 1;

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") || LIMIT);
  const force = searchParams.get("force") === "true";

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  console.log(`⚡️ start processing cafes (limit: ${limit}, force: ${force})`);

  const { data: cafes = [], error, count } = await supabase
    .from("cafes")
    .select("*", { count: "exact" })
    .eq("status", "PUBLISHED")
    .not("website_url", "is", null)
    // .not("website_content", "is", null)
    .is("processed->fetched_website_content_at", null)
    .order("created_at", { ascending: true })
    // .eq("id", "6175fbd2-1078-4d2b-b08b-208c57509faf")
    .limit(limit);

  if (cafes === null || cafes === undefined || error) {
    console.error("⚠️ Error fetching cafes", error);
    return NextResponse.json({ error: "Error fetching cafes" });
  }

  let processedCount = 0;
  for (const cafe of cafes) {
    const timerLabel = `⚡️ ${cafe.name} (${cafe.id})`;
    console.time(timerLabel);
    console.log(`⚡️ processing ${cafe.name} ${cafe.address}`);

    let content: string | null = cafe.website_content;
    if (!content || force) {
      content = await getJinaContent(cafe.website_url);
    }
    
    if (!content) {
      console.log(`❌ content not found res: ${content}`);
      console.timeEnd(timerLabel);
      await setCafeAsProcessed(cafe);
      continue;
    }

    const result = await generateAboutContent(content, cafe.name, cafe.city);

    if (!result) {
      console.log(`❌ about not generated for ${cafe.name}`);
      console.timeEnd(timerLabel);
      await setCafeAsProcessed(cafe);
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
        drinks_content: {
          de: result.drinks_content_de,
          en: result.drinks_content_en,
        },
        work_friendly_content: {
          de: result.work_friendly_de,
          en: result.work_friendly_en,
        },
        updated_at: dayjs().toISOString(),
        processed: mergeObjects(cafe?.processed, {
          fetched_website_content_at: dayjs().toISOString(),
        }),
        processed_at: dayjs().toISOString(),
      })
      .eq("id", cafe.id);

    if (updateError) {
      console.log(`❌ about not updated for ${cafe.name}`);
      console.timeEnd(timerLabel);
      continue;
    }

    console.log(`✅ about generated for ${cafe.name}`);
    console.timeEnd(timerLabel);
    processedCount++;
  }

  console.log(`✅ finished processing ${processedCount}/${cafes.length} cafes. ${count ? count - processedCount : 0} cafes left`);

  return NextResponse.json({ message: "success" });
}

async function setCafeAsProcessed(cafe: Cafe) {
  const { error: updateError } = await supabase
    .from("cafes")
    .update({
      processed: mergeObjects(cafe?.processed, {
        fetched_website_content_at: dayjs().toISOString(),
      }),
    })
    .eq("id", cafe.id);

  if (updateError) {
    console.log(`❌ about not updated for ${cafe.name}`);
  }
}