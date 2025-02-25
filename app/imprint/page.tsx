import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config, { domainEn, domainDe, baseUrl } from "@/config/config";
import { isGerman } from "@/libs/environment";
import { notFound } from "next/navigation";
import { address, lastUpdated, unsplashCredits } from "@/config/imprint";

export const metadata = getSEOTags({
  title: `Imprint | ${config.appName}`,
  description: `Legal notice and imprint for ${config.appName}`,
  alternates: {
    canonical: `https://${domainEn}/imprint`,
    languages: {
      "de": `https://${domainDe}/impressum`,
      "en": `https://${domainEn}/imprint`,
    },
  },
});

const Imprint = () => {

  if (isGerman) {
    return notFound();
  }

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 md:py-32">
      <div className="prose leading-relaxed whitespace-pre-wrap mx-auto">
        <h1>Imprint for {config.appName}</h1>
        <p>Last updated: {lastUpdated}</p>
        <p>
          Website Name: {config.appName}
          <br />
          Website URL: <Link href={baseUrl}>{baseUrl}</Link>
        </p>

        <h2>Responsible for content according to § 5 TMG</h2>
        <p>
          Name: Mathias Michel
          <br />
          Address: {address}
          <br />
          Email: {config.mailgun.supportEmail}
        </p>
        <h2>Disclaimer</h2>
        <p>
          The content of this website has been created with the utmost care.
          However, we cannot guarantee the accuracy, completeness,
          or timeliness of the content. As a service provider, we are
          responsible for our own content on these pages according to § 7
          Para. 1 TMG. According to §§ 8 to 10 TMG, however, we are not
          obligated to monitor transmitted or stored third-party information
          or to investigate circumstances that indicate illegal activity.
          The obligation to remove or block the use of information according
          to general laws remains unaffected. However, liability in this
          regard is only possible from the time of knowledge of a specific
          legal violation.
        </p>
        <h2>Liability for Links</h2>
        <p>
          This website contains links to external websites over which we have
          no control. Therefore, we cannot accept any responsibility for their
          content. The respective provider or operator is always responsible
          for the content of the linked pages. The linked pages were checked
          for possible legal violations at the time of linking. Illegal content
          was not recognizable at the time of linking. However, permanent
          monitoring of the content of the linked pages is not reasonable
          without concrete evidence of a violation of law. If we become aware
          of any legal violations, we will remove such links immediately.
        </p>
        <h2>Copyright</h2>
        <p>
          The content and works on these pages are subject to German copyright law.
          The reproduction, editing, distribution, and any kind of exploitation
          outside the limits of copyright law require the written consent of
          the respective author or creator. Downloads and copies of this page
          are only permitted for private, non-commercial use. Insofar as the
          content on this page was not created by the operator, the copyrights
          of third parties are respected. In particular, third-party content
          is marked as such. Should you nevertheless become aware of any
          copyright infringement, please inform us accordingly. If we become
          aware of any infringements, we will remove such content immediately.
        </p>
        <h2>Privacy Policy</h2>
        <p>
          Please read our <Link href="/privacy">Privacy Policy</Link>
        </p>
        <h2>Image Credits</h2>
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
