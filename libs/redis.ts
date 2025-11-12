import Redis from 'ioredis';

// Check if Redis is available/configured
export const isRedisAvailable = (): boolean => {
  // If REDIS_URL is explicitly set, use it
  if (process.env.REDIS_URL) {
    return true;
  }
  
  // During build time on Vercel (where Redis typically isn't available),
  // skip Redis to avoid connection errors
  // Vercel sets VERCEL=1 during builds and deployments
  const isVercelBuild = process.env.VERCEL === '1' && 
                        (process.env.NEXT_PHASE === 'phase-production-build' || 
                         !process.env.REDIS_URL);
  
  if (isVercelBuild) {
    return false;
  }
  
  // In other environments (local dev, runtime), allow Redis connection attempts
  // The connection will fail gracefully if Redis isn't available
  return true;
};

// Lazy Redis connection - only create when actually needed
let redisInstance: Redis | null = null;

const createRedisConnection = (): Redis | null => {
  if (!isRedisAvailable()) {
    return null;
  }

  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisDb = parseInt(process.env.REDIS_DB || '5', 10);
    const redisUsername = process.env.REDIS_USERNAME || 'default';
    const redisPassword = process.env.REDIS_PASSWORD;

    const client = new Redis(redisUrl, {
      db: redisDb,
      username: redisUsername,
      password: redisPassword,
      maxRetriesPerRequest: null,
      lazyConnect: true, // Don't connect immediately
      retryStrategy: () => null, // Don't retry on connection failure
      enableOfflineQueue: false, // Don't queue commands when offline
    });

    // Handle connection errors gracefully
    client.on('error', (err) => {
      // Only log if not in build phase
      if (process.env.NEXT_PHASE !== 'phase-production-build') {
        console.warn('Redis connection error:', err.message);
      }
    });

    return client;
  } catch (error) {
    console.warn('Failed to create Redis connection:', error);
    return null;
  }
};

// Get Redis instance (lazy initialization)
export const getRedis = (): Redis | null => {
  if (!redisInstance) {
    redisInstance = createRedisConnection();
  }
  return redisInstance;
};

// Export for backward compatibility, but it may be null
export const redis = getRedis();