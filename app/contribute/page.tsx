import { Button } from '@/components/ui/button';
import { Share2, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContributePage() {
  return (
    <main className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Contribute to WorkCafes.de</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Suggest New Listing */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Suggest a New Listing</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Know a great cafe that&apos;s perfect for working? Help others discover it by adding it to our directory.
            </p>
            <Button asChild>
              <a href="https://forms.gle/example" target="_blank" rel="noopener noreferrer">
                Submit a Cafe
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
              Help us grow the community by sharing WorkCafes.de with your network.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <a href="https://twitter.com/intent/tweet?text=Check%20out%20WorkCafes.de%20-%20Find%20the%20best%20cafes%20for%20working%20in%20Germany!%20%23WorkCafes%20%23RemoteWork&url=https%3A%2F%2Fworkcafes.de" 
                   target="_blank" rel="noopener noreferrer">
                  Share on Twitter
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Want to go back to browsing cafes?
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              Return to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}