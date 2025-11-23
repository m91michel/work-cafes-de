import { Job } from "bullmq";
import { createHash } from "crypto";
import { queue as cafeQueue } from "../../queues/cafe";
import supabase from "../../supabase/supabaseClient";
import { getPlaceDetails } from "../../google-maps";
import { uploadImageToBunny } from "../../bunny";
import { JOB_NAMES } from "../job-names";
import { setCafeAsError } from "../../supabase/cafe/update-actions";

export interface JobData {
  cafeId: string;
}

export const JOB_NAME = JOB_NAMES.googleMapsImages;

/**
 * Enqueue a job to process cafe images
 */
export async function enqueueJob(cafeId: string) {
  if (!cafeQueue) {
    console.warn(
      `⚠️ Redis queue not available. Skipping ${JOB_NAME} job for cafe: ${cafeId}`
    );
    return;
  }

  // Generate unique job ID using hash of cafeId and timestamp
  const timestamp = Date.now();
  const hash = createHash("sha256")
    .update(`${cafeId}-${timestamp}`)
    .digest("hex")
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

  console.log(
    `✅ Enqueued ${JOB_NAME} job for cafe: ${cafeId} (Job ID: ${jobId})`
  );
}

/**
 * Process a cafe image job
 */
export async function processJob(job: Job<JobData>) {
  const { cafeId } = job.data;

  console.log(`⚡️ Starting ${JOB_NAME} for cafe: ${cafeId}`);

  const { data: cafe } = await supabase
    .from("cafes")
    .select("*")
    .eq("id", cafeId)
    .maybeSingle();

  if (!cafe) {
    return {
      success: false,
      cafeId,
      error: `Cafe not found for ${cafeId}`,
    };
  }

  try {
    if (!cafe || !cafe.google_place_id) {
      throw new Error(`Cafe not found or no google_place_id for ${cafeId}`);
    }

    // Get place details to fetch photos
    const placeDetails = await getPlaceDetails(cafe.google_place_id);

    if (!placeDetails) {
      throw new Error(`No place details found for ${cafe.name}`);
    }

    // Process photos
    const photos = placeDetails.photos || [];
    const photoUrls: string[] = photos.map((photo: any) => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    });

    let bunnyUrl;
    if (photoUrls.length > 0) {
      const filename = `${cafe.slug}-thumb.jpg`;
      bunnyUrl = await uploadImageToBunny(photoUrls[0], filename, "cafes");
      console.log(`📸 uploaded image for ${cafe.name}`);
    } else {
      console.log(`⚠️ No photos available for ${cafe.name}`);
      return {
        success: true,
        cafeId,
        skipped: true,
        reason: "No photos available",
      };
    }

    // Update cafe with preview image
    const { error } = await supabase
      .from("cafes")
      .update({
        preview_image: bunnyUrl,
        maps_data: {
          ...((cafe.maps_data as any) || {}),
          photos: photoUrls,
        },
      })
      .eq("id", cafe.id);

    if (error) {
      console.error(`⚠️ Error updating cafe image: ${cafe.name}`, error);
      throw new Error(`Error updating cafe image: ${cafe.name}`, error);
    }

    console.log(`✅ processed image for ${cafe.name} (${cafeId})`);

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
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    };
  }
}
