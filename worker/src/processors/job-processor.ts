import { Job } from 'bullmq';
import { jobHandlers, JobData } from '../../../libs/jobs';

export async function processJob(job: Job<JobData>) {
  const startTime = Date.now();
  const jobName = job.name;
  const jobId = job.id;

  console.log(`🚀 Processing job: ${jobName} (ID: ${jobId})`);

  try {
    const handler = jobHandlers[jobName];
    
    if (!handler) {
      throw new Error(`Unknown job type: ${jobName}`);
    }

    const result = await handler(job);

    const duration = Date.now() - startTime;
    console.log(`✅ Job ${jobName} (ID: ${jobId}) completed in ${duration}ms`);

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Job ${jobName} (ID: ${jobId}) failed after ${duration}ms:`, error);
    throw error;
  }
}

