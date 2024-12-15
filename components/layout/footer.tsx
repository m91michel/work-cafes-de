import { Coffee, Github } from "lucide-react";
import Link from "next/link";
import config, { domainName } from "@/config/config";
import { SiInstagram, SiX } from "@icons-pack/react-simple-icons";

const currentYear = new Date().getFullYear();

const cities = [
  { name: "Berlin", slug: "berlin" },
  { name: "München", slug: "muenchen" },
  { name: "Hamburg", slug: "hamburg" },
  { name: "Frankfurt", slug: "frankfurt-am-main" },
  { name: "Stuttgart", slug: "stuttgart" },
  { name: "Köln", slug: "koeln" },
];

const legalLinks = [
  { name: "Datenschutz", href: "/datenschutz" },
  { name: "Impressum", href: "/impressum" },
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-6 h-6" />
              <span className="font-bold text-xl">Cafés zum Arbeiten</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Wir helfen dir, die besten Cafés zum Arbeiten in Deutschland zu
              finden.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Die besten Cafés</h3>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/cities/${city.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Cafés zum Arbeiten in {city.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/cities"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Alle Städte
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Ressourcen</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/ueber-uns"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Über uns
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${config.mailgun.supportEmail}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
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
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} {domainName}. Alle Rechte vorbehalten.
          </p>
          <div className="mt-2 flex justify-center gap-4 text-sm text-muted-foreground">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
