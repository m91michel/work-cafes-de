import { SuggestCafeForm } from "@/components/cafe/form/add/suggest-cafe-form";
import { TransHighlight } from "@/components/general/translation";
import initTranslations from "@/libs/i18n/config";
import { getSEOTags } from "@/libs/seo";

// generate metadata
export async function generateMetadata() {
  const { t } = await initTranslations(["cafe"]);

  return getSEOTags({
    title: t("submit.title"),
    description: t("submit.description"),
    canonicalUrlRelative: `/cafes/submit`,
  });
}

export default async function CafePage() {
  return (
    <main className="flex-1 bg-background">
      <div className="bg-card">
        <div className="max-w-7xl mx-auto px-4 pt-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <TransHighlight
              i18nKey={"submit.title"}
              namespace="cafe"
            />
          </h1>
          <p className="text-xl text-muted-foreground">
            <TransHighlight
              i18nKey={"submit.description"}
              namespace="cafe"
            />
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <SuggestCafeForm className="max-w-2xl mx-auto" />
      </section>

      {/* <section className="max-w-7xl mx-auto px-4 py-12">
        <FAQSection faqsIds={defaultIds} namespace="cafe" />
      </section> */}
    </main>
  );
}

