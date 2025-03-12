import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { analyzeRedditPost, RedditAnalysisResponse } from "@/libs/openai/reddit/analyze-post";
import { RedditPost } from "@/libs/types";
import { extractToken } from "@/libs/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const LIMIT = 1;

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") || LIMIT);

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  console.log("⚡️ start fetching reddit posts");

  const { data: posts, count } = await supabase
    .from("reddit_posts")
    .select("*", { count: "exact" })
    .is("is_relevant", null)
    .limit(limit);

  if (!posts || posts.length === 0) {
    console.log("🔴 No posts found");
    return NextResponse.json({ success: true, count: 0 });
  }

  console.log(`📊 Found ${posts.length} posts`);

  for (const post of posts) {
    let analysis: RedditAnalysisResponse | null = null;

    if (post.selftext) {
      console.log(`🔍 Analyzing post ${post.id}: ${post.title}`);
      analysis = await analyzeRedditPost(post as RedditPost);
    }

    console.log(`🔍 Analysis: ${JSON.stringify(analysis)}`);

    if (!analysis) {
      console.log(`🔴 No analysis for post ${post.id}: ${post.title}`);
      analysis = {
        isSearchingForWorkCafe: false,
        city: null,
        keywords: [],
        confidence: 0,
        shouldReply: 0,
      }
    }

    const { isSearchingForWorkCafe } = analysis;

    const { error } = await supabase
      .from("reddit_posts")
      .update({
        is_relevant: isSearchingForWorkCafe,
        keywords: analysis.keywords,
        eval_confidence: analysis.confidence,
        eval_shouldReply: analysis.shouldReply,
        meta_data: analysis,
      })
      .eq("id", post.id);

    if (error) {
      console.log(`🔴 Error updating post ${post.id}: ${error}`);
    }
  }

  console.log(`✅ fetched ${posts.length} posts remaining: ${(count || 0) - posts.length}`);

  return NextResponse.json({
    success: true,
    posts,
    count: posts.length,
    timestamp: new Date().toISOString(),
  });
}
