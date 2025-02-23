import { ReportCafeForm } from "@/components/cafe/form/report/form";
import { FAQSection } from "@/components/general/sections/faq";
import { TransHighlight } from "@/components/general/translation";
import initTranslations from "@/libs/i18n/config";
import { getSEOTags } from "@/libs/seo";
import { getCafeBySlug } from "@/libs/supabase/cafes";
import { PageProps } from "@/libs/types";

// generate metadata
export async function generateMetadata() {
  const { t } = await initTranslations(["cafe"]);

  return getSEOTags({
    title: t("report.title"),
    description: t("report.description"),
    canonicalUrlRelative: `/cafes/report`,
  });
}

const defaultIds = ['goal-of-report', 'cases-when-report'];

export default async function CafePage({ searchParams }: PageProps) {
  const _searchParams = await searchParams;
  const cafeSlug = _searchParams.slug as string | undefined;

  const cafe = await getCafeBySlug(cafeSlug);

  return (
    <main className="flex-1 bg-background">
      <div className="bg-card">
        <div className="max-w-2xl mx-auto px-4 pt-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <TransHighlight
              i18nKey={"report.title"}
              namespace="cafe"
            />
          </h1>
          <p className="text-xl text-muted-foreground">
            <TransHighlight
              i18nKey={"report.description"}
              namespace="cafe"
            />
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <ReportCafeForm className="max-w-2xl mx-auto" cafe={cafe} />
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">  
        <FAQSection faqsIds={defaultIds} namespace="cafe" />
      </div>
    </main>
  );
}

