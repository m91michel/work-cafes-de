import { NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import type { NextRequest } from "next/server";
import { enqueue } from "@/libs/jobs";
import { JOB_NAMES } from "@/libs/jobs/job-names";

type Params = Promise<{ jobName: string }>;

// Jobs that can be triggered without parameters
const PARAMETERLESS_JOBS = [
  JOB_NAMES.cafeScheduler,
  JOB_NAMES.cafeProcessDuplicates,
  JOB_NAMES.updateCafeStats,
] as const;

type ParameterlessJobName = (typeof PARAMETERLESS_JOBS)[number];

// Map job names to their enqueue functions
const JOB_ENQUEUE_MAP: Record<ParameterlessJobName, () => Promise<void>> = {
  [JOB_NAMES.cafeScheduler]: () => enqueue.cafeScheduler(),
  [JOB_NAMES.cafeProcessDuplicates]: () => enqueue.cafeProcessDuplicates(),
  [JOB_NAMES.updateCafeStats]: () => enqueue.updateCafeStats(),
};

export async function POST(
  request: NextRequest,
  segmentData: { params: Params }
) {
  // Disable in production
  if (isProd) {
    return NextResponse.json(
      { error: "This API route is not available in production" },
      { status: 404 }
    );
  }

  const params = await segmentData.params;
  const { jobName } = params;

  if (!jobName) {
    return NextResponse.json(
      { error: "Job name is required" },
      { status: 400 }
    );
  }

  // Validate that this is a parameterless job
  if (!PARAMETERLESS_JOBS.includes(jobName as ParameterlessJobName)) {
    return NextResponse.json(
      {
        error: `Job ${jobName} is not supported. Supported jobs: ${PARAMETERLESS_JOBS.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const typedJobName = jobName as ParameterlessJobName;

  try {
    const enqueueFunction = JOB_ENQUEUE_MAP[typedJobName];
    if (!enqueueFunction) {
      return NextResponse.json(
        { error: `No enqueue function found for job ${typedJobName}` },
        { status: 500 }
      );
    }

    await enqueueFunction();

    return NextResponse.json({
      success: true,
      message: `${typedJobName} job has been enqueued`,
    });
  } catch (error) {
    console.error("Error enqueuing job:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to enqueue job",
      },
      { status: 500 }
    );
  }
}

