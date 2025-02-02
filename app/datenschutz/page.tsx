import { getSEOTags } from "@/libs/seo";
import config, { baseUrl, domainDe, domainEn } from "@/config/config";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import { isEnglish } from "@/libs/environment";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// Ich benötige deine Hilfe, um eine einfache Datenschutzrichtlinie für meine Website zu erstellen. Hier sind einige Kontextinformationen:
// - Website: https://cafezumarbeiten.de
// - Name: Café zum Arbeiten
// - Beschreibung: Finde das perfekte Cafe wo du arbeiten kannst und darfst
// - Daten die erhoben werden: name, email
// - Nicht-persönliche Daten: web cookies
// - Zweck der Datenerhebung: Kontaktaufnahme per Email
// - Datenweitergabe: wir geben die Daten nicht an andere Dritte weiter
// - Datenschutz bei Kindern: wir erheben keine Daten von Kindern
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: privacy@cafezumarbeiten.de

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Datenschutz | ${config.appName}`,
  description: `Datenschutz für ${config.appName}`,
  alternates: {
    canonical: `https://${domainDe}/datenschutz`,
    languages: {
      "de": `https://${domainDe}/datenschutz`,
      "en": `https://${domainEn}/privacy`,
    },
  },
});

const lastUpdated = "2024-12-08";
const PrivacyPolicy = () => {

  if (isEnglish) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-8 py-16 md:py-32">
      <div className="max-w-2xl mx-auto p-5">
        <h1 className="text-3xl font-extrabold pb-6">
          Datenschutz für {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
{`
Letzte Aktualisierung: ${dayjs(lastUpdated).format("DD.MM.YYYY")}

Willkommen bei ${config.appName}!

Diese Datenschutzerklärung beschreibt, wie wir Informationen sammeln, nutzen und schützen, wenn Sie unsere Website ${baseUrl} nutzen.

Erhebung von Daten

Wir erfassen die folgenden Daten:
	•	Persönliche Daten: Name und E-Mail-Adresse, die Sie uns für die Kontaktaufnahme per E-Mail bereitstellen.
	•	Nicht-personenbezogene Daten: Informationen, die durch Web-Cookies gesammelt werden, um die Benutzerfreundlichkeit unserer Website zu verbessern.

Zweck der Datenerhebung

Die von Ihnen bereitgestellten Daten werden ausschließlich zur Kontaktaufnahme verwendet.

Weitergabe von Daten

Wir geben Ihre Daten nicht an Dritte weiter.

Datenschutz bei Kindern

Wir sammeln keine Daten von Kindern unter 13 Jahren.

Aktualisierungen der Datenschutzerklärung

Diese Datenschutzerklärung kann gelegentlich aktualisiert werden. Über wesentliche Änderungen informieren wir Sie per E-Mail.

Kontakt

Wenn Sie Fragen oder Bedenken zu unserer Datenschutzerklärung haben, kontaktieren Sie uns bitte unter:
E-Mail: privacy@${config.domainName}

Vielen Dank, dass Sie Café zum Arbeiten nutzen!


`}


        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
