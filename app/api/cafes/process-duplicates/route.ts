import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import type { NextRequest } from "next/server";
import { enqueue } from "@/libs/jobs";

export async function POST(request: NextRequest) {
  // Disable in production
  if (isProd) {
    return NextResponse.json(
      { error: "This API route is not available in production" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { limit } = body;

    await enqueue.cafeProcessDuplicates(limit);

    return NextResponse.json({ 
      success: true, 
      message: `Duplicate processing job enqueued${limit ? ` (limit: ${limit})` : ""}` 
    });
  } catch (error) {
    console.error("Error enqueuing job:", error);
    return NextResponse.json(
      { error: "Failed to enqueue job" },
      { status: 500 }
    );
  }
}

