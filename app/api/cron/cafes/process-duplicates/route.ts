import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken, generateSlug } from "@/libs/utils";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit"));

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  let totalProcessedCount = 0;
  let hasDuplicates = true;

  while (hasDuplicates) {
    const {
      data: cafes = [],
      error,
      count = 0,
    } = await supabase
      .from("cafes")
      .select("*", { count: "exact" })
      .eq("status", "DUPLICATE")
      .order("created_at", { ascending: true })
      .limit(1);

    if (cafes === null || cafes === undefined || error) {
      console.error("⚠️ Error fetching cafes", error);
      return NextResponse.json({ error: "Error fetching cafes" });
    }

    // If no more duplicates, break the loop
    if (cafes.length === 0) {
      hasDuplicates = false;
      break;
    }

    let processedCount = 0;
    for (const cafe of cafes) {
      console.log(`⚡️ processing ${cafe.name} in ${cafe.city}`);
      if (!cafe.name || !cafe.city) {
        console.error("⚠️ Cafe name or city is null", cafe);
        continue;
      }

      const { data: duplicates = [] } = await supabase
        .from("cafes")
        .select("*")
        .eq("name", cafe.name)
        .eq("city", cafe.city)
        .order("created_at", { ascending: true });

      if (
        duplicates === null ||
        duplicates === undefined ||
        duplicates.length === 0
      ) {
        console.error("⚠️ No duplicates found for cafe", cafe);
        continue;
      }

      console.log(`⚡️ found ${duplicates.length} duplicates for ${cafe.name}`);
      for (const [index, duplicate] of duplicates.entries()) {
        const slug = generateSlug(`${cafe.name}-${cafe.city}-${index + 1}`);

        const { error } = await supabase
          .from("cafes")
          .update({
            slug,
            status: "NEW",
          })
          .eq("id", duplicate.id);

        if (error) {
          console.error("⚠️ Error updating cafe", error);

          await supabase
            .from("cafes")
            .update({
              status: "ERROR",
            })
            .eq("id", duplicate.id);

          continue;
        }
        console.log(`✅ updated cafe ${duplicate.name} in ${duplicate.city} (${slug})`);
      }

      processedCount++;
      totalProcessedCount++;
    }

    console.log(
      `✅ finished processing batch: ${processedCount}/${cafes.length} cafes. ${
        count ? count - processedCount : 0
      } cafes left`
    );
  }

  console.log(`🎉 Finished processing all duplicates. Total processed: ${totalProcessedCount}`);
  return NextResponse.json({ 
    message: "success",
    totalProcessed: totalProcessedCount 
  });
}
