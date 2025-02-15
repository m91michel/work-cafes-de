import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config, { domainEn, domainDe, baseUrl } from "@/config/config";
import { isEnglish } from "@/libs/environment";
import { notFound } from "next/navigation";
import { address, lastUpdated, unsplashCredits } from "@/config/imprint";

export const metadata = getSEOTags({
  title: `Impressum | ${config.appName}`,
  description: `Impressum für ${config.appName}`,
  alternates: {
    canonical: `https://${domainDe}/impressum`,
    languages: {
      "de": `https://${domainDe}/impressum`,
      "en": `https://${domainEn}/impressum`,
    },
  },
});

const Impressum = () => {

  if (isEnglish) {
    return notFound();
  }

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 md:py-32">
      <div className="prose leading-relaxed whitespace-pre-wrap mx-auto">
        <h1>Impressum für {config.appName}</h1>
        <p>Letzte Aktualisierung: {lastUpdated}</p>
        <p>
          Website Name: {config.appName}
          <br />
          Website URL: <Link href={baseUrl}>{baseUrl}</Link>
        </p>

        <h2>Verantwortlich für den Inhalt nach § 5 TMG</h2>
        <p>
          Name: Mathias Michel
          <br />
          Adresse: {address}
          <br />
          E-Mail: {config.mailgun.supportEmail}
        </p>
        <h2>Haftungsausschluss</h2>
        <p>
        Der Inhalt dieser Website wurde mit größter Sorgfalt erstellt.
          Jedoch können wir keine Gewähr für die Genauigkeit, Vollständigkeit
          oder Aktualität des Inhalts übernehmen. Als Diensteanbieter sind
          wir gemäß § 7 Abs. 1 TMG für unseren eigenen Inhalt auf diesen
          Seiten verantwortlich. Nach § 8 bis 10 TMG sind wir jedoch nicht
          verpflichtet, übermittelte oder gespeicherte Informationen Dritter
          zu überwachen oder zu untersuchen, die auf eine rechtswidrige
          Tätigkeit hinweisen. Die Pflicht zur Entfernung oder Sperrung der
          Nutzung von Informationen nach den allgemeinen Gesetzen bleibt
          unberührt. Eine Haftung in diesem Zusammenhang besteht jedoch nur
          von der Zeit der Kenntnis einer konkreten Rechtsverletzung.
        </p>
        <h2>Haftung für Links</h2>
        <p>
          Diese Website enthält Links zu externen Websites, über die wir keinen
          Einfluss haben. Daher können wir keine Verantwortung für deren
          Inhalt übernehmen. Der jeweilige Anbieter oder Betreiber der
          verlinkten Seiten ist immer für den Inhalt dieser Seiten verantwortlich.
          Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
          mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren
          zum Zeitpunkt der Verlinkung nicht erkennbar. Jedoch ist eine
          regelmäßige Überprüfung der verlinkten Seiten ohne konkrete
          Anhaltspunkte für eine Rechtsverletzung nicht zumutbar. Bei
          Bekanntwerden von Rechtsverletzungen werden wir derartige Links
          unverzüglich entfernen.
        </p>
        <h2>Urheberrecht</h2>
        <p>
          Der Inhalt und die Werke auf diesen Seiten unterliegen dem deutschen
          Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und
          jede Art der Nutzung außerhalb der Grenzen des Urheberrechts
          bedürfen der schriftlichen Zustimmung des jeweiligen Autors oder
          Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten,
          nicht kommerziellen Gebrauch gestattet. Insofern der Inhalt dieser
          Seite nicht vom Betreiber erstellt wurde, sind die Urheberrechte
          Dritter zu beachten. Insbesondere sind Inhalte Dritter als solche
          zu kennzeichnen. Sollten Sie dennoch rechtswidrige Inhalte bemerken,
          bitten wir Sie, uns unverzüglich zu informieren. Bei Bekanntwerden von
          Rechtsverletzungen werden wir derartige Inhalte unverzüglich entfernen.
        </p>
        <h2>Datenschutzerklärung</h2>
        <p>
          Bitte lesen Sie unsere <Link href="/datenschutz">Datenschutzerklärung</Link>
        </p>
        <h2>Bildquellen</h2>
        <ul className="list-disc list-inside">
          {unsplashCredits.map((credit, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: credit }} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Impressum;
