"use client";

import { Coffee, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavLinks } from "./NavLinks";
import config from "@/config/config";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b relative">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Coffee className="h-6 w-6" />
          <span className="font-semibold text-lg">{config.appName}</span>
        </Link>

        <div className="flex items-center md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          <NavLinks className="flex gap-6 items-center" />
        </nav>
      </div>

      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white border-t z-10 md:hidden">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <NavLinks onClick={() => setIsMenuOpen(false)} />
          </div>
        </nav>
      )}
    </header>
  );
}
