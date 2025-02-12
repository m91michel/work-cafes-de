
import { CityHero } from '@/components/city/city-hero';
import { notFound } from 'next/navigation';
import { getSEOTags } from '@/libs/seo';
import { getCafesByCity } from '@/libs/supabase/cafes';
import { getCities, getCityBySlug } from '@/libs/supabase/cities';
import { CafeList } from '@/components/cafe-directory';
import { CityList } from '@/components/city/city-list';
import initTranslations from '@/libs/i18n/config';
import { isGerman } from '@/libs/environment';

type Params = Promise<{ city: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
type Props = {
  params: Params
  searchParams: SearchParams
}

// generate metadata
export async function generateMetadata({ params }: Props) {
  const { t } = await initTranslations(['city']);
  const slug = (await params).city
  const city = await getCityBySlug(slug);
  const dbName = isGerman ? city?.name_de : city?.name_en
  const name = dbName || t('meta.show.your_city')

  return getSEOTags({
    title: t('meta.show.title', { name }),
    description: t('meta.show.description', { name }),
    canonicalUrlRelative: `/cities/${slug}`,
  });
}

export async function generateStaticParams() {
  const cities = await getCities({ limit: 100 });
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export default async function CityPage({ params }: Props) {
  const { t } = await initTranslations(['city']);
  const citySlug = (await params).city
  const city = await getCityBySlug(citySlug);
  const cafes = await getCafesByCity(citySlug) || [];
  const cities = await getCities({ limit: 3, offset: 0, excludeSlug: citySlug });
  

  if (!city || !city.name_de) {
    notFound();
  }

  return (
    <main className="flex-1 bg-background">
      <CityHero city={city} cafeCount={cafes.length} t={t} />
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold">
          {t('hero.subtitle', { count: cafes.length, name: city.name_de })}
        </h2>
        <p className="text-muted-foreground">
          {t('hero.description', { name: city.name_de })}
        </p>
      </div>

      <CafeList cafes={cafes} />

      <CityList title={t('more_cities.title')} cities={cities} showMoreButton={true} t={t} />
    </main>
  );
}