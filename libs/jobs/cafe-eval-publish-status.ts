import { Job } from "bullmq";
import { createHash } from "crypto";
import { queue as cafeQueue } from "../queues/cafe";
import supabase from "../supabase/supabaseClient";
import { mergeObjects } from "../utils";
import dayjs from "dayjs";
import { analyzeReviews } from "../openai/analyze-reviews";
import { prepareReviews } from "../review-utils";
import { isDev } from "../environment";
import { JOB_NAMES } from "./job-names";

export interface JobData {
  cafeId: string;
}

export const JOB_NAME = JOB_NAMES.cafeEvalPublishStatus;

/**
 * Enqueue a job to process a cafe
 */
export async function enqueueJob(cafeId: string) {
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

  try {
    if (!cafeId) {
      throw new Error("Cafe ID is required");
    }
    const { data: cafe } = await supabase
      .from("cafes")
      .select("*")
      .eq("id", cafeId)
      .maybeSingle();

    if (!cafe) {
      throw new Error(`Cafe not found for id: ${cafeId}`);
    }

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

    console.log(`✅ processed ${cafe.name} (${cafeId})`);

    return {
      success: true,
      cafeId,
    };
  } catch (error) {
    console.error(`❌ Error in ${JOB_NAME} for cafe ${cafeId}:`, error);
    return {
      success: false,
      cafeId,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    };
  }
}
