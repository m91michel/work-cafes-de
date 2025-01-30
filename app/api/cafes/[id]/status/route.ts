import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Disable in production
  if (isProd) {
    return NextResponse.json(
      { error: "This API route is not available in production" },
      { status: 403 }
    );
  }

  try {
    const { status } = await request.json();

    // Validate status
    const validStatuses = ["NEW", "PROCESSED", "PUBLISHED", "CLOSED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update cafe status
    const { data, error } = await supabase
      .from("cafes")
      .update({ 
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating cafe status:", error);
      return NextResponse.json(
        { error: "Failed to update cafe status" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in status update route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 