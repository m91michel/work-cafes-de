import { Job } from "bullmq";
import { createHash } from "crypto";
import { queue as cafeQueue } from "../../queues/cafe";
import supabase from "../../supabase/supabaseClient";
import { mergeObjects } from "../../utils";
import dayjs from "dayjs";
import { Cafe } from "../../types";
import { JOB_NAMES } from "../job-names";

import { getJinaContent } from "../../apis/jinaAi";
import { generateAboutContent } from "../../openai/generate-about-content";

export interface JobData {
  cafeId: string;
}

export const JOB_NAME = JOB_NAMES.cafeFetchAboutContent;

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

  const timerLabel = `⚡️ ${cafeId}`;
  console.time(timerLabel);

  try {
    console.log(`⚡️ processing ${cafe.name} ${cafe.address}`);

    let content: string | null = cafe.website_content;
    if (!content) {
      content = await getJinaContent(cafe.website_url);
    }

    if (!content) {
      throw new Error(`No website content found for ${cafe.name}`);
    }

    const result = await generateAboutContent(content, cafe.name, cafe.city);

    if (!result) {
      throw new Error(`No about content generated for ${cafe.name}`);
    }

    const { error: updateError } = await supabase
      .from("cafes")
      .update({
        website_content: content,
        about_content: {
          de: result.about_de,
          en: result.about_en,
        },
        food_contents: {
          de: result.food_content_de,
          en: result.food_content_en,
        },
        drinks_content: {
          de: result.drinks_content_de,
          en: result.drinks_content_en,
        },
        work_friendly_content: {
          de: result.work_friendly_de,
          en: result.work_friendly_en,
        },
        updated_at: dayjs().toISOString(),
        processed: mergeObjects(cafe?.processed, {
          fetched_website_content_at: dayjs().toISOString(),
        }),
        processed_at: dayjs().toISOString(),
      })
      .eq("id", cafe.id);

    if (updateError) {
      throw new Error(`Error updating cafe: ${cafe.name}`, updateError);
    }

    console.timeEnd(timerLabel);
    console.log(`✅ processed ${cafe.name} (${cafeId})`);

    return {
      success: true,
      cafeId,
    };
  } catch (error) {
    console.error(`❌ Error in ${JOB_NAME} for cafe ${cafeId}:`, error);
    console.timeEnd(timerLabel);
    await setCafeAsProcessed(cafe);

    return {
      success: false,
      cafeId,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    };
  }
}

async function setCafeAsProcessed(cafe?: Cafe) {
  if (!cafe) return;

  const { error: updateError } = await supabase
    .from("cafes")
    .update({
      processed: mergeObjects(cafe?.processed, {
        fetched_website_content_at: dayjs().toISOString(),
      }),
    })
    .eq("id", cafe.id);

  if (updateError) {
    console.log(`❌ about not updated for ${cafe.name}`);
  }
}
