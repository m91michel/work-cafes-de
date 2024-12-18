import { processOpenHours } from "../../libs/openai/process-open-hours";
import { getPlaceDetails } from "../../libs/google-maps";
import supabase from "../../libs/supabase/supabaseClient";

export async function updateOpenHours() {
  console.log("⚡️ Updating open hours...");

  const { data: cafes = [], error } = await supabase
    .from("cafes")
    .select("*")
    .eq("status", "PUBLISHED")
    .is("processed->open_hours_at", null)
    .order("created_at", { ascending: false })
    .limit(100);

  //@ts-ignore
  for (const cafe of cafes) {
    console.log(`⚡️ Processing ${cafe.name} in ${cafe.city}`);

    if (!cafe.google_place_id) {
      console.log(`⚠️ No Google Place ID found for ${cafe.name}`);
      continue;
    }

    const placeDetails = await getPlaceDetails(cafe.google_place_id);

    if (!placeDetails) {
      console.log(`⚠️ No place details found for ${cafe.name}`);
      continue;
    }

    const weekdayText = placeDetails.opening_hours?.weekday_text;
    let openHours = weekdayText?.join("\n");

    console.log({
      formatted_address: placeDetails.formatted_address,
      open_hours: openHours,
    });

    if (!openHours) {
      console.log(`⚠️ No opening hours found for ${cafe.name}`);
      continue;
    }

    openHours = await processOpenHours(openHours) || openHours;

    const { error } = await supabase
      .from("cafes")
      .update({
        open_hours: openHours,
        address: placeDetails.formatted_address,
        processed: {
          ...(typeof cafe.processed === 'object' && cafe.processed !== null ? cafe.processed : {}),
          open_hours_at: new Date().toISOString(),
        },
      })
      .eq("slug", cafe.slug || "");

    if (error) {
      console.log(`⚠️ Error updating cafe: ${cafe.name}`, error);
    }
  }

  console.log(`✅ Open hours updated successfully for ${cafes?.length} cafes`);
}
