import { getSEOTags } from "@/libs/seo";
import { getAllCafes } from "@/libs/supabase/cafes";
import { CafesTable } from "@/components/dashboard/cafes/cafes-table";
import { notFound } from "next/navigation";
import { isProd } from "@/libs/environment";

export const revalidate = 5;

export const metadata = getSEOTags({
  title: `Dashboard`,
  description: "Dashboard",
  canonicalUrlRelative: "/dashboard",
  robots: "noindex, nofollow",
});

export default async function CafeIndex() {
  const cafes = await getAllCafes({ limit: 1000, offset: 0 });

  if (isProd) {
    return notFound()
  }

  return (
    <main className="flex-1 p-8 bg-background">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Cafes Dashboard</h1>
        <CafesTable data={cafes} />
      </div>
    </main>
  );
}
