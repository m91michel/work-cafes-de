import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';
import { queues, areQueuesAvailable } from '@/libs/queues';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if queues are available
    if (!areQueuesAvailable()) {
      return NextResponse.json({
        queues: [],
        message: 'Redis queues are not available in this environment',
      });
    }

    // Get queue statistics for both queues
    // Note: Full Bull Board UI requires Express middleware which doesn't work
    // directly with Next.js App Router. This endpoint provides basic stats.

    const [cafeWaiting, cafeActive, cafeCompleted, cafeFailed, cafeDelayed] = await Promise.all([
      queues.cafe?.getWaitingCount() || Promise.resolve(0),
      queues.cafe?.getActiveCount() || Promise.resolve(0),
      queues.cafe?.getCompletedCount() || Promise.resolve(0),
      queues.cafe?.getFailedCount() || Promise.resolve(0),
      queues.cafe?.getDelayedCount() || Promise.resolve(0),
    ]);

    const [cronWaiting, cronActive, cronCompleted, cronFailed, cronDelayed] = await Promise.all([
      queues.cron?.getWaitingCount() || Promise.resolve(0),
      queues.cron?.getActiveCount() || Promise.resolve(0),
      queues.cron?.getCompletedCount() || Promise.resolve(0),
      queues.cron?.getFailedCount() || Promise.resolve(0),
      queues.cron?.getDelayedCount() || Promise.resolve(0),
    ]);

    return NextResponse.json({
      queues: [
        {
          name: 'cafe-processing',
          waiting: cafeWaiting,
          active: cafeActive,
          completed: cafeCompleted,
          failed: cafeFailed,
          delayed: cafeDelayed,
        },
        {
          name: 'cron-jobs',
          waiting: cronWaiting,
          active: cronActive,
          completed: cronCompleted,
          failed: cronFailed,
          delayed: cronDelayed,
        },
      ],
    });
  } catch (error) {
    console.error('Error getting queue stats:', error);
    return NextResponse.json(
      { error: 'Failed to get queue stats' },
      { status: 500 }
    );
  }
}

