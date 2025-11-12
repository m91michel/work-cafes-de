import { Queue } from 'bullmq';
import Redis from 'ioredis';

// Queue initialization
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisDb = parseInt(process.env.REDIS_DB || '5', 10);

const redis = new Redis(redisUrl, {
  db: redisDb,
  maxRetriesPerRequest: null,
});

export const cafeQueue = new Queue('cafe-processing', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
      count: 1000,
    },
    removeOnFail: {
      age: 86400, // Keep failed jobs for 24 hours
    },
  },
});



// Job registry for type-safe processing (internal imports)
import { processProcessCafe, ProcessCafeJobData, JOB_NAME as PROCESS_CAFE_NAME, enqueueProcessCafe } from './process-cafe';
import { processUpdateCafeStats, UpdateCafeStatsJobData, JOB_NAME as UPDATE_STATS_NAME, enqueueUpdateCafeStats } from './update-cafe-stats';

export type JobData = ProcessCafeJobData | UpdateCafeStatsJobData;

export type JobHandler = (job: any) => Promise<any>;

export const jobHandlers: Record<string, JobHandler> = {
  [PROCESS_CAFE_NAME]: processProcessCafe,
  [UPDATE_STATS_NAME]: processUpdateCafeStats,
};

// Export job names as constants for type safety
export const JOB_NAMES = {
  PROCESS_CAFE: PROCESS_CAFE_NAME,
  UPDATE_CAFE_STATS: UPDATE_STATS_NAME,
} as const;

export const enqueue = {
  processCafe: enqueueProcessCafe,
  updateCafeStats: enqueueUpdateCafeStats,
}