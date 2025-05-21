import { CafeHero } from "@/components/cafe/cafe-hero";
import { CafeDetails } from "@/components/cafe/sections/cafe-details";
import {
  CafeAmenities,
  DebugInfo,
} from "@/components/cafe/sections/cafe-section-blocks";
import { notFound } from "next/navigation";
import { getSEOTags } from "@/libs/seo";
import config from "@/config/config";
import { getAllPublishedCafes, getCafeBySlug, getCafes, getCafesByCity } from "@/libs/supabase/cafes";
import { CafeCard } from "@/components/cafe/cafe-card";
import { CafeRatingCard } from "@/components/cafe/sections/rating";
import CafeBreadcrumb from "@/components/cafe/cafe-breadcrumb";
import { isDev } from "@/libs/environment";
import { CafeReviews } from "@/components/cafe/cafe-reviews";
import { FAQSection } from "@/components/general/sections/faq";
import initTranslations from "@/libs/i18n/config";
import { getCountryByCode } from "@/libs/supabase/countries";
import { CafeMapLocation } from "@/components/cafe/sections/cafe-map-location";
import { LinkSection } from "@/components/city/sections/link-section";
import Paths from "@/libs/paths";
import { getCafeOGImage } from "@/libs/og-helper";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type Props = {
  params: Params;
  searchParams: SearchParams;
};

// generate metadata
export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  const cafe = await getCafeBySlug(slug);

  if (!cafe) {
    return getSEOTags({
      title: `Café nicht gefunden | ${config.appName}`,
      description: `Café nicht gefunden`,
      canonicalUrlRelative: Paths.cafe(slug),
    });
  }
  const { t } = await initTranslations(["cafe"]);

  const ogImage = getCafeOGImage(cafe);

  return getSEOTags({
    title: `${cafe.name} | ${config.appName}`,
    description: t("meta.slug.description", {
      name: cafe.name || '',
      city: cafe.city || '',
    }),
    canonicalUrlRelative: Paths.cafe(slug),
    openGraph: {
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: cafe.name || ''
      }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImage],
    }
  });
}

export const generateStaticParams = async () => {
  if (isDev) {
    // Just generate 10 cafes for dev
    const cafes = await getCafes({ limit: 10, offset: 0 });
    return cafes.data.map((cafe) => ({
      slug: cafe.slug,
    }));
  }
  const cafes = await getAllPublishedCafes();
  return cafes.map((cafe) => ({
    slug: cafe.slug,
  }));
};

export default async function CafePage({ params }: Props) {
  const { t } = await initTranslations(["cafe"]);
  const slug = (await params).slug;
  const cafe = await getCafeBySlug(slug);
  const country = await getCountryByCode(cafe?.cities?.country_code);

  if (!cafe) {
    return notFound();
  }

  const relatedCafes = await getCafesByCity(cafe?.city_slug || "", {
    limit: 3,
    excludeSlug: slug,
  });

  return (
    <main className="flex-1 bg-background">
      <CafeHero cafe={cafe} />
      <CafeBreadcrumb cafe={cafe} country={country} className="py-6" />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details - Box 1 */}
          <div className="order-1 lg:order-1 lg:col-span-2 lg:row-span-2">
            <CafeDetails cafe={cafe} t={t} />
          </div>

          {/* Sidebar - Box 2 */}
          <div className="order-2 lg:order-3 lg:col-span-1 lg:row-span-5">
            <div className="sticky top-6">
              <CafeMapLocation cafe={cafe} />
              <CafeRatingCard cafe={cafe} />
              <CafeAmenities cafe={cafe} />
              {isDev && false && <DebugInfo cafe={cafe} />}
            </div>
          </div>

          {/* Reviews - Box 3 */}
          <div className="order-3 lg:order-3 lg:col-span-2 lg:row-span-3">
            <CafeReviews cafe={cafe} />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">
            {t("more_cafes.title", { city: cafe.city })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedCafes.map((cafe) => (
              <CafeCard key={cafe.slug} cafe={cafe} />
            ))}
          </div>
        </div>
        <div className="mt-12">
          <FAQSection />
        </div>
      </div>

      <LinkSection />
    </main>
  );
}
