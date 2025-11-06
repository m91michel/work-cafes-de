import { Job } from 'bullmq';
import supabase from '../../../libs/supabase/supabaseClient';
import { updateCafeCount } from '../../../libs/supabase/cities';
import { Cafe } from '../../../libs/types';

export interface UpdateCafeStatsJobData {
  citySlug?: string;
}

export async function updateCafeStats(job: Job<UpdateCafeStatsJobData>) {
  const { citySlug } = job.data;
  
  console.log(`⚡️ Starting update-cafe-stats job${citySlug ? ` for city: ${citySlug}` : ' for all cities'}`);

  try {
    // Build query
    let query = supabase
      .from('cafes')
      .select('id, city_slug, status')
      .eq('status', 'PUBLISHED');

    // If citySlug is provided, filter by it
    if (citySlug) {
      query = query.eq('city_slug', citySlug);
    }

    const { data: cafes, error } = await query;

    if (error) {
      throw new Error(`Error fetching cafes: ${error.message}`);
    }

    if (!cafes || cafes.length === 0) {
      console.log('⚠️ No published cafes found');
      return { success: true, processed: 0 };
    }

    // Get unique city slugs
    const citySlugs = [...new Set(cafes.map((cafe) => cafe.city_slug).filter(Boolean))];

    console.log(`📊 Processing ${citySlugs.length} cities`);

    let processedCount = 0;
    for (const slug of citySlugs) {
      if (!slug) continue;

      // Get cafes for this city
      const cityCafes = cafes.filter((cafe) => cafe.city_slug === slug);
      
      // Update cafe count for this city
      // We'll use the first cafe as a reference (updateCafeCount expects a cafe object)
      const cafeRef: Partial<Cafe> = {
        city_slug: slug,
        status: 'PUBLISHED',
      };

      await updateCafeCount(cafeRef);
      processedCount++;

      await job.updateProgress((processedCount / citySlugs.length) * 100);
    }

    console.log(`✅ Successfully updated stats for ${processedCount} cities`);

    return {
      success: true,
      processed: processedCount,
      citiesProcessed: citySlugs.length,
    };
  } catch (error) {
    console.error('❌ Error in update-cafe-stats job:', error);
    throw error;
  }
}

