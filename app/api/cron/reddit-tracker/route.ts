import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import { extractToken } from "@/libs/utils";
import { RedditClient } from "@/libs/reddit/client";
import { getCities } from "@/libs/supabase/cities";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LIMIT = 10;

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") || LIMIT);

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  console.log(`⚡️ start fetching reddit posts (limit: ${limit})`);

  let redditClient: RedditClient;
  try {
    redditClient = new RedditClient();
  } catch (error) {
    console.error("⚠️ Error initializing Reddit client:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }

  const cities = await getCities({ limit: 10 });

  const posts = [];
  for (const city of cities) {
    const subreddit = city.slug;
    const query = "cafe OR coffee OR coworking";

    const _posts = await redditClient.searchSubreddit(subreddit, query, {
      limit,
    });
    posts.push(..._posts);
  }

  console.log(`✅ fetched ${posts.length} posts from ${cities.length} cities`);

  return NextResponse.json({
    success: true,
    posts,
    count: posts.length,
    timestamp: new Date().toISOString(),
  });
}
