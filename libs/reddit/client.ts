import Snoowrap, { BaseSearchOptions } from "snoowrap";

const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 (web:awifi.place:v1.0)";

export class RedditClient {
  private client: Snoowrap;

  constructor() {
    if (
      !process.env.REDDIT_CLIENT_ID ||
      !process.env.REDDIT_CLIENT_SECRET ||
      !process.env.REDDIT_USERNAME ||
      !process.env.REDDIT_PASSWORD
    ) {
      throw new Error("Missing Reddit credentials in environment variables");
    }

    this.client = new Snoowrap({
      userAgent,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD,
    });

    // Configure request delays to avoid rate limiting
    this.client.config({
      requestDelay: 1000,
      continueAfterRatelimitError: true,
      retryErrorCodes: [502, 503, 504, 522],
    });
  }

  /**
   * Get recent posts from a subreddit
   */
  async getSubredditPosts(
    subreddit: string,
    limit = 25
  ): Promise<RedditPost[]> {
    try {
      const posts = await this.client.getSubreddit(subreddit).getNew({ limit });

      return posts.map((post: any) => ({
        id: post.id,
        subreddit: post.subreddit_name_prefixed?.replace("r/", ""),
        title: post.title,
        selftext: post.selftext,
        url: post.url,
        permalink: post.permalink,
        created_utc: post.created_utc,
        author: post.author?.name || "[deleted]",
        num_comments: post.num_comments,
      }));
    } catch (error) {
      console.error(`Error fetching posts from r/${subreddit}:`, error);
      return [];
    }
  }

  /**
   * Search for posts in a subreddit
   */
  async searchSubreddit(
    subreddit: string,
    query: string,
    options: Omit<BaseSearchOptions, "query"> & {
      limit?: number;
    } = {}
  ): Promise<RedditPost[]> {
    const { limit = 25, time = "week", sort = "new" } = options;
    try {
      const searchResults = await this.client.getSubreddit(subreddit).search({
        query: query,
        sort,
        time,
        //@ts-ignore
        limit,
      });

      return searchResults.map((post) => ({
        id: post.id,
        subreddit: post.subreddit_name_prefixed.replace("r/", ""),
        title: post.title,
        selftext: post.selftext,
        url: post.url,
        permalink: post.permalink,
        created_utc: post.created_utc,
        author: post.author.name,
        num_comments: post.num_comments,
      }));
    } catch (error) {
      console.error(`Error searching r/${subreddit} for "${query}":`, error);
      return [];
    }
  }

  /**
   * Post a comment on a Reddit post
   */
  async postComment(postId: string, comment: string): Promise<string | null> {
    try {
      const submission = this.client.getSubmission(postId);
      const result = await (submission.reply(comment) as Promise<any>);
      return result.id;
    } catch (error) {
      console.error(`Error posting comment to ${postId}:`, error);
      return null;
    }
  }

  /**
   * Get information about a subreddit
   */
  async getSubredditInfo(subreddit: string): Promise<{
    exists: boolean;
    subscribers?: number;
    description?: string;
    title?: string;
  }> {
    try {
      const sub = await (this.client.getSubreddit(subreddit).fetch() as Promise<any>);
      return {
        exists: true,
        subscribers: sub.subscribers,
        description: sub.public_description,
        title: sub.title
      };
    } catch (error) {
      console.error(`Error fetching info for r/${subreddit}:`, error);
      return { exists: false };
    }
  }
}

export interface RedditPost {
  id: string;
  subreddit: string;
  title: string;
  selftext: string;
  url: string;
  permalink: string;
  created_utc: number;
  author: string;
  num_comments: number;
}
