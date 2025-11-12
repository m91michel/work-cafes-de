import { Job } from 'bullmq';
import { createHash } from 'crypto';
import { queue as cafeQueue } from '../queues/cafe';
import supabase from '../supabase/supabaseClient';
import { mergeObjects } from '../utils';
import dayjs from 'dayjs';
import { Cafe } from '../types';
import { outscraperReviewsTask } from '../apis/outscraper';
import { getKeywords } from '../cafe-utils';
import { JOB_NAMES } from './job-names';

export interface JobData {
  cafeId: string;
}

export const JOB_NAME = JOB_NAMES.cafeFetchReviews;

/**
 * Enqueue a job to process a cafe
 */
export async function enqueueJob(cafeId: string) {
  // Generate unique job ID using hash of cafeId and timestamp
  const timestamp = Date.now();
  const hash = createHash('sha256')
    .update(`${cafeId}-${timestamp}`)
    .digest('hex')
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

  console.log(`✅ Enqueued ${JOB_NAME} job for cafe: ${cafeId} (Job ID: ${jobId})`);
}

/**
 * Process a cafe job
 */
export async function processJob(job: Job<JobData>) {
  const { cafeId } = job.data;
  
  console.log(`⚡️ Starting ${JOB_NAME} for cafe: ${cafeId}`);

  try {
    if (!cafeId) {
      throw new Error('Cafe ID is required');
    }
    const { data: cafe } = await supabase
      .from('cafes')
      .select("id, google_place_id, name, city_slug, address, review_count, processed, cities(country_code)")
      .eq('id', cafeId)
      .maybeSingle();
    
    if (!cafe || !cafe.google_place_id) {
      throw new Error(`Cafe not found or no google_place_id for ${cafeId}`);
    }

    //@ts-ignore
    if (cafe.processed?.google_reviews_at) {
      console.log(`Skipping ${cafe.name} because it as already been processed`);
      return {
        success: true,
        cafeId,
      };
    }

    await setProcessed(cafe);

    const keywords = getKeywords(cafe.cities?.country_code || "");
    for (const keyword of keywords) {
      await outscraperReviewsTask({
        id: cafe.google_place_id,
        keywords: keyword,
        async: true,
      });

      console.log(`🚀 Outscraper task created for ${cafe.name} and keyword "${keyword}"`);
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
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
    };
  }
}

async function setProcessed(cafe?: Pick<Cafe, "id" | "processed">) {
  if (!cafe) return;

  return await supabase
    .from("cafes")
    .update({
      processed: mergeObjects(cafe?.processed, {
        google_reviews_at: dayjs().toISOString(),
      }),
      processed_at: dayjs().toISOString(),
    })
    .eq("id", cafe.id);
}