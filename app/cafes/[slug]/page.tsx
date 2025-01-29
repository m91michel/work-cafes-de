import { CafeHero } from "@/components/cafe/cafe-hero";
import { CafeDetails } from "@/components/cafe/cafe-details";
import {
  CafeAmenities,
  CafeFurtherButtons,
  DebugInfo,
} from "@/components/cafe/cafe-section-blocks";
import { notFound } from "next/navigation";
import { getSEOTags } from "@/libs/seo";
import config from "@/config/config";
import { getCafeBySlug, getCafes, getCafesByCity } from "@/libs/supabase/cafes";
import { CafeCard } from "@/components/cafe/cafe-card";
import { CafeRatingCard } from "@/components/cafe/rating";
import CafeBreadcrumb from "@/components/cafe/cafe-breadcrumb";
import { getReviewsById } from "@/libs/supabase/reviews";
import { isDev } from "@/libs/environment";
import { CafeReviews } from "@/components/cafe/cafe-reviews";
import { FAQSection } from "@/components/faq";
import { faqs } from "@/config/faq";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type Props = {
  params: Params;
  searchParams: SearchParams;
};

export const revalidate = 1;

// generate metadata
export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  const cafe = await getCafeBySlug(slug);

  if (!cafe) {
    return getSEOTags({
      title: `Café nicht gefunden | ${config.appName}`,
      description: `Café nicht gefunden`,
      canonicalUrlRelative: `/cafes/${slug}`,
    });
  }

  return getSEOTags({
    title: `${cafe.name} | Cafés zum Arbeiten`,
    description: `Das ${cafe.name} in ${cafe.city} ist ein idealer Ort zum Arbeiten, Studieren oder sich auszutauschen. Wir haben die Bewertungen geprüft und die besten Cafés für dich ausgewählt.`,
    canonicalUrlRelative: `/cafes/${slug}`,
  });
}

// Required for static site generation
export async function generateStaticParams() {
  const cafes = await getCafes({ limit: 1000 });
  // Don't forget that supabase returns max 1000 rows

  return cafes.map((cafe) => ({
    slug: cafe.slug,
  }));
}

export default async function CafePage({ params }: Props) {
  const slug = (await params).slug;
  const cafe = await getCafeBySlug(slug);
  const relatedCafes = await getCafesByCity(cafe?.city_slug || "", {
    limit: 3,
    excludeSlug: slug,
  });
  const reviews = await getReviewsById(cafe?.id);

  if (!cafe) {
    notFound();
  }

  return (
    <main className="flex-1 bg-background">
      <CafeHero cafe={cafe} />
      <CafeBreadcrumb cafe={cafe} className="py-6" />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <CafeDetails cafe={cafe} />
          </div>
          <div>
            <CafeRatingCard rating={cafe.google_rating} />
            <CafeAmenities cafe={cafe} />
            <CafeFurtherButtons cafe={cafe} />
            {isDev && <DebugInfo cafe={cafe} />}
          </div>

          <div className="md:col-span-2">
            <CafeReviews cafe={cafe} />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">
            Weitere Cafés in {cafe.city}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedCafes.map((cafe) => (
              <CafeCard key={cafe.slug} cafe={cafe} />
            ))}
          </div>
        </div>
        <div className="mt-12">
          <FAQSection faqs={faqs} />
        </div>
      </div>
    </main>
  );
}
