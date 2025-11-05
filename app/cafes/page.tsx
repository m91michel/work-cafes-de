import { getSEOTags } from "@/libs/seo";
import { getCafes } from "@/libs/supabase/cafes";
import { getAllCities } from "@/libs/supabase/cities";
import initTranslations from "@/libs/i18n/config";
import { AdvancedCafeList } from "@/components/cafe/lists/advanced-cafe-list";
import { cafeSortingOptions } from "@/components/cafe/filters/filters-section";
import { PaginationSection } from "@/components/general/pagination-section";
import { FAQSection } from "@/components/general/sections/faq";
import { LinkSection } from "@/components/city/sections/link-section";

export const metadata = getSEOTags({
  title: `Entdecke die besten Cafés zum Arbeiten in deiner Stadt`,
  description: "Entdecke die besten Cafés zum Arbeiten in deiner Stadt! Finde ideale Orte für Kaffee und Produktivität mit unserer umfassenden Liste der Hotspots.",
  canonicalUrlRelative: "/cafes",
});

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

type Props = {
  params: Params;
  searchParams: SearchParams;
};

export const revalidate = 2592000; // 30 days

export default async function CafesPage({ searchParams }: Props) {
  const { t } = await initTranslations(['cafe']);
  const _searchParams = await searchParams;
  const citySlug = _searchParams.city as string | undefined;
  const sort = whiteListedSortParam(_searchParams.sort as string | undefined);
  const sortBy = sort?.split('-')[0] || 'google_rating';
  const sortOrder = sort?.split('-')[1] as 'asc' | 'desc' || 'desc';
  const currentPage = Number(_searchParams.page) || 1;
  const pageSize = Number(_searchParams.page_size) || 25;
  
  const { data: cafes, total } = await getCafes({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    citySlug,
    sortBy,
    sortOrder
  });
  const cities = await getAllCities();
  
  return (
    <main className="flex-1 bg-background">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t('index.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('index.description')}
          </p>
        </div>

        <AdvancedCafeList
          cafes={cafes}
          cities={cities}
        />

        <PaginationSection
          totalItems={total}
          pageSize={pageSize}
          currentPage={currentPage}
        />

        <FAQSection />

        <LinkSection />
      </div>
    </main>
  );
}

function whiteListedSortParam(sort?: string | undefined) {
  if (!sort) {
    return cafeSortingOptions[0].value;
  }
  const isIncluded = cafeSortingOptions.some((option) => option.value === sort);
  
  if (!isIncluded) {
    return cafeSortingOptions[0].value;
  }
  return sort;
}