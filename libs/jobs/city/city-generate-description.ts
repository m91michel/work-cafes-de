import { Job } from "bullmq";
import { createHash } from "crypto";
import { queue as cronQueue } from "../../queues/cron";
import supabase from "../../supabase/supabaseClient";
import { City } from "../../types";
import { generateCityDescription } from "../../openai/generate-citiy-description";
import dayjs from "dayjs";
import { JOB_NAMES } from "../job-names";

export interface JobData {
  citySlug: string;
}

export const JOB_NAME = JOB_NAMES.cityGenerateDescription;

/**
 * Enqueue a job to generate descriptions for a city
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

async function setCityAsProcessed(city: City) {
  const { error: updateError } = await supabase
    .from("cities")
    .update({
      processed_at: dayjs().toISOString(),
    })
    .eq("slug", city.slug);

  if (updateError) {
    console.log(`❌ city not updated for ${city.name_en}`);
  }
}

/**
 * Generate descriptions for a single city
 */
export async function generateDescriptionForCity(city: City) {
  const cityName = city.name_en || city.name_de;

  if (!cityName) {
    throw new Error(`City name is null for city ${city.slug}`);
  }

  console.log(`⚡️ processing ${cityName} ${city.country} ${city.state}`);

  let description_short_de = null;
  let description_short_en = null;
  let description_long_de = null;
  let description_long_en = null;

  const result_en = await generateCityDescription(city, "en");
  if (!result_en) {
    throw new Error(`Error generating English city description for ${cityName}`);
  }
  description_short_en = result_en.description_short;
  description_long_en = result_en.description_long;

  const result_de = await generateCityDescription(city, "de");
  if (!result_de) {
    throw new Error(`Error generating German city description for ${cityName}`);
  }
  description_short_de = result_de.description_short;
  description_long_de = result_de.description_long;

  const { error: updateError } = await supabase
    .from("cities")
    .update({
      name_de: city.name_de || result_de.name,
      name_en: city.name_en || result_en.name,
      state: city.state || result_en.state,
      description_short_de,
      description_short_en,
      description_long_de,
      description_long_en,
      processed_at: dayjs().toISOString(),
    })
    .eq("slug", city.slug);

  if (updateError) {
    throw new Error(`Error updating city ${cityName}: ${updateError.message}`);
  }

  console.log(`✅ finished ${cityName} ${city.country} ${city.state}`);

  return {
    citySlug: city.slug,
    cityName,
    description_short_en,
    description_short_de,
    description_long_en,
    description_long_de,
  };
}

/**
 * Process a city description generation job
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

    // Check if descriptions already exist
    if (city.description_short_en) {
      console.log(
        `ℹ️ City ${city.name_en || city.name_de} already has descriptions, skipping`
      );
      return {
        success: true,
        citySlug,
        skipped: true,
        message: "Descriptions already exist",
      };
    }

    const result = await generateDescriptionForCity(city);

    console.log(`✅ processed ${result.cityName} (${citySlug})`);

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error(`❌ Error in ${JOB_NAME} for city ${citySlug}:`, error);

    // Mark city as processed even on error to avoid infinite retries
    try {
      const { data: city } = await supabase
        .from("cities")
        .select("*")
        .eq("slug", citySlug)
        .maybeSingle();
      if (city) {
        await setCityAsProcessed(city);
      }
    } catch (markError) {
      console.error(`Failed to mark city as processed:`, markError);
    }

    return {
      success: false,
      citySlug,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    };
  }
}

