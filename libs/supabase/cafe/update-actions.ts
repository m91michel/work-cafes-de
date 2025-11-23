import dayjs from "dayjs";
import supabase from "../supabaseClient";
import { mergeObjects } from "../../utils";
import { Cafe } from "../../types";
import { sendMessage } from "../../telegram";

export async function setProcessed(
  cafe: Pick<Cafe, "id" | "processed" | "status">,
  field?: string
) {
  const date = dayjs().toISOString();
  const processed = field ? { [field]: date } : {};

  const { error: updateError } = await supabase
    .from("cafes")
    .update({
      status: cafe.status !== "PUBLISHED" ? "PROCESSED" : cafe.status,
      processed: mergeObjects(cafe?.processed, processed),
      processed_at: date,
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
