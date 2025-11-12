import { Queue } from 'bullmq';
import { getRedis, isRedisAvailable } from '../redis';

export const QUEUE_NAME = 'cafe-processing';

// Create queue only if Redis is available
let queueInstance: Queue | null = null;

const createQueue = (): Queue | null => {
  if (!isRedisAvailable()) {
    return null;
  }

  const redis = getRedis();
  if (!redis) {
    return null;
  }

  try {
    return new Queue(QUEUE_NAME, {
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
  } catch (error) {
    console.warn('Failed to create cafe queue:', error);
    return null;
  }
};

export const queue = createQueue();