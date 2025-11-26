import { getSEOTags } from "@/libs/seo";
import { getCafesForDashboard } from "@/libs/supabase/cafes";
import { CafesTable } from "@/components/dashboard/cafes/cafes-table";
import { JobButton } from "@/components/general/job-button";
import { createClient } from '@/libs/supabase/server';
import { redirect } from 'next/navigation';
import { RefreshCw, Play } from "lucide-react";

export const revalidate = 5;

export const metadata = getSEOTags({
  title: `Cafes Dashboard`,
  description: "Manage cafes",
  canonicalUrlRelative: "/dashboard/cafes",
  robots: "noindex, nofollow",
});

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CafesPage({
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
  const city = typeof params.city === 'string' ? params.city : undefined;
  const name = typeof params.name === 'string' ? params.name : undefined;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : 100;
  const offset = (page - 1) * limit;

  const { data: cafes } = await getCafesForDashboard({
    limit,
    offset,
    status,
    city,
    name,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Cafes</h1>
        <div className="flex gap-2">
          <JobButton
            jobName="cafeScheduler"
            variant="outline"
            size="sm"
            successMessage="Cafe scheduler job has been queued"
          >
            <Play className="mr-2 h-4 w-4" />
            Run Scheduler
          </JobButton>
          <JobButton
            jobName="cafeProcessDuplicates"
            variant="outline"
            size="sm"
            successMessage="Duplicate processing job has been queued"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Process Duplicates
          </JobButton>
        </div>
      </div>

      <CafesTable data={cafes} />
    </div>
  );
} 