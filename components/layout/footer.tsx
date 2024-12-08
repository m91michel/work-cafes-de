import { Coffee, Github, Twitter } from "lucide-react";
import Link from "next/link";
import config, { domainName } from "@/config/config";

export function Footer() {
  const currentYear = new Date().getFullYear();

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
              Entdecken Sie die besten Cafes zum Arbeiten in Deutschland.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Die besten Cafes</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/city/berlin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cafes zum Arbeiten in Berlin
                </Link>
              </li>
              <li>
                <Link href="/city/munich" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cafes zum Arbeiten in München
                </Link>
              </li>
              <li>
                <Link href="/city/hamburg" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cafes zum Arbeiten in Hamburg
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Ressourcen</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Über uns
                </Link>
              </li>
              <li>
                <a href={`mailto:${config.mailgun.supportEmail}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Folge uns</h3>
            <div className="flex items-center gap-4">
              <Link href="#twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#github" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {domainName}. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}