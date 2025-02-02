import config, { domainDe, domainEn } from '@/config/config';
import { isEnglish, language } from '@/libs/environment';
import { getSEOTags } from '@/libs/seo';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export const metadata = getSEOTags({
  title: `About Us | ${config.appName}`,
  description: `Discover how ${config.appName} helps you find the perfect cafés for working and studying in Germany.`,
  alternates: {
    canonical: `https://${domainEn}/about`,
    languages: {
      "de": `https://${domainDe}/ueber-uns`,
      "en": `https://${domainEn}/about`,
    },
  },
});

export default function AboutPage() {
  if (!isEnglish) {
    console.log("wrong language", language);
    return notFound();
  }

  const aboutContent = `
## Our Mission

We believe finding a great café to work from shouldn't be a time-consuming task. Whether you're a freelancer looking for your next workspace, a student preparing for exams, or just someone who enjoys working in a vibrant atmosphere – we're here to make your search easier.

## Why We Started This

As a remote worker, I've spent countless hours searching for cafés with the right mix of atmosphere, WiFi, and comfort. The challenge wasn't just finding cafés – it was finding the right ones that welcome laptop users and provide a suitable environment for getting work done.

That's why I created ${config.appName}. Instead of spending time reading through countless reviews and visiting cafés only to find they're not laptop-friendly, you can now quickly find vetted spots that welcome digital nomads, students, and remote workers.

## About the Creator

Hi! I'm Mathias Michel, a software developer who loves building tools that solve real problems. When I'm not coding or exploring new cafés, I'm working on projects that make digital life a bit easier. One of these is [RewriteBar](https://rewritebar.com), a macOS app that helps you enhance your writing with AI.

## What Makes Us Different

We don't just list any café – we focus on what matters to remote workers and students:

- Carefully selected cafés that welcome laptop users
- Real information about WiFi quality and power outlets
- Details about noise levels and working atmosphere
- Insights about peak hours and best times to visit
- First-hand experiences from other remote workers

## Current Status & Future Plans

We're actively growing our database of laptop-friendly cafés across Germany. While we haven't covered every city yet, we're constantly adding new locations and improving our existing listings.

Looking ahead, we're exploring features like:
- Community reviews from fellow remote workers
- Real-time updates about café availability
- Integration with maps for easier navigation
- Personalized recommendations based on your preferences

## Get Involved

Found a great café that's not on our list? Have suggestions for making the platform better? We'd love to hear from you! Drop us a line at [contact@cafezumarbeiten.de](mailto:contact@cafezumarbeiten.de).

Together, we can build the most comprehensive guide to laptop-friendly cafés in Germany.
`;

  return (
    <main className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">About Us</h1>
        <ReactMarkdown className="prose text-lg leading-relaxed">
          {aboutContent}
        </ReactMarkdown>
      </div>
    </main>
  );
}