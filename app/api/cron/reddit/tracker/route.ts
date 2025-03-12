import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import { extractToken } from "@/libs/utils";
import { RedditClient } from "@/libs/reddit/client";
import { getActiveSearches, saveRedditPosts } from "@/libs/supabase/reddit";
import supabase from "@/libs/supabase/supabaseClient";
import { RedditPost } from "@/libs/types";

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

  console.log("⚡️ start fetching reddit posts");

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

  const searches = await getActiveSearches({ limit });
  console.log(`📊 Found ${searches.length} active searches`);

  const posts: RedditPost[] = [];

  for (const search of searches) {
    const { id: searchId, subreddit, query, time_frame, sort, result_limit } = search;
    
    console.log(`🔍 Searching r/${subreddit} for "${query}"`);
    
    const _posts = await redditClient.searchSubreddit(subreddit, query, {
      time: time_frame,
      sort: sort,
      limit: result_limit,
    });
    
    if (_posts.length > 0) {
      // Transform posts to match our database schema
      const transformedPosts = _posts.map(post => ({
        reddit_id: post.id,
        subreddit: post.subreddit,
        title: post.title,
        selftext: post.selftext,
        url: post.url,
        permalink: post.permalink,
        created_utc: post.created_utc,
        author: post.author,
        num_comments: post.num_comments,
        search_id: searchId
      }));
      
      // Save posts to database
      await saveRedditPosts(transformedPosts, searchId);
      posts.push(...transformedPosts);
    }
    
    // Update last_checked timestamp
    await supabase
      .from("reddit_searches")
      .update({ last_checked: new Date().toISOString() })
      .eq("id", searchId);
  }

  console.log(`✅ fetched ${posts.length} posts from ${searches.length} searches`);

  return NextResponse.json({
    success: true,
    posts,
    count: posts.length,
    searches_processed: searches.length,
    timestamp: new Date().toISOString(),
  });
}
