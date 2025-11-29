import { Job } from 'bullmq';
import { createHash } from 'crypto';
import { queue as cronQueue } from '../../queues/cron';
import supabase from '../../supabase/supabaseClient';
import { GoogleMapsPlace, searchPlaces, getPlaceDetails } from '../../google-maps';
import { sendMessage } from '../../telegram';
import { Cafe, City } from '../../types';
import { generateSlug } from '../../utils';
import { JOB_NAMES } from '../job-names';
import * as cafeProcessDuplicatesJobs from '../cafe/cafe-process-duplicates';
import { isDACHCountry } from '../../cafe-utils';

export interface JobData {
  citySlug: string;
}

export const JOB_NAME = JOB_NAMES.citySearchForCafes;

/**
 * Enqueue a job to search for cafes in a city
 */
export async function enqueueJob(citySlug: string) {
  if (!cronQueue) {
    console.warn(`⚠️ Redis queue not available. Skipping ${JOB_NAME} job for city: ${citySlug}`);
    return;
  }

  // Generate unique job ID using hash of citySlug and timestamp
  const timestamp = Date.now();
  const hash = createHash('sha256')
    .update(`${citySlug}-${timestamp}`)
    .digest('hex')
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

  console.log(`✅ Enqueued ${JOB_NAME} job for city: ${citySlug} (Job ID: ${jobId})`);
}

/**
 * Search cafes for a single city
 */
export async function searchCafesForCity(city: City) {
  let cafesAdded = 0;
  let cafesWithError: string[] = [];
  let firstAddress = "";
  let duplicatesFound = false;

  const isDACH = isDACHCountry(city.country_code || "");
  const cityName = isDACH ? city.name_de : city.name_en;

  if (!cityName) {
    throw new Error(`City name is null for city ${city.slug}`);
  }

  console.log(`⚡️ start processing ${cityName} (${city.slug})`);

  const searchQuery = isDACH
    ? `cafe zum arbeiten in ${cityName}`
    : `cafe for working in ${cityName}`;
  const places = await searchPlaces(searchQuery, { type: "cafe", language: isDACH ? "de" : "en" });

  if (places === null || places === undefined) {
    throw new Error(`Error searching for cafes in ${cityName}`);
  }

  for (const [index, place] of places.entries()) {
    const cityNames = [...(city.name_local?.split(",") || []), cityName].filter(Boolean) as string[];
    if (!isInCity(place, cityNames)) {
      console.log(`⚠️ ${place.formatted_address} is not in ${city.name_local || cityName}`);
      firstAddress = place.formatted_address || "";
      continue;
    }

    // check if its operational
    if (place.business_status !== "OPERATIONAL") {
      console.log(`⏭️ ${place.formatted_address} is not operational`);
      continue;
    }

    // Get English address using getPlaceDetails
    const google_place_id = place.place_id;
    let formattedAddress = place.formatted_address;
    
    // if (google_place_id) {
    //   const placeDetails = await getPlaceDetails(google_place_id, { 
    //     language: "en",
    //     fields: "formatted_address,geometry,rating,user_ratings_total,price_level,business_status"
    //   });
      
    //   if (placeDetails?.formatted_address) {
    //     formattedAddress = placeDetails.formatted_address;
    //   }
    // }

    const lat_long = `${place.geometry?.location?.lat},${place.geometry?.location?.lng}`;
    const rating = place.rating;
    const slug = generateSlug(`${place.name}-${city.slug}`);

    const attributes: Partial<Cafe> = {
      name: place.name,
      city_slug: city.slug,
      city: city.name_de,
      address: formattedAddress,
      slug: slug,
      lat_long: lat_long,
      google_rating: rating,
      google_place_id: google_place_id,
      user_ratings_total: place.user_ratings_total,
      price_level: place.price_level,
      source: "GOOGLE_MAPS_SEARCH",
    };

    const { data, error } = await supabase
      .from("cafes")
      .upsert(
        {
          ...attributes,
          status: "NEW",
        },
        {
          onConflict: "google_place_id",
          ignoreDuplicates: true,
        }
      )
      .select("id")
      .maybeSingle();

    if (error && error.code === "23505") {
      console.log(`💭 Handling key violation for cafe`, error);

      const slug = generateSlug(`${place.name}-${city.slug}-${index}`);

      const { error: duplicateError } = await supabase
        .from("cafes")
        .upsert(
          {
            ...attributes,
            slug: slug,
            status: "DUPLICATE",
          },
          {
            onConflict: "google_place_id",
            ignoreDuplicates: true,
          }
        )
        .select("id")
        .maybeSingle();

      if (duplicateError) {
        console.error("⚠️ Error inserting cafe", duplicateError);
        cafesWithError.push(`✴️ ${place.name} (${slug})`);
      } else {
        console.log(`✴️ duplicate cafe ${place.name} (${slug})`);
        duplicatesFound = true;
      }

      continue;
    } else if (error) {
      console.error(
        `⚠️ Unknown error inserting cafe ${place.name} in ${city.name_en}`,
        error
      );
      cafesWithError.push(`❌ ${place.name} (${slug})`);
      continue;
    }

    cafesAdded++;
    console.log(`🎉 processed ${place.name} (${data?.id})`);
  }

  if (cafesWithError.length > 0) {
    console.log(`⚠️ Cafes with errors: ${cafesWithError.length}`);
    await sendMessage(
      `⚠️ Cafes with errors in ${city.name_en}: \n\n- ${cafesWithError.join(
        "\n- "
      )}`
    );
  }

  if (cafesAdded === 0) {
    console.log(`⚠️ No cafes added for ${city.name_en}`);
    await sendMessage(
      `⚠️ No cafes added for ${city.name_en}: \n\n- ${cafesWithError.join(
        "\n- "
      )} \n\nAddress: ${firstAddress}`
    );
  }

  if (city.status !== "PUBLISHED") {
    const status = cafesAdded > 0 ? "PROCESSING" : "CHECK!";
    await supabase
      .from("cities")
      .update({ status: status })
      .eq("slug", city.slug);
  }

  // Automatically trigger duplicate processing if duplicates were found
  if (duplicatesFound) {
    console.log(`🔄 Duplicates found, triggering duplicate processing job`);
    try {
      await cafeProcessDuplicatesJobs.enqueueJob();
      console.log(`✅ Duplicate processing job enqueued`);
    } catch (error) {
      console.error(`⚠️ Failed to enqueue duplicate processing job:`, error);
    }
  }

  return {
    cafesAdded,
    cafesWithError,
    status,
    duplicatesFound,
  };
}

