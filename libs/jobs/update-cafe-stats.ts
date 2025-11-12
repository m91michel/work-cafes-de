import { Job } from 'bullmq';
import { cafeQueue } from './index';
import supabase from '../supabase/supabaseClient';
import { updateCafeCount } from '../supabase/cities';
import { Cafe } from '../types';

export interface UpdateCafeStatsJobData {
  citySlug?: string;
}

export const JOB_NAME = 'update-cafe-stats' as const;

/**
 * Enqueue a job to update cafe stats
 */
export async function enqueueUpdateCafeStats(citySlug?: string) {
  const jobId = citySlug ? `${JOB_NAME}-${citySlug}` : JOB_NAME;
  
  await cafeQueue.add(
    JOB_NAME,
    { citySlug },
    {
      jobId, // Prevent duplicates
      priority: 5,
    }
  );

  console.log(`✅ Enqueued ${JOB_NAME} job${citySlug ? ` for city: ${citySlug}` : ''}`);
}

/**
 * Process update cafe stats job
 */
export async function processUpdateCafeStats(job: Job<UpdateCafeStatsJobData>) {
  const { citySlug } = job.data;
  
  console.log(`⚡️ Starting ${JOB_NAME} job${citySlug ? ` for city: ${citySlug}` : ' for all cities'}`);

  try {
    let query = supabase
      .from('cafes')
      .select('id, city_slug, status')
      .eq('status', 'PUBLISHED');

    if (citySlug) {
      query = query.eq('city_slug', citySlug);
    }

    const { data: cafes, error } = await query;

    if (error) {
      throw new Error(`Error fetching cafes: ${error.message}`);
    }

    if (!cafes || cafes.length === 0) {
      console.log('⚠️ No published cafes found');
      return { success: true, processed: 0 };
    }

    const citySlugs = [...new Set(cafes.map((cafe) => cafe.city_slug).filter(Boolean))];

    console.log(`📊 Processing ${citySlugs.length} cities`);

    let processedCount = 0;
    for (const slug of citySlugs) {
      if (!slug) continue;
      
      const cafeRef: Partial<Cafe> = {
        city_slug: slug,
        status: 'PUBLISHED',
      };

      await updateCafeCount(cafeRef);
      processedCount++;

      await job.updateProgress((processedCount / citySlugs.length) * 100);
    }

    console.log(`✅ Successfully updated stats for ${processedCount} cities`);

    return {
      success: true,
      processed: processedCount,
      citiesProcessed: citySlugs.length,
    };
  } catch (error) {
    console.error(`❌ Error in ${JOB_NAME} job:`, error);
    throw error;
  }
}

