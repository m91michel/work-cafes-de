import config from '@/config/config';
import { getSEOTags } from '@/libs/seo';

export const metadata = getSEOTags({
  title: `Über uns | ${config.appName}`,
  description: `Wie die Idee zu ${config.appName} entstand und wie ich als Entwickler und Designer die Plattform entwickelt habe.`, // Should be 100-160 characters
  canonicalUrlRelative: "/ueber-uns",
});

export default function AboutPage() {
  return (
    <main className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Über uns</h1>
        <section className="text-lg leading-relaxed">
          <h2 className="text-3xl font-bold mb-6">Hintergrund zu {config.appName}</h2>
          <p className="mb-4">
            Aus eigener Erfahrung weiß ich, wie zeitaufwendig es sein kann, laptopfreundliche Cafés auf Google Maps zu finden. Die Suche nach den besten Arbeitsplätzen in Cafés erfordert oft das Durchsehen von Bildern und Bewertungen.
          </p>
          <p className="mb-4">
            Mein Ziel ist es, dir eine Plattform zu bieten, die sich auf Cafés konzentriert, die ideal zum Arbeiten oder Studieren sind. Ich helfe dir, die besten Cafés zu finden, die Laptop-freundlich sind.
          </p>
          <p>
            Ich habe Bewertungen für jedes Café analysiert und Informationen zur Lautstärke und Arbeitsatmosphäre gesammelt, um dir die besten Optionen zu präsentieren.
          </p>
        </section>
        <section className="text-lg leading-relaxed mt-12">
          <h2 className="text-3xl font-bold mb-6">Über Mich</h2>
          <p className="mb-4">
            Ich bin Mathias Michel, ein erfahrener Softwareentwickler, der sich zu einem vielseitigen Generalisten entwickelt hat. In meinen Nebenprojekten erweitere ich kontinuierlich meine Fähigkeiten in den Bereichen Marketing, Design und Business-Strategie.
          </p>
          <p>
            Diese Plattform entstand aus der Notwendigkeit, ein persönliches Problem zu lösen, und ich hoffe, dass sie auch anderen hilft, die besten laptopfreundlichen Cafés zu finden. Neben dieser Plattform habe ich auch &quot;<a href="https://rewritebar.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">RewriteBar</a>&quot; entwickelt, eine nützliche macOS App, die es ermöglicht, Texte schnell mit Hilfe von künstlicher Intelligenz (AI) zu verbessern.
          </p>
        </section>
      </div>
    </main>
  );
}