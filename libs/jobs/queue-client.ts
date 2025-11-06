import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// Use the same Redis database number as the worker
const redisDb = parseInt(process.env.REDIS_DB || '1', 10);

const redis = new Redis(redisUrl, {
  db: redisDb,
  maxRetriesPerRequest: null,
});

export const cafeQueue = new Queue('cafe-processing', {
  connection: redis,
});

export interface UpdateCafeStatsJobData {
  citySlug?: string;
}

export async function enqueueCafeStatsUpdate(citySlug?: string) {
  const jobId = citySlug ? `update-cafe-stats-${citySlug}` : 'update-cafe-stats';
  
  await cafeQueue.add(
    'update-cafe-stats',
    { citySlug } as UpdateCafeStatsJobData,
    {
      jobId, // Prevent duplicates
      priority: 5,
    }
  );

  console.log(`✅ Enqueued update-cafe-stats job${citySlug ? ` for city: ${citySlug}` : ''}`);
}

