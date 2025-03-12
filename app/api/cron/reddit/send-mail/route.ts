import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import { extractToken } from "@/libs/utils";
import { getRedditPosts } from "@/libs/supabase/reddit";
import { sendMailTemplate } from "@/libs/mails/mails";
import { RedditResults } from "@/emails/transactional/reddit-results";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LIMIT = 100;
const EMAIL = "work91michel@gmail.com";

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") || LIMIT);

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  console.log("⚡️ start fetching reddit posts");

  const posts = await getRedditPosts({
    isRelevant: true,
    hasBeenReplied: false,
    limit,
  });
  console.log(`📊 Found ${posts.length} posts`);

  await sendMailTemplate(RedditResults, {
    posts,
    email: EMAIL,
  });

  console.log(`✅ fetched ${posts.length} posts`);

  return NextResponse.json({
    success: true,
    posts,
    count: posts.length,
    timestamp: new Date().toISOString(),
  });
}
