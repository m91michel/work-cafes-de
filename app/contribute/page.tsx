import { MLink } from "@/components/general/link";
import { Button } from "@/components/ui/button";
import config, {
  baseUrl,
  domainDe,
  domainEn,
  submitFormUrl,
} from "@/config/config";
import { isEnglish, language } from "@/libs/environment";
import Paths from "@/libs/paths";
import { getSEOTags } from "@/libs/seo";
import { Share2, PlusCircle } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata = getSEOTags({
  title: `Support Us | ${config.appName}`,
  description: `Help us create the ultimate guide to work-friendly cafés by contributing your favorite spots.`, // More compelling description
  alternates: {
    canonical: `https://${domainEn}${Paths.contribute}`,
    languages: {
      de: `https://${domainDe}/helfe-uns`,
      en: `https://${domainEn}/contribute`,
    },
  },
});

const tweetText = `Found your perfect workspace yet? Check out the best work-friendly cafés at ${config.appName}! 🎯 ☕️`;

export default function ContributePage() {
  if (!isEnglish) {
    console.log("wrong language", language);
    return notFound();
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}&url=${encodeURIComponent(baseUrl)}`;
  return (
    <main className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          Join Our Community of Remote Workers
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Suggest New Listing */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">
                Share Your Favorite Spot
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Know a café that&apos;s perfect for remote work? Help fellow
              digital nomads discover great workspaces by sharing your go-to
              spots.
            </p>
            <Button asChild>
              <MLink
                href={Paths.submitCafe}
                umami-event="suggest-cafe"
              >
                Add a Recommendation
              </MLink>
            </Button>
          </div>

          {/* Add a new city */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Add a New City</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Don&apos;t see your city listed? Help us expand our coverage by
              suggesting new locations for our community.
            </p>
            <Button asChild>
              <MLink href={Paths.suggestCity} umami-event="suggest-city">
                Suggest a City
              </MLink>
            </Button>
          </div>

          {/* Share */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Spread The Word</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Do you love the idea of {config.appName}? Help us build the
              largest community of remote workers by sharing with your network.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="default">
                <MLink
                  href={tweetUrl}
                  umami-event="share-on-twitter"
                >
                  Share on Twitter
                </MLink>
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
              Help shape the future of {config.appName}! Share your ideas,
              suggestions, or feedback to make our platform even better for
              everyone.
            </p>
            <Button asChild>
              <MLink
                href={`mailto:feedback@${domainEn}`}
                umami-event="send-feedback"
              >
                Send Feedback
              </MLink>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Looking for your next favorite workspace?
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <MLink href={Paths.cities}>Explore Cities</MLink>
            </Button>
            <Button asChild variant="outline">
              <MLink href={Paths.cafes}>Explore Cafés</MLink>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
