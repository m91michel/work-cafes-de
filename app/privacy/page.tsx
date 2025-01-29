import { getSEOTags } from "@/libs/seo";
import config, { baseUrl } from "@/config/config";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import { isGerman } from "@/libs/environment";

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
  title: `Privacy Policy | ${config.appName}`,
  description: `Privacy Policy for ${config.appName}`,
  canonicalUrlRelative: "/privacy",
  alternates: {
    canonical: "https://cafezumarbeiten.de/datenschutz",
  },
});

const lastUpdated = "2024-12-08";
const PrivacyPolicy = () => {

  if (isGerman) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-8 py-16 md:py-32">
      <div className="max-w-2xl mx-auto p-5">
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
{`
Last updated: ${dayjs(lastUpdated).format("YYYY-MM-DD")}

Welcome to ${config.appName}!

This privacy policy describes how we collect, use, and protect information when you use our website ${baseUrl}.

Collection of Data

We collect the following data:
    • Personal Data: Name and email address that you provide to contact us via email.
    • Non-Personal Data: Information collected through web cookies to improve the user-friendliness of our website.

Purpose of Data Collection

The data you provide is used solely for contacting you.

Sharing of Data

We do not share your data with third parties.

Privacy for Children

We do not collect data from children under 13 years of age.

Updates to the Privacy Policy

This privacy policy may occasionally be updated. We will inform you of significant changes via email.

Contact

If you have questions or concerns about our privacy policy, please contact us at:
Email: privacy@${config.domainName}

Thank you for using Café for Work!

`}


        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
