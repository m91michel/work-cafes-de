import { Job } from 'bullmq';
import { createHash } from 'crypto';
import { queue as cafeQueue } from '../../queues/cafe';
import supabase from '../../supabase/supabaseClient';
import { outscraperReviewsTask } from '../../apis/outscraper';
import { getKeywords } from '../../cafe-utils';
import { JOB_NAMES } from '../job-names';
import { setCafeAsError, setProcessed } from '../../supabase/cafe/update-actions';
import { Cafe } from '../../types';
import { mergeObjects } from '@/libs/utils';
import { omit } from 'lodash';

export interface JobData {
  cafeId: string;
}

export const JOB_NAME = JOB_NAMES.cafeFetchReviews;

/**
 * Enqueue a job to process a cafe
 */
export async function enqueueJob(cafeId: string) {
  if (!cafeQueue) {
    console.warn(`⚠️ Redis queue not available. Skipping ${JOB_NAME} job for cafe: ${cafeId}`);
    return;
  }

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

  const { data: cafe } = await supabase
    .from('cafes')
    .select("id, google_place_id, name, city_slug, address, review_count, processed, status, cities(country_code)")
    .eq('id', cafeId)
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
      error: `No google_place_id for ${cafeId}`,
    };
  }

  try {
    if ((cafe?.processed as any)?.google_reviews_at) {
      console.log(`⚠️ Skipping ${cafe.name} because it as already been processed`);
      return {
        success: true,
        cafeId,
      };
    }

    await setProcessed({
      ...cafe,
      processed: omit(cafe?.processed as any, "checked_reviews_at"),
    });

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
    await setCafeAsError(cafe, error as Error);
    return {
      success: false,
      cafeId,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
    };
  }
}
