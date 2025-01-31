import config from '@/config/config';
import { isEnglish } from '@/libs/environment';
import { getSEOTags } from '@/libs/seo';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export const metadata = getSEOTags({
  title: `Über uns | ${config.appName}`,
  description: `Wie die Idee zu ${config.appName} entstand und wie ich als Entwickler und Designer die Plattform entwickelt habe.`, // Should be 100-160 characters
  canonicalUrlRelative: "/ueber-uns",
});

export default function AboutPage() {
  if (isEnglish) {
    return notFound();
  }

  const aboutContent = `
## Unser Ziel

Wir möchten, dass du weniger Zeit mit der Suche und mehr Zeit mit produktivem Arbeiten verbringst. Egal, ob du Freelancer, Student oder einfach auf der Suche nach einem inspirierenden Arbeitsort bist – wir sind hier, um dir zu helfen.

Aus eigener Erfahrung weiß ich, wie zeitaufwendig es sein kann, laptopfreundliche Cafés auf Google Maps zu finden. Die Suche nach den besten Arbeitsplätzen in Cafés erfordert oft das Durchsehen von Bildern und Bewertungen. Dabei bleibt die Frage, ob das Café wirklich für produktives Arbeiten geeignet ist, oft unbeantwortet.

Mit "Café zum Arbeiten" möchte ich dir eine Plattform bieten, die dir genau diese Arbeit abnimmt. Hier findest du gezielt Cafés, die sich ideal zum Arbeiten oder Studieren eignen. Ob du eine ruhige Arbeitsatmosphäre, gutes WLAN oder einfach eine angenehme Umgebung suchst – ich helfe dir, die besten Optionen zu entdecken.

Um dir die Auswahl zu erleichtern, habe ich Bewertungen analysiert und Informationen zur Lautstärke, Arbeitsatmosphäre und Ausstattung der Cafés gesammelt. So kannst du dich ganz auf deine Arbeit konzentrieren und musst keine Zeit mit der Suche verschwenden.

## Über mich

Ich bin Mathias Michel, ein leidenschaftlicher Softwareentwickler mit einem breiten Spektrum an Fähigkeiten. In meinen Nebenprojekten kombiniere ich meine Erfahrung in Entwicklung, Marketing, Design und Business-Strategie, um nützliche Tools und Plattformen zu schaffen.

Die Idee für diese Plattform entstand aus einem persönlichen Problem: Ich wollte einen Ort finden, an dem ich produktiv arbeiten kann, ohne lange suchen zu müssen. Daraus wurde "Café zum Arbeiten" – eine Lösung, die ich nun mit anderen teilen möchte.

Neben diesem Projekt habe ich auch [RewriteBar](https://rewritebar.com) entwickelt, eine macOS-App, die dir hilft, Texte schnell und effizient mit KI zu optimieren. Ich liebe es, Projekte zu schaffen, die das Leben ein kleines bisschen einfacher machen.

## Was du hier findest

- Eine kuratierte Auswahl der besten Cafés zum Arbeiten in Deutschland.
- Detaillierte Informationen zu jedem Café: WLAN-Qualität, Lautstärke, Arbeitsatmosphäre und mehr.
- Kategorien wie „Beste Cafés in München“ oder „Cafés in [Stadt]“, um dir die Suche zu erleichtern.

## Aktueller Stand

Die Seite befindet sich noch im Aufbau. Daher sind aktuell noch nicht alle Städte aufgelistet. Wir arbeiten kontinuierlich daran, das Angebot zu erweitern und noch mehr Cafés in ganz Deutschland aufzunehmen.

In Zukunft könnte es auch möglich sein, dass Nutzer selbst die Cafés auf Arbeitsfreundlichkeit bewerten und ihre Erfahrungen teilen können. So würde die Plattform noch lebendiger und hilfreicher werden.

Viel Spaß beim Entdecken der besten Cafés! Wenn du Feedback oder Vorschläge hast, melde dich gerne bei uns unter [kontakt@cafezumarbeiten.de](mailto:kontakt@cafezumarbeiten.de).
  `;

  return (
    <main className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Über uns</h1>
        <ReactMarkdown className="prose text-lg leading-relaxed">
          {aboutContent}
        </ReactMarkdown>
      </div>
    </main>
  );
}