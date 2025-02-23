"use server";

import supabase from "@/libs/supabase/supabaseClient";
import { sendMessage } from "@/libs/telegram";

export async function reportCafeAction(formData: FormData) {
  try {
    // Your server-side logic here
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;
    const cafeSlug = formData.get("slug") as string;
    const cafeName = formData.get("cafe_name") as string;
    const issueType = formData.get("issue_type") as string;

    const { error } = await supabase
      .from("user_report")
      .insert({
        email,
        name,
        text: message,
        cafe_slug: cafeSlug,
        cafe_name: cafeName,
        issue_type: issueType,
      });

    if (error) {
      console.error(error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      };
    }

    await sendMessage(`${name} hat einen Report erstellt für ${cafeSlug}: ${message}`);

    console.log(`✅ Cafe ${cafeSlug} reported`);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
