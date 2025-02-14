import { Button } from '@/components/ui/button';
import config, { baseUrl, domainDe, domainEn, submitFormUrl } from '@/config/config';
import { isEnglish, language } from '@/libs/environment';
import { getSEOTags } from '@/libs/seo';
import { Share2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = getSEOTags({
  title: `Support Us | ${config.appName}`,
  description: `Support us by sharing this page with your friends.`, // 100-160 characters
  alternates: {
    canonical: `https://${domainEn}/help-us`,
    languages: {
      "de": `https://${domainDe}/hilfe-uns`,
      "en": `https://${domainEn}/help-us`,
    },
  },
});

const tweetText = `Discover the best work-friendly cafés in Germany at Work-Friendly Cafés - Your guide to productive spaces!`;

export default function ContributePage() {
  if (!isEnglish) {
    console.log("wrong language", language);
    return notFound();
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(baseUrl)}`;
  return (
    <main className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Help Us Grow Our Community</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Suggest New Listing */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Recommend a Café</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Found a hidden gem that&apos;s perfect for working? Help others discover great workspaces by recommending your favorite café.
            </p>
            <Button asChild>
              <a href={submitFormUrl} target="_blank" rel="noopener noreferrer" umami-event="suggest-cafe">
                Add a Recommendation
              </a>
            </Button>
          </div>

          {/* Share */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Spread the Word</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Know someone who would love our platform? Share it with your network and help others find their perfect workspace.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <a href={tweetUrl} target="_blank" rel="noopener noreferrer" umami-event="share-on-twitter">
                  Share on Twitter
                </a>
              </Button>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Share Your Thoughts</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Your feedback helps us improve. Have suggestions or ideas? We&apos;d love to hear how we can make your experience even better.
            </p>
            <Button asChild>
              <a href={`mailto:feedback@${domainEn}`} target="_blank" rel="noopener noreferrer" umami-event="send-feedback">
                Send Feedback
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Ready to explore more work-friendly spaces?
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              Explore Cafés
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}