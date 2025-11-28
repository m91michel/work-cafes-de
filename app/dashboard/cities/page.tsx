import { getSEOTags } from "@/libs/seo";
import { getCitiesForDashboard } from "@/libs/supabase/cities";
import { CitiesTable } from "@/components/dashboard/cities/cities-table";
import { JobButton } from "@/components/general/job-button";
import { createClient } from '@/libs/supabase/server';
import { redirect } from 'next/navigation';
import { RefreshCw } from "lucide-react";

export const revalidate = 5;

export const metadata = getSEOTags({
  title: `Cities Dashboard`,
  description: "Manage cities",
  canonicalUrlRelative: "/dashboard/cities",
  robots: "noindex, nofollow",
});

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CitiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const status = typeof params.status === 'string' ? params.status : undefined;
  const name = typeof params.name === 'string' ? params.name : undefined;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 100;
  const offset = (page - 1) * limit;

  const { data: cities, total } = await getCitiesForDashboard({
    limit,
    offset,
    status,
    name,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Cities</h1>
        <div className="flex items-center gap-4">
          <p>{total} cities found</p>
          <JobButton
            jobName="cityUpdateCafeStats"
            variant="outline"
            size="sm"
            successMessage="Update cafe stats job has been queued"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Update Cafe Stats
          </JobButton>
        </div>
      </div>

      <CitiesTable data={cities} />
    </div>
  );
}

