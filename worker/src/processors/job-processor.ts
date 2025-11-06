import { Job } from 'bullmq';
import { updateCafeStats, UpdateCafeStatsJobData } from '../jobs/update-cafe-stats';

export type JobData = UpdateCafeStatsJobData;

export async function processJob(job: Job<JobData>) {
  const startTime = Date.now();
  const jobName = job.name;
  const jobId = job.id;

  console.log(`🚀 Processing job: ${jobName} (ID: ${jobId})`);

  try {
    let result;

    switch (jobName) {
      case 'update-cafe-stats':
        result = await updateCafeStats(job as Job<UpdateCafeStatsJobData>);
        break;
      default:
        throw new Error(`Unknown job type: ${jobName}`);
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Job ${jobName} (ID: ${jobId}) completed in ${duration}ms`);

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Job ${jobName} (ID: ${jobId}) failed after ${duration}ms:`, error);
    throw error;
  }
}

