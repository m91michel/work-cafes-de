import { cafeQueue } from '../../../libs/jobs';

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

async function scheduleRepeatableJobs() {
  try {
    // Check if the repeatable job already exists
    const repeatableJobs = await cafeQueue.getJobSchedulers();
    const existingJob = repeatableJobs.find(
      (job) => job.id === 'update-cafe-stats-daily'
    );

    if (existingJob) {
      console.log('ℹ️ Repeatable job already exists: update-cafe-stats-daily');
      return;
    }

    // Schedule update-cafe-stats to run daily at 3 AM
    await cafeQueue.add(
      'update-cafe-stats',
      {},
      {
        repeat: {
          pattern: '0 3 * * *', // Cron pattern: daily at 3 AM
        },
        jobId: 'update-cafe-stats-daily',
      }
    );

    console.log('✅ Scheduled repeatable job: update-cafe-stats (daily at 3 AM)');
  } catch (error) {
    console.error('❌ Error scheduling repeatable jobs:', error);
    throw error;
  }
}

export async function listScheduledJobs() {
  const repeatableJobs = await cafeQueue.getRepeatableJobs();
  return repeatableJobs;
}

export async function removeScheduledJob(jobKey: string) {
  await cafeQueue.removeRepeatableByKey(jobKey);
  console.log(`✅ Removed scheduled job: ${jobKey}`);
}

export async function shutdownScheduler() {
  // No cleanup needed in BullMQ v4+ as there's no separate scheduler process
  schedulerInitialized = false;
  console.log('✅ Scheduler shut down');
}

