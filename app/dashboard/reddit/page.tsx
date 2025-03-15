import { getSEOTags } from "@/libs/seo";
import { createClient } from '@/libs/supabase/server';
import { redirect } from 'next/navigation';
import { RedditPostsList } from "@/components/dashboard/reddit/reddit-posts-list";
import { DBRedditPost, RedditPost } from "@/libs/types";
import { startOfToday, startOfWeek, formatISO } from 'date-fns';

export const revalidate = 5;

export const metadata = getSEOTags({
  title: `Reddit Posts Dashboard`,
  description: "Manage Reddit posts",
  canonicalUrlRelative: "/dashboard/reddit",
  robots: "noindex, nofollow",
});

const ITEMS_PER_PAGE = 10;

export default async function RedditPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const requestSearchParams = await searchParams;

  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Get today's and this week's start date
  const today = formatISO(startOfToday());
  const weekStart = formatISO(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Parse query parameters
  const dateFilter = (requestSearchParams.date as string) || 'today';
  const relevanceFilter = (requestSearchParams.relevance as string) || 'relevant';
  const page = parseInt((requestSearchParams.page as string) || '1', 10);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Build base query
  let query = supabase
    .from('reddit_posts')
    .select('*', { count: 'exact' });

  // Apply date filter
  if (dateFilter === 'today') {
    query = query.gte('created_at', today);
  } else if (dateFilter === 'week') {
    query = query.gte('created_at', weekStart).lt('created_at', today);
  }

  // Apply relevance filter
  if (relevanceFilter === 'relevant') {
    query = query.eq('is_relevant', true);
  } else if (relevanceFilter === 'not-relevant') {
    query = query.eq('is_relevant', false);
  }

  // Apply pagination and ordering
  const { data: posts, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1);

  // Convert DBRedditPost to RedditPost format
  const formatPosts = (posts: DBRedditPost[] | null): RedditPost[] => 
    (posts || []).map((post) => ({
      id: post.id,
      reddit_id: post.reddit_id,
      subreddit: post.subreddit,
      title: post.title,
      selftext: post.selftext,
      url: post.url,
      permalink: post.permalink,
      created_utc: post.created_utc,
      author: post.author,
      num_comments: post.num_comments,
      is_relevant: post.is_relevant,
      has_been_replied: post.has_been_replied,
      reply_id: post.reply_id,
      notes: post.notes,
      search_id: post.search_id,
      created_at: post.created_at,
      updated_at: post.updated_at
    }));

  const formattedPosts = formatPosts(posts);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reddit Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and manage Reddit posts
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      <RedditPostsList 
        posts={formattedPosts}
        totalPosts={count || 0}
        currentPage={page}
        itemsPerPage={ITEMS_PER_PAGE}
        dateFilter={dateFilter}
        relevanceFilter={relevanceFilter}
      />
    </div>
  );
} 