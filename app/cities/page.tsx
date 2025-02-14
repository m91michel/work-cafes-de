import { CityList } from '@/components/city/city-list';
import initTranslations from '@/libs/i18n/config';
import { getSEOTags } from '@/libs/seo';
import { getCities } from '@/libs/supabase/cities';

export const revalidate = 28800; // 8 hours

// generate metadata
export async function generateMetadata() {
  const { t } = await initTranslations(['city']);
  return getSEOTags({
    title: t('meta.index.title'),
    description: t('meta.index.description'),
    canonicalUrlRelative: `/cities`,
  });
}

export default async function CityPage() {
  const { t } = await initTranslations(['city']);
  const cities = await getCities({ limit: 1000 });

  return (
    <main className="flex-1 bg-background">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">{t('index.title')}</h1>
          <p className="text-xl text-muted-foreground">{t('index.description')}</p>
        </div>
      </div>
      
      <CityList cities={cities} suggestCityCard={true} t={t} />
    </main>
  );
}