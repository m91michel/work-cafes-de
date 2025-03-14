import { getSEOTags } from "@/libs/seo";
import { getAllCafes } from "@/libs/supabase/cafes";
import { CafesTable } from "@/components/dashboard/cafes/cafes-table";
import { createClient } from '@/libs/supabase/server';
import { redirect } from 'next/navigation';
import SignOutButton from "@/components/auth/sign-out-button";

export const revalidate = 5;

export const metadata = getSEOTags({
  title: `Dashboard`,
  description: "Dashboard",
  canonicalUrlRelative: "/dashboard",
  robots: "noindex, nofollow",
});

export default async function CafeIndex() {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  const cafes = await getAllCafes({ limit: 1000, offset: 0 });

  return (
    <main className="flex-1 p-8 bg-background">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Cafes Dashboard</h1>
          <SignOutButton />
        </div>
        <CafesTable data={cafes} />
      </div>
    </main>
  );
}
