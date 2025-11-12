import { queues } from '../../../libs/queues';
import { JOB_NAMES } from '../../../libs/jobs/job-names';

let schedulerInitialized = false;

export async function initializeScheduler() {
  if (schedulerInitialized) {
    console.log('⚠️ Scheduler already initialized');
    return;
  }

  // In BullMQ v4+, QueueScheduler is no longer needed
  // Repeatable jobs work directly on the Queue
  console.log('✅ Initializing scheduler...');

  // Schedule repeatable jobs
  await scheduleRepeatableJobs();

  schedulerInitialized = true;
  console.log('✅ Scheduler initialized');
}

/**
 * Helper function to check if a repeatable job already exists
 */
async function jobExists(jobId: string): Promise<boolean> {
  try {
    const repeatableJobs = await queues.cafe.getRepeatableJobs();
    return repeatableJobs.some((job) => job.id === jobId);
  } catch (error) {
    console.error(`❌ Error checking for existing job ${jobId}:`, error);
    return false;
  }
}

/**
 * Schedule a repeatable job if it doesn't already exist
 */
async function scheduleJobIfNotExists(
  jobName: string,
  jobId: string,
  cronPattern: string,
  description: string,
  jobData: any = {}
) {
  const exists = await jobExists(jobId);
  
  if (exists) {
    console.log(`ℹ️ Repeatable job already exists: ${jobId} (${description})`);
    return;
  }

  try {
    await queues.cafe.add(
      jobName,
      jobData,
      {
        repeat: {
          pattern: cronPattern,
        },
        jobId,
      }
    );

    console.log(`✅ Scheduled repeatable job: ${jobId} (${description})`);
  } catch (error) {
    console.error(`❌ Error scheduling job ${jobId}:`, error);
    throw error;
  }
}

async function scheduleRepeatableJobs() {
  try {
    // Schedule cafe-scheduler to run every 5 minutes
    // This job will fetch cafes and schedule subsequent jobs for each cafe
    await scheduleJobIfNotExists(
      JOB_NAMES.cafeScheduler,
      'cafe-scheduler-every-5-min',
      '*/5 * * * *', // Every 5 minutes
      'Cafe scheduler (every 5 minutes)',
      {}
    );

    // Schedule update-cafe-stats to run daily at 3 AM
    await scheduleJobIfNotExists(
      JOB_NAMES.updateCafeStats,
      'update-cafe-stats-daily',
      '0 3 * * *', // Daily at 3 AM
      'Update cafe stats (daily at 3 AM)',
      {}
    );

    console.log('✅ All repeatable jobs scheduled');
  } catch (error) {
    console.error('❌ Error scheduling repeatable jobs:', error);
    throw error;
  }
}

export async function listScheduledJobs() {
  const repeatableJobs = await queues.cafe.getRepeatableJobs();
  return repeatableJobs;
}

export async function removeScheduledJob(jobKey: string) {
  await queues.cafe.removeRepeatableByKey(jobKey);
  console.log(`✅ Removed scheduled job: ${jobKey}`);
}

export async function shutdownScheduler() {
  // No cleanup needed in BullMQ v4+ as there's no separate scheduler process
  schedulerInitialized = false;
  console.log('✅ Scheduler shut down');
}

