import { Job, Worker } from 'bullmq';
import { JOBS, QUEUES, redisConnection } from './config';
import { 
  EvaluateCafeJobData, 
  ProcessNewCafeJobData, 
  UpdateCafeDetailsJobData 
} from './queues';
import supabase from '@/libs/supabase/supabaseClient';
import { sendMessage } from '@/libs/telegram';
import dayjs from 'dayjs';
import { mergeObjects } from '@/libs/utils';

// Create the worker for processing cafe jobs
export const cafeProcessingWorker = new Worker(
  QUEUES.CAFE_PROCESSING,
  async (job: Job) => {
    const { name: jobName, data } = job;

    console.log(`Processing job ${jobName} with id ${job.id}`);

    try {
      switch (jobName) {
        case JOBS.PROCESS_NEW_CAFE:
          return await processNewCafe(data as ProcessNewCafeJobData);
        case JOBS.EVALUATE_CAFE:
          return await evaluateCafe(data as EvaluateCafeJobData);
        case JOBS.UPDATE_CAFE_DETAILS:
          return await updateCafeDetails(data as UpdateCafeDetailsJobData);
        default:
          throw new Error(`Unknown job type: ${jobName}`);
      }
    } catch (error) {
      console.error(`Error processing job ${jobName}:`, error);
      await sendMessage(`Error processing job ${jobName}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  },
  { connection: redisConnection }
);

// Set up event handlers for the worker
cafeProcessingWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

cafeProcessingWorker.on('failed', (job, error) => {
  console.error(`Job ${job?.id} failed with error:`, error);
});

// Job processor functions
async function processNewCafe(data: ProcessNewCafeJobData) {
  const { cafeId, slug, name, placeId } = data;
  
  console.log(`Processing new cafe: ${name} (${slug})`);
  
  // Update cafe status to PROCESSING
  const { error: updateError } = await supabase
    .from('cafes')
    .update({
      status: 'PROCESSING',
      processed: {
        processing_started_at: dayjs().toISOString(),
      },
    })
    .eq('id', cafeId);
  
  if (updateError) {
    console.error(`Error updating cafe status: ${name}`, updateError);
    throw updateError;
  }
  
  // If we have a Google Place ID, fetch additional details
  if (placeId) {
    // This would be handled by the UPDATE_CAFE_DETAILS job
    return { success: true, message: 'Cafe marked as processing, details will be updated' };
  }
  
  return { success: true, message: 'Cafe processed successfully' };
}

async function evaluateCafe(data: EvaluateCafeJobData) {
  const { cafeId, name } = data;
  
  console.log(`Evaluating cafe: ${name}`);
  
  // Get reviews for the cafe
  const { data: reviews = [], error: reviewsError } = await supabase
    .from('reviews')
    .select('*')
    .eq('cafe_id', cafeId)
    .order('created_at', { ascending: false });
  
  if (reviewsError) {
    console.error(`Error fetching reviews for cafe: ${name}`, reviewsError);
    throw reviewsError;
  }
  
  // If we have enough reviews, we could analyze them
  // This would typically call the existing analyze-reviews functionality
  
  // For now, just update the status
  const { error: updateError } = await supabase
    .from('cafes')
    .update({
      status: reviews.length > 0 ? 'PROCESSED' : 'PENDING_REVIEWS',
      processed: mergeObjects({
        evaluation_completed_at: dayjs().toISOString(),
        review_count: reviews.length,
      }),
    })
    .eq('id', cafeId);
  
  if (updateError) {
    console.error(`Error updating cafe after evaluation: ${name}`, updateError);
    throw updateError;
  }
  
  return { 
    success: true, 
    message: `Cafe evaluated successfully with ${reviews.length} reviews` 
  };
}

async function updateCafeDetails(data: UpdateCafeDetailsJobData) {
  const { cafeId, placeId } = data;
  
  console.log(`Updating details for cafe with ID: ${cafeId} using place ID: ${placeId}`);
  
  // This would typically call Google Maps API to fetch details
  // For now, just update the processed field
  
  const { error: updateError } = await supabase
    .from('cafes')
    .update({
      processed: mergeObjects({
        details_updated_at: dayjs().toISOString(),
        place_id: placeId,
      }),
    })
    .eq('id', cafeId);
  
  if (updateError) {
    console.error(`Error updating cafe details: ${cafeId}`, updateError);
    throw updateError;
  }
  
  return { success: true, message: 'Cafe details updated successfully' };
}

