import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { updateImageUrl } from "./_helpers";
import { Cafe } from "@/libs/types";

export const dynamic = 'force-dynamic'
export const revalidate = 0

// This route is called after a successful login. It exchanges the code for a session and redirects to the callback URL (see config.js).
export async function GET() {
  if (isProd) {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  const { data: cafes } = await supabase
          .from("cafes")
          .select("*")
          .eq("processed->broken_image", true)
          .limit(2);

  if (!cafes) {
    return NextResponse.json({ message: "No cafes found" }, { status: 404 });
  }

  const { data: cities = [] } = await supabase
          .from("cities")
          .select("*")

  if (!cities) {
    return NextResponse.json({ message: "No cities found" }, { status: 404 });
  }

  for (const cafe of cafes) {
    await updateImageUrl(cafe as Cafe)
  }

  const processedCafes = cafes.map(cafe => ({
    id: cafe.id,
    name: cafe.name,
    slug: cafe.slug,
    city: cafe.city,
    preview_image: cafe.preview_image,
  }))
  return NextResponse.json({ message: "success", cafes: processedCafes });
}

