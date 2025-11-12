import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import type { NextRequest } from "next/server";
import { enqueue } from "@/libs/jobs";
import { JOB_NAMES } from "@/libs/jobs/job-names";

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
    const body = await request.json();
    const { jobName } = body;

    if (!jobName) {
      return NextResponse.json(
        { error: "Job name is required" },
        { status: 400 }
      );
    }

    // Validate job name
    const validJobNames = Object.values(JOB_NAMES);
    if (!validJobNames.includes(jobName)) {
      return NextResponse.json(
        { error: `Invalid job name. Valid options: ${validJobNames.join(", ")}` },
        { status: 400 }
      );
    }

    // Execute the corresponding job based on job name
    switch (jobName) {
      case JOB_NAMES.googleMapsDetails:
        await enqueue.cafeFetchGoogleMapsDetails(id);
        break;
      case JOB_NAMES.cafeFetchReviews:
        await enqueue.cafeFetchReviews(id);
        break;
      case JOB_NAMES.cafeEvalPublishStatus:
        await enqueue.cafeEvalPublishStatus(id);
        break;
      default:
        return NextResponse.json(
          { error: `Job ${jobName} is not supported for individual cafes` },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      success: true, 
      message: `${jobName} job enqueued for cafe ${id}` 
    });
  } catch (error) {
    console.error("Error enqueuing job:", error);
    return NextResponse.json(
      { error: "Failed to enqueue job" },
      { status: 500 }
    );
  }
}

