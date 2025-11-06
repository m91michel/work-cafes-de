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

let worker: Worker | null = null;
let isShuttingDown = false;

async function startWorker() {
  console.log('🚀 Starting worker...');

  // Initialize scheduler
  await initializeScheduler();

  // Create worker
  worker = new Worker(
    'cafe-processing',
    async (job: Job) => {
      return await processJob(job);
    },
    {
      connection: redisConnection,
      concurrency: 5,
    }
  );

  // Event listeners
  worker.on('completed', (job: Job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`❌ Job ${job?.id || 'unknown'} failed:`, err.message);
  });

  worker.on('active', (job: Job) => {
    console.log(`🔄 Job ${job.id} is now active`);
  });

  worker.on('error', (err: Error) => {
    console.error('❌ Worker error:', err);
  });

  console.log('✅ Worker started and ready to process jobs');
}

async function shutdown() {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log('🛑 Shutting down worker...');

  if (worker) {
    await worker.close();
    worker = null;
    console.log('✅ Worker closed');
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

// Start the worker
startWorker().catch((error) => {
  console.error('❌ Failed to start worker:', error);
  process.exit(1);
});

