import { SuggestCityForm } from "@/components/city/form/suggest/suggest-city-form";
import { TransHighlight } from "@/components/general/translation";
import initTranslations from "@/libs/i18n/config";
import { getSEOTags } from "@/libs/seo";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Props = {
  params: Params;
  searchParams: SearchParams;
};

// generate metadata
export async function generateMetadata({ searchParams }: Props) {
  const { t } = await initTranslations(["city"]);

  return getSEOTags({
    title: t("suggest.title"),
    description: t("suggest.description"),
    canonicalUrlRelative: `/cities/suggest`,
  });
}

export default async function CityPage({ searchParams }: Props) {
  const { t } = await initTranslations(["city"]);
  const _searchParams = await searchParams;
  console.log(_searchParams);
  
  return (
    <main className="flex-1 bg-background">
      <div className="bg-card">
        <div className="max-w-7xl mx-auto px-4 pt-12">
          <h1 className="text-4xl font-bold mb-4">
            <TransHighlight
              i18nKey={"suggest.title"}
              namespace="city"
            />
          </h1>
          <p className="text-xl text-muted-foreground">
            <TransHighlight
              i18nKey={"suggest.description"}
              namespace="city"
            />
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <SuggestCityForm className="max-w-2xl" />
      </section>
    </main>
  );
}

