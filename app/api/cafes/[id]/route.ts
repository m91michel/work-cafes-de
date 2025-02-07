import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import type { NextRequest } from "next/server";

type Params = Promise<{ id: string }>

export async function PATCH(
  request: NextRequest, 
  segmentData: { params: Params }
) {
  const params = await segmentData.params
  const id = params.id

  // Disable in production
  if (isProd) {
    return NextResponse.json(
      { error: "This API route is not available in production" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();

    // Update cafe status
    const { data, error } = await supabase
      .from("cafes")
      .update({ 
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)  // Using awaited id
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