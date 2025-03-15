import { getSEOTags } from "@/libs/seo";
import { createClient } from '@/libs/supabase/server';
import { redirect } from 'next/navigation';

export const revalidate = 5;

export const metadata = getSEOTags({
  title: `Dashboard`,
  description: "Dashboard overview",
  canonicalUrlRelative: "/dashboard",
  robots: "noindex, nofollow",
});

export default async function DashboardPage() {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Get quick stats
  const { count: publishedCafes } = await supabase
    .from('cafes')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'PUBLISHED');

  const { count: relevantPosts } = await supabase
    .from('reddit_posts')
    .select('*', { count: 'exact', head: true })
    .eq('is_relevant', true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats Cards */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Published Cafes</h3>
          <p className="text-3xl font-bold">{publishedCafes || 0}</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Relevant Reddit Posts</h3>
          <p className="text-3xl font-bold">{relevantPosts || 0}</p>
        </div>
      </div>
    </div>
  );
}
