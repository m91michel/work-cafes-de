import { Coffee, Github, Twitter } from "lucide-react";
import Link from "next/link";
import config from "@/config/config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-6 h-6" />
              <span className="font-bold text-xl">WorkCafes.de</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover the best work-friendly cafes across Germany.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Popular Cities</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#berlin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Berlin
                </Link>
              </li>
              <li>
                <Link href="#munich" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Munich
                </Link>
              </li>
              <li>
                <Link href="#hamburg" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Hamburg
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href={`mailto:${config.mailgun.supportEmail}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Support
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Imprint
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
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
          <p>&copy; {currentYear} WorkCafes.de. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}