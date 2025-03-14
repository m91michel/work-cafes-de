import { NextRequest, NextResponse } from "next/server";
import supabase from "@/libs/supabase/supabaseClient";
import { generateRedditReply } from "@/libs/openai/reddit/reddit-reply";
import { extractToken } from "@/libs/utils";
import { isProd } from "@/libs/environment";
import { domainEn } from "@/config/config";

const LIMIT = 100;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = extractToken(request.headers.get("Authorization"));
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get("limit") || LIMIT);

  if (token !== process.env.CRON_JOB_KEY && isProd) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    // Get posts without replies
    const { data: posts, error: postsError } = await supabase
      .from("reddit_posts")
      .select("*")
      .eq("is_relevant", true)
      .eq("has_been_replied", false)
    //   .gt("eval_confidence", 3)
      .limit(limit);

    if (postsError) throw postsError;
    if (!posts) {
      return NextResponse.json({ message: "No posts to process" });
    }

    const results = [];

    for (const post of posts) {
      const url = `https://${domainEn}`;
      try {
        // Generate reply using OpenAI
        const result = await generateRedditReply(post, url);

        if (!result || !result.reply) continue;

        // Save the reply
        const { data: replyData, error: replyError } = await supabase
          .from("reddit_post_replies")
          .insert({
            post_id: post.id,
            reply_message: result.reply,
          })
          .select()
          .single();

        if (replyError) throw replyError;

        // Update the post with the reply_id
        const { error: updateError } = await supabase
          .from("reddit_posts")
          .update({
            reply_id: replyData.id,
            has_been_replied: true,
          })
          .eq("id", post.id);

        if (updateError) throw updateError;

        results.push({
          post_id: post.id,
          reply_id: replyData.id,
          status: "success",
        });
      } catch (error) {
        console.error(`⚠️ Error creating reply for post ${post.id}:`, error);
        results.push({
          post_id: post.id,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      message: "Processing complete",
      count: results.length,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
