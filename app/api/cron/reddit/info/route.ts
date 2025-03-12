import { NextRequest, NextResponse } from "next/server";
import { RedditClient } from "@/libs/reddit/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const subreddits = ['Munich', 'Berlin', 'nyc', 'Seattle', 'frankfurt'];
  
  console.log(`⚡️ start fetching subreddit info`);

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

  const results = [];
  for (const subreddit of subreddits) {
    const info = await redditClient.getSubredditInfo(subreddit);
    results.push({
      subreddit,
      ...info
    });
  }

  console.log(`✅ fetched info for ${results.length} subreddits`);

  return NextResponse.json({
    success: true,
    results,
    timestamp: new Date().toISOString(),
  });
} 