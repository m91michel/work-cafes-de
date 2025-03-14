import { NextRequest, NextResponse } from "next/server";
import { isProd } from "@/libs/environment";
import { extractToken } from "@/libs/utils";
import { getRedditPosts } from "@/libs/supabase/reddit";
import { sendMailTemplate } from "@/libs/mails/mails";
import { RedditResults } from "@/emails/transactional/reddit-results";
import { RedditPost } from "@/libs/types";
import supabase from "@/libs/supabase/supabaseClient";

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

  const { data: posts = [] } = await supabase
    .from("reddit_posts")
    .select("*")
    .eq("is_relevant", true)
    .is("mail_send_at", null)
    .limit(limit);

  console.log(`✅ fetched ${posts?.length} posts`);

  if (posts && posts.length > 0) {
    await sendMailTemplate(RedditResults, {
      posts: posts as RedditPost[],
      email: EMAIL,
    });
    
    // Bulk update all posts that were sent in the email
    await updatePosts(posts as RedditPost[]);
  }

  console.log("✅ finished");

  return NextResponse.json({
    success: true,
    posts,
    count: posts?.length,
    timestamp: new Date().toISOString(),
  });
}

async function updatePosts(posts: RedditPost[]) {
  if (posts.length === 0) {
    return;
  }

  const postIds = posts
    .map(post => post.id)
    .filter((id): id is string => id !== undefined && id !== null);
  
  if (postIds.length === 0) {
    return;
  }
  
  const { error } = await supabase
    .from("reddit_posts")
    .update({
      mail_send_at: new Date().toISOString(),
    })
    .in("id", postIds);
    
  if (error) {
    console.error("❌ Error updating posts:", error);
    return;
  }
  
  console.log(`✅ Updated mail_send_at for ${postIds.length} posts`);
}