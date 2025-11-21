import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import { extractToken } from "@/libs/utils";
import { processDuplicates } from "@/libs/jobs/cafe/cafe-process-duplicates";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const result = await processDuplicates(limit);
    return NextResponse.json({ 
      message: "success",
      totalProcessed: result.totalProcessed 
    });
  } catch (error) {
    console.error("Error processing duplicates:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error processing duplicates" },
      { status: 500 }
    );
  }
}
