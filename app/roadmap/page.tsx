import { RoadmapComponent } from "@/components/general/feature-vote/board";
import config from "@/config/config";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: `Roadmap | ${config.appName}`,
  description: `Check out the roadmap for ${config.appName}`,
  canonicalUrlRelative: "/roadmap",
});

export default function AboutPage() {
  return (
    <main className="flex-1 bg-background">
      <section className="max-w-4xl mx-auto px-4 pt-12">
        <h1 className="text-4xl font-bold">Roadmap</h1>
      </section>
      <section className="px-4 h-[vh100]">
        <RoadmapComponent />
      </section>
    </main>
  );
}
