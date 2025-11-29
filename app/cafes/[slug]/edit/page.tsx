import { notFound, redirect } from "next/navigation";
import { getCafeBySlug } from "@/libs/supabase/cafes";
import { createClient } from "@/libs/supabase/server";
import { CafeEditForm } from "@/components/cafe/edit/cafe-edit-form";
import { isProd, isDev } from "@/libs/environment";
import { getSEOTags } from "@/libs/seo";
import config from "@/config/config";
import { CafeHero } from "@/components/cafe/cafe-hero";
import CafeBreadcrumb from "@/components/cafe/cafe-breadcrumb";
import { getCountryByCode } from "@/libs/supabase/countries";
import {
  CafeAmenities,
  DebugInfo,
} from "@/components/cafe/sections/cafe-section-blocks";
import { CafeMapLocation } from "@/components/cafe/sections/cafe-map-location";
import { CafeRatingCard } from "@/components/cafe/sections/rating";

type Params = Promise<{ slug: string }>;
type Props = {
  params: Params;
};

export const metadata = getSEOTags({
  title: `Edit Cafe | ${config.appName}`,
  description: "Edit cafe information",
  robots: "noindex, nofollow",
});

export default async function CafeEditPage({ params }: Props) {
  // Check authentication
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Disable in production (same as API route)
  if (isProd) {
    return notFound();
  }

  if (!session) {
    redirect('/login');
  }


  const slug = (await params).slug;
  const cafe = await getCafeBySlug(slug);
  const country = await getCountryByCode(cafe?.cities?.country_code);

  if (!cafe) {
    return notFound();
  }

  return (
    <main className="flex-1 bg-background">
      <CafeHero cafe={cafe} />
      <CafeBreadcrumb cafe={cafe} country={country} className="py-6" />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Edit Form - Main Content */}
          <div className="order-1 lg:order-1 lg:col-span-2">
            <CafeEditForm cafe={cafe} />
          </div>

          {/* Sidebar */}
          <div className="order-2 lg:order-3 lg:col-span-1">
            <div className="sticky top-6">
              <CafeMapLocation cafe={cafe} />
              <CafeRatingCard cafe={cafe} />
              <CafeAmenities cafe={cafe} />
              {isDev && <DebugInfo cafe={cafe} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

