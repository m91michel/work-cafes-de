import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";
import { createCityImagePrompt } from "@/libs/openai/create-city-image-prompt";
import { createReplicateImage } from "@/libs/replicate";
import { uploadImageToBunny } from "@/libs/bunny";

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

  console.log(`⚡️ start processing cities (limit: ${limit})`);

  const { data: cities = [], error } = await supabase
    .from("cities")
    .select("name_de, name_en, slug, status")
    .is("preview_image", null)
    .eq("status", "NEW")
    .order("population", { ascending: false })
    .limit(limit);

  if (cities === null || cities === undefined || error) {
    console.error("⚠️ Error fetching cities", error);
    return NextResponse.json({ error: "Error fetching cities" });
  }

  let processed = 0;
  for (const city of cities) {
    if (!city.name_de) {
      console.error("⚠️ City name is null", city);
      continue;
    }

    const prompt = await createCityImagePrompt(city.name_de);
    console.log(`⚡️ generating image for ${city.name_de} prompt: <start>${prompt}<end>`);
    const imageUrl = await createReplicateImage(prompt);

    if (imageUrl) {
      const fileType = getFileType(imageUrl);
      const filename = `${city.slug}-image.${fileType}`;
      const bunnyUrl = await uploadImageToBunny(imageUrl, filename, "cities");

      if (bunnyUrl) {
        const { error: updateError } = await supabase
          .from("cities")
          .update({
            preview_image: bunnyUrl,
          })
          .eq("slug", city.slug);

        if (updateError) {
          console.error(`⚠️ Error updating city ${city.name_de}:`, updateError);
          continue;
        }
        console.log(`🎉 processed ${city.name_de} (${bunnyUrl})`);
        processed++;
      } else {
        console.error(`⚠️ Error uploading image for ${city.name_de}. Bunny URL is null`);
      }
    } else {
      console.error(`⚠️ Error generating image for ${city.name_de}. Image URL is null`);
    }
  }

  console.log(`✅ finished generating ${processed} city images`);

  return NextResponse.json({ message: "success" });
}

function getFileType(url?: string) {
  if (!url) {
    return "jpg";
  }

  const extension = url.split(".").pop();
  return extension;
}
