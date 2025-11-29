import { Job } from "bullmq";
import { createHash } from "crypto";
import { queue as cronQueue } from "../../queues/cron";
import { JOB_NAMES } from "../job-names";
import { enqueue } from "..";
import {
  getCafesForGoogleMapsDetails,
  getCafesForGoogleMapsImages,
  getCafesToFetchReviews,
  getCafesToEvaluate,
  getCafesToFetchAboutContent,
  getPublishedCafesForRegularUpdate,
} from "../../supabase/cafe/processing-queries";
import { isProd } from "../../environment";

export const JOB_NAME = JOB_NAMES.cafeScheduler;

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
  fetchReviews: 2,
  evaluateCafes: 5,
  fetchAboutContent: 5,
  updateMaps: 10,
  updateImages: 5,
  regularUpdateOfPublishedCafes: 1, // Regular updates for published cafes
};
export async function processJob(job: Job) {
  console.log(`⚡️ Starting ${JOB_NAME} job ${job.id}`);
  // if (isProd) {
  //   console.log(`⚡️ Skipping ${JOB_NAME} job ${job.id} in production`);
  //   return {
  //     success: true,
  //     skip: true,
  //   };
  // }

  const { data: updateMapDetailsCafes = [], count: updateMapsTotalCount = 0 } =
    await getCafesForGoogleMapsDetails({ limit: processCount.updateMaps });

  for (const cafe of updateMapDetailsCafes || []) {
    console.log(
      `⚡️ Triggering ${JOB_NAMES.googleMapsDetails} for ${cafe.slug}`
    );
    await enqueue.cafeFetchGoogleMapsDetails(cafe.id);
  }

  const {
    data: regularUpdateOfPublishedCafes = [],
    count: regularUpdateOfPublishedCafesTotalCount = 0,
  } = await getPublishedCafesForRegularUpdate({
    limit: processCount.regularUpdateOfPublishedCafes,
  });

  for (const cafe of regularUpdateOfPublishedCafes || []) {
    console.log(
      `⚡️ Triggering ${JOB_NAMES.googleMapsDetails} for ${cafe.slug}`
    );
    await enqueue.cafeFetchGoogleMapsDetails(cafe.id);
  }

  const { data: updateImagesCafes = [], count: updateImagesTotalCount = 0 } =
    await getCafesForGoogleMapsImages({ limit: processCount.updateImages });

  for (const cafe of updateImagesCafes || []) {
    console.log(
      `⚡️ Triggering ${JOB_NAMES.googleMapsImages} for ${cafe.slug}`
    );
    await enqueue.cafeFetchGoogleMapsImages(cafe.id);
  }

  const { data: fetchReviewsCafes = [], count: fetchReviewsTotalCount = 0 } =
    await getCafesToFetchReviews({ limit: processCount.fetchReviews });

  for (const cafe of fetchReviewsCafes || []) {
    console.log(
      `⚡️ Triggering ${JOB_NAMES.cafeFetchReviews} for ${cafe.slug}`
    );
    await enqueue.cafeFetchReviews(cafe.id);
  }

  const { data: evaluateCafes = [], count: evaluateCafesTotalCount = 0 } =
    await getCafesToEvaluate({ limit: processCount.evaluateCafes });

  for (const cafe of evaluateCafes || []) {
    console.log(
      `⚡️ Triggering ${JOB_NAMES.cafeEvalPublishStatus} for ${cafe.name} ${cafe.slug}`
    );
    await enqueue.cafeEvalPublishStatus(cafe.id);
  }

  const {
    data: fetchAboutContentCafes = [],
    count: fetchAboutContentTotalCount = 0,
  } = await getCafesToFetchAboutContent({
    limit: processCount.fetchAboutContent,
  });

  for (const cafe of fetchAboutContentCafes || []) {
    console.log(
      `⚡️ Triggering ${JOB_NAMES.cafeFetchAboutContent} for ${cafe.slug}`
    );
    await enqueue.cafeFetchAboutContent(cafe.id);
  }

  const data = {
    updateMaps: `Updated ${updateMapDetailsCafes.length} of ${updateMapsTotalCount} cafes`,
    regularUpdateOfPublishedCafes: `Updated ${regularUpdateOfPublishedCafes.length} of ${regularUpdateOfPublishedCafesTotalCount} cafes`,
    updateImages: `Updated images for ${updateImagesCafes.length} of ${updateImagesTotalCount} cafes`,
    fetchReviews: `Fetched ${fetchReviewsCafes.length} of ${fetchReviewsTotalCount} cafes`,
    evaluateCafes: `Evaluated ${evaluateCafes.length} of ${evaluateCafesTotalCount} cafes`,
    fetchAboutContent: `Fetched ${fetchAboutContentCafes.length} of ${fetchAboutContentTotalCount} cafes`,
  };
  console.log(data);
  return { success: true, data };
}
