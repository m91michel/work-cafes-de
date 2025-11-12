import Redis from 'ioredis';

// Queue initialization
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisDb = parseInt(process.env.REDIS_DB || '5', 10);
const redisUsername = process.env.REDIS_USERNAME || 'default';
const redisPassword = process.env.REDIS_PASSWORD;

export const redis = new Redis(redisUrl, {
  db: redisDb,
  username: redisUsername, // Redis ACL username (default: 'default')
  password: redisPassword, // Support password from env var if not in URL
  maxRetriesPerRequest: null,
});