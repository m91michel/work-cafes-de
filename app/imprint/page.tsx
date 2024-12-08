import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config/config";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Suspense } from "react";

export const metadata = getSEOTags({
  title: `Imprint | ${config.appName}`,
  description: `Imprint for ${config.appName}`,
  canonicalUrlRelative: "/imprint",
});

const lastUpdated = "2024-12-08";
const address = "Waldstr. 48, 90763 Fürth, Germany";
const url = `https://${config.domainName}`;

const Imprint = () => {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <section className="max-w-7xl mx-auto px-8 py-16 md:py-32">
          <div className="prose leading-relaxed whitespace-pre-wrap mx-auto">
            <h1>Imprint for {config.appName}</h1>
            <p>Last Updated: {lastUpdated}</p>
            <p>
              Website Name: {config.appName}
              <br />
              Website URL: <Link href={url}>{url}</Link>
            </p>

            <h2>Responsible for Content according to § 5 TMG</h2>
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
              However, we cannot guarantee the accuracy, completeness, or
              timeliness of the content. As a service provider, we are
              responsible for our own content on these pages under the general
              laws according to § 7 Abs.1 TMG. However, according to §§ 8 to 10
              TMG, we are not obliged to monitor transmitted or stored
              third-party information or to investigate circumstances that
              indicate illegal activity. Obligations to remove or block the use
              of information under the general laws remain unaffected. However,
              liability in this regard is only possible from the time of
              knowledge of a specific infringement. Upon notification of such
              violations, we will remove the content immediately.
            </p>
            <h2>Liability for Links</h2>
            <p>
              Our website contains links to external websites over which we have
              no control. Therefore, we cannot accept any responsibility for
              their content. The respective provider or operator of the linked
              pages is always responsible for the content of these pages. The
              linked pages were checked for possible legal violations at the
              time of linking. Illegal contents were not recognizable at the
              time of linking. However, permanent monitoring of the content of
              the linked pages is not reasonable without concrete evidence of a
              violation. Upon notification of violations, we will remove such
              links immediately.
            </p>
            <h2>Intellectual Property</h2>
            <p>
              The content and works on these pages created by the site operator
              are subject to German copyright law. The reproduction, editing,
              distribution, and any kind of exploitation outside the limits of
              copyright require the written consent of the respective author or
              creator. Downloads and copies of this site are only permitted for
              private, non-commercial use. Insofar as the content on this site
              was not created by the operator, the copyrights of third parties
              are respected. In particular, third-party content is marked as
              such. Should you nevertheless become aware of a copyright
              infringement, please inform us accordingly. Upon notification of
              violations, we will remove such content immediately.
            </p>
            <h2>Privacy Policy</h2>
            <p>
              Please see our <Link href="/privacy-policy">Privacy Policy</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Imprint;
