import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { extractToken } from "@/libs/utils";
import { searchTripAdvisorLocation } from "@/libs/apis/tripAdvisor";
import { Cafe } from "@/libs/types";

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
    .is("tripadvisor_id", null)
    .is("processed->tripadvisor_id_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cafes === null || cafes === undefined || error) {
    console.error("⚠️ Error fetching cafes", error);
    return NextResponse.json({ error: "Error fetching cafes" });
  }

  for (const cafe of cafes) {
    console.log(`⚡️ processing ${cafe.name} ${cafe.address}`);

    const query = `${cafe.name} ${cafe.address}`;
    const tripAdvisorLocations = await searchTripAdvisorLocation({
      searchQuery: query,
    });
    
    if (!tripAdvisorLocations) {
      console.log(`❌ no location found for ${cafe.name} ${cafe.address}`);
      continue;
    }

    const selectedLocation = getTripAdvisorId(tripAdvisorLocations, cafe as Cafe);


    console.log(selectedLocation);


    // const processed = {
    //   ...(typeof cafe?.processed === "object" && cafe?.processed !== null
    //     ? cafe?.processed
    //     : {}),
    //   tripadvisor_id_at: dayjs().toISOString(),
    // };

    
    // const { error } = await supabase
    //   .from("cafes")
    //   .update({
    //     processed,
    //     processed_at: new Date().toISOString(),
    //     // status: 'PROCESSED'
    //   })
    //   .eq("id", cafe.id);

    if (error) {
      console.error(`⚠️ Error updating cafe: ${cafe.name}`, error);
    }
  
    console.log(`🎉 processed ${cafe.name}`);
  }

  console.log(`✅ finished processing ${cafes.length} cafes`);

  return NextResponse.json({ message: "success" });
}

function getTripAdvisorId(tripAdvisorLocations?: any[], cafe?: Cafe) {
  if (!tripAdvisorLocations || !cafe) {
    return null;
  }

  const filteredLocations = tripAdvisorLocations.filter(
    (location) => location.name.includes(cafe.name)
  );

  return filteredLocations[0]?.location_id;
}
