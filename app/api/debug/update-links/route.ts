import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { adjustLinks } from "./_helpers";

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
          .is("processed->links", null)
          .neq("links", null)
          .limit(50);

  if (!cafes) {
    return NextResponse.json({ message: "No cafes found" }, { status: 404 });
  }

  for (const cafe of cafes) {
    const links = await adjustLinks(cafe)
    console.log({
      links,
      original_links: cafe.links,
    })
    if (!links) {
      continue
    }

    const { error } = await supabase.from("cafes").update({ 
      links, 
      processed: {
        links: true,
      },
      processed_at: new Date().toISOString() 
    }).eq("id", cafe.id)
    if (error) {
      console.log(`Error updating cafe: ${cafe.name}`, error)
    }
  }

  const processedCafes = cafes.map(cafe => ({
    id: cafe.id,
    name: cafe.name,
    slug: cafe.slug,
    city: cafe.city,
    links: cafe.links,
    preview_image: cafe.preview_image,
  }))
  return NextResponse.json({ message: "success", cafes: processedCafes });
}

