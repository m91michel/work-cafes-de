import { getSEOTags } from "@/libs/seo";
import { getCafesWithUnpublished } from "@/libs/supabase/cafes";
import { CafesTable } from "@/components/dashboard/cafes/cafes-table";
import { createClient } from '@/libs/supabase/server';
import { redirect } from 'next/navigation';

export const revalidate = 5;

export const metadata = getSEOTags({
  title: `Cafes Dashboard`,
  description: "Manage cafes",
  canonicalUrlRelative: "/dashboard/cafes",
  robots: "noindex, nofollow",
});

export default async function CafesPage() {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  const cafes = await getCafesWithUnpublished({ limit: 100, offset: 0 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Cafes</h1>
      </div>

      <CafesTable data={cafes} />
    </div>
  );
} 