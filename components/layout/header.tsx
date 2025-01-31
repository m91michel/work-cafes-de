"use client";

import { Coffee, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavLinks } from "./NavLinks";
import { useTranslations } from "@/hooks/use-translations";
import { LanguageSwitcher } from "../general/language-switcher";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslations();

  return (
    <header className="border-b relative">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Coffee className="h-6 w-6" />
          <span className="font-semibold text-lg">{t('meta.title')}</span>
        </Link>

        <div className="flex items-center md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          <NavLinks className="flex gap-6 items-center" />
          <LanguageSwitcher />
        </nav>
      </div>

      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white border-t z-10 md:hidden">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <NavLinks onClick={() => setIsMenuOpen(false)} />
            <div className="mt-4 border-t pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
