import { Job } from "bullmq";
import { createHash } from "crypto";
import { queue as cronQueue } from "../../queues/cron";
import { JOB_NAMES } from "../job-names";
import { enqueue } from "..";
import { getCitiesForImageGeneration } from "../../supabase/cities/processing-queries";

export const JOB_NAME = JOB_NAMES.cityScheduler;

/**
 * Enqueue a job to process a cafe
 */
export async function enqueueJob() {
  if (!cronQueue) {
    console.warn(`⚠️ Redis queue not available. Skipping ${JOB_NAME} job`);
    return;
  }

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

  console.log(`✅ Enqueued ${JOB_NAME} job (Job ID: ${jobId})`);
}

/**
 * Process a cafe job
 */

const processCount = {
  createPreviewImages: 2,
};
export async function processJob(job: Job) {
  console.log(`⚡️ Starting ${JOB_NAME} job ${job.id}`);

  const {
    data: citiesForImageGeneration = [],
    count: citiesForImageGenerationTotalCount = 0
  } = await getCitiesForImageGeneration({ limit: processCount.createPreviewImages });

  for (const city of citiesForImageGeneration || []) {
    console.log(
      `⚡️ Triggering ${JOB_NAMES.cityGenerateImage} for ${city.slug}`
    );
    await enqueue.cityGenerateImage(city.slug);
  }

  const data = {
    createPreviewImages: `Created preview images for ${citiesForImageGeneration.length} of ${citiesForImageGenerationTotalCount} cities`,
  };
  console.log(data);
  return { success: true, data };
}
