import { citySortingOptions, FiltersSection } from '@/components/city/filters/filters-section';
import { CityList } from '@/components/city/list/city-list';
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

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

type Props = {
  params: Params;
  searchParams: SearchParams;
};
export default async function CityPage({ searchParams }: Props) {
  const { t } = await initTranslations(['city']);
  const _searchParams = await searchParams;
  const country = _searchParams.country as string | undefined;
  const sort = whiteListedSortParam(_searchParams.sort as string | undefined);
  const sortBy = sort?.split('-')[0] || 'population';
  const sortOrder = sort?.split('-')[1] as 'asc' | 'desc' || 'desc';
  const cities = await getCities({ limit: 1000, country, sortBy, sortOrder });

  return (
    <main className="flex-1 bg-background">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">{t('index.title')}</h1>
          <p className="text-xl text-muted-foreground">{t('index.description')}</p>
        </div>
      </div>
      
      <CityList cities={cities} suggestCityCard={true} t={t} filterSection={<FiltersSection countries={[]} />} />
    </main>
  );
}

function whiteListedSortParam(sort?: string | undefined) {
  if (!sort) {
    return citySortingOptions[0].value;
  }
  const isIncluded = citySortingOptions.some((option) => option.value === sort);
  
  if (!isIncluded) {
    return citySortingOptions[0].value;
  }
  return sort;
}