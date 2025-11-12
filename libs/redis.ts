import Redis from 'ioredis';

// Queue initialization
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisDb = parseInt(process.env.REDIS_DB || '5', 10);

export const redis = new Redis(redisUrl, {
  db: redisDb,
  maxRetriesPerRequest: null,
});