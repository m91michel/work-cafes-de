import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import type { NextRequest } from "next/server";
import { enqueue } from "@/libs/jobs";

type Params = Promise<{ id: string }>

export async function POST(
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

  if (!id) {
    return NextResponse.json(
      { error: "Cafe ID is required" },
      { status: 400 }
    );
  }

  try {
    await enqueue.cafeFetchGoogleMapsDetails(id);

    return NextResponse.json({ 
      success: true, 
      message: `Processing job enqueued for cafe ${id}` 
    });
  } catch (error) {
    console.error("Error enqueuing processing job:", error);
    return NextResponse.json(
      { error: "Failed to enqueue processing job" },
      { status: 500 }
    );
  }
}

