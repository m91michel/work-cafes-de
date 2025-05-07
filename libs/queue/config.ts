import { ConnectionOptions } from 'bullmq';

// Redis connection configuration
export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// Queue names
export const QUEUES = {
  CAFE_PROCESSING: 'cafe-processing',
};

// Job names
export const JOBS = {
  PROCESS_NEW_CAFE: 'process-new-cafe',
  EVALUATE_CAFE: 'evaluate-cafe',
  UPDATE_CAFE_DETAILS: 'update-cafe-details',
};

