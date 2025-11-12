import { Job } from 'bullmq';
import { createHash } from 'crypto';
import { cafeQueue } from './index';
import supabase from '../supabase/supabaseClient';

export interface ProcessCafeJobData {
  cafeId: string;
}

export const JOB_NAME = 'process-cafe' as const;

/**
 * Enqueue a job to process a cafe
 */
export async function enqueueProcessCafe(cafeId: string) {
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
export async function processProcessCafe(job: Job<ProcessCafeJobData>) {
  const { cafeId } = job.data;
  
  console.log(`⚡️ Starting ${JOB_NAME} for cafe: ${cafeId}`);

  if (!cafeId) {
    throw new Error('Cafe ID is required');
  }

  try {
    const { data: cafe, error } = await supabase
      .from('cafes')
      .select('*')
      .eq('id', cafeId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching cafe: ${error.message}`);
    }

    if (!cafe) {
      throw new Error('Cafe not found');
    }

    console.log(`✅ Cafe found: ${cafe.name}`);

    return {
      success: true,
      cafe: {
        id: cafe.id,
        name: cafe.name,
        city_slug: cafe.city_slug,
        status: cafe.status,
        address: cafe.address,
        city: cafe.city,
      },
    };
  } catch (error) {
    console.error(`❌ Error in ${JOB_NAME}:`, error);
    throw error;
  }
}

