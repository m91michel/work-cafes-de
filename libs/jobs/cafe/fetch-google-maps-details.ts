import { Job } from 'bullmq';
import { createHash } from 'crypto';
import { queue as cafeQueue } from '../../queues/cafe';
import supabase from '../../supabase/supabaseClient';
import { getPlaceDetails } from '../../google-maps';
import { processOpenHours } from '../../openai/process-open-hours';
import { formatLinks, mergeObjects } from '../../utils';
import dayjs from 'dayjs';
import { JOB_NAMES } from '../job-names';
import { setCafeAsError } from '../../supabase/cafe/update-actions';

export interface JobData {
  cafeId: string;
}

export const JOB_NAME = JOB_NAMES.googleMapsDetails;

/**
 * Enqueue a job to process a cafe
 */
export async function enqueueJob(cafeId: string) {
  if (!cafeQueue) {
    console.warn(`⚠️ Redis queue not available. Skipping ${JOB_NAME} job for cafe: ${cafeId}`);
    return;
  }

  // Generate unique job ID using hash of cafeId and timestamp
  const timestamp = Date.now();
  const hash = createHash('sha256')
    .update(`${cafeId}-${timestamp}`)
    .digest('hex')
    .substring(0, 16); // Use first 16 chars for shorter ID
  const jobId = `${JOB_NAME}-${cafeId}-${hash}`;
  
  await cafeQueue.add(
    JOB_NAME,
    { cafeId },
    {
      jobId,
      priority: 10, // Higher priority for individual cafe processing
    }
  );

  console.log(`✅ Enqueued ${JOB_NAME} job for cafe: ${cafeId} (Job ID: ${jobId})`);
}

/**
 * Process a cafe job
 */
export async function processJob(job: Job<JobData>) {
  const { cafeId } = job.data;
  
  console.log(`⚡️ Starting ${JOB_NAME} for cafe: ${cafeId}`);

  const { data: cafe } = await supabase
    .from('cafes')
    .select('*')
    .eq('id', cafeId)
    .maybeSingle();
  
  if (!cafe || !cafe.google_place_id) {
    return {
      success: false,
      cafeId,
      error: `No google_place_id for cafe ${cafeId}`,
    };
  }
  try {
    const placeDetails = await getPlaceDetails(cafe.google_place_id);

    if (!placeDetails) {
      throw new Error(`No place details found for ${cafe.name}`);
    }

    // Store photo URLs in maps_data (images will be processed separately)
    const photos = placeDetails.photos || [];
    const photoUrls: string[] = photos.map((photo: any) => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    });

    const formattedAddress = placeDetails.formatted_address;
    const lat_long = `${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}`;
    const rating = placeDetails.rating;
    const weekdayText = placeDetails.opening_hours?.weekday_text;
    const website = placeDetails.website && `Website: ${placeDetails.website}`;
    let openHours = weekdayText?.join("\n");

    if (openHours) {
      openHours = await processOpenHours(openHours);
      console.log(`📅 processed open hours for ${cafe.name}`);
    }
    
    const { error } = await supabase
      .from("cafes")
      .update({
        processed: mergeObjects(cafe?.processed, {
          google_details_at: dayjs().toISOString(),
        }),
        processed_at: dayjs().toISOString(),
        address: formattedAddress,
        lat_long: lat_long,
        google_rating: rating,
        open_hours: openHours,
        website_url: formatLinks(placeDetails.website),
        links: website,
        user_ratings_total: placeDetails.user_ratings_total,
        price_level: placeDetails.price_level,
        maps_data: {
          ...placeDetails as any,
          photos: photoUrls
        },
        status: cafe.status !== 'PUBLISHED' ? 'PROCESSED' : cafe.status
      })
      .eq("id", cafe.id);

    if (error) {
      console.error(`⚠️ Error updating cafe: ${cafe.name}`, error);
      throw new Error(`Error updating cafe: ${cafe.name}`, error);
    }
  
    console.log(`✅ processed ${cafe.name} (${cafeId})`);

    return {
      success: true,
      cafeId,
    };
  } catch (error) {
    console.error(`❌ Error in ${JOB_NAME} for cafe ${cafeId}:`, error);
    await setCafeAsError(cafe, error as Error);
    return {
      success: false,
      cafeId,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
    };
  }
}

