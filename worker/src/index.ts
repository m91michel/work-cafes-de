// Load environment variables first, before any other imports
import dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';

// Load .env.local from the project root (two levels up from worker/src)
const envLocalPath = path.resolve(__dirname, '../../.env.local');
const envPath = path.resolve(__dirname, '../../.env');

if (existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  console.log('✅ Loaded environment from .env.local');
} else if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ Loaded environment from .env');
} else {
  console.warn('⚠️ No .env.local or .env file found, using system environment variables');
}

// Verify required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
}
if (!process.env.REDIS_URL) {
  console.warn('⚠️ REDIS_URL is not set, using default: redis://localhost:6379');
}

import { Worker, Job } from 'bullmq';
import { redisConnection } from './config/redis';
import { processJob } from './processors/job-processor';
import { initializeScheduler, shutdownScheduler } from './schedulers/scheduler';

let cafeWorker: Worker | null = null;
let cronWorker: Worker | null = null;
let isShuttingDown = false;

async function startWorkers() {
  console.log('🚀 Starting workers...');

  // Initialize scheduler
  await initializeScheduler();

  // Get concurrency from environment variables
  const cafeConcurrency = parseInt(process.env.CAFE_WORKER_CONCURRENCY || process.env.WORKER_CONCURRENCY || '5', 10);
  const cronConcurrency = parseInt(process.env.CRON_WORKER_CONCURRENCY || '1', 10);
  
  console.log(`📊 Cafe worker concurrency set to: ${cafeConcurrency}`);
  console.log(`📊 Cron worker concurrency set to: ${cronConcurrency}`);

  // Create cafe processing worker
  cafeWorker = new Worker(
    'cafe-processing',
    async (job: Job) => {
      return await processJob(job);
    },
    {
      connection: redisConnection,
      concurrency: cafeConcurrency,
    }
  );

  // Create cron jobs worker
  cronWorker = new Worker(
    'cron-jobs',
    async (job: Job) => {
      return await processJob(job);
    },
    {
      connection: redisConnection,
      concurrency: cronConcurrency,
    }
  );

  // Cafe worker event listeners
  cafeWorker.on('completed', (job: Job) => {
    console.log(`✅ Cafe job ${job.id} completed`);
  });

  cafeWorker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`❌ Cafe job ${job?.id || 'unknown'} failed:`, err.message);
  });

  cafeWorker.on('active', (job: Job) => {
    console.log(`🔄 Cafe job ${job.id} is now active`);
  });

  cafeWorker.on('error', (err: Error) => {
    console.error('❌ Cafe worker error:', err);
  });

  // Cron worker event listeners
  cronWorker.on('completed', (job: Job) => {
    console.log(`✅ Cron job ${job.id} completed`);
  });

  cronWorker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`❌ Cron job ${job?.id || 'unknown'} failed:`, err.message);
  });

  cronWorker.on('active', (job: Job) => {
    console.log(`🔄 Cron job ${job.id} is now active`);
  });

  cronWorker.on('error', (err: Error) => {
    console.error('❌ Cron worker error:', err);
  });

  console.log('✅ Workers started and ready to process jobs');
}

async function shutdown() {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log('🛑 Shutting down workers...');

  if (cafeWorker) {
    await cafeWorker.close();
    cafeWorker = null;
    console.log('✅ Cafe worker closed');
  }

  if (cronWorker) {
    await cronWorker.close();
    cronWorker = null;
    console.log('✅ Cron worker closed');
  }

  await shutdownScheduler();
  await redisConnection.quit();
  console.log('✅ Redis connection closed');

  process.exit(0);
}

// Graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  shutdown();
});

// Start the workers
startWorkers().catch((error) => {
  console.error('❌ Failed to start workers:', error);
  process.exit(1);
});

