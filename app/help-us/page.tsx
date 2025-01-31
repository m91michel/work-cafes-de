import { Button } from '@/components/ui/button';
import config, { baseUrl, domainEn, submitFormUrl } from '@/config/config';
import { language } from '@/libs/environment';
import { isGerman } from '@/libs/environment';
import { getSEOTags } from '@/libs/seo';
import { Share2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = getSEOTags({
  title: `Support Us | ${config.appName}`,
  description: `Support us by sharing this page with your friends.`, // 100-160 characters
  canonicalUrlRelative: "/help-us",
});

const tweetText = `Looking for a café to work from? Check out Work-Friendly Cafés.`;

export default function ContributePage() {
  if (isGerman) {
    console.log("wrong language", language);
    return notFound();
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(baseUrl)}`;
  return (
    <main className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Would you like to support this site?</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Suggest New Listing */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Suggest a Café</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Know a café that&apos;s not listed on this site? Let us know about it!
            </p>
            <Button asChild>
              <a href={submitFormUrl} target="_blank" rel="noopener noreferrer">
                Suggest a Café
              </a>
            </Button>
          </div>

          {/* Share */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Share with Friends</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Support us by sharing this page with your friends.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
                  Share on Twitter
                </a>
              </Button>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Give Feedback</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Have an idea on how to improve the site? Send us an email.
            </p>
            <Button asChild>
              <a href={`mailto:feedback@${domainEn}`} target="_blank" rel="noopener noreferrer">
                Give Feedback
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Want to go back to the cafés?
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              Back to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}