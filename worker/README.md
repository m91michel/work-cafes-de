# Worker Service

Background job processing service using BullMQ and Redis.

## Architecture Overview

The worker service processes background jobs for the cafe management system. It uses:

- **BullMQ**: Job queue management
- **Redis**: Queue storage and job state
- **Supabase**: Database access for job processing

## Directory Structure

```
worker/
├── src/
│   ├── config/
│   │   └── redis.ts          # Redis connection configuration
│   ├── processors/
│   │   └── job-processor.ts   # Job processing router (uses registry from libs/jobs)
│   ├── schedulers/
│   │   └── scheduler.ts       # Scheduled/repeatable jobs
│   └── index.ts               # Worker entry point

libs/jobs/
├── index.ts                   # Queue initialization and job registry
├── process-cafe.ts            # Process cafe job (enqueue + process)
└── update-cafe-stats.ts       # Update cafe stats job (enqueue + process)
```

## Environment Variables

Create a `.env` file in the worker directory (or use `.env.local` from the root):

```env
REDIS_URL=redis://localhost:6379
REDIS_DB=1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=development
```

**Redis Database Number:**
- `REDIS_DB` (default: `1`) - Redis database number to use for BullMQ data
- This allows you to use the same Redis instance as other applications
- Database 0 is typically used by default, so we use database 1 to avoid conflicts
- You can use any database number 0-15 (depending on your Redis configuration)

## Local Development Setup

1. **Install dependencies:**
   ```bash
   cd worker
   yarn install
   ```

2. **Configure Redis connection:**
   ```bash
   # If using an existing Redis container, set REDIS_URL and REDIS_DB
   # REDIS_URL=redis://localhost:6379 (or your Redis host)
   # REDIS_DB=1 (use a different database number to isolate BullMQ data)
   
   # If you need to start a new Redis instance:
   docker run -d -p 6379:6379 redis:7-alpine
   ```

3. **Set environment variables** in `.env` or `.env.local`

4. **Start the worker:**
   ```bash
   yarn dev
   ```

   Or from the root directory:
   ```bash
   yarn worker:dev
   ```

## Adding New Jobs

### 1. Create Job File

Create a new file in `libs/jobs/` that contains both the enqueue and process functions:

```typescript
// libs/jobs/my-new-job.ts
import { Job } from 'bullmq';
import { cafeQueue } from './index';

export interface MyNewJobData {
  // Define your job data structure
  someField: string;
}

export const JOB_NAME = 'my-new-job' as const;

/**
 * Enqueue a job
 */
export async function enqueueMyNewJob(someField: string) {
  await cafeQueue.add(
    JOB_NAME,
    { someField },
    {
      jobId: `${JOB_NAME}-${someField}`, // Optional: prevent duplicates
      priority: 5,
    }
  );

  console.log(`✅ Enqueued ${JOB_NAME} job for: ${someField}`);
}

/**
 * Process the job
 */
export async function processMyNewJob(job: Job<MyNewJobData>) {
  const { someField } = job.data;
  
  console.log(`⚡️ Starting ${JOB_NAME} for: ${someField}`);
  
  // Your job logic here
  console.log(`Processing: ${someField}`);
  
  return { success: true };
}
```

### 2. Register in Job Registry

Update `libs/jobs/index.ts` to register your new job:

```typescript
// Add import
import { processMyNewJob, MyNewJobData, JOB_NAME as MY_NEW_JOB_NAME } from './my-new-job';

// Add to JobData union type (automatic if exported)
export type JobData = ProcessCafeJobData | UpdateCafeStatsJobData | MyNewJobData;

// Add to job handlers registry
export const jobHandlers: Record<string, JobHandler> = {
  [PROCESS_CAFE_NAME]: processProcessCafe,
  [UPDATE_STATS_NAME]: processUpdateCafeStats,
  [MY_NEW_JOB_NAME]: processMyNewJob, // Add this line
};

// Add to JOB_NAMES constant
export const JOB_NAMES = {
  PROCESS_CAFE: PROCESS_CAFE_NAME,
  UPDATE_CAFE_STATS: UPDATE_STATS_NAME,
  MY_NEW_JOB: MY_NEW_JOB_NAME, // Add this line
} as const;
```

### 3. Enqueue Jobs

From your Next.js app, import and use the enqueue function:

```typescript
import { enqueueMyNewJob } from '@/libs/jobs';

await enqueueMyNewJob('value');
```

## Scheduling Jobs

Jobs can be scheduled using BullMQ's repeatable jobs feature. Edit `worker/src/schedulers/scheduler.ts`:

```typescript
import { cafeQueue } from '../../../libs/jobs';

// Schedule a job to run daily at 3 AM
await cafeQueue.add(
  'my-new-job',
  { someField: 'value' },
  {
    repeat: {
      pattern: '0 3 * * *', // Cron pattern
    },
    jobId: 'my-new-job-daily',
  }
);
```

### Cron Pattern Examples

- `0 3 * * *` - Daily at 3 AM
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 0` - Every Sunday at midnight
- `*/15 * * * *` - Every 15 minutes

## Job Options

When adding jobs, you can specify options:

```typescript
await cafeQueue.add(
  'job-name',
  data,
  {
    priority: 1,        // Higher priority = processed first
    delay: 5000,        // Delay execution by 5 seconds
    attempts: 3,        // Retry 3 times on failure
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    jobId: 'unique-id', // Prevent duplicate jobs
  }
);
```

## Monitoring

Access the queue dashboard at `/dashboard/queues` (requires authentication).

The dashboard shows:
- Waiting jobs
- Active jobs
- Completed jobs
- Failed jobs
- Delayed jobs

## Docker Deployment

The worker service is included in `docker-compose.yml`:

```bash
# Build and start all services
docker-compose up -d

# View worker logs
docker-compose logs -f worker

# Restart worker
docker-compose restart worker
```

## Troubleshooting

### Worker not connecting to Redis

- Check `REDIS_URL` environment variable
- Verify Redis is running: `redis-cli ping`
- Check network connectivity if using Docker

### Jobs not processing

- Check worker logs for errors
- Verify job names match between enqueue and processor
- Check Redis connection

### Jobs failing

- Check job logs in the dashboard
- Verify Supabase credentials
- Check job data structure matches interface

## Example: Update Cafe Stats Job

The included `update-cafe-stats` job demonstrates:

1. Job data interface definition
2. Enqueue function with job options
3. Process function with Supabase integration
4. Progress updates
5. Error handling
6. Result reporting

See `libs/jobs/update-cafe-stats.ts` for reference.

## Production Considerations

- Set appropriate concurrency based on your workload
- Monitor Redis memory usage
- Set up job retry strategies
- Implement proper error logging
- Consider job prioritization for critical tasks
- Set up monitoring/alerting for failed jobs

