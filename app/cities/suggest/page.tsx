import { AddCityForm } from "@/components/city/form/add/suggest-city-form";
import { LinkSection } from "@/components/city/sections/link-section";
import { FAQSection } from "@/components/general/sections/faq";
import { TransHighlight } from "@/components/general/translation";
import initTranslations from "@/libs/i18n/config";
import { getSEOTags } from "@/libs/seo";

// generate metadata
export async function generateMetadata() {
  const { t } = await initTranslations(["city"]);

  return getSEOTags({
    title: t("suggest.title"),
    description: t("suggest.description"),
    canonicalUrlRelative: `/cities/suggest`,
  });
}

const defaultIds = ['city-added-order', 'when-suggest', 'suggest-email'];

export default async function CityPage() {
  return (
    <main className="flex-1 bg-background">
      <div className="bg-card">
        <div className="max-w-7xl mx-auto px-4 pt-12 text-center">
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
        <AddCityForm className="max-w-2xl mx-auto" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <FAQSection faqsIds={defaultIds} namespace="city" />
      </section>

      <LinkSection className="mb-12" />
    </main>
  );
}

