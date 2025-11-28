import { Job } from "bullmq";
import { createHash } from "crypto";
import { queue as cafeQueue } from "../../queues/cafe";
import supabase from "../../supabase/supabaseClient";
import { mergeObjects } from "../../utils";
import dayjs from "dayjs";
import { analyzeReviews } from "../../openai/analyze-reviews";
import { prepareReviews } from "../../review-utils";
import { isDev } from "../../environment";
import { JOB_NAMES } from "../job-names";
import { setCafeAsError } from "../../supabase/cafe/update-actions";
import { enqueueJob as enqueueUpdateCafeStats } from "../cron/update-cafe-stats";

export interface JobData {
  cafeId: string;
}

export const JOB_NAME = JOB_NAMES.cafeEvalPublishStatus;

/**
 * Enqueue a job to process a cafe
 */
export async function enqueueJob(cafeId: string) {
  if (!cafeQueue) {
    console.warn(
      `⚠️ Redis queue not available. Skipping ${JOB_NAME} job for cafe: ${cafeId}`
    );
    return;
  }

  // Generate unique job ID using hash of cafeId and timestamp
  const timestamp = Date.now();
  const hash = createHash("sha256")
    .update(`${cafeId}-${timestamp}`)
    .digest("hex")
    .substring(0, 16); // Use first 16 chars for shorter ID
  const jobId = `${JOB_NAME}-${cafeId}-${hash}`;

  await cafeQueue.add(
    JOB_NAME,
    { cafeId },
    {
      jobId,
      priority: 10, // Higher priority for individual cafe processing
    }
  );

  console.log(
    `✅ Enqueued ${JOB_NAME} job for cafe: ${cafeId} (Job ID: ${jobId})`
  );
}

/**
 * Process a cafe job
 */
export async function processJob(job: Job<JobData>) {
  const { cafeId } = job.data;

  console.log(`⚡️ Starting ${JOB_NAME} for cafe: ${cafeId}`);

  const { data: cafe } = await supabase
    .from("cafes")
    .select("*")
    .eq("id", cafeId)
    .maybeSingle();

  if (!cafe) {
    return {
      success: false,
      cafeId,
      error: `Cafe not found for ${cafeId}`,
    };
  }
  if (!cafe.google_place_id) {
    return {
      success: false,
      cafeId,
      error: `No google_place_id for cafe ${cafeId}`,
    };
  }

  try {
    const { data: reviews = [], error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .eq("cafe_id", cafe.id)
      .order("created_at", { ascending: false });

    if (reviewsError || reviews === null) {
      throw new Error(
        `Error fetching reviews: ${cafe.name} ${reviewsError?.message || "Unknown error"}`
      );
    }

    const gtpReviews = prepareReviews(reviews || []);

    const aiResult = await analyzeReviews(gtpReviews);

    if (isDev) {
      console.log(`👀 AI Result for ${cafe.name}:`, aiResult);
    }

    if (!aiResult?.status) {
      throw new Error(`No status found for cafe: ${cafe.name}`);
    }

    const publishedAt =
      aiResult.status === "PUBLISHED" ? dayjs().toISOString() : null;

    const { error: updateError } = await supabase
      .from("cafes")
      .update({
        status: aiResult.status,
        discard_reason: aiResult.status_reasoning,
        wifi_qualitity: aiResult.wifi_quality,
        ambiance: aiResult.ambiance,
        seating_comfort: aiResult.seating_comfort,
        processed: mergeObjects(cafe?.processed, {
          checked_reviews_at: dayjs().toISOString(),
        }),
        checked: "AUTOMATED",
        processed_at: dayjs().toISOString(),
        published_at: publishedAt,
      })
      .eq("id", cafe.id);

    if (updateError) {
      throw new Error(`Error updating cafe: ${cafe.name}`, updateError);
    }

    // If cafe was published, enqueue a delayed job to update city cafe stats
    // The delay ensures we batch multiple cafe publications together
    // If another cafe is published within 5 minutes, the job will be replaced with a new 5-minute delay
    if (aiResult.status === "PUBLISHED" && cafe.city_slug) {
      await enqueueUpdateCafeStats(cafe.city_slug, 15);
    }

    console.log(`✅ processed ${cafe.name} (${cafeId})`);

    return {
      success: true,
      cafeId,
    };
  } catch (error) {
    console.error(`❌ Error in ${JOB_NAME} for cafe ${cafeId}:`, error);
    await setCafeAsError(cafe, error as Error);
    return {
      success: false,
      cafeId,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    };
  }
}
