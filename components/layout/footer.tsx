import { Coffee, Github } from "lucide-react";
import Link from "next/link";
import config, { domainName } from "@/config/config";
import { SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import { getCities } from "@/libs/supabase/cities";

const currentYear = new Date().getFullYear();

const resources = [
  { name: "Alle Cafés", href: "/cafes" },
  { name: "Alle Städte", href: "/cities" },
];

const aboutLinks = [
  { name: "Über uns", href: "/ueber-uns" },
  { name: "Support", href: `mailto:${config.mailgun.supportEmail}` },
];

const legalLinks = [
  { name: "Datenschutz", href: "/datenschutz" },
  { name: "Impressum", href: "/impressum" },
];

export async function Footer() {
  const cities = (await getCities({ limit: 20, offset: 0 })).map((city) => ({
    name: city.name,
    slug: city.slug,
  }));

  return (
    <footer className="border-t bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-6 h-6" />
              <span className="font-bold text-xl">Cafés zum Arbeiten</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Wir helfen dir, die besten Cafés zum Arbeiten in Deutschland zu
              finden.
            </p>
            <p className="text-sm text-muted-foreground">Build with ☕️ by <Link href="https://mathias.rocks" target="_blank" className="hover:text-primary transition-colors">Mathias Michel</Link></p>
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
            <h3 className="font-semibold mb-4">Ressourcen</h3>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <Link
                    href={resource.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Über uns</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
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
            </ul>
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
