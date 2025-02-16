import { SuggestCafeForm } from "@/components/cafe/form/suggest-cafe-form";
import { FAQSection } from "@/components/faq";
import { TransHighlight } from "@/components/general/translation";
import initTranslations from "@/libs/i18n/config";
import { getSEOTags } from "@/libs/seo";

// generate metadata
export async function generateMetadata() {
  const { t } = await initTranslations(["cafe"]);

  return getSEOTags({
    title: t("suggest.title"),
    description: t("suggest.description"),
    canonicalUrlRelative: `/cafes/suggest`,
  });
}

const defaultIds = ['next-steps'];

export default async function CafePage() {
  return (
    <main className="flex-1 bg-background">
      <div className="bg-card">
        <div className="max-w-7xl mx-auto px-4 pt-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <TransHighlight
              i18nKey={"suggest.title"}
              namespace="cafe"
            />
          </h1>
          <p className="text-xl text-muted-foreground">
            <TransHighlight
              i18nKey={"suggest.description"}
              namespace="cafe"
            />
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <SuggestCafeForm className="max-w-2xl mx-auto" />
        <FAQSection faqsIds={defaultIds} namespace="cafe" />
      </section>
    </main>
  );
}

