import { getCafes, getCafeBySlug } from '@/lib/cafe-utils';
import { CafeHero } from '@/components/cafe/cafe-hero';
import { CafeDetails } from '@/components/cafe/cafe-details';
import { CafeAmenities } from '@/components/cafe/cafe-amenities';
import { notFound } from 'next/navigation';

interface CafePageProps {
  params: {
    slug: string;
  };
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