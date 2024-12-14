import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { Cafe } from "@/libs/types";
import OpenAI from "openai";
import { processOpenHours } from "@/libs/openai/process-open-hours";

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
    .select("id, name, open_hours")
    .neq("open_hours", null)
    .is("processed->open_hours", null)
    .limit(30);

  if (!cafes) {
    return NextResponse.json({ message: "No cafes found" }, { status: 404 });
  }

  for (const cafe of cafes) {
    const hours = await processOpenHours(cafe as Cafe);

    console.log(hours);

    const { error } = await supabase
      .from("cafes")
      .update({
        processed_at: new Date().toISOString(),
        processed: {
          open_hours: true,
        },
        open_hours: hours,
      })
      .eq("id", cafe.id);

    if (error) {
      console.log(`Error updating cafe: ${cafe.name}`, error);
    }
  }

  return NextResponse.json({ message: "success", cafes });
}
