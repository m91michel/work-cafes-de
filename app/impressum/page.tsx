import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config, { alternateDomainName } from "@/config/config";
import { isEnglish } from "@/libs/environment";
import { notFound } from "next/navigation";

export const metadata = getSEOTags({
  title: `Impressum | ${config.appName}`,
  description: `Impressum für ${config.appName}`,
  canonicalUrlRelative: "/impressum",
  alternates: {
    canonical: `https://${alternateDomainName}/privacy`,
  },
});

const lastUpdated = "2024-12-11";
const address = "Waldstr. 48, 90763 Fürth, Germany";
const url = `https://${config.domainName}`;

const unsplashCredits = [
  'Photo by <a href="https://unsplash.com/@stewi?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Stephan Widua</a> on <a href="https://unsplash.com/photos/time-lapse-photography-of-vehicle-at-the-road-in-between-the-building-at-nighttime-aerial-photography-iPOZf3tQfHA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
  'Photo by <a href="https://unsplash.com/@jankolar?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jan Antonin Kolar</a> on <a href="https://unsplash.com/photos/view-of-buildings-8QJSi37vhms?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
  'Photo by <a href="https://unsplash.com/@kumas_taverne?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">𝕶𝖚𝖒𝖆𝖘 𝕿𝖆𝖛𝖊𝖗𝖓𝖊</a> on <a href="https://unsplash.com/photos/a-water-fountain-in-front-of-a-large-building-5TvIkh12MSA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>',
  'Photo by Philipp Birmes: https://www.pexels.com/photo/worms-eye-view-of-high-rise-building-3646913/',
  'Photo by Jasper Kortmann: https://www.pexels.com/photo/view-of-cologne-cathedral-and-hohenzollern-bridge-29693403/',
  'Photo by Pixabay: https://www.pexels.com/photo/view-of-skyscrapers-against-cloudy-sky-258642/',
  'Image by <a href="https://pixabay.com/users/maxmann-665103/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2890738">Th G</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2890738">Pixabay</a>',
  'Bild von <a href="https://pixabay.com/de/users/waldnob-9842518/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6935921">Norbert Waldhausen</a> auf <a href="https://pixabay.com/de//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6935921">Pixabay</a>',
  'Bild von <a href="https://pixabay.com/de/users/schaerfsystem-130387/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=745365">Caro Sodar</a> auf <a href="https://pixabay.com/de//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=745365">Pixabay</a>',
  'Image by <a href="https://pixabay.com/users/evgenit-4930349/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3150867">Evgeni Tcherkasski</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3150867">Pixabay</a>',
  'Image by <a href="https://pixabay.com/users/maxmann-665103/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1055063">Th G</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1055063">Pixabay</a>',
  'Photo by Markus Spiske: https://www.pexels.com/photo/brown-wooden-table-and-chairs-93108/',
  'Image by <a href="https://pixabay.com/users/medienservice-1888061/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6557996">Nicole Pankalla</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6557996">Pixabay</a>',
  'Image by <a href="https://pixabay.com/users/kookay-11914957/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4152279">Udo</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4152279">Pixabay</a>',
  'Image by <a href="https://pixabay.com/users/unlike_you_photography-12470727/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4206677">Andreas Poznanski</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4206677">Pixabay</a>',
  'Photo by Jakub Zerdzicki: https://www.pexels.com/photo/bochum-rathaus-station-21625033/',
  'Image by <a href="https://pixabay.com/users/mibro-8455312/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3352209">mibro</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3352209">Pixabay</a>',
  'Image by <a href="https://pixabay.com/users/marcimarc105-6128323/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3913173">Marci Marc</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3913173">Pixabay</a>',
  'Image by <a href="https://pixabay.com/users/tomkor-20122445/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5974157">tomkor</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5974157">Pixabay</a>',
  'Photo by Robert Schwarz: https://www.pexels.com/photo/a-suspension-railway-entering-a-station-27775590/'
]

const Imprint = () => {

  if (isEnglish) {
    notFound();
  }

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 md:py-32">
      <div className="prose leading-relaxed whitespace-pre-wrap mx-auto">
        <h1>Impressum für {config.appName}</h1>
        <p>Letzte Aktualisierung: {lastUpdated}</p>
        <p>
          Website Name: {config.appName}
          <br />
          Website URL: <Link href={url}>{url}</Link>
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

export default Imprint;
