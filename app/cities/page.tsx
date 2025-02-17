import {
  citySortingOptions,
  FiltersSection,
} from "@/components/city/filters/filters-section";
import { CityList } from "@/components/city/list/city-list";
import { TransHighlight } from "@/components/general/translation";
import initTranslations from "@/libs/i18n/config";
import { getSEOTags } from "@/libs/seo";
import { getCities } from "@/libs/supabase/cities";
import { getCountries } from "@/libs/supabase/countries";

export const revalidate = 28800; // 8 hours

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Props = {
  params: Params;
  searchParams: SearchParams;
};

// generate metadata
export async function generateMetadata({ searchParams }: Props) {
  const { t } = await initTranslations(["city"]);
  const _searchParams = await searchParams;
  const country = _searchParams.country as string | undefined;
  const titleKey = country ? "meta.index.title_with_country" : "meta.index.title";

  return getSEOTags({
    title: t(titleKey, { country }),
    description: t("meta.index.description"),
    canonicalUrlRelative: `/cities?country=${country}`,
  });
}

export default async function CityPage({ searchParams }: Props) {
  const { t } = await initTranslations(["city"]);
  const _searchParams = await searchParams;
  const country = _searchParams.country as string | undefined;
  const sort = whiteListedSortParam(_searchParams.sort as string | undefined);
  const sortBy = sort?.split("-")[0] || "population";
  const sortOrder = (sort?.split("-")[1] as "asc" | "desc") || "desc";
  const cities = await getCities({ limit: 1000, country, sortBy, sortOrder });
  const countries = await getCountries({ status: "ACTIVE" });
  const titleKey = country ? "index.title_with_country" : "index.title";
  const descriptionKey = country ? "index.description_with_country" : "index.description";
  return (
    <main className="flex-1 bg-background">
      <div className="bg-card">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">
            <TransHighlight
              i18nKey={titleKey}
              values={{ country: country || "" }}
              namespace="city"
            />
          </h1>
          <p className="text-xl text-muted-foreground">
            <TransHighlight
              i18nKey={descriptionKey}
              values={{ country: country || "" }}
              namespace="city"
            />
          </p>
        </div>
      </div>

      <CityList
        cities={cities}
        suggestCityCard={true}
        t={t}
        filterSection={<FiltersSection countries={countries} />}
      />
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
