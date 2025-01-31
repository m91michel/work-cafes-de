import { Button } from '@/components/ui/button';
import config, { baseUrl, domainDe, submitFormUrl } from '@/config/config';
import { isGerman } from '@/libs/environment';
import { getSEOTags } from '@/libs/seo';
import { Share2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = getSEOTags({
  title: `Unterstütze uns | ${config.appName}`,
  description: `Hilf uns dabei, die beste Plattform für arbeitnehmerfreundliche Cafés in Deutschland aufzubauen.`, // 100-160 characters
  canonicalUrlRelative: "/helfe-uns",
});

const tweetText = `Entdecke die besten laptop-freundlichen Cafés in Deutschland auf ${config.appName} - Dein Guide für entspanntes Arbeiten im Café!`;

export default function ContributePage() {
  if (!isGerman) {
    return notFound();
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(baseUrl)}`;
  return (
    <main className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Hilf uns, die besten Cafés zu finden</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Suggest New Listing */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Café empfehlen</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Du kennst ein gemütliches Café, in dem du gerne mit deinem Laptop arbeitest? Teile deine Entdeckung und hilf anderen, die perfekte Location zum Arbeiten zu finden.
            </p>
            <Button asChild>
              <a href={submitFormUrl} target="_blank" rel="noopener noreferrer">
                Café vorschlagen
              </a>
            </Button>
          </div>

          {/* Share */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Weitersagen</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Kennst du andere, die auch gerne im Café arbeiten? Teile unsere Plattform und hilf ihnen, die besten laptop-freundlichen Cafés in ihrer Nähe zu finden.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
                  Auf Twitter teilen
                </a>
              </Button>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Feedback geben</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Deine Meinung ist uns wichtig! Hast du Ideen oder Vorschläge, wie wir die Suche nach gemütlichen Cafés zum Arbeiten noch einfacher machen können?
            </p>
            <Button asChild>
              <a href={`mailto:feedback@${domainDe}`} target="_blank" rel="noopener noreferrer">
                Feedback senden
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Lust auf neue Café-Entdeckungen?
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              Cafés entdecken
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}