import { getCafes, getCafeBySlug } from '@/libs/cafe-utils';
import { CafeHero } from '@/components/cafe/cafe-hero';
import { CafeDetails } from '@/components/cafe/cafe-details';
import { CafeAmenities } from '@/components/cafe/cafe-amenities';
import { notFound } from 'next/navigation';
import { getSEOTags } from '@/libs/seo';
import config from '@/config/config';

interface CafePageProps {
  params: {
    slug: string;
  };
}

// generate metadata
export async function generateMetadata({ params }: CafePageProps) {
  const cafe = await getCafeBySlug(params.slug);

  if (!cafe) {
    return getSEOTags({
      title: `Café nicht gefunden | ${config.appName}`,
      description: `Café nicht gefunden`,
      canonicalUrlRelative: `/cafe/${params.slug}`,
    });
  }
  
  return getSEOTags({
    title: `${cafe.name} | Cafés zum Arbeiten`,
    description: `Das ${cafe.name} in ${cafe.city} ist ein idealer Ort zum Arbeiten, Studieren oder sich auszutauschen. Wir haben die Bewertungen geprüft und die besten Cafés für dich ausgewählt.`,
    canonicalUrlRelative: `/cafe/${params.slug}`,
  });
}

// Required for static site generation
export async function generateStaticParams() {
  const cafes = await getCafes();
  const allCafes = Object.values(cafes).flat();
  
  return allCafes.map((cafe) => ({
    slug: cafe.slug,
  }));
}

export default async function CafePage({ params }: CafePageProps) {
  const cafe = await getCafeBySlug(params.slug);
  
  if (!cafe) {
    notFound();
  }

  return (
    <main className="flex-1 bg-background">
      <CafeHero cafe={cafe} />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <CafeDetails cafe={cafe} />
          </div>
          <div>
            <CafeAmenities cafe={cafe} />
          </div>
        </div>
      </div>
    </main>
  );
}