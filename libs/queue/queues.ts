import { Queue } from 'bullmq';
import { JOBS, QUEUES, redisConnection } from './config';

// Create the cafe processing queue
export const cafeProcessingQueue = new Queue(QUEUES.CAFE_PROCESSING, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Types for job data
export interface ProcessNewCafeJobData {
  cafeId: string;
  slug: string;
  name: string;
  citySlug?: string;
  placeId?: string;
}

export interface EvaluateCafeJobData {
  cafeId: string;
  slug: string;
  name: string;
}

export interface UpdateCafeDetailsJobData {
  cafeId: string;
  placeId: string;
}

// Helper functions to add jobs to the queue
export async function addProcessNewCafeJob(data: ProcessNewCafeJobData) {
  return cafeProcessingQueue.add(JOBS.PROCESS_NEW_CAFE, data, {
    priority: 1, // High priority
  });
}

export async function addEvaluateCafeJob(data: EvaluateCafeJobData) {
  return cafeProcessingQueue.add(JOBS.EVALUATE_CAFE, data, {
    priority: 2,
    delay: 60000, // 1 minute delay to allow other processes to complete
  });
}

export async function addUpdateCafeDetailsJob(data: UpdateCafeDetailsJobData) {
  return cafeProcessingQueue.add(JOBS.UPDATE_CAFE_DETAILS, data, {
    priority: 3,
  });
}

