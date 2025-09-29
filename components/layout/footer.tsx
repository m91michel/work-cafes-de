import { Coffee } from "lucide-react";
import Link from "next/link";
import config, {
  appName,
  domainName,
} from "@/config/config";
import Paths from "@/libs/paths";
import initTranslations from "@/libs/i18n/config";
import { LanguageSwitcher } from "@/components/general/LanguageSwitcher";

const currentYear = new Date().getFullYear();

const resources = [
  { key: "all-cafes", href: Paths.cafes },
  { key: "all-cities", href: Paths.cities },
  { key: "study-cities", href: Paths.bestStudy },
];

const aboutLinks = [
  { key: "about", href: Paths.about },
  { key: "roadmap", href: Paths.roadmap },
  { key: "support", href: `mailto:${config.mailgun.supportEmail}` },
  { key: "contribute", href: Paths.contribute },
];

const legalLinks = [
  { key: "privacy", href: Paths.privacy },
  { key: "imprint", href: Paths.imprint },
];

const toolsLinks = [
  { label: "RewriteBar", href: "https://rewritebar.com" },
];

export async function Footer() {
  const { t } = await initTranslations(["common"]);

  return (
    <footer className="border-t bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-6 h-6" />
              <span className="font-bold text-xl">{appName}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("meta.description")}
            </p>
            <p className="text-sm text-muted-foreground">
              <LanguageSwitcher />
            </p>
            <p className="text-sm text-muted-foreground">
              Build with ☕️ by{" "}
              <Link
                href="https://mathias.rocks"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                Mathias Michel
              </Link>
            </p>
            {/* <div>
              <h3 className="font-semibold mb-4">Folge uns</h3>
              <div className="flex items-center gap-4">
                <Link
                  href="#twitter"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <SiX className="w-5 h-5" />
                </Link>
                <Link
                  href="#instagram"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <SiInstagram className="w-5 h-5" />
                </Link>
              </div>
            </div> */}
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.resources")}</h3>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <Link
                    href={resource.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(`footer.${resource.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.about")}</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(`footer.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.tools")}</h3>
            <ul className="space-y-2">
              {toolsLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* <div>
            <h3 className="font-semibold mb-4">{t("footer.city-title")}</h3>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/cities/${city.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(`footer.city-cafes`, { city: city.name })}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} {domainName}. {t("footer.rights-reserved")}
          </p>
          <div className="mt-2 flex justify-center gap-4 text-sm text-muted-foreground">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t(`footer.${link.key}`)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
