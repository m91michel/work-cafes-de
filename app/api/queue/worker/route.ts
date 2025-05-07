import { NextRequest, NextResponse } from 'next/server';
import { extractToken } from '@/libs/utils';
import { isProd } from '@/libs/environment';
import { cafeProcessingWorker } from '@/libs/queue/workers';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get('Authorization'));
  
  // Validate the token in production
  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  try {
    // Make sure the worker is running
    if (cafeProcessingWorker.isRunning()) {
      return NextResponse.json({
        status: 'Worker is already running',
        jobs: await cafeProcessingWorker.getActiveCount(),
      });
    }
    
    // Start the worker if it's not running
    await cafeProcessingWorker.run();
    
    return NextResponse.json({
      status: 'Worker started successfully',
      jobs: await cafeProcessingWorker.getActiveCount(),
    });
  } catch (error) {
    console.error('Error starting worker:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start worker' },
      { status: 500 }
    );
  }
}

