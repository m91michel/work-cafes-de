import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';
import { queues } from '@/libs/queues';

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

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queues.cafe.getWaitingCount(),
      queues.cafe.getActiveCount(),
      queues.cafe.getCompletedCount(),
      queues.cafe.getFailedCount(),
      queues.cafe.getDelayedCount(),
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

