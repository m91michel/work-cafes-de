import { Job } from "bullmq";
import { createHash } from "crypto";
import { queue as cronQueue } from "../../queues/cron";
import supabase from "../../supabase/supabaseClient";
import { City } from "../../types";
import { createCityImagePrompt } from "../../openai/create-city-image-prompt";
import { createReplicateImage } from "../../replicate";
import { uploadImageToBunny } from "../../bunny";
import { JOB_NAMES } from "../job-names";

export interface JobData {
  citySlug: string;
}

export const JOB_NAME = JOB_NAMES.cityGenerateImage;

/**
 * Enqueue a job to generate an image for a city
 */
export async function enqueueJob(citySlug: string) {
  if (!cronQueue) {
    console.warn(
      `⚠️ Redis queue not available. Skipping ${JOB_NAME} job for city: ${citySlug}`
    );
    return;
  }

  // Generate unique job ID using hash of citySlug and timestamp
  const timestamp = Date.now();
  const hash = createHash("sha256")
    .update(`${citySlug}-${timestamp}`)
    .digest("hex")
    .substring(0, 16); // Use first 16 chars for shorter ID
  const jobId = `${JOB_NAME}-${citySlug}-${hash}`;

  await cronQueue.add(
    JOB_NAME,
    { citySlug },
    {
      jobId,
      priority: 10, // Higher priority for individual city processing
    }
  );

  console.log(
    `✅ Enqueued ${JOB_NAME} job for city: ${citySlug} (Job ID: ${jobId})`
  );
}

function getFileType(url?: string) {
  if (!url) {
    return "jpg";
  }

  const extension = url.split(".").pop();
  return extension || "jpg";
}

/**
 * Generate image for a single city
 */
export async function generateImageForCity(city: City) {
  const cityName = city.name_en || city.name_de;
  if (!cityName) {
    throw new Error(`City name is null for city ${city.slug}`);
  }

  console.log(`⚡️ generating image for ${cityName} (${city.slug})`);

  const prompt = await createCityImagePrompt(cityName);
  if (!prompt) {
    throw new Error(`Failed to generate prompt for ${cityName}`);
  }

  console.log(`⚡️ prompt generated for ${cityName}: <start>${prompt}<end>`);
  const imageUrl = await createReplicateImage(prompt);

  if (!imageUrl) {
    throw new Error(
      `Failed to generate image for ${cityName}. Image URL is null`
    );
  }

  const fileType = getFileType(imageUrl);
  const filename = `${city.slug}-image.${fileType}`;
  const bunnyUrl = await uploadImageToBunny(imageUrl, filename, "cities");

  if (!bunnyUrl) {
    throw new Error(
      `Failed to upload image for ${cityName}. Bunny URL is null`
    );
  }

  const { error: updateError } = await supabase
    .from("cities")
    .update({
      preview_image: bunnyUrl,
    })
    .eq("slug", city.slug);

  if (updateError) {
    throw new Error(`Error updating city ${cityName}: ${updateError.message}`);
  }

  console.log(`🎉 processed ${cityName} (${bunnyUrl})`);

  return {
    citySlug: city.slug,
    cityName,
    bunnyUrl,
  };
}

/**
 * Process a city image generation job
 */
export async function processJob(job: Job<JobData>) {
  const { citySlug } = job.data;

  console.log(`⚡️ Starting ${JOB_NAME} for city: ${citySlug}`);

  try {
    if (!citySlug) {
      throw new Error("City slug is required");
    }

    const { data: city } = await supabase
      .from("cities")
      .select("*")
      .eq("slug", citySlug)
      .maybeSingle();

    if (!city) {
      throw new Error(`City not found for slug: ${citySlug}`);
    }

    // Check if image already exists
    if (city.preview_image) {
      console.log(
        `ℹ️ City ${city.name_en || city.name_de} already has an image, skipping`
      );
      return {
        success: true,
        citySlug,
        skipped: true,
        message: "Image already exists",
      };
    }

    const result = await generateImageForCity(city);

    console.log(`✅ processed ${result.cityName} (${citySlug})`);

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error(`❌ Error in ${JOB_NAME} for city ${citySlug}:`, error);
    return {
      success: false,
      citySlug,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    };
  }
}
