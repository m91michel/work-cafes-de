import dayjs from "dayjs";
import supabase from "../supabaseClient";
import { mergeObjects } from "../../utils";
import { Cafe } from "../../types";
import { sendMessage } from "../../telegram";
import { pick } from "lodash";

const WHITE_LIST_FIELDS: (keyof Cafe)[] = ["id", "status", "processed", "processed_at", "published_at", "discard_reason", "checked"] as const;

export async function setProcessed(
  cafe: Partial<Pick<Cafe, (typeof WHITE_LIST_FIELDS)[number]>>,
  field?: string
) {
  if (!cafe || !cafe.id) {
    console.log(`❌ setProcessed with invalid cafe (${JSON.stringify(cafe)})`);
    return;
  }
  const date = dayjs().toISOString();
  const processed = field ? { [field]: date } : {};
  const cafeStatus = cafe.status !== "PUBLISHED" ? "PROCESSED" : cafe.status;

  // set published_at if status is PUBLISHED and it's not set
  let publishedAt = cafeStatus === "PUBLISHED" && !cafe.published_at ? date : cafe.published_at;

  const { error: updateError } = await supabase
    .from("cafes")
    .update({
      ...pick(cafe, WHITE_LIST_FIELDS),
      status: cafeStatus,
      processed: mergeObjects(cafe?.processed, processed),
      processed_at: date,
      published_at: publishedAt,
    })
    .eq("id", cafe.id);

  if (updateError) {
    console.log(`❌ processed not updated for ${cafe.id}`);
  }
}

export async function setCafeAsError(
    cafe: Pick<Cafe, "id" | "status">,
    error: Error | string
  ) {
    if (cafe.status === "PUBLISHED") {
      sendMessage("Error On published cafe", {
        cafe_id: cafe.id,
        error: error instanceof Error ? error.message : error,
      });
    }
    const { error: updateError } = await supabase
      .from("cafes")
      .update({
        status: cafe.status !== "PUBLISHED" ? "ERROR" : cafe.status,
        processed_at: dayjs().toISOString(),
        error_message: error instanceof Error ? error.message : error,
        error_metadata:
          error instanceof Error
            ? JSON.stringify(error)
            : JSON.stringify({ message: error }),
      })
      .eq("id", cafe.id);
  
    if (updateError) {
      console.log(`❌ error not updated for ${cafe.id}`);
    }
  }
