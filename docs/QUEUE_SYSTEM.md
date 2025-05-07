# Cafe Processing Queue System

This document describes the queue system used for processing cafe submissions and updates in the Work Cafes DE application.

## Overview

The application uses BullMQ, a Redis-based queue system, to handle asynchronous processing of cafe-related tasks. This approach provides several benefits:

- **Reliability**: Jobs that fail can be automatically retried
- **Scalability**: Processing can be distributed across multiple workers
- **Monitoring**: Queue status and job progress can be easily monitored
- **Prioritization**: Jobs can be prioritized based on importance

## Queue Structure

The system uses a single queue with multiple job types:

- **Cafe Processing Queue**: Handles all cafe-related processing tasks

### Job Types

1. **Process New Cafe** (`process-new-cafe`)
   - Triggered when a new cafe is submitted
   - Updates cafe status to "PROCESSING"
   - Prepares the cafe for further processing

2. **Evaluate Cafe** (`evaluate-cafe`)
   - Analyzes cafe reviews and details
   - Determines if the cafe should be published
   - Updates cafe status based on evaluation

3. **Update Cafe Details** (`update-cafe-details`)
   - Fetches additional details from Google Maps API
   - Updates cafe information with external data

## Implementation Details

### Files Structure

- `libs/queue/config.ts` - Configuration for Redis connection and queue names
- `libs/queue/queues.ts` - Queue definitions and job adding functions
- `libs/queue/workers.ts` - Worker implementation for processing jobs
- `libs/queue/index.ts` - Initialization and shutdown functions

### API Routes

- `app/api/queue/worker/route.ts` - Starts the worker in a serverless environment
- `app/api/queue/status/route.ts` - Returns the current status of the queue
- `app/api/queue/add-job/route.ts` - Manually adds jobs to the queue

## Usage

### Adding a Job to the Queue

```typescript
import { addProcessNewCafeJob } from '@/libs/queue/queues';

// Add a job to process a new cafe
await addProcessNewCafeJob({
  cafeId: 'cafe-id',
  slug: 'cafe-slug',
  name: 'Cafe Name',
  citySlug: 'city-slug',
  placeId: 'google-place-id',
});
```

### Starting the Worker

In a serverless environment, the worker can be started by making a GET request to the `/api/queue/worker` endpoint with the appropriate authorization token.

### Monitoring Queue Status

Queue status can be monitored by making a GET request to the `/api/queue/status` endpoint with the appropriate authorization token.

## Deployment Considerations

### Redis Server

The queue system requires a Redis server. For production, consider using a managed Redis service like:

- Redis Cloud
- AWS ElastiCache
- Azure Cache for Redis
- Upstash (serverless Redis)

### Environment Variables

The following environment variables need to be set:

- `REDIS_HOST` - Redis server hostname
- `REDIS_PORT` - Redis server port
- `REDIS_PASSWORD` - Redis server password (if required)
- `CRON_JOB_KEY` - Security key for cron job API routes

### Worker Execution

In a serverless environment, the worker needs to be kept alive by periodically calling the `/api/queue/worker` endpoint. This can be done using:

- A cron job service (e.g., Vercel Cron Jobs)
- A dedicated server or container running the worker process

## Troubleshooting

### Common Issues

1. **Redis Connection Errors**
   - Check Redis connection settings
   - Verify network access to Redis server

2. **Failed Jobs**
   - Check job logs for error details
   - Jobs will be automatically retried based on configuration

3. **Worker Not Processing Jobs**
   - Verify worker is running by checking the status endpoint
   - Restart worker if necessary

