import config from '@/config/config';
import { isGerman, language } from '@/libs/environment';
import { getSEOTags } from '@/libs/seo';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export const metadata = getSEOTags({
  title: `About Us | ${config.appName}`,
  description: `How the idea for ${config.appName} came about and how I developed the platform as a developer and designer.`, // Should be 100-160 characters
  canonicalUrlRelative: "/about",
});

export default function AboutPage() {
  if (isGerman) {
    console.log("wrong language", language);
    return notFound();
  }

  const aboutContent = `
## Our Goal

We want you to spend less time searching and more time working productively. Whether you're a freelancer, student, or simply looking for an inspiring place to work – we're here to help.

From personal experience, I know how time-consuming it can be to find laptop-friendly cafés on Google Maps. Searching for the best workspaces in cafés often requires sifting through images and reviews. The question of whether the café is really suitable for productive work often remains unanswered.

With "Café zum Arbeiten", I want to provide you with a platform that takes care of this work for you. Here you'll find cafés specifically suited for working or studying. Whether you're looking for a quiet work atmosphere, good WiFi, or simply a pleasant environment – I'll help you discover the best options.

To make your selection easier, I've analyzed reviews and collected information about noise levels, work atmosphere, and facilities in the cafés. This way, you can focus entirely on your work without wasting time searching.

## About Me

I'm Mathias Michel, a passionate software developer with a broad spectrum of skills. In my side projects, I combine my experience in development, marketing, design, and business strategy to create useful tools and platforms.

The idea for this platform came from a personal problem: I wanted to find a place where I could work productively without having to search for long. This became "Café zum Arbeiten" – a solution that I now want to share with others.

Besides this project, I've also developed [RewriteBar](https://rewritebar.com), a macOS app that helps you quickly and efficiently optimize texts with AI. I love creating projects that make life a little bit easier.

## What You'll Find Here

- A curated selection of the best cafés for working in Germany.
- Detailed information about each café: WiFi quality, noise level, work atmosphere, and more.
- Categories like "Best Cafés in Munich" or "Cafés in [City]" to make your search easier.

## Current Status

The site is still under construction. Therefore, not all cities are currently listed. We're continuously working on expanding the offering and including more cafés throughout Germany.

In the future, it might also be possible for users to rate the cafés themselves for work-friendliness and share their experiences. This would make the platform even more vibrant and helpful.

Have fun discovering the best cafés! If you have feedback or suggestions, feel free to contact us at [contact@cafezumarbeiten.de](mailto:kontakt@cafezumarbeiten.de).
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