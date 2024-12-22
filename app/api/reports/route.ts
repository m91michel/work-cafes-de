import { NextResponse } from "next/server";
import supabase from "@/libs/supabase/supabaseClient";
import { sendMessage } from "@/libs/telegram";

export async function POST(request: Request) {
  const { email, name, message, cafeSlug } = await request.json();

  if (!email || !name || !message) {
    return NextResponse.json({ error: "Bitte fülle alle Felder aus" }, { status: 400 });
  }

  try {
    const { error } = await supabase.from("user_report").insert({
      email,
      name,
      text: message,
      cafe_slug: cafeSlug,
    });

    if (error) {
        console.log({ error })
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    await sendMessage(`${name} hat einen Report erstellt für ${cafeSlug}: ${message}`);

    return NextResponse.json({ message: "Report submitted successfully" }, { status: 200 });
  } catch (error) {
    console.log({ error })
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
} 