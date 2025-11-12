import { NextRequest, NextResponse } from 'next/server';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { createClient } from '@/libs/supabase/server';

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

    // Get queue statistics
    // Note: Full Bull Board UI requires Express middleware which doesn't work
    // directly with Next.js App Router. This endpoint provides basic stats.
    
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisDb = parseInt(process.env.REDIS_DB || '5', 10);
    
    const redis = new Redis(redisUrl, {
      db: redisDb,
      maxRetriesPerRequest: null,
    });

    const cafeQueue = new Queue('cafe-processing', {
      connection: redis,
    });

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      cafeQueue.getWaitingCount(),
      cafeQueue.getActiveCount(),
      cafeQueue.getCompletedCount(),
      cafeQueue.getFailedCount(),
      cafeQueue.getDelayedCount(),
    ]);

    return NextResponse.json({
      queues: [
        {
          name: 'cafe-processing',
          waiting,
          active,
          completed,
          failed,
          delayed,
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

