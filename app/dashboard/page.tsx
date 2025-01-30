import { getSEOTags } from "@/libs/seo";
import { getCafes } from "@/libs/supabase/cafes";

export const revalidate = 5;

export const metadata = getSEOTags({
  title: `Dashboard`,
  description: "Dashboard",
  canonicalUrlRelative: "/dashboard",
  robots: "noindex, nofollow",
});

export default async function CafeIndex() {
  const cafes = await getCafes({ limit: 1000, offset: 0 });

  return (
    <main className="flex-1 bg-background">
      
    </main>
  );
}
