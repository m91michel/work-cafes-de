import { Job } from "bullmq";
import { createHash } from "crypto";
import { queue as cronQueue } from "../../queues/cron";
import supabase from "../../supabase/supabaseClient";
import { JOB_NAMES } from "../job-names";
import { enqueue } from "..";

export const JOB_NAME = JOB_NAMES.cafeScheduler;

/**
 * Enqueue a job to process a cafe
 */
export async function enqueueJob() {
  // Generate unique job ID using hash of cafeId and timestamp
  const timestamp = Date.now();
  const hash = createHash("sha256")
    .update(`${timestamp}`)
    .digest("hex")
    .substring(0, 16); // Use first 16 chars for shorter ID
  const jobId = `${JOB_NAME}-${hash}`;

  await cronQueue.add(
    JOB_NAME,
    {},
    {
      jobId,
      priority: 10, // Higher priority for scheduler jobs
    }
  );

  console.log(
    `✅ Enqueued ${JOB_NAME} job (Job ID: ${jobId})`
  );
}

/**
 * Process a cafe job
 */
export async function processJob(job: Job) {
  console.log(`⚡️ Starting ${JOB_NAME} job ${job.id}`);

  const {
    data: updateMapDetailsCafes = [],
    count: updateMapsTotalCount = 0,
  } = await supabase
    .from("cafes")
    .select("*", { count: "exact" })
    .not("google_place_id", "is", null)
    .gte("review_count", 1) // only process cafes with at least 1 review
    .is("processed->google_details_at", null)
    .in("status", ["NEW", "PROCESSED", "UNKNOWN"])
    .order("created_at", { ascending: true })
    .limit(10);

  for (const cafe of updateMapDetailsCafes || []) {
    console.log(`⚡️ processing ${cafe.name} ${cafe.address}`);
    await enqueue.cafeFetchGoogleMapsDetails(cafe.id);
  }

  return {
    success: true,
    data: {
      updateMaps: `Updated ${updateMapsTotalCount} of ${updateMapsTotalCount} cafes`,
    },
  };
}
