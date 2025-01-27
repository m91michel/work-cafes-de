import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log(`⚡️ start processing request`, body);

  return NextResponse.json({ message: "success" });
}
