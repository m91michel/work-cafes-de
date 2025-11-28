import { Job } from 'bullmq';
import { queue as cronQueue } from '../../queues/cron';
import supabase from '../../supabase/supabaseClient';
import { updateCafeCount } from '../../supabase/cities';
import { JOB_NAMES } from '../job-names';

export interface JobData {
  citySlug?: string;
}

export const JOB_NAME = JOB_NAMES.cityUpdateCafeStats;

/**
 * Enqueue a job to update cafe stats
 * @param citySlug - Optional city slug to update stats for a specific city
 * @param delayMinutes - Optional delay in minutes before the job runs (default: 0 = immediate)
 *                      If a job with the same jobId already exists, it will be replaced with the new delay
 */
export async function enqueueJob(citySlug?: string, delayMinutes: number = 0) {
  if (!cronQueue) {
    console.warn(`⚠️ Redis queue not available. Skipping ${JOB_NAME} job${citySlug ? ` for city: ${citySlug}` : ''}`);
    return;
  }

  const jobId = citySlug ? `${JOB_NAME}-${citySlug}` : JOB_NAME;
  
  const jobOptions: {
    jobId: string;
    priority: number;
    delay?: number;
  } = {
    jobId, // Prevent duplicates - same jobId will replace existing delayed job
    priority: 5,
  };

  if (delayMinutes > 0) {
    jobOptions.delay = delayMinutes * 60 * 1000; // Convert minutes to milliseconds
  }
  
  await cronQueue.add(JOB_NAME, { citySlug }, jobOptions);

  console.log(`✅ Enqueued ${JOB_NAME} job${citySlug ? ` for city: ${citySlug}` : ''}${delayMinutes > 0 ? ` with ${delayMinutes} minute delay` : ''}`);
}

/**
 * Process update cafe stats job
 */
export async function processJob(job: Job<JobData>) {
  const { citySlug } = job.data;
  
  console.log(`⚡️ Starting ${JOB_NAME} job${citySlug ? ` for city: ${citySlug}` : ' for all cities'}`);

  try {
    let query = supabase
      .from('cities')
      .select('*')
      .in('status', ['PUBLISHED', 'PROCESSING']);

    if (citySlug) {
      query = query.eq('slug', citySlug);
    }

    const { data: cities, error } = await query;

    if (error) {
      throw new Error(`Error fetching cities: ${error.message}`);
    }

    if (!cities || cities.length === 0) {
      console.log('⚠️ No cities found');
      return { success: true, processed: 0 };
    }

    console.log(`📊 Processing ${cities.length} cities`);

    let processedCount = 0;
    for (const city of cities) {
      await updateCafeCount(city);
      processedCount++;

      await job.updateProgress((processedCount / cities.length) * 100);
    }

    console.log(`✅ Successfully updated stats for ${processedCount} cities`);

    return {
      success: true,
      processed: processedCount,
      citiesProcessed: cities.length,
    };
  } catch (error) {
    console.error(`❌ Error in ${JOB_NAME} job:`, error);
    throw error;
  }
}

