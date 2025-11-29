import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import type { NextRequest } from "next/server";
import { createClient } from "@/libs/supabase/server";

type Params = Promise<{ slug: string }>

export async function PATCH(
  request: NextRequest, 
  segmentData: { params: Params }
) {
  const params = await segmentData.params
  const slug = params.slug

  // Check authentication
  const supabaseServer = await createClient();
  const { data: { session } } = await supabaseServer.auth.getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Disable in production
  if (isProd) {
    return NextResponse.json(
      { error: "This API route is not available in production" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();

    // Update cafe by slug
    const { data, error } = await supabase
      .from("cafes")
      .update({ 
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug)
      .select()
      .single();

    if (error) {
      console.error("Error updating cafe:", error);
      return NextResponse.json(
        { error: "Failed to update cafe" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in cafe update route:", error);
    return NextResponse.json(
      { error: "Internal server error to update cafe" },
      { status: 500 }
    );
  }
}

