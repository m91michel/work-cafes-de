import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import supabase from "@/libs/supabase/supabaseClient";
import { analyzeRedditPost, RedditAnalysisResponse } from "@/libs/openai/reddit/analyze-post";
import { RedditPost } from "@/libs/types";
import { extractToken } from "@/libs/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const maxDuration = 300;

const LIMIT = 100;

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

    console.log(` isRelevant: ${analysis?.isRelevant ? "true" : "false"} confidence: ${analysis?.confidence} reasoning: ${analysis?.reasoning}`);

    if (!analysis) {
      console.log(`🔴 No analysis for post ${post.id}: ${post.title}`);
      analysis = {
        isRelevant: false,
        keywords: [],
        confidence: 0
      }
    }

    const { isRelevant } = analysis;

    const { error } = await supabase
      .from("reddit_posts")
      .update({
        is_relevant: isRelevant,
        keywords: analysis.keywords,
        eval_confidence: analysis.confidence,
        eval_reasoning: analysis.reasoning,
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
    count: posts.length,
    timestamp: new Date().toISOString(),
  });
}
