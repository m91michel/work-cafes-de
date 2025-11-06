import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// Use a separate Redis database number to isolate BullMQ data
// Default to database 1 (0 is typically used by other apps)
const redisDb = parseInt(process.env.REDIS_DB || '1', 10);

export const redisConnection = new Redis(redisUrl, {
  db: redisDb,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisConnection.on('connect', () => {
  console.log('✅ Redis connected');
});

redisConnection.on('error', (err: Error) => {
  console.error('❌ Redis connection error:', err);
});

redisConnection.on('ready', () => {
  console.log('✅ Redis ready');
});

export default redisConnection;

