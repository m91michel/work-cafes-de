import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { generateSlug } from "@/libs/utils";

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

  const { data: cities } = await supabase.from("cities").select("*")

  if (!cafes) {
    return NextResponse.json({ message: "No cafes found" }, { status: 404 });
  }

  for (const cafe of cafes) {
    const city_slug = cities?.find(city => city.name === mapTranslatedCities(cafe.city))?.slug
    if (!city_slug) {
      console.log(`City not found for cafe: ${cafe.name} ${cafe.city}`)
      continue
    }
    const cafe_slug = generateSlug(`${city_slug}-${cafe.name}`)

    const { error } = await supabase.from("cafes").update({ 
        slug: cafe_slug,
        city_slug: city_slug
    }).eq("id", cafe.id)

    if (error) {
      console.log(`Error updating cafe: ${cafe.name}`, error)
    }
  }

  return NextResponse.json({ message: "success", cafes });
}

function mapTranslatedCities(cityName?: string | null) {
    if (!cityName) {
        return null
    }

    if (cityName === "Cologne") {
        return "Köln"
    }

    if (cityName === "Munich") {
        return "München"
    }

    return cityName
}