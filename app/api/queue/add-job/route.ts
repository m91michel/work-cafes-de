import { NextRequest, NextResponse } from 'next/server';
import { extractToken } from '@/libs/utils';
import { isProd } from '@/libs/environment';
import { 
  addEvaluateCafeJob, 
  addProcessNewCafeJob, 
  addUpdateCafeDetailsJob 
} from '@/libs/queue/queues';
import { JOBS } from '@/libs/queue/config';
import supabase from '@/libs/supabase/supabaseClient';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const token = extractToken(request.headers.get('Authorization'));
  
  // Validate the token in production
  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { jobType, cafeId, limit } = body;
    
    if (!jobType) {
      return NextResponse.json(
        { error: 'Job type is required' },
        { status: 400 }
      );
    }
    
    // If a specific cafe ID is provided
    if (cafeId) {
      const { data: cafe, error } = await supabase
        .from('cafes')
        .select('*')
        .eq('id', cafeId)
        .single();
      
      if (error || !cafe) {
        return NextResponse.json(
          { error: `Cafe with ID ${cafeId} not found` },
          { status: 404 }
        );
      }
      
      const job = await addJobForCafe(jobType, cafe);
      return NextResponse.json({ success: true, job });
    }
    
    // If no specific cafe ID is provided, process multiple cafes based on job type
    const jobsAdded = await addJobsForMultipleCafes(jobType, limit || 10);
    return NextResponse.json({ success: true, jobsAdded });
    
  } catch (error) {
    console.error('Error adding job to queue:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add job to queue' },
      { status: 500 }
    );
  }
}

async function addJobForCafe(jobType: string, cafe: any) {
  switch (jobType) {
    case JOBS.PROCESS_NEW_CAFE:
      return addProcessNewCafeJob({
        cafeId: cafe.id,
        slug: cafe.slug,
        name: cafe.name,
        citySlug: cafe.city_slug,
        placeId: cafe.google_place_id,
      });
    
    case JOBS.EVALUATE_CAFE:
      return addEvaluateCafeJob({
        cafeId: cafe.id,
        slug: cafe.slug,
        name: cafe.name,
      });
    
    case JOBS.UPDATE_CAFE_DETAILS:
      if (!cafe.google_place_id) {
        throw new Error('Cafe does not have a Google Place ID');
      }
      return addUpdateCafeDetailsJob({
        cafeId: cafe.id,
        placeId: cafe.google_place_id,
      });
    
    default:
      throw new Error(`Unknown job type: ${jobType}`);
  }
}

async function addJobsForMultipleCafes(jobType: string, limit: number) {
  let query = supabase.from('cafes').select('*');
  
  // Apply different filters based on job type
  switch (jobType) {
    case JOBS.PROCESS_NEW_CAFE:
      query = query.eq('status', 'PENDING').order('created_at', { ascending: true });
      break;
    
    case JOBS.EVALUATE_CAFE:
      query = query.eq('status', 'PROCESSING')
        .gte('review_count', 1)
        .order('created_at', { ascending: true });
      break;
    
    case JOBS.UPDATE_CAFE_DETAILS:
      query = query.not('google_place_id', 'is', null)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: true });
      break;
    
    default:
      throw new Error(`Unknown job type for batch processing: ${jobType}`);
  }
  
  // Limit the number of cafes to process
  query = query.limit(limit);
  
  const { data: cafes, error } = await query;
  
  if (error || !cafes || cafes.length === 0) {
    throw new Error(`No cafes found for job type ${jobType}`);
  }
  
  // Add a job for each cafe
  const jobs = await Promise.all(
    cafes.map(cafe => addJobForCafe(jobType, cafe))
  );
  
  return {
    count: jobs.length,
    cafeIds: cafes.map(cafe => cafe.id),
  };
}

