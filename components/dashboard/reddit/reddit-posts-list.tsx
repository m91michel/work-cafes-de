"use client";

import { RedditPost } from "@/libs/types";
import { Button } from "@/components/ui/button";
import { createClient } from "@/libs/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { ExternalLink, Calendar } from "lucide-react";
import { cn } from "@/libs/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RedditPostsListProps {
  posts: RedditPost[];
  totalPosts: number;
  currentPage: number;
  itemsPerPage: number;
  dateFilter: string;
  relevanceFilter: string;
}

export function RedditPostsList({ 
  posts, 
  totalPosts,
  currentPage,
  itemsPerPage,
  dateFilter,
  relevanceFilter
}: RedditPostsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleRelevance = async (postId: string, isRelevant: boolean) => {
    const { error } = await supabase
      .from("reddit_posts")
      .update({ is_relevant: isRelevant })
      .eq("id", postId);

    if (!error) {
      // Refresh the page to get updated data
      router.refresh();
    }
  };

  const updateFilters = (type: 'date' | 'relevance', value: string) => {
    const params = new URLSearchParams(searchParams);
    if (type === 'date') {
      params.set('date', value);
    } else {
      params.set('relevance', value);
    }
    params.set('page', '1'); // Reset to first page when filters change
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalPosts / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Tabs value={dateFilter} className="w-[400px]" onValueChange={(value) => updateFilters('date', value)}>
          <TabsList>
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={relevanceFilter} className="w-[400px]" onValueChange={(value) => updateFilters('relevance', value)}>
          <TabsList>
            <TabsTrigger value="relevant">Relevant</TabsTrigger>
            <TabsTrigger value="not-relevant">Not Relevant</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4">
            <div className="space-y-3">
              {/* Subreddit and author */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-primary">r/{post.subreddit}</span>
                <span>•</span>
                <span>Posted by u/{post.author}</span>
              </div>

              {/* Title and content */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold break-words">{post.title}</h3>

                {post.selftext && (
                  <div className="relative overflow-hidden">
                    <div className="max-h-[240px] overflow-y-auto">
                      <div className={cn(
                        "prose prose-sm dark:prose-invert w-full max-w-none",
                        "prose-headings:font-semibold prose-headings:tracking-tight",
                        "prose-p:leading-7",
                        "prose-li:my-0",
                        "prose-hr:my-2"
                      )}>
                        <div className="whitespace-pre-wrap break-words">
                          {post.selftext}
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant={post.is_relevant ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRelevance(post.id!, true)}
                  >
                    Relevant
                  </Button>

                  <Button
                    variant={post.is_relevant === false ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleRelevance(post.id!, false)}
                  >
                    Not Relevant
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() =>
                    window.open(`https://reddit.com${post.permalink}`, "_blank")
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Reddit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="py-2 px-3 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
