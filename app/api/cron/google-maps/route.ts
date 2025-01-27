import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { data: cafes = [], error } = await supabase
    .from("cafes")
    .select("id, google_place_id, name, address")
    .not("google_place_id", "is", null)
    .is("google_reviews", null)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!cafes || error) {
    console.error("Error fetching cafes", error);
    return NextResponse.json({ error: "Error fetching cafes" }, { status: 500 });
  }

  for (const cafe of cafes) {
    console.log(`processing ${cafe.name} ${cafe.address}`);
  }

  return NextResponse.json({ message: "success", cafes });
}