import { Button } from '@/components/ui/button';
import config, { baseUrl, submitFormUrl } from '@/config/config';
import { getSEOTags } from '@/libs/seo';
import { Share2, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = getSEOTags({
  title: `Unterstütze uns | ${config.appName}`,
  description: `Unterstütze uns, indem du diese Seite mit Freunden teilst.`, // 100-160 characters
  canonicalUrlRelative: "/helfe-uns",
});

const tweetText = `Du suchst nach einem Café zum Arbeiten? Dann schau doch mal auf Cafés zum Arbeiten vorbei.`;

export default function ContributePage() {
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(baseUrl)}`;
  return (
    <main className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Du möchtest diese Seite unterstützen?</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Suggest New Listing */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Café vorschlagen</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Du kennst ein Cafe, was noch nicht auf dieser Seite ist? Dann schlage es uns vor!
            </p>
            <Button asChild>
              <a href={submitFormUrl} target="_blank" rel="noopener noreferrer">
                Cafe vorschlagen
              </a>
            </Button>
          </div>

          {/* Share */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Mit Freunden teilen</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Unterstütze uns, indem du diese Seite mit Freunden teilst.
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
              Du hast eine Idee wie man die Seite verbessern kann? Dann schreibe uns eine Mail.
            </p>
            <Button asChild>
              <a href="mailto:feedback@example.com" target="_blank" rel="noopener noreferrer">
                Feedback geben
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Willst du wieder zu den Cafés gehen?
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              Zurück zur Startseite
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}