function isInCity(place: GoogleMapsPlace, cityNames: string[]): boolean {
  if (!place.formatted_address) return false;
  if (!cityNames || cityNames.length == 0) return false;

  // Convert to lowercase and remove special characters for comparison
  const normalizedAddress = place.formatted_address.toLowerCase();
  for (const name of cityNames) {
    const normalizedCity = name.replace("City", "").trim().toLowerCase();
    if (normalizedAddress.includes(normalizedCity)) {
      return true;
    }
  }

  return false;
}

/**
 * Process a city search job
 */
export async function processJob(job: Job<JobData>) {
  const { citySlug } = job.data;
  
  console.log(`⚡️ Starting ${JOB_NAME} for city: ${citySlug}`);

  try {
    if (!citySlug) {
      throw new Error('City slug is required');
    }

    const { data: city } = await supabase
      .from('cities')
      .select('*')
      .eq('slug', citySlug)
      .maybeSingle();
    
    if (!city) {
      throw new Error(`City not found for slug: ${citySlug}`);
    }

    const result = await searchCafesForCity(city);
  
    console.log(`✅ processed ${city.name_en || city.name_de} (${citySlug})`);
    console.log(`   - Cafes added: ${result.cafesAdded}`);
    console.log(`   - Cafes with errors: ${result.cafesWithError.length}`);

    return {
      success: true,
      citySlug,
      ...result,
    };
  } catch (error) {
    console.error(`❌ Error in ${JOB_NAME} for city ${citySlug}:`, error);
    return {
      success: false,
      citySlug,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error,
    };
  }
}

