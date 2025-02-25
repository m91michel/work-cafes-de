import { MLink } from '@/components/general/link';
import { Button } from '@/components/ui/button';
import config, { baseUrl, domainDe, domainEn } from '@/config/config';
import { isGerman } from '@/libs/environment';
import Paths from '@/libs/paths';
import { getSEOTags } from '@/libs/seo';
import { Share2, PlusCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = getSEOTags({
  title: `Trage zu unserem Verzeichnis bei | ${config.appName}`,
  description: `Hilf uns dabei, die besten arbeitnehmerfreundlichen Cafés weltweit zu sammeln.`, // 100-160 characters
  alternates: {
    canonical: `https://${domainDe}/helfe-uns`,
    languages: {
      "de": `https://${domainDe}/helfe-uns`,
      "en": `https://${domainEn}/help-us`,
    },
  },
});

const tweetText = `Entdecke die besten laptop-freundlichen Cafés weltweit auf ${config.appName} - Dein Guide für entspanntes Arbeiten im Café!`;

export default function ContributePage() {
  if (!isGerman) {
    return notFound();
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(baseUrl)}`;
  return (
    <main className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Trage zu unserem Verzeichnis bei</h1>
        
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
              <MLink href={Paths.submitCafe} umami-event="suggest-cafe">
                Café vorschlagen
              </MLink>
            </Button>
          </div>

          {/* Suggest New City */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Stadt empfehlen</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Möchtest du eine neue Stadt empfehlen? Wir freuen uns auf deine Vorschläge!
            </p>
            <Button asChild>
              <MLink href={Paths.suggestCity} umami-event="suggest-city">
                Stadt vorschlagen
              </MLink>
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
                <MLink href={tweetUrl} umami-event="share-on-twitter">
                  Auf Twitter teilen
                </MLink>
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
              <MLink href={`mailto:feedback@${domainDe}`} umami-event="send-feedback">
                Feedback senden
              </MLink>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Lust auf neue Café-Entdeckungen?
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <MLink href={Paths.cafes}>
                Cafés entdecken
              </MLink>
            </Button>
            <Button asChild variant="outline">
              <MLink href={Paths.cities}>
                Städte entdecken
              </MLink>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}