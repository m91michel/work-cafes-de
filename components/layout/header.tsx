"use client";

import { Coffee, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavLinks } from "./NavLinks";
import { useCTranslation } from "@/hooks/use-translation";
import { appName } from "@/config/config";
import AuthNav from "@/components/auth/auth-nav";
import { isProd } from "@/libs/environment";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useCTranslation();

  return (
    <header className="border-b relative">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Coffee className="h-6 w-6" />
          <span className="font-semibold text-lg">{appName}</span>
        </Link>

        <div className="flex items-center md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          <NavLinks className="flex gap-6 items-center" />
          {!isProd && <AuthNav />}
        </nav>
      </div>

      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white border-y pb-4 shadow-lg z-50 md:hidden">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <NavLinks onClick={() => setIsMenuOpen(false)} />
            <div className="mt-4">
              <AuthNav />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
