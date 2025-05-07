import { NextRequest, NextResponse } from 'next/server';
import { extractToken } from '@/libs/utils';
import { isProd } from '@/libs/environment';
import { cafeProcessingQueue } from '@/libs/queue/queues';
import { cafeProcessingWorker } from '@/libs/queue/workers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get('Authorization'));
  
  // Validate the token in production
  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  try {
    // Get queue statistics
    const [
      waitingCount,
      activeCount,
      completedCount,
      failedCount,
      delayedCount,
    ] = await Promise.all([
      cafeProcessingQueue.getWaitingCount(),
      cafeProcessingQueue.getActiveCount(),
      cafeProcessingQueue.getCompletedCount(),
      cafeProcessingQueue.getFailedCount(),
      cafeProcessingQueue.getDelayedCount(),
    ]);
    
    // Get worker status
    const workerStatus = cafeProcessingWorker.isRunning() ? 'running' : 'stopped';
    
    return NextResponse.json({
      queue: {
        name: cafeProcessingQueue.name,
        waiting: waitingCount,
        active: activeCount,
        completed: completedCount,
        failed: failedCount,
        delayed: delayedCount,
        total: waitingCount + activeCount + delayedCount,
      },
      worker: {
        status: workerStatus,
        active: await cafeProcessingWorker.getActiveCount(),
      },
    });
  } catch (error) {
    console.error('Error getting queue status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get queue status' },
      { status: 500 }
    );
  }
}

