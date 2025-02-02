import config, { domainDe, domainEn } from '@/config/config';
import { isGerman } from '@/libs/environment';
import { getSEOTags } from '@/libs/seo';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export const metadata = getSEOTags({
  title: `Über uns | ${config.appName}`,
  description: `Entdecke, wie ${config.appName} dir hilft, die besten Cafés zum Arbeiten und Lernen in Deutschland zu finden.`,
  alternates: {
    canonical: `https://${domainDe}/ueber-uns`,
    languages: {
      "de": `https://${domainDe}/ueber-uns`,
      "en": `https://${domainEn}/about-us`,
    },
  },
});

export default function AboutPage() {
  if (!isGerman) {
    return notFound();
  }

  const aboutContent = `
## Unsere Mission

Wir glauben, dass die Suche nach einem guten Café zum Arbeiten einfach sein sollte. Ob du Freelancer bist, für deine Prüfungen lernst oder einfach gerne in entspannter Atmosphäre arbeitest – wir helfen dir, schnell das passende Café zu finden.

## Wie alles begann

Als Remote Worker kenne ich das Problem: Man verbringt mehr Zeit damit, ein geeignetes Café zu suchen, als dort tatsächlich zu arbeiten. Zwischen den vielen Google-Bewertungen und Fotos ist es schwer zu erkennen, ob ein Café wirklich laptop-freundlich ist und ob man dort in Ruhe ein paar Stunden arbeiten kann.

Genau deshalb gibt es jetzt ${config.appName}. Statt stundenlang zu suchen und vor verschlossenen Türen zu stehen, findest du hier Cafés, die bereits von anderen Digital Nomads, Studierenden und Remote Workern getestet wurden.

## Über den Gründer

Hi! Ich bin Mathias Michel, Softwareentwickler und Café-Enthusiast. Neben dem Programmieren und der Suche nach den gemütlichsten Cafés entwickle ich Tools, die den digitalen Alltag einfacher machen. Eines davon ist [RewriteBar](https://rewritebar.com), eine macOS-App, mit der du deine Texte mithilfe von KI optimieren kannst.

## Was uns besonders macht

Wir listen nicht einfach irgendwelche Cafés – wir konzentrieren uns auf das, was für dich beim mobilen Arbeiten wirklich wichtig ist:

- Handverlesene Cafés, die Laptop-Nutzer willkommen heißen
- Verlässliche Infos zu WLAN-Qualität und Steckdosen
- Details zur Lautstärke und Arbeitsatmosphäre
- Tipps zu Stoßzeiten und den besten Arbeitszeiten
- Ehrliche Erfahrungsberichte von anderen Nutzern

## Aktueller Stand & Zukunftspläne

Wir bauen unsere Datenbank mit laptop-freundlichen Cafés in ganz Deutschland stetig aus. Auch wenn noch nicht alle Städte vertreten sind, kommen regelmäßig neue Locations dazu.

Für die Zukunft planen wir:
- Eine Community-Funktion für Bewertungen und Erfahrungsaustausch
- Aktuelle Updates zur Café-Auslastung
- Bessere Kartenintegration für einfachere Navigation
- Personalisierte Café-Empfehlungen

## Mach mit!

Du kennst ein tolles Café, das noch nicht bei uns gelistet ist? Oder hast Ideen, wie wir die Plattform noch besser machen können? Schreib uns einfach an [kontakt@cafezumarbeiten.de](mailto:kontakt@cafezumarbeiten.de).

Gemeinsam bauen wir den besten Guide für laptop-freundliche Cafés in Deutschland!
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