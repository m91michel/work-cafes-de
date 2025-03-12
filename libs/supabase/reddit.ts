import { RedditSearch, RedditPost } from "../types";
import supabase from "./supabaseClient";

type Query = {
  limit?: number;
};

export async function getActiveSearches(props: Query = {}): Promise<RedditSearch[]> {
  const { limit = 10 } = props;

  const { data, error } = await supabase
    .from("reddit_searches")
    .select("*")
    .eq("is_active", true)
    .limit(limit)
    .order("last_checked", { ascending: true, nullsFirst: true });

  if (error) {
    console.error("Error fetching reddit searches:", error);
    return [];
  }

  return data as RedditSearch[];
}

export async function saveRedditPosts(posts: Omit<RedditPost, 'id'>[], searchId: string): Promise<void> {
  if (posts.length === 0) return;

  const { error } = await supabase
    .from("reddit_posts")
    .upsert(
      posts.map(post => ({
        ...post,
        search_id: searchId,
        reddit_id: post.reddit_id,
      })),
      { onConflict: 'reddit_id', ignoreDuplicates: true }
    );

  if (error) {
    console.error("Error saving reddit posts:", error);
  }
}

type GetRedditPostsProps = {
  isRelevant?: boolean;
  hasBeenReplied?: boolean;
  limit?: number;
};

export async function getRedditPosts(props: GetRedditPostsProps = {}): Promise<RedditPost[]> {
  const { isRelevant = true, hasBeenReplied = false, limit = 10 } = props;

  const { data, error } = await supabase
    .from("reddit_posts")
    .select("*")
    .eq("is_relevant", isRelevant)
    .eq("has_been_replied", hasBeenReplied)
    .limit(limit);

  if (error) {
    console.error("Error fetching reddit posts:", error);
    return [];
  }

  return data as RedditPost[];
}