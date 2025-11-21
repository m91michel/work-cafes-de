import { Job } from 'bullmq';
import { createHash } from 'crypto';
import { queue as cronQueue } from '../../queues/cron';
import supabase from '../../supabase/supabaseClient';
import { generateSlug } from '../../utils';
import { JOB_NAMES } from '../job-names';

export interface JobData {
  limit?: number;
}

export const JOB_NAME = JOB_NAMES.cafeProcessDuplicates;

/**
 * Enqueue a job to process duplicate cafes
 */
export async function enqueueJob(limit?: number) {
  if (!cronQueue) {
    console.warn(`⚠️ Redis queue not available. Skipping ${JOB_NAME} job`);
    return;
  }

  // Generate unique job ID using hash of timestamp
  const timestamp = Date.now();
  const hash = createHash('sha256')
    .update(`${timestamp}`)
    .digest('hex')
    .substring(0, 16); // Use first 16 chars for shorter ID
  const jobId = `${JOB_NAME}-${hash}`;
  
  await cronQueue.add(
    JOB_NAME,
    { limit },
    {
      jobId,
      priority: 10, // Higher priority for duplicate processing
    }
  );

  console.log(`✅ Enqueued ${JOB_NAME} job (Job ID: ${jobId})`);
}

/**
 * Process duplicate cafes
 */
export async function processDuplicates(limit?: number) {
  let totalProcessedCount = 0;
  let hasDuplicates = true;

  while (hasDuplicates) {
    const {
      data: cafes = [],
      error,
      count = 0,
    } = await supabase
      .from("cafes")
      .select("*", { count: "exact" })
      .eq("status", "DUPLICATE")
      .order("created_at", { ascending: true })
      .limit(limit || 1);

    if (cafes === null || cafes === undefined || error) {
      console.error("⚠️ Error fetching cafes", error);
      throw new Error(`Error fetching cafes: ${error?.message || "Unknown error"}`);
    }

    // If no more duplicates, break the loop
    if (cafes.length === 0) {
      hasDuplicates = false;
      break;
    }

    let processedCount = 0;
    for (const cafe of cafes) {
      console.log(`⚡️ processing ${cafe.name} in ${cafe.city}`);
      if (!cafe.name || !cafe.city) {
        console.error("⚠️ Cafe name or city is null", cafe);
        continue;
      }

      const { data: duplicates = [] } = await supabase
        .from("cafes")
        .select("*")
        .eq("name", cafe.name)
        .eq("city", cafe.city)
        .order("created_at", { ascending: true });

      if (
        duplicates === null ||
        duplicates === undefined ||
        duplicates.length === 0
      ) {
        console.error("⚠️ No duplicates found for cafe", cafe);
        continue;
      }

      console.log(`⚡️ found ${duplicates.length} duplicates for ${cafe.name}`);
      for (const [index, duplicate] of duplicates.entries()) {
        const slug = generateSlug(`${cafe.name}-${cafe.city}-${index + 1}`);

        const { error } = await supabase
          .from("cafes")
          .update({
            slug,
            status: "NEW",
          })
          .eq("id", duplicate.id);

        if (error) {
          console.error("⚠️ Error updating cafe", error);

          await supabase
            .from("cafes")
            .update({
              status: "ERROR",
            })
            .eq("id", duplicate.id);

          continue;
        }
        console.log(`✅ updated cafe ${duplicate.name} in ${duplicate.city} (${slug})`);
      }

      processedCount++;
      totalProcessedCount++;
    }

    console.log(
      `✅ finished processing batch: ${processedCount}/${cafes.length} cafes. ${
        count ? count - processedCount : 0
      } cafes left`
    );
  }

  console.log(`🎉 Finished processing all duplicates. Total processed: ${totalProcessedCount}`);
  return {
    totalProcessed: totalProcessedCount,
  };
}

/**
 * Process a duplicate cafes job
 */
export async function processJob(job: Job<JobData>) {
  const { limit } = job.data;
  
  console.log(`⚡️ Starting ${JOB_NAME} (limit: ${limit || "unlimited"})`);

  try {
    const result = await processDuplicates(limit);
  
    console.log(`✅ Finished ${JOB_NAME}. Total processed: ${result.totalProcessed}`);

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error(`❌ Error in ${JOB_NAME}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
    };
  }
}